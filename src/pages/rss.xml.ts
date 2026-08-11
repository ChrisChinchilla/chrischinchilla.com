import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { SITE, BLOG } from '~/config.mjs';
import { fetchPosts } from '~/utils/blog';
import { getPermalink } from '~/utils/permalinks';

export const GET = async () => {
  if (BLOG.disabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await fetchPosts();
  const newsletters = await getCollection('newsletters');
  const stories = await getCollection('stories');
  const books = await getCollection('books');
  const music = await getCollection('music');
  const av = await getCollection('av');

  // gear, podcasts, games, events, and clients are deliberately excluded from this feed —
  // see SEO-AEO-AUDIT.md finding 7 for why (no usable publish date to sort a feed by, or
  // the date only exists in an external source, or the content is reference/portfolio data
  // rather than periodically published content).
  const allItems = [
    ...posts.map((post) => ({
      link: getPermalink(post.id, 'post'),
      title: post.title,
      description: post.description,
      pubDate: post.publishDate,
    })),
    ...newsletters.map((entry) => ({
      link: `/newsletter/${entry.id}`,
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: new Date(entry.data.date),
    })),
    ...stories.map((entry) => ({
      link: `/stories/${entry.id}`,
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: new Date(entry.data.date),
    })),
    ...books.map((entry) => ({
      link: `/books/${entry.id}`,
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: new Date(entry.data.publish_date),
    })),
    ...music.map((entry) => ({
      link: `/music/${entry.id}`,
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: new Date(entry.data.release_date),
    })),
    ...av.map((entry) => ({
      link: entry.data.store_urls?.[0]?.url ?? `/videos/${entry.id}`,
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: new Date(entry.data.publish_date),
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${SITE.name}'s Blog`,
    description: SITE.description,
    site: import.meta.env.SITE,

    items: allItems,
  });
};
