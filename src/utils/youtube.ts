// Shared YouTube playlist fetch, used by /videos and by the category archive
// system (content-categories.ts). Both need the same data; this keeps the
// fetch and its build-time cache in one place instead of duplicated per page.

export interface YouTubePlaylistItem {
  snippet: {
    title: string;
    description: string;
    publishedAt?: string;
    resourceId?: { videoId?: string };
    thumbnails?: Record<string, unknown>;
    [key: string]: unknown;
  };
  contentDetails?: {
    videoId?: string;
    videoPublishedAt?: string;
  };
  [key: string]: unknown;
}

const PLAYLIST_ID = 'PL1fnzsSshABw25W5Qscxw_gQII_MlCoOS';

let cachedVideos: Promise<YouTubePlaylistItem[]> | undefined;

async function fetchAllYouTubeVideos(): Promise<YouTubePlaylistItem[]> {
  const apiKey = import.meta.env.GOOGLE_API;
  if (!apiKey) return [];

  let allVideos: YouTubePlaylistItem[] = [];
  let nextPageToken: string | null = null;

  try {
    do {
      const url: string = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${PLAYLIST_ID}&key=${apiKey}${
        nextPageToken ? `&pageToken=${nextPageToken}` : ''
      }`;

      const response: Response = await fetch(url);
      const data: { items?: YouTubePlaylistItem[]; nextPageToken?: string } = await response.json();

      if (data.items) {
        allVideos = allVideos.concat(data.items);
      }

      nextPageToken = data.nextPageToken || null;
    } while (nextPageToken);
  } catch (error) {
    console.warn('Unable to fetch YouTube playlist during build:', error);
  }

  return allVideos;
}

// Memoized so the playlist is only fetched once per build, no matter how
// many pages need it (the /videos pagination and the tech category archive).
export const getAllYouTubeVideos = (): Promise<YouTubePlaylistItem[]> => {
  if (!cachedVideos) {
    cachedVideos = fetchAllYouTubeVideos();
  }
  return cachedVideos;
};
