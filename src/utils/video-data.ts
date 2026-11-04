// Per-video data kept in the repo (src/data/videos) plus helpers for chapters and transcripts,
// so article pages don't depend on the YouTube API being reachable at build time.

export interface VideoMeta {
  title: string;
  uploadDate: string;
  /** ISO 8601 duration, e.g. PT12M10S. */
  duration?: string;
  transcriptSource?: 'auto-generated' | 'edited';
}

export interface VideoChapter {
  /** Seconds from the start of the video. */
  start: number;
  label: string;
}

export interface TranscriptLine {
  start: number;
  text: string;
}

const metas = import.meta.glob<VideoMeta>('/src/data/videos/*.json', { eager: true, import: 'default' });
const transcripts = import.meta.glob<string>('/src/data/videos/*.transcript.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const dataPath = (id: string, ext: string) => `/src/data/videos/${id}.${ext}`;

export const getVideoMeta = (id: string): VideoMeta | undefined => metas[dataPath(id, 'json')];

const clockToSeconds = (h: string | undefined, m: string, s: string): number =>
  Number(h ?? 0) * 3600 + Number(m) * 60 + Number(s);

export const formatClock = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
};

export const durationToSeconds = (iso?: string): number | undefined => {
  const match = iso?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return undefined;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
};

// YouTube only treats a description as chapters when the list starts at 0:00 and has at least
// three entries, so the same rule is used here to avoid mistaking stray timestamps for chapters.
export const parseChapters = (description?: string): VideoChapter[] => {
  if (!description) return [];
  const chapters: VideoChapter[] = [];
  for (const line of description.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:[-•*]\s*)?(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*[-–—:)]?\s*(.+?)\s*$/);
    if (match) chapters.push({ start: clockToSeconds(match[1], match[2], match[3]), label: match[4] });
  }
  if (chapters.length < 3 || chapters[0].start !== 0) return [];
  return chapters.every((c, i) => i === 0 || c.start > chapters[i - 1].start) ? chapters : [];
};

export const getTranscript = (id: string): TranscriptLine[] | undefined => {
  const raw = transcripts[dataPath(id, 'transcript.md')];
  if (!raw) return undefined;
  const lines: TranscriptLine[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\[(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\]\s*(.*)$/);
    if (match && match[4].trim()) lines.push({ start: clockToSeconds(match[1], match[2], match[3]), text: match[4].trim() });
    else if (lines.length && line.trim()) lines[lines.length - 1].text += ` ${line.trim()}`;
  }
  return lines.length ? lines : undefined;
};

export const watchUrl = (id: string, start = 0): string =>
  start > 0 ? `https://www.youtube.com/watch?v=${id}&t=${Math.floor(start)}s` : `https://www.youtube.com/watch?v=${id}`;

export const embedUrl = (id: string): string => `https://www.youtube.com/embed/${id}`;

export const thumbnailUrl = (id: string): string => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
