// Sitemap customization utility
// This function is called during build to customize sitemap entries

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const postsDir = path.resolve(process.cwd(), 'src/content/posts');

// @astrojs/sitemap's serialize callback only receives the built URL, not
// content collection frontmatter, so blog post publishDate is read directly
// from the source files here to give lastmod a real value instead of the
// build timestamp.
function loadPostDates(dir: string): Map<string, string> {
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
          if (data.publishDate) dates.set(id, new Date(data.publishDate).toISOString());
        } catch {
          // Skip files that fail to parse — lastmod falls back to the build date.
        }
      }
    }
  }

  walk(dir, '');
  return dates;
}

const postDates = loadPostDates(postsDir);

export function customizeSitemapItem(item: any) {
  // Extract path from URL
  const url = new URL(item.url);
  const path = url.pathname;

  // Set priority and changefreq based on page type
  if (path === '/') {
    item.priority = 1.0;
    item.changefreq = 'weekly';
  } else if (path.startsWith('/blog/') && !path.includes('/tag/') && !path.includes('/page/')) {
    // Individual blog posts
    item.priority = 0.8;
    item.changefreq = 'monthly';
    const id = path.replace(/^\/blog\//, '').replace(/\/$/, '');
    const publishDate = postDates.get(id);
    if (publishDate) item.lastmod = publishDate;
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
  } else {
    item.priority = 0.6;
    item.changefreq = 'monthly';
  }

  return item;
}
