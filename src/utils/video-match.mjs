// Pure title/date matching between YouTube videos and articles. Plain ESM (no Astro imports)
// so it is shared by the build-time map (video-articles.ts) and scripts/match-videos.mjs.

const STOP = new Set([
  'a', 'an', 'and', 'the', 'of', 'to', 'in', 'on', 'for', 'with', 'is', 'are', 'your', 'you',
  'my', 'i', 'at', 'by', 'from', 'how', 'what', 'whats', 's', 'new', 'vs', 'this', 'that', 'it',
  'can', 'do', 'does', 'be', 'or', 'as', 'we',
]);

export function tokens(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((t) => t && !STOP.has(t));
}

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

// Containment is more forgiving than Jaccard when one title is a longer variant of the other.
function containment(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / Math.min(A.size, B.size);
}

// Like scoreMatch's title part, but containment only counts when the shorter title has two or
// more words, so a one-word podcast name can't swallow every video that mentions it.
function podcastSimilarity(a, b) {
  const at = tokens(a);
  const bt = tokens(b);
  const contained = Math.min(new Set(at).size, new Set(bt).size) >= 2 ? containment(at, bt) * 0.85 : 0;
  return Math.max(jaccard(at, bt), contained);
}

const DAY = 86400000;

// Score 0..1. Title similarity dominates; date proximity can only add (articles are often
// published days or weeks apart from the video, so a large gap is not penalised heavily).
export function scoreMatch(video, article) {
  const vt = tokens(video.title);
  const at = tokens(article.title);
  const title = Math.max(jaccard(vt, at), containment(vt, at) * 0.85);

  let bonus = 0;
  const vd = Date.parse(video.date);
  const ad = Date.parse(article.date);
  if (!Number.isNaN(vd) && !Number.isNaN(ad)) {
    const days = Math.abs(vd - ad) / DAY;
    if (days <= 14) bonus = 0.15;
    else if (days <= 60) bonus = 0.07;
    else if (days > 365) bonus = -0.1;
  }
  return Math.max(0, Math.min(1, title + bonus));
}

// Titles at or above this similarity to a podcast entry (src/content/podcasts, named after the
// episode title) are treated as podcast episodes. Checked against the 50 newest videos: real
// episodes scored 0.57-1.0 and everything else 0.42 or lower. A soft heuristic until the podcast
// content is tidied up: it only stops automatic pairing, and everything it skips is reported.
export const PODCAST_THRESHOLD = 0.55;
// Article titles are stricter: old posts with short titles often sit inside a longer episode title
// ("Tech Salary Trends in 2017"), and an article that is an episode's write-up usually shares its title.
export const PODCAST_ARTICLE_THRESHOLD = 0.8;
export const AUTO_THRESHOLD = 0.7; // accepted automatically at build time
export const SUGGEST_THRESHOLD = 0.35; // listed as a candidate by the script
export const MIN_MARGIN = 0.1; // best must beat runner-up by this much to be automatic
// Automatic pairing only applies to videos published on or after this date. Older videos (the
// channel has ~540) have not been reviewed, and a wrong automatic pair would redirect a live
// video page, so they need an explicit `youtubeId` in frontmatter. Move this date back as
// older batches are reviewed with `npm run match-videos`.
export const AUTO_MATCH_FROM = '2025-03-13';

// videos: [{id,title,date}], articles: [{id,title,date,youtubeId?,relatedYoutubeIds?}]
// Returns { pairs: [{videoId, articleId, score, source, role}], candidates, conflicts, plus
// podcastVideos / podcastArticles (skipped as podcast episodes) and podcastWarnings (explicit
// pairs that look like podcast episodes) }.
/**
 * @param {{ id: string, title: string, date: string }[]} videos
 * @param {{ id: string, title: string, date: string, youtubeId?: string | false, relatedYoutubeIds?: string[] }[]} articles
 * @param {{ ignoredVideoIds?: string[], podcasts?: { id: string, title?: string }[] }} [options]
 */
export function matchVideosToArticles(videos, articles, { ignoredVideoIds = [], podcasts = [] } = {}) {
  const ignored = new Set(ignoredVideoIds);
  // podcasts: [{id, title?}]. Returns the closest podcast entry when a title looks like an episode.
  const podcastFor = (title, threshold = PODCAST_THRESHOLD) => {
    let best;
    for (const p of podcasts) {
      const score = podcastSimilarity(title, p.title ?? p.id);
      if (score >= threshold && (!best || score > best.score)) best = { podcastId: p.id, score: Number(score.toFixed(2)) };
    }
    return best;
  };
  const podcastVideos = [];
  const podcastArticles = [];
  const podcastWarnings = [];
  const pairs = [];
  const candidates = [];
  const conflicts = [];

  const explicit = new Map(); // videoId -> articleId
  const claim = (videoId, articleId, role) => {
    if (explicit.has(videoId)) {
      conflicts.push({ videoId, articles: [explicit.get(videoId), articleId] });
      return;
    }
    explicit.set(videoId, articleId);
    pairs.push({ videoId, articleId, score: 1, source: 'frontmatter', role });
  };
  for (const a of articles) {
    if (typeof a.youtubeId === 'string') claim(a.youtubeId, a.id, 'primary');
  }
  // Related videos are only honoured on articles that have a primary video.
  for (const a of articles) {
    if (typeof a.youtubeId !== 'string') continue;
    for (const id of a.relatedYoutubeIds ?? []) claim(id, a.id, 'related');
  }

  // Explicit frontmatter always wins, but say so when a pair looks like a podcast episode.
  const videoTitle = new Map(videos.map((v) => [v.id, v.title]));
  const articleById = new Map(articles.map((a) => [a.id, a]));
  for (const pair of pairs) {
    const video = videoTitle.has(pair.videoId) ? podcastFor(videoTitle.get(pair.videoId)) : undefined;
    const article = podcastFor(articleById.get(pair.articleId)?.title ?? '', PODCAST_ARTICLE_THRESHOLD);
    if (video) podcastWarnings.push({ ...pair, of: 'video', ...video });
    if (article) podcastWarnings.push({ ...pair, of: 'article', ...article });
  }

  // Articles that look like podcast episodes are never paired automatically.
  const eligible = articles.filter((a) => {
    if (a.youtubeId !== undefined) return false;
    const hit = podcastFor(a.title, PODCAST_ARTICLE_THRESHOLD);
    if (hit) podcastArticles.push({ articleId: a.id, ...hit });
    return !hit;
  });
  const automatic = [];
  for (const v of videos) {
    if (explicit.has(v.id) || ignored.has(v.id)) continue;
    const podcast = podcastFor(v.title);
    if (podcast) {
      podcastVideos.push({ videoId: v.id, ...podcast });
      continue;
    }
    const scored = eligible
      .map((a) => ({ a, score: scoreMatch(v, a) }))
      .sort((x, y) => y.score - x.score);
    const best = scored[0];
    if (!best || best.score < SUGGEST_THRESHOLD) continue;
    const runnerUp = scored[1]?.score ?? 0;
    const entry = {
      videoId: v.id,
      articleId: best.a.id,
      score: Number(best.score.toFixed(2)),
      runnerUp: scored[1] ? { articleId: scored[1].a.id, score: Number(runnerUp.toFixed(2)) } : null,
    };
    if (
      v.date >= AUTO_MATCH_FROM &&
      best.score >= AUTO_THRESHOLD &&
      best.score - runnerUp >= MIN_MARGIN
    ) {
      automatic.push({ entry, score: best.score });
    } else {
      candidates.push(entry);
    }
  }
  // Compare videos competing for the same article before choosing its primary. Playlist
  // order must not decide canonical URLs; close matches need an explicit selection.
  const byArticle = new Map();
  for (const match of automatic) {
    const group = byArticle.get(match.entry.articleId) ?? [];
    group.push(match);
    byArticle.set(match.entry.articleId, group);
  }
  for (const group of byArticle.values()) {
    group.sort((a, b) => b.score - a.score || a.entry.videoId.localeCompare(b.entry.videoId));
    const [best, runnerUp] = group;
    if (!runnerUp || best.score - runnerUp.score >= MIN_MARGIN) {
      pairs.push({ ...best.entry, source: 'auto', role: 'primary' });
      candidates.push(...group.slice(1).map(({ entry }) => entry));
    } else {
      candidates.push(...group.map(({ entry }) => entry));
    }
  }
  return { pairs, candidates, conflicts, podcastVideos, podcastArticles, podcastWarnings };
}
