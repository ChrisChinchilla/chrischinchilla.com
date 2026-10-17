import type { APIRoute, GetStaticPaths } from 'astro';

import { getContentApiData } from '~/utils/content-api';

// Full entry (metadata, links, Markdown body), e.g. /api/content/blog/2026/some-post.json.
export const getStaticPaths = (async () => {
  const { details } = await getContentApiData();
  return [...details.entries()].flatMap(([type, entries]) =>
    entries.map((entry) => ({ params: { type, id: entry.id } })),
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const { details } = await getContentApiData();
  const entry = details.get(params.type as string)?.find((e) => e.id === params.id);
  return new Response(JSON.stringify(entry ?? null), {
    status: entry ? 200 : 404,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
