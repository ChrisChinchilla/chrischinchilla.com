import type { APIRoute, GetStaticPaths } from 'astro';

import { getContentApiData } from '~/utils/content-api';

// One listing per content type, e.g. /api/content/blog.json (metadata and summaries, no bodies).
export const getStaticPaths = (async () => {
  const { index } = await getContentApiData();
  return index.types.map((type) => ({ params: { type: type.slug } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const { index } = await getContentApiData();
  const type = index.types.find((t) => t.slug === params.type);
  const items = index.items.filter((i) => i.type === params.type);
  return new Response(JSON.stringify({ site: index.site, type, count: items.length, items }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
