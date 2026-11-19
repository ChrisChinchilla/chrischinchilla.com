// Run after npm run build: npm run check:video-schemas
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createVideoObjectSchema, normalizeVideoUploadDate } from '../src/utils/video-schema.mjs';

const validUploadDate = '2026-11-11T09:45:13Z';
assert.equal(normalizeVideoUploadDate(validUploadDate), validUploadDate);
assert.equal(normalizeVideoUploadDate('2026-11-11'), '2026-11-11');
assert.equal(normalizeVideoUploadDate(undefined), undefined);
assert.equal(normalizeVideoUploadDate('not-a-date'), undefined);
assert.equal(normalizeVideoUploadDate('2026-02-30T09:45:13Z'), undefined);
assert.equal(normalizeVideoUploadDate('2026-11-11T25:00:00Z'), undefined);
assert.equal(
  createVideoObjectSchema({ title: 'Video', uploadDate: validUploadDate }, 'https://example.com/video').uploadDate,
  validUploadDate
);
assert.equal(createVideoObjectSchema({ title: 'Undated video' }, 'https://example.com/video'), undefined);
assert.equal(
  createVideoObjectSchema({ title: 'Invalid date', uploadDate: '2026-02-30' }, 'https://example.com/video'),
  undefined
);

const dist = new URL('../dist/', import.meta.url);
assert.ok(existsSync(dist), 'Build the site before checking generated video schemas');
const htmlFiles = [];
const walk = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
};
walk(dist);

const videoObjectsIn = (value, videos = []) => {
  if (Array.isArray(value)) {
    value.forEach((item) => videoObjectsIn(item, videos));
  } else if (value && typeof value === 'object') {
    if (value['@type'] === 'VideoObject') videos.push(value);
    Object.values(value).forEach((item) => videoObjectsIn(item, videos));
  }
  return videos;
};

const allVideoObjects = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const [, json] of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    allVideoObjects.push(...videoObjectsIn(JSON.parse(json)));
  }
}
assert.ok(allVideoObjects.length, 'Expected at least one VideoObject in the generated site');
for (const video of allVideoObjects) {
  assert.ok(normalizeVideoUploadDate(video.uploadDate), `Invalid VideoObject uploadDate: ${video.name}`);
}

const vivooPage = new URL('blog/2026/vivoo-at-home-tests/index.html', dist);
assert.ok(existsSync(vivooPage), 'Expected the Vivoo article page in the generated site');
const vivooHtml = readFileSync(vivooPage, 'utf8');
const vivooSchemas = [
  ...vivooHtml.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
].map((match) => JSON.parse(match[1]));
const vivooVideos = vivooSchemas.flatMap((schema) => videoObjectsIn(schema));
assert.equal(vivooVideos.length, 1, 'Expected one VideoObject on the Vivoo article');
assert.equal(vivooVideos[0].name, 'At home wellness tests with Vivoo');
assert.equal(vivooVideos[0].uploadDate, validUploadDate);
assert.equal(vivooVideos[0].duration, 'PT6M54S');

console.log(`Verified ${allVideoObjects.length} generated VideoObjects and the Vivoo upload timestamp.`);
