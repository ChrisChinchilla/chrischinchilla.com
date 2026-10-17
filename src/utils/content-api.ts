import { getCollection } from 'astro:content';

import { SITE } from '~/config.mjs';
import {
  SITE_CATEGORIES,
  getEntryCategories,
  getPodcastEpisodeEntries,
  getYouTubeVideoEntries,
} from '~/utils/content-categories';
import type { ContentDetail, ContentIndex, ContentRecord, ContentTypeInfo } from '~/shared/content-tools';

// Builds the machine-readable content API (index + per-type listings + per-entry detail)
// that powers the WebMCP tools and the remote MCP server. One definition per content type;
// add a collection here and it appears in every listing, search, and tool.

type Data = Record<string, unknown>;
type Entry = { id: string; collection?: string; body?: string; data: Data };

const asRecord = (value: unknown): Data | undefined =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Data) : undefined;

interface TypeDef {
  slug: string;
  label: string;
  description: string;
  /** Content collection name, or a live-feed source handled specially below. */
  source: string;
  listUrl: string;
  /** Site path of an entry; omit for list-only types, whose entries link to listUrl. */
  entryPath?: (id: string) => string;
}

// Slugs deliberately match CATEGORY_CONTENT_TYPES in content-categories.ts where they overlap.
const TYPES: TypeDef[] = [
  { slug: 'blog', label: 'Blog', description: 'Blog posts on tech, writing, music, and more.', source: 'posts', listUrl: '/blog', entryPath: (id) => `/blog/${id}` },
  { slug: 'books', label: 'Books', description: 'Books Chris has written or contributed to.', source: 'books', listUrl: '/books', entryPath: (id) => `/books/${id}` },
  { slug: 'stories', label: 'Stories', description: 'Short fiction.', source: 'stories', listUrl: '/stories', entryPath: (id) => `/stories/${id}` },
  { slug: 'newsletters', label: 'Newsletters', description: 'Newsletter issues.', source: 'newsletters', listUrl: '/newsletter', entryPath: (id) => `/newsletter/${id}` },
  { slug: 'music', label: 'Music', description: 'Music releases.', source: 'music', listUrl: '/music', entryPath: (id) => `/music/${id}` },
  { slug: 'software', label: 'Software', description: 'Open-source projects Chris created or contributed to.', source: 'software', listUrl: '/software', entryPath: (id) => `/software/${id}` },
  { slug: 'gear', label: 'Gear', description: 'Equipment and tools Chris uses.', source: 'gear', listUrl: '/gear', entryPath: (id) => `/gear/${id}` },
  { slug: 'courses', label: 'Video courses', description: 'Video courses and audio/visual projects.', source: 'av', listUrl: '/courses' },
  { slug: 'games', label: 'Games', description: 'Game projects Chris has worked on.', source: 'games', listUrl: '/games' },
  { slug: 'events', label: 'Events & talks', description: 'Talks given, events organised, and events attended.', source: 'events', listUrl: '/events' },
  { slug: 'clients', label: 'Clients', description: 'Clients and companies Chris has worked with.', source: 'clients', listUrl: '/clients' },
  { slug: 'podcasts', label: 'Podcasts', description: 'Podcast episodes (live from the podcast feed).', source: 'podcast-feed', listUrl: '/podcast', entryPath: (id) => `/podcast/${id}` },
  { slug: 'videos', label: 'Videos', description: 'YouTube videos (live from the YouTube playlist).', source: 'youtube', listUrl: '/videos', entryPath: (id) => `/videos/${id}` },
];

export const CONTENT_TYPE_SLUGS = TYPES.map((t) => t.slug);

const SITE_CATEGORY_SLUGS = new Set(SITE_CATEGORIES.map((c) => c.slug));

const toIsoDate = (value: unknown): string | undefined => {
  if (!(value instanceof Date) && typeof value !== 'string') return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date.toISOString().slice(0, 10);
};

const stripMarkup = (value: string): string =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/%%[\s\S]*?%%/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const truncate = (value: string, max: number): string =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

const firstParagraph = (body?: string): string => {
  const paragraph = (body ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith('import ') && !p.startsWith('<'));
  return paragraph ? truncate(stripMarkup(paragraph), 240) : '';
};

const SKIPPED_FIELDS = new Set([
  // Surfaced as top-level `title`/`date` already.
  'event', 'publishDate', 'publish_date', 'release_date', 'date',
  'title', 'summary', 'description', 'image', 'heroimage', 'herotext', 'tags', 'categories',
  'category', 'store_urls', 'stream_urls',
]);

const LINK_FIELDS: Record<string, string> = {
  publication_url: 'Publication',
  company_url: 'Company site',
  slides_url: 'Slides',
  video_url: 'Video',
  related_post_url: 'Related post',
  pres_url: 'Presentation',
  affiliate_url: 'Buy',
};

const isHttp = (value: unknown): value is string => typeof value === 'string' && /^https?:\/\//i.test(value);

const collectLinks = (data: Data): { label: string; url: string }[] => {
  const links: { label: string; url: string }[] = [];
  for (const [key, label] of Object.entries(LINK_FIELDS)) {
    const url = data[key];
    if (isHttp(url)) links.push({ label, url });
  }
  for (const key of ['store_urls', 'stream_urls']) {
    if (Array.isArray(data[key])) {
      for (const item of data[key] as unknown[]) {
        const link = asRecord(item);
        if (link && isHttp(link.url)) links.push({ label: String(link.label ?? key), url: link.url });
      }
    }
  }
  return links;
};

const collectFields = (data: Data): Record<string, string | number | boolean> => {
  const fields: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SKIPPED_FIELDS.has(key) || key in LINK_FIELDS) continue;
    const date = value instanceof Date ? toIsoDate(value) : undefined;
    if (date) fields[key] = date;
    else if (typeof value === 'string' && value.trim() && value.length <= 300) fields[key] = value.trim();
    else if (typeof value === 'number' || typeof value === 'boolean') fields[key] = value;
  }
  return fields;
};

const buildDetail = (def: TypeDef, entry: Entry): ContentDetail => {
  const data = entry.data ?? {};
  const feed = def.source === 'podcast-feed' || def.source === 'youtube';

  // Events carry a tagline in `title` and the actual name in `event`.
  const title = String(data.event ?? data.title ?? entry.id);
  let summary: string;
  let date = toIsoDate(
    data.publishDate ?? data.publish_date ?? data.release_date ?? data.date ?? data.start_date,
  );
  let externalUrl: string | undefined;
  // Preserve the site's existing publication policy: content originally published elsewhere
  // is link-only here, just as it is in llms-full.txt. Republishing the source Markdown through
  // the JSON API/MCP would bypass that policy.
  const body = feed || data.publication_url ? undefined : entry.body?.trim() || undefined;
  const links = collectLinks(data);

  if (def.source === 'podcast-feed') {
    const raw = entry as unknown as Data;
    summary = truncate(stripMarkup(typeof raw.summary === 'string' ? raw.summary : ''), 400);
    if (isHttp(raw.link)) externalUrl = raw.link;
  } else if (def.source === 'youtube') {
    const snippet = asRecord((entry as unknown as Data).snippet);
    summary = truncate(stripMarkup(String(snippet?.description ?? '')), 400);
    const videoId = asRecord(snippet?.resourceId)?.videoId;
    if (typeof videoId === 'string' && videoId) externalUrl = `https://www.youtube.com/watch?v=${videoId}`;
    date = toIsoDate(snippet?.publishedAt) ?? date;
  } else {
    summary =
      stripMarkup(String(data.summary ?? data.description ?? '')) ||
      (def.source === 'events' && data.event && data.title ? stripMarkup(String(data.title)) : '') ||
      firstParagraph(body);
  }

  externalUrl ??= links[0]?.url;

  const categories = getEntryCategories(entry as unknown as Parameters<typeof getEntryCategories>[0]).filter((slug) =>
    SITE_CATEGORY_SLUGS.has(slug),
  );

  return {
    type: def.slug,
    id: entry.id,
    title,
    url: def.entryPath ? def.entryPath(entry.id) : def.listUrl,
    summary,
    date,
    tags: Array.isArray(data.tags) ? data.tags.filter((t: unknown): t is string => typeof t === 'string') : [],
    categories,
    externalUrl,
    body,
    links,
    fields: collectFields(data),
  };
};

const toRecord = ({ body: _body, links: _links, fields: _fields, ...record }: ContentDetail): ContentRecord => record;

const loadEntries = async (source: string): Promise<Entry[]> => {
  if (source === 'youtube') return (await getYouTubeVideoEntries()) as unknown as Entry[];
  if (source === 'podcast-feed') return (await getPodcastEpisodeEntries()) as unknown as Entry[];
  return (await getCollection(source as Parameters<typeof getCollection>[0])) as unknown as Entry[];
};

export interface ContentApiData {
  index: ContentIndex;
  details: Map<string, ContentDetail[]>;
}

let cache: Promise<ContentApiData> | undefined;

const build = async (): Promise<ContentApiData> => {
  const details = new Map<string, ContentDetail[]>();
  await Promise.all(
    TYPES.map(async (def) => {
      const entries = await loadEntries(def.source);
      details.set(def.slug, entries.map((entry) => buildDetail(def, entry)));
    }),
  );

  // Newest first, undated last; ties broken by title for stable output.
  const items = TYPES.flatMap((def) => (details.get(def.slug) ?? []).map(toRecord)).sort((a, b) =>
    a.date && b.date ? b.date.localeCompare(a.date) || a.title.localeCompare(b.title) : a.date ? -1 : b.date ? 1 : a.title.localeCompare(b.title),
  );

  const types: ContentTypeInfo[] = TYPES.map((def) => ({
    slug: def.slug,
    label: def.label,
    description: def.description,
    count: details.get(def.slug)?.length ?? 0,
    listUrl: def.listUrl,
    hasBody: def.source !== 'podcast-feed' && def.source !== 'youtube',
  }));

  const categories = SITE_CATEGORIES.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    count: items.filter((i) => i.categories.includes(c.slug)).length,
  }));

  return {
    index: {
      site: { name: SITE.name, url: SITE.origin, description: SITE.description },
      categories,
      types,
      items,
    },
    details,
  };
};

export const getContentApiData = (): Promise<ContentApiData> => (cache ??= build());
