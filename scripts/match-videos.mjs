#!/usr/bin/env node
// Suggest YouTube video <-> article pairings. Manual helper, not part of the build.
//
//   npm run match-videos                                          # report (needs GOOGLE_API)
//   npm run match-videos -- --videos videos.json                  # report from a file
//   npm run match-videos -- --since 2026-10-01 --new-only         # only recent, unresolved videos
//   npm run match-videos -- --videos videos.json --write pairs.json
//
// videos.json: [[id, title, "YYYY-MM-DD"], ...] or [{id,title,date}, ...] (e.g. a VidIQ export).
// If --videos is omitted and GOOGLE_API is set, the site's YouTube playlist is fetched instead
// (also loaded from .env). --since drops older videos; --new-only hides pairs that already exist
// in frontmatter, which is what a scheduled run wants (see .github/workflows/video-matches.yml).
// pairs.json: { "<videoId>": "<posts entry id, e.g. 2026/typeboost>" } — only these get a
// `youtubeId:` line added to frontmatter, and only if the article has none yet. The report
// never edits files; review it first.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { matchVideosToArticles } from '../src/utils/video-match.mjs';

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const flag = (name) => args.includes(`--${name}`);

// Node loads .env natively (v20.6+), so GOOGLE_API works the same as in the Astro build.
try {
  process.loadEnvFile?.();
} catch {
  // No .env file: GOOGLE_API must come from the environment.
}

const POSTS = path.resolve('src/content/posts');
// Videos that must never be paired or reported (e.g. podcast episodes), id -> reason.
const IGNORED = JSON.parse(fs.readFileSync(path.resolve('src/data/video-matching-ignore.json'), 'utf8'));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.mdx?$/.test(e.name) ? [p] : [];
  });
}

// Podcast entries are named after the episode title; see PODCAST_THRESHOLD in video-match.mjs.
function loadPodcasts() {
  const dir = path.resolve('src/content/podcasts');
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => ({ id: f.replace(/\.mdx?$/, '') }));
}

function loadArticles() {
  return walk(POSTS).map((file) => {
    const { data } = matter(fs.readFileSync(file, 'utf8'));
    const d = data.publishDate;
    return {
      id: path.relative(POSTS, file).replace(/\.mdx?$/, ''),
      file,
      title: String(data.title ?? ''),
      date: d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? ''),
      youtubeId: data.youtubeId,
      relatedYoutubeIds: data.relatedYoutubeIds,
    };
  });
}

async function loadVideos() {
  const file = opt('videos');
  if (file) {
    return JSON.parse(fs.readFileSync(file, 'utf8')).map((v) =>
      Array.isArray(v) ? { id: v[0], title: v[1], date: v[2] } : v,
    );
  }
  const key = process.env.GOOGLE_API;
  if (!key) throw new Error('Pass --videos <file.json> or set GOOGLE_API.');
  const out = [];
  let token = '';
  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PL1fnzsSshABw25W5Qscxw_gQII_MlCoOS&key=${key}${token ? `&pageToken=${token}` : ''}`;
    const data = await (await fetch(url)).json();
    for (const i of data.items ?? []) {
      out.push({
        id: i.snippet.resourceId.videoId,
        title: i.snippet.title,
        date: (i.snippet.publishedAt ?? '').slice(0, 10),
      });
    }
    token = data.nextPageToken ?? '';
  } while (token);
  return out;
}

function writePairs(pairsFile, articles) {
  const approved = JSON.parse(fs.readFileSync(pairsFile, 'utf8'));
  // Validate the whole import before changing any files, so a duplicate cannot leave a
  // partially applied import or duplicate YAML keys in an article.
  const targets = new Set();
  for (const articleId of Object.values(approved)) {
    if (targets.has(articleId)) {
      throw new Error(`Several videos target ${articleId}. Choose one youtubeId and use relatedYoutubeIds for additional videos.`);
    }
    targets.add(articleId);
  }
  const byId = new Map(articles.map((a) => [a.id, a]));
  for (const [videoId, articleId] of Object.entries(approved)) {
    const a = byId.get(articleId);
    if (!a) {
      console.warn(`skip ${videoId}: no article ${articleId}`);
      continue;
    }
    if (a.youtubeId !== undefined) {
      console.warn(`skip ${articleId}: already has youtubeId`);
      continue;
    }
    const src = fs.readFileSync(a.file, 'utf8');
    // Insert before the closing frontmatter fence, leaving everything else byte-identical.
    const m = src.match(/^(---\r?\n[\s\S]*?\r?\n)(---)/);
    if (!m) {
      console.warn(`skip ${articleId}: no frontmatter`);
      continue;
    }
    const nl = m[1].includes('\r\n') ? '\r\n' : '\n';
    fs.writeFileSync(a.file, `${m[1]}youtubeId: ${videoId}${nl}${src.slice(m[1].length)}`);
    console.log(`wrote youtubeId: ${videoId} -> ${articleId}`);
  }
}

const articles = loadArticles();
const pairsFile = opt('write');
if (pairsFile) {
  writePairs(pairsFile, articles);
} else {
  let videos = await loadVideos();
  const since = opt('since');
  if (since) videos = videos.filter((v) => v.date >= since);
  videos = videos.filter((v) => !(v.id in IGNORED));
  const title = new Map(videos.map((v) => [v.id, v.title]));
  const aTitle = new Map(articles.map((a) => [a.id, a.title]));
  const { pairs, candidates, conflicts, podcastVideos, podcastArticles, podcastWarnings } = matchVideosToArticles(
    videos,
    articles,
    { ignoredVideoIds: Object.keys(IGNORED), podcasts: loadPodcasts() },
  );
  const matched = new Set(pairs.map((p) => p.videoId));
  const seen = new Set([...candidates, ...podcastVideos].map((c) => c.videoId));

  const line = (p) =>
    `${String(p.score).padEnd(5)} ${p.videoId}  ${title.get(p.videoId)}\n      -> ${p.articleId}  (${aTitle.get(p.articleId)})` +
    (p.runnerUp ? `\n      runner-up ${p.runnerUp.score}: ${p.runnerUp.articleId}` : '');

  const shownPairs = flag('new-only') ? pairs.filter((p) => p.source === 'auto') : pairs;
  console.log(`# ${flag('new-only') ? 'Automatic pairs, used at build time but not yet in frontmatter' : 'Existing / automatic pairs'} (${shownPairs.length})`);
  shownPairs.forEach((p) => console.log(`[${p.source}${p.role === 'related' ? ', related' : ''}] ${line(p)}`));
  console.log(`\n# Candidates needing review (${candidates.length})`);
  candidates.forEach((c) => console.log(line(c)));
  const none = videos.filter((v) => !matched.has(v.id) && !seen.has(v.id));
  console.log(`\n# Videos with no plausible article (${none.length})`);
  none.forEach((v) => console.log(`${v.id}  ${v.date}  ${v.title}`));
  console.log(`\n# Skipped: look like podcast episodes (${podcastVideos.length})`);
  podcastVideos.forEach((p) => console.log(`${String(p.score).padEnd(5)} ${p.videoId}  ${title.get(p.videoId)}\n      ~ podcast ${p.podcastId}`));
  if (podcastArticles.length) {
    console.log(`\n# ${podcastArticles.length} articles look like podcast episodes and are skipped for automatic pairing${flag('show-podcast-articles') ? '' : ' (list them with --show-podcast-articles)'}`);
    if (flag('show-podcast-articles')) {
      podcastArticles.forEach((p) => console.log(`${String(p.score).padEnd(5)} ${p.articleId}  (${aTitle.get(p.articleId)})\n      ~ podcast ${p.podcastId}`));
    }
  }
  if (podcastWarnings.length) {
    console.log('\n# CHECK: explicit pairs whose video or article looks like a podcast episode');
    podcastWarnings.forEach((w) => console.log(`${w.videoId} <-> ${w.articleId} (${w.of} ~ podcast ${w.podcastId}, ${w.score})`));
  }
  if (conflicts.length) {
    console.log('\n# CONFLICTS: one video claimed by several articles');
    conflicts.forEach((c) => console.log(JSON.stringify(c)));
  }
}
