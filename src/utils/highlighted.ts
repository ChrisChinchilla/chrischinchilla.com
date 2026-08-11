import { getCollection } from 'astro:content';

export interface HighlightedItem {
  id: string;
  slug: string;
  title: string;
  image: string | any;
  summary?: string;
  date: Date | null;
}

interface HeroFlaggedEntry {
  id: string;
  data: {
    title?: string;
    herotext?: string;
    heroimage?: any;
    summary?: string;
    publication_url?: string;
    [key: string]: any;
  };
}

const mapToHighlightedItem = (
  item: HeroFlaggedEntry,
  basePath: string,
  dateField: string | null
): HighlightedItem | null => {
  if (!item.data.herotext || !item.data.heroimage) return null;

  let date: Date | null = null;
  if (dateField) {
    const dateValue = item.data[dateField];
    date = dateValue instanceof Date ? dateValue : typeof dateValue === 'string' ? new Date(dateValue) : null;
  }

  return {
    id: item.id,
    slug: item.data.publication_url ?? `/${basePath}/${item.id}`,
    title: item.data.title ?? item.id,
    image: item.data.heroimage,
    summary: item.data.herotext ?? item.data.summary,
    date,
  };
};

/** All content (posts, books, events, podcasts, newsletters, stories, music, games) flagged
 * for highlighting via `herotext` + `heroimage` frontmatter, newest first. */
export const findHighlightedItems = async (): Promise<Array<HighlightedItem>> => {
  const [posts, books, events, podcasts, newsletters, stories, music, games] = await Promise.all([
    getCollection('posts'),
    getCollection('books'),
    getCollection('events'),
    getCollection('podcasts'),
    getCollection('newsletters'),
    getCollection('stories'),
    getCollection('music'),
    getCollection('games'),
  ]);

  const items = [
    ...posts.map((post) => mapToHighlightedItem(post, 'blog', 'publishDate')),
    ...books.map((book) => mapToHighlightedItem(book, 'books', 'publish_date')),
    ...events.map((event) => mapToHighlightedItem(event, 'events', 'start_date')),
    ...podcasts.map((podcast) => mapToHighlightedItem(podcast, 'podcast', null)),
    ...newsletters.map((newsletter) => mapToHighlightedItem(newsletter, 'newsletter', 'date')),
    ...stories.map((story) => mapToHighlightedItem(story, 'stories', 'date')),
    ...music.map((release) => mapToHighlightedItem(release, 'music', 'release_date')),
    ...games.map((game) => mapToHighlightedItem(game, 'games', 'publish_date')),
  ].filter((item): item is HighlightedItem => item !== null);

  return items.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });
};
