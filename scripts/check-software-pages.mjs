// Run after npm run build: node scripts/check-software-pages.mjs
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import matter from 'gray-matter';

const content = new URL('../src/content/software/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const readPage = (path) => readFileSync(new URL(`${path}/index.html`, dist), 'utf8');
const schemas = (html) =>
  [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1])
  );
const listing = readPage('software');
const cards = [...listing.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)];
const entries = readdirSync(content).filter((name) => name.endsWith('.md'));
assert.equal(cards.length, entries.length);
for (const [, card] of cards) {
  const header = card.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)[1];
  assert.equal([...header.matchAll(/<a\b/g)].length, 1, 'Preview and title must share one link');
  assert.match(header, /aria-labelledby="software-[^"]+"/);
  assert.doesNotMatch(card, /View project|\.gif(?:["?])/);
}
const itemList = schemas(listing).find((schema) => schema['@type'] === 'ItemList');
assert.equal(itemList.numberOfItems, entries.length);
assert.ok(itemList.itemListElement.every((item) => item.url.startsWith('https://chrischinchilla.com/software/')));
for (const name of entries) {
  const { data } = matter(readFileSync(new URL(name, content), 'utf8'));
  const html = readPage(`software/${name.slice(0, -3)}`);
  const schema = schemas(html).find((schema) => schema['@type'] === data.software_type);
  assert.ok(schema, `Missing software schema for ${name}`);
  assert.equal(schema.name, data.title);
  assert.equal(schema.description, data.summary);
  assert.equal(schema.license, data.license_url);
  assert.equal(schema.sameAs, data.project_url);
  assert.ok(schema[data.role === 'Contributor' ? 'contributor' : 'creator']);
  assert.equal(schema.author, undefined, 'Do not attribute contributed projects to the site author');
  assert.equal(schema.aggregateRating, undefined, 'Stars are not review ratings');
  if (data.image) {
    assert.equal(schema.image, new URL(data.image, 'https://chrischinchilla.com').href);
    if (data.software_type === 'SoftwareApplication') assert.equal(schema.screenshot, schema.image);
    assert.ok(html.includes(`property="og:image" content="${schema.image}"`), 'Share image must resolve correctly');
  }
  assert.match(html, /<h2 id="project-facts"/);
  for (const fact of ['Platform', 'Requirements', 'My role', 'Availability'])
    assert.match(html, new RegExp(`<dt\\b[^>]*>${fact}</dt>`));
  assert.doesNotMatch(html, />\s*View project|vscodePandoc\.gif/);
  if (data.project_url) assert.ok(html.includes(data.project_label));
}
console.log(
  `Verified accessible cards, project facts, links, share images and software schemas for ${entries.length} projects.`
);
