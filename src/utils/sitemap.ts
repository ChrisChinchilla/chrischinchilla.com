import { getContentDates } from './content-dates';
// Sitemap customization utility
// This function is called during build to customize sitemap entries

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// URL prefix -> content directory and the frontmatter field holding the original date.
// `modifiedDate` (when set for a substantive edit) always wins over the original date.
const DATED_SECTIONS: { prefix: string; dir: string; dateField: string }[] = [
  { prefix: '/blog/', dir: 'posts', dateField: 'publishDate' },
  { prefix: '/stories/', dir: 'stories', dateField: 'date' },
  { prefix: '/newsletter/', dir: 'newsletters', dateField: 'date' },
  { prefix: '/books/', dir: 'books', dateField: 'publish_date' },
  { prefix: '/music/', dir: 'music', dateField: 'release_date' },
  { prefix: '/gear/', dir: 'gear', dateField: 'modifiedDate' },
  { prefix: '/software/', dir: 'software', dateField: 'modifiedDate' },
];

// @astrojs/sitemap's serialize callback only receives the built URL, not
// content collection frontmatter, so the dates are read directly from the
// source files here to give lastmod a real value (the last substantive edit,
// else the original publish date) instead of the build timestamp.
function loadDates(dir: string, dateField: string): Map<string, string> {
  const dates = new Map<string, string>();

  function walk(current: string, relative: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      const entryRelative = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(entryPath, entryRelative);
      } else if (/\.(md|mdx)$/.test(entry.name)) {
        const id = entryRelative.replace(/\.(md|mdx)$/, '');
        try {
          const { data } = matter(fs.readFileSync(entryPath, 'utf-8'));
          const normalized = getContentDates({ date: dateField === 'modifiedDate' ? undefined : data[dateField], modifiedDate: data.modifiedDate });
          const lastmod = normalized.modifiedDate ?? normalized.publishedDate;
          if (lastmod) dates.set(id, new Date(lastmod).toISOString());
        } catch {
          // Skip files that fail to parse — lastmod falls back to the build date.
        }
      }
    }
  }

  walk(dir, '');
  return dates;
}

const sectionDates = DATED_SECTIONS.map((section) => ({
  ...section,
  dates: loadDates(path.resolve(process.cwd(), 'src/content', section.dir), section.dateField),
}));

// Applies a real lastmod to individual entry pages (not tag/pagination pages).
function applyLastmod(item: any, pathname: string) {
  const section = sectionDates.find((s) => pathname.startsWith(s.prefix));
  if (!section) return;
  const id = pathname.slice(section.prefix.length).replace(/\/$/, '');
  const lastmod = section.dates.get(id);
  if (lastmod) item.lastmod = lastmod;
}

export function customizeSitemapItem(item: any) {
  // Extract path from URL
  const url = new URL(item.url);
  const path = url.pathname;

  if (!path.includes('/tag/') && !path.includes('/page/')) applyLastmod(item, path);

  // Set priority and changefreq based on page type
  if (path === '/') {
    item.priority = 1.0;
    item.changefreq = 'weekly';
  } else if (path.startsWith('/blog/') && !path.includes('/tag/') && !path.includes('/page/')) {
    // Individual blog posts
    item.priority = 0.8;
    item.changefreq = 'monthly';
  } else if (path === '/blog' || path === '/blog/') {
    // Blog index
    item.priority = 0.9;
    item.changefreq = 'daily';
  } else if (path === '/stories' || path === '/stories/') {
    // Stories index
    item.priority = 0.8;
    item.changefreq = 'weekly';
  } else if (path.startsWith('/stories/') && !path.includes('/tag/') && !path.includes('/page/')) {
    // Individual stories
    item.priority = 0.7;
    item.changefreq = 'monthly';
  } else if (path === '/videos' || path === '/videos/') {
    item.priority = 0.8;
    item.changefreq = 'weekly';
  } else if (path.startsWith('/videos/') && !/\/\d+$/.test(path)) {
    // Individual video pages (not paginated list)
    item.priority = 0.7;
    item.changefreq = 'monthly';
  } else if (path.startsWith('/podcast/')) {
    item.priority = 0.8;
    item.changefreq = 'monthly';
  } else if (path.startsWith('/books/')) {
    item.priority = 0.7;
    item.changefreq = 'monthly';
  } else if (path === '/music' || path === '/music/') {
    // Music index
    item.priority = 0.8;
    item.changefreq = 'weekly';
  } else if (path.startsWith('/music/') && !/\/\d+\/?$/.test(path)) {
    // Individual music releases (not paginated list)
    item.priority = 0.7;
    item.changefreq = 'monthly';
  } else if (path === '/gear' || path === '/gear/') {
    item.priority = 0.8;
    item.changefreq = 'weekly';
  } else if (path.startsWith('/gear/') && !path.includes('/tag/') && !/\/\d+\/?$/.test(path)) {
    item.priority = 0.7;
    item.changefreq = 'monthly';
  } else if (path === '/software' || path === '/software/') {
    item.priority = 0.7;
    item.changefreq = 'weekly';
  } else if (path.startsWith('/software/') && !path.includes('/tag/') && !/\/\d+\/?$/.test(path)) {
    item.priority = 0.6;
    item.changefreq = 'monthly';
  } else if (path === '/newsletter' || path === '/newsletter/' || /^\/newsletter\/\d{1,2}\/?$/.test(path)) {
    // Newsletter index + pagination. Pagination page numbers are 1-2 digits; individual
    // newsletter issue slugs are 6-digit ddmmyy date codes (e.g. /newsletter/010825), so a
    // digit-count check distinguishes them without needing to read collection data here.
    item.priority = 0.8;
    item.changefreq = 'weekly';
  } else if (path.startsWith('/newsletter/') && !/^\/newsletter\/\d{1,2}\/?$/.test(path)) {
    // Individual newsletter issues
    item.priority = 0.7;
    item.changefreq = 'monthly';
  } else if (path === '/events' || path === '/events/' || /^\/events\/\d+\/?$/.test(path)) {
    // Events index + pagination (no individual detail pages)
    item.priority = 0.7;
    item.changefreq = 'weekly';
  } else if (path === '/clients' || path === '/clients/' || /^\/clients\/\d+\/?$/.test(path)) {
    // Clients index + pagination (no individual detail pages)
    item.priority = 0.7;
    item.changefreq = 'monthly';
  } else if (path === '/games' || path === '/games/' || /^\/games\/\d+\/?$/.test(path)) {
    // Games index + pagination (no individual detail pages)
    item.priority = 0.7;
    item.changefreq = 'monthly';
  } else if (path === '/courses' || path === '/courses/') {
    item.priority = 0.6;
    item.changefreq = 'monthly';
  } else {
    item.priority = 0.6;
    item.changefreq = 'monthly';
  }

  return item;
}
