import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

import { getPermalink, cleanSlug } from '~/utils/permalinks';

export type SiteCategory = {
  slug: string;
  title: string;
  description: string;
};

export const SITE_CATEGORIES: SiteCategory[] = [
  {
    slug: 'tech',
    title: 'Tech',
    description: 'Technical writing, documentation, tooling, client work, and technology coverage.',
  },
  {
    slug: 'writing',
    title: 'Writing',
    description: 'Blog posts, books, stories, essays, and long-form writing projects.',
  },
  {
    slug: 'music',
    title: 'Music',
    description: 'Music releases, performance work, podcasts, and audio-first projects.',
  },
  {
    slug: 'games',
    title: 'Games',
    description: 'Game projects, interactive fiction, and related creative work.',
  },
];

export type CategoryContentType = {
  slug: string;
  label: string;
  collection: 'posts' | 'books' | 'podcasts' | 'av' | 'stories' | 'games' | 'newsletters' | 'music' | 'software';
  listStyle: 'grid' | 'list';
  pageSize: number;
};

export const CATEGORY_CONTENT_TYPES: CategoryContentType[] = [
  { slug: 'blog', label: 'Blog', collection: 'posts', listStyle: 'grid', pageSize: 30 },
  { slug: 'books', label: 'Books', collection: 'books', listStyle: 'grid', pageSize: 15 },
  { slug: 'podcasts', label: 'Podcasts', collection: 'podcasts', listStyle: 'list', pageSize: 15 },
  { slug: 'videos', label: 'Videos', collection: 'av', listStyle: 'list', pageSize: 30 },
  { slug: 'stories', label: 'Stories', collection: 'stories', listStyle: 'grid', pageSize: 30 },
  { slug: 'games', label: 'Games', collection: 'games', listStyle: 'grid', pageSize: 30 },
  { slug: 'newsletters', label: 'Newsletters', collection: 'newsletters', listStyle: 'list', pageSize: 25 },
  { slug: 'music', label: 'Music', collection: 'music', listStyle: 'grid', pageSize: 15 },
  { slug: 'software', label: 'Software', collection: 'software', listStyle: 'grid', pageSize: 25 },
];

export type CategoryContentTypeWithEntries = CategoryContentType & {
  entries: ArchiveEntry[];
};

type ArchiveEntry = CollectionEntry<any>;

let categoryContentTypeCache: Map<string, CategoryContentTypeWithEntries[]> | undefined;

export const getCategoryTypePermalink = (categorySlug: string, contentTypeSlug: string): string =>
  getPermalink(`/${cleanSlug(categorySlug)}/${cleanSlug(contentTypeSlug)}`);

export const getCategoryBySlug = (categorySlug: string): SiteCategory | undefined =>
  SITE_CATEGORIES.find((category) => category.slug === cleanSlug(categorySlug));

export const getCategoryContentTypeBySlug = (contentTypeSlug: string): CategoryContentType | undefined =>
  CATEGORY_CONTENT_TYPES.find((contentType) => contentType.slug === cleanSlug(contentTypeSlug));

export const getEntryCategories = (entry: ArchiveEntry): string[] => {
  const data = entry.data ?? {};
  const categories = new Set<string>();

  const addCategoryValue = (value: unknown): void => {
    if (typeof value === 'string' && value.trim()) {
      categories.add(cleanSlug(value));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => addCategoryValue(item));
      return;
    }

    if (value && typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([key, nestedValue]) => {
        if (typeof nestedValue === 'boolean' && nestedValue) {
          categories.add(cleanSlug(key));
          return;
        }

        if (typeof nestedValue === 'string' && nestedValue.trim()) {
          categories.add(cleanSlug(nestedValue));
          return;
        }

        addCategoryValue(nestedValue);
      });
    }
  };

  addCategoryValue(data.categories);
  addCategoryValue(data.category);
  addCategoryValue(data.tags);

  // Fallbacks: some collections currently lack explicit category metadata.
  // Keep them discoverable in top-level category archives until frontmatter is backfilled.
  if (categories.size === 0 && entry.collection === 'games') {
    categories.add('games');
  }

  if (categories.size === 0 && entry.collection === 'music') {
    categories.add('music');
  }

  // Software entries are always tech, regardless of their (mostly tool-name) tags.
  if (entry.collection === 'software') {
    categories.add('tech');
  }

  // Stories always belong to the writing category, regardless of their genre tags
  // (e.g. fiction/fantasy/horror), which never match the site taxonomy on their own.
  if (entry.collection === 'stories') {
    categories.add('writing');
  }

  return [...categories];
};

export const matchesCategory = (entry: ArchiveEntry, categorySlug: string): boolean =>
  getEntryCategories(entry).includes(cleanSlug(categorySlug));

const buildCategoryContentTypeCache = async (): Promise<Map<string, CategoryContentTypeWithEntries[]>> => {
  const entriesByCollection = new Map<string, ArchiveEntry[]>();

  await Promise.all(
    CATEGORY_CONTENT_TYPES.map(async (contentType) => {
      const entries = await getCollection(contentType.collection);
      entriesByCollection.set(contentType.collection, entries);
    })
  );

  const cache = new Map<string, CategoryContentTypeWithEntries[]>();

  SITE_CATEGORIES.forEach((category) => {
    const contentTypes = CATEGORY_CONTENT_TYPES.map((contentType) => {
      const entries = entriesByCollection.get(contentType.collection) ?? [];
      const filteredEntries = entries
        .filter((entry) => matchesCategory(entry, category.slug))
        .sort((a, b) => {
          const dateA = getEntryDate(a)?.valueOf() ?? 0;
          const dateB = getEntryDate(b)?.valueOf() ?? 0;
          return dateB - dateA;
        });

      return {
        ...contentType,
        entries: filteredEntries,
      };
    }).filter((contentType) => contentType.entries.length > 0);

    cache.set(category.slug, contentTypes);
  });

  return cache;
};

export const getCategoryContentTypes = async (categorySlug: string): Promise<CategoryContentTypeWithEntries[]> => {
  const normalizedSlug = cleanSlug(categorySlug);

  if (!categoryContentTypeCache) {
    categoryContentTypeCache = await buildCategoryContentTypeCache();
  }

  return categoryContentTypeCache.get(normalizedSlug) ?? [];
};

export const getCategoryMenuLinks = async (categorySlug: string): Promise<Array<{ text: string; href: string }>> => {
  const contentTypes = await getCategoryContentTypes(categorySlug);

  return contentTypes.map((contentType) => ({
    text: contentType.label,
    href: getCategoryTypePermalink(categorySlug, contentType.slug),
  }));
};

export const getEntryTitle = (entry: ArchiveEntry): string => entry.data?.title ?? entry.data?.name ?? entry.id;

export const getEntrySummary = (entry: ArchiveEntry): string =>
  entry.data?.summary ?? entry.data?.description ?? entry.data?.excerpt ?? '';

export const getEntryDate = (entry: ArchiveEntry): Date | undefined => {
  const data = entry.data ?? {};
  const rawDate =
    data.publishDate ??
    data.publish_date ??
    data.release_date ??
    data.date ??
    data.start_date ??
    data.end_date;

  return rawDate ? new Date(rawDate) : undefined;
};

export const getEntryImage = (entry: ArchiveEntry): unknown => entry.data?.image ?? entry.data?.heroimage;

export const getEntryHref = (entry: ArchiveEntry): string | undefined => {
  const data = entry.data ?? {};

  if (typeof data.publication_url === 'string' && data.publication_url) return data.publication_url;
  if (typeof data.company_url === 'string' && data.company_url) return data.company_url;
  if (typeof data.affiliate_url === 'string' && data.affiliate_url) return data.affiliate_url;
  if (Array.isArray(data.store_urls) && data.store_urls[0]?.url) return data.store_urls[0].url;

  // Only these collections have a real internal detail page - `games`, `av`, and the
  // markdown `podcasts` collection don't (their listings link out via store_urls/
  // publication_url above, or - for games/av with neither - have no per-entry page at all).
  switch (entry.collection) {
    case 'posts':
      return `/blog/${entry.id}`;
    case 'books':
      return `/books/${entry.id}`;
    case 'stories':
      return `/stories/${entry.id}`;
    case 'newsletters':
      return `/newsletter/${entry.id}`;
    case 'music':
      return `/music/${entry.id}`;
    case 'software':
      return `/software/${entry.id}`;
    case 'clients':
      return '/clients';
    default:
      return undefined;
  }
};
