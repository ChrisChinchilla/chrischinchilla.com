import rss from '@astrojs/rss';

import { SITE, BLOG } from '~/config.mjs';
import { fetchPosts } from '~/utils/blog';
import { getPermalink } from '~/utils/permalinks';

export const get = async () => {
  if (BLOG.disabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }
  // TODO: Also need to fetch all
  const posts = await fetchPosts();

  return rss({
    title: `${SITE.name}’s Blog`,
    description: SITE.description,
    site: import.meta.env.SITE,

    items: posts.map((post) => ({
      link: getPermalink(post.id, 'post'),
      title: post.title,
      description: post.description,
      pubDate: post.publishDate,
    })),
  });
};
