// Shared Simplecast RSS fetch, used by /podcast and by the category archive
// system (content-categories.ts), so both use identical parsing and only hit
// the feed once per build instead of duplicating the fetch per page.

import { XMLParser } from 'fast-xml-parser';

export interface PodcastEpisode {
  title: string | string[];
  description?: string;
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
    const rssFeedData = await response.text();
    const parsedFeed = parser.parse(rssFeedData);
    return parsedFeed?.rss?.channel?.item ?? [];
  } catch (error) {
    console.warn('Unable to fetch podcast feed during build:', error);
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

export const getPodcastEpisodeTitle = (episode: PodcastEpisode): string =>
  Array.isArray(episode.title) ? episode.title[0] : episode.title;
