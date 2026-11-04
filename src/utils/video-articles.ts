// Build-time map between YouTube videos and the articles that are their canonical versions.
// Explicit `youtubeId` / `relatedYoutubeIds` frontmatter always wins; otherwise a conservative
// title/date matcher (video-match.mjs) pairs them automatically. Ambiguous matches are left
// unpaired on purpose. Set `youtubeId: false` on an article to opt it out of automatic matching.
//
// Memoized like youtube.ts so the whole build computes it once.

import { getCollection } from 'astro:content';
import { getAllYouTubeVideos } from '~/utils/youtube';
import { matchVideosToArticles } from '~/utils/video-match.mjs';
import ignoredVideos from '~/data/video-matching-ignore.json';
import {
  durationToSeconds,
  embedUrl,
  getTranscript,
  getVideoMeta,
  parseChapters,
  thumbnailUrl,
  watchUrl,
  type TranscriptLine,
  type VideoChapter,
} from '~/utils/video-data';

export interface VideoArticlePair {
  videoId: string;
  articleId: string; // posts collection entry id
  source: 'frontmatter' | 'auto';
  role: 'primary' | 'related';
  score: number;
}

export interface VideoArticleMap {
  byVideoId: Map<string, VideoArticlePair>;
  /** Primary video first, then related videos in frontmatter order. */
  byArticleId: Map<string, VideoArticlePair[]>;
}

/** Site path of the article that is canonical for a video. */
export const articlePath = (articleId: string): string => `/blog/${articleId}`;

let cached: Promise<VideoArticleMap> | undefined;

async function build(): Promise<VideoArticleMap> {
  const [posts, playlist, podcastEntries] = await Promise.all([
    getCollection('posts'),
    getAllYouTubeVideos(),
    getCollection('podcasts'),
  ]);

  const videos = playlist
    .map((v) => ({
      id: v.snippet.resourceId?.videoId ?? '',
      title: v.snippet.title,
      date: (v.snippet.publishedAt ?? '').slice(0, 10),
    }))
    .filter((v) => v.id);

  const articles = posts.map((p) => {
    const d = p.data.publishDate;
    return {
      id: p.id,
      title: p.data.title,
      date: d instanceof Date ? d.toISOString().slice(0, 10) : String(d),
      youtubeId: p.data.youtubeId,
      relatedYoutubeIds: p.data.relatedYoutubeIds,
    };
  });

  // Podcast entries are named after the episode title; used to keep episodes out of automatic pairing.
  const podcasts = podcastEntries.map((p) => ({ id: p.id, title: p.data.title }));

  const { pairs, conflicts, podcastWarnings } = matchVideosToArticles(videos, articles, {
    ignoredVideoIds: Object.keys(ignoredVideos),
    podcasts,
  });
  for (const w of podcastWarnings) {
    console.warn(
      `[video-articles] ${w.videoId} <-> ${w.articleId} is paired explicitly but its ${w.of} looks like ` +
        `podcast episode "${w.podcastId}" (${w.score}). Podcast episodes are not normally paired.`,
    );
  }
  if (conflicts.length) {
    throw new Error(
      `Several articles claim the same YouTube video: ${JSON.stringify(conflicts)}. ` +
        'Each video can have only one canonical article.',
    );
  }

  const byVideoId = new Map<string, VideoArticlePair>();
  const byArticleId = new Map<string, VideoArticlePair[]>();
  for (const p of pairs as VideoArticlePair[]) {
    byVideoId.set(p.videoId, p);
    byArticleId.set(p.articleId, [...(byArticleId.get(p.articleId) ?? []), p]);
  }
  return { byVideoId, byArticleId };
}

export const getVideoArticleMap = (): Promise<VideoArticleMap> => {
  if (!cached) cached = build();
  return cached;
};

export interface ArticleVideoChapter extends VideoChapter {
  /** Seconds at which the next chapter (or the video) ends, when known. */
  end?: number;
}

export interface ArticleVideo {
  id: string;
  role: 'primary' | 'related';
  title: string;
  description?: string;
  uploadDate?: string;
  /** ISO 8601 duration. */
  duration?: string;
  watchUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  chapters: ArticleVideoChapter[];
  transcript?: { source: 'auto-generated' | 'edited'; lines: TranscriptLine[]; text: string };
}

/**
 * Everything an article page needs about its videos. Repo data (src/data/videos) is the
 * baseline so this works without the YouTube API; the live playlist adds the description (the
 * source of chapters) and the canonical title/date when it is available.
 */
export async function getArticleVideos(
  articleId: string,
  fallback: { title: string },
): Promise<ArticleVideo[]> {
  const [map, playlist] = await Promise.all([getVideoArticleMap(), getAllYouTubeVideos()]);
  const live = new Map(playlist.map((v) => [v.snippet.resourceId?.videoId ?? '', v.snippet]));

  return (map.byArticleId.get(articleId) ?? []).map((pair) => {
    const meta = getVideoMeta(pair.videoId);
    const snippet = live.get(pair.videoId);
    const description = snippet?.description;
    const duration = meta?.duration;
    const total = durationToSeconds(duration);

    const chapters: ArticleVideoChapter[] = parseChapters(description).map((c, i, all) => ({
      ...c,
      end: all[i + 1]?.start ?? total,
    }));

    const lines = getTranscript(pair.videoId);
    return {
      id: pair.videoId,
      role: pair.role,
      title: snippet?.title ?? meta?.title ?? fallback.title,
      description,
      uploadDate: snippet?.publishedAt ?? meta?.uploadDate,
      duration,
      watchUrl: watchUrl(pair.videoId),
      embedUrl: embedUrl(pair.videoId),
      thumbnailUrl: thumbnailUrl(pair.videoId),
      chapters,
      transcript: lines
        ? {
            source: meta?.transcriptSource ?? 'auto-generated',
            lines,
            text: lines.map((l) => l.text).join(' '),
          }
        : undefined,
    };
  });
}
