// Shared Simplecast RSS fetch, used by /podcast and by the category archive
// system (content-categories.ts), so both use identical parsing and only hit
// the feed once per build instead of duplicating the fetch per page.

import { XMLParser } from 'fast-xml-parser';
import { handleFeedFailure } from '~/utils/feed-failure';

export interface PodcastEpisode {
  title: string | string[];
  description: string;
  enclosure: { att_url: string };
  summary?: string;
  pubDate?: string;
  image?: { att_href?: string };
  [key: string]: unknown;
}

const FEED_URL = 'https://feeds.simplecast.com/whlwDbyc';

const parser = new XMLParser({
  ignoreAttributes: false,
  stopNodes: ['root.itunes:title'],
  attributeNamePrefix: 'att_',
  removeNSPrefix: true,
});

let cachedEpisodes: Promise<PodcastEpisode[]> | undefined;

async function fetchAllPodcastEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) throw new Error(`Feed responded ${response.status}`);
    const parsedFeed = parser.parse(await response.text());
    const items = parsedFeed?.rss?.channel?.item;
    if (!Array.isArray(items) || items.length === 0) throw new Error('Feed has no episodes');
    return items;
  } catch (error) {
    handleFeedFailure('the podcast feed', error);
    return [];
  }
}

// Memoized so the feed is only fetched once per build, no matter how many
// pages need it (the /podcast pagination and the tech category archive).
export const getAllPodcastEpisodes = (): Promise<PodcastEpisode[]> => {
  if (!cachedEpisodes) {
    cachedEpisodes = fetchAllPodcastEpisodes();
  }
  return cachedEpisodes;
};

export const getPodcastEpisodeTitle = (episode: { title: string | string[] }): string =>
  Array.isArray(episode.title) ? episode.title[0] : episode.title;
