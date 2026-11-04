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
// It does not touch src/data/video-matching-ignore.json: if the episode has a YouTube video, make
// sure its ID is listed there so it is never paired with an article.
// Not part of the build; run by hand.

import { readFileSync, writeFileSync, existsSync, unlinkSync, appendFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import matter from 'gray-matter';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const [postArg, slug] = args.filter((a) => !a.startsWith('--'));

if (!postArg || !slug) {
  console.error('Usage: npm run merge-qa -- <post-file> <podcast-slug>   (or merge-qa:apply to write)');
  process.exit(1);
}

const root = process.cwd();
const postPath = resolve(root, postArg);
const stubPath = resolve(root, 'src/content/podcasts', `${slug}.md`);

if (!existsSync(postPath)) throw new Error(`Post not found: ${postPath}`);
if (!existsSync(stubPath)) throw new Error(`No podcast stub at ${relative(root, stubPath)} - check the slug.`);

const post = matter(readFileSync(postPath, 'utf8'));
const stub = matter(readFileSync(stubPath, 'utf8'));

if (stub.content.trim()) {
  throw new Error(`Stub ${slug} already has a body; refusing to overwrite it.`);
}

// Old URL: the posts glob id is the path under src/content/posts without the extension.
const postId = relative(resolve(root, 'src/content/posts'), postPath).replace(/\.(md|mdx)$/, '');
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
data.title = post.data.title;
data.summary = post.data.summary ?? post.data.description;
data.publishDate = toIso(post.data.publishDate ?? post.data.date);
if (Array.isArray(post.data.tags) && post.data.tags.length) data.tags = post.data.tags;
if (post.data.modifiedDate) data.modifiedDate = toIso(post.data.modifiedDate);
if (post.data.updateNote) data.updateNote = post.data.updateNote;
for (const key of Object.keys(data)) if (data[key] === undefined) delete data[key];

const output = matter.stringify(`\n${transform(post.content)}\n`, data);

console.log(`Post:     ${relative(root, postPath)}`);
console.log(`Stub:     ${relative(root, stubPath)}`);
console.log(`Redirect: ${oldUrl} -> ${newUrl}`);
console.log(`Fields:   ${Object.keys(data).join(', ')}`);

if (!apply) {
  console.log('\nDry run - re-run with --apply to write changes and delete the post.');
  process.exit(0);
}

writeFileSync(stubPath, output);
appendFileSync(resolve(root, 'netlify.toml'), `\n\n[[redirects]]\n  from = "${oldUrl}"\n  to = "${newUrl}"\n  status = 301\n`);
unlinkSync(postPath);
console.log('\nDone. Review the diff, then run npm run check && npm run build.');
