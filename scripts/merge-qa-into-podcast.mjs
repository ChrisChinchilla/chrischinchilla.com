#!/usr/bin/env node
// Moves a Q&A post into the stub for its podcast episode, so the Q&A shows on /podcast/<slug>.
//
//   npm run merge-qa -- <post-file> <podcast-slug>          (dry run)
//   npm run merge-qa:apply -- <post-file> <podcast-slug>    (write changes)
// or call the script directly with node; --apply may go anywhere in the arguments.
//
// e.g. npm run merge-qa:apply -- src/content/posts/2026/cybersecurity-dark-wolf.md \
//        punk-rock-cybersecurity-with-brian-panarello-of-dark-wolf
//
// What --apply does:
//   1. Writes the post's body into src/content/podcasts/<podcast-slug>.md, keeping the stub's
//      existing frontmatter (player_embed etc.) and adding title, summary, publishDate, tags,
//      modifiedDate and updateNote from the post.
//   2. Demotes headings by one level (## -> ###) and turns standalone **bold question** lines into
//      #### headings, so they nest under the "Condensed Q&A" <h2> on the episode page.
//   3. Appends a 301 redirect from the old /blog/... URL to /podcast/<slug> in netlify.toml.
//   4. Deletes the post file.
//
// Optional, for an episode that also has a video (can be used with or without a post; pass `-` as
// the post file to only add the video):
//   --video <youtubeId> --video-path /videos/<slug>-<id>
//   Sets `youtubeId` and `oldVideoPath` on the stub (the latter is a TEMPORARY field that becomes a
//   301 from the old video page, see src/pages/[redirectsFile].ts) and lists the ID in
//   src/data/video-matching-ignore.json so it is never paired with an article.
// Not part of the build; run by hand.

import { readFileSync, writeFileSync, existsSync, unlinkSync, appendFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import matter from 'gray-matter';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const videoId = flag('--video');
const videoPath = flag('--video-path');
const [postArg, slug] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.match(/^--video(-path)?$/));
if (videoId && !/^[A-Za-z0-9_-]{11}$/.test(videoId)) throw new Error('--video must be an 11-character YouTube ID');
if (videoPath && !videoPath.startsWith('/videos/')) throw new Error('--video-path must start with /videos/');
if (videoId && !videoPath) console.warn('Warning: no --video-path, so the old video page will not be redirected.');

if (!postArg || !slug) {
  console.error('Usage: npm run merge-qa -- <post-file> <podcast-slug>   (or merge-qa:apply to write)');
  process.exit(1);
}

const root = process.cwd();
const qaMode = postArg !== '-';
const postPath = qaMode ? resolve(root, postArg) : undefined;
const stubPath = resolve(root, 'src/content/podcasts', `${slug}.md`);

if (qaMode && !existsSync(postPath)) throw new Error(`Post not found: ${postPath}`);
if (!existsSync(stubPath)) throw new Error(`No podcast stub at ${relative(root, stubPath)} - check the slug.`);

const post = qaMode ? matter(readFileSync(postPath, 'utf8')) : undefined;
const stub = matter(readFileSync(stubPath, 'utf8'));

if (qaMode && stub.content.trim()) {
  throw new Error(`Stub ${slug} already has a body; refusing to overwrite it.`);
}

// Old URL: the posts glob id is the path under src/content/posts without the extension.
const postId = qaMode ? relative(resolve(root, 'src/content/posts'), postPath).replace(/\.(md|mdx)$/, '') : '';
const oldUrl = `/blog/${postId}`;
const newUrl = `/podcast/${slug}`;

const transform = (body) =>
  body
    .replace(/^(#{2,5}) /gm, (_m, hashes) => `${hashes}# `)
    .replace(/^\*\*([^*\n]+\?)\*\*\s*$/gm, '#### $1')
    .replace('This post is a condensed Q&A', 'This is a condensed Q&A')
    .trim();

const toIso = (value) => (value instanceof Date ? value.toISOString() : value);
const data = { ...stub.data };
if (qaMode) {
  data.title = post.data.title;
  data.summary = post.data.summary ?? post.data.description;
  data.publishDate = toIso(post.data.publishDate ?? post.data.date);
  if (Array.isArray(post.data.tags) && post.data.tags.length) data.tags = post.data.tags;
  if (post.data.modifiedDate) data.modifiedDate = toIso(post.data.modifiedDate);
  if (post.data.updateNote) data.updateNote = post.data.updateNote;
}
if (videoId) data.youtubeId = videoId;
if (videoPath) data.oldVideoPath = videoPath;
for (const key of Object.keys(data)) if (data[key] === undefined) delete data[key];

const output = matter.stringify(qaMode ? `\n${transform(post.content)}\n` : `\n${stub.content.trim()}\n`, data);

if (qaMode) console.log(`Post:     ${relative(root, postPath)}`);
console.log(`Stub:     ${relative(root, stubPath)}`);
if (qaMode) console.log(`Redirect: ${oldUrl} -> ${newUrl}`);
if (videoPath) console.log(`Redirect: ${videoPath} -> ${newUrl} (from frontmatter)`);
console.log(`Fields:   ${Object.keys(data).join(', ')}`);

if (!apply) {
  console.log('\nDry run - re-run with --apply to write changes and delete the post.');
  process.exit(0);
}

writeFileSync(stubPath, output);
if (qaMode) {
  appendFileSync(resolve(root, 'netlify.toml'), `\n\n[[redirects]]\n  from = "${oldUrl}"\n  to = "${newUrl}"\n  status = 301\n`);
  unlinkSync(postPath);
}
if (videoId) {
  const ignorePath = resolve(root, 'src/data/video-matching-ignore.json');
  const ignore = JSON.parse(readFileSync(ignorePath, 'utf8'));
  ignore[videoId] ??= `Tech Lounge podcast episode (${data.title ?? slug})`;
  writeFileSync(ignorePath, `${JSON.stringify(ignore, null, 2)}\n`);
}
console.log('\nDone. Review the diff, then run npm run check && npm run build.');
