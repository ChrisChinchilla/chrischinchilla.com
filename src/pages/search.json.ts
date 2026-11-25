// The site search index, fetched by SearchComponent.astro the first time search is opened.
// It used to be inlined into every page (about 840 KB each).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getEntryHref } from '~/utils/content-categories';

const toISOString = (date: Date | string | undefined): string | undefined => {
  if (!date) return undefined;
  const parsed = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

export const GET: APIRoute = async () => {
  const [posts, newsletters, podcasts, stories, courses] = await Promise.all([
    getCollection('posts'),
    getCollection('newsletters'),
    getCollection('podcasts'),
    getCollection('stories'),
    getCollection('av'),
  ]);

  const content = [
    ...posts.map((post) => ({
      url: `/blog/${post.id}`,
      title: post.data.title,
      description: post.data.summary || '',
      publishDate: toISOString(post.data.publishDate),
      tags: post.data.tags || [],
    })),
    ...newsletters.map((item) => ({
      url: `/newsletter/${item.id}`,
      title: item.data.title,
      description: item.data.summary || '',
      publishDate: toISOString(item.data.date),
      tags: [],
    })),
    ...podcasts.map((item) => ({
      url: `/podcast/${item.id}`,
      title: item.data.title || '',
      description: item.data.description || '',
      publishDate: undefined,
      tags: [],
    })),
    ...stories.map((item) => ({
      url: `/stories/${item.id}`,
      title: item.data.title,
      description: item.data.summary || '',
      publishDate: toISOString(item.data.date),
      tags: item.data.tags || [],
    })),
    // Courses have no page of their own: link out when they have a URL, else to the list.
    ...courses.map((item) => ({
      url: getEntryHref(item) ?? '/courses',
      title: item.data.title,
      description: '',
      publishDate: toISOString(item.data.publish_date),
      tags: [],
    })),
  ].sort((a, b) => {
    if (!a.publishDate) return 1;
    if (!b.publishDate) return -1;
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  return new Response(JSON.stringify(content), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
