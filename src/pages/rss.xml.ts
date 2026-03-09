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
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${SITE.name}'s Blog`,
    description: SITE.description,
    site: import.meta.env.SITE,

    items: allItems,
  });
};
