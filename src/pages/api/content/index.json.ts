import { getContentApiData } from '~/utils/content-api';

// Machine-readable index of every content type and entry (no bodies).
// Consumed by the WebMCP tools and the remote MCP server (/mcp); also fine for any other client.
export const GET = async () => {
  const { index } = await getContentApiData();
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
