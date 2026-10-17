// Remote MCP server for chrischinchilla.com (Streamable HTTP, stateless) at /mcp.
// Read-only: serves the same content tools as WebMCP (src/shared/content-tools.ts) from the
// static JSON API generated at build time (/api/content/**), so it never touches content files.
import type { Config } from '@netlify/functions';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import {
  CONTENT_TOOLS,
  runContentTool,
  type ContentDetail,
  type ContentIndex,
  type ToolContext,
} from '../../src/shared/content-tools';

const SITE_URL = 'https://chrischinchilla.com';
const INDEX_TTL_MS = 5 * 60 * 1000;
const MAX_REQUEST_BYTES = 64 * 1024;

const INSTRUCTIONS =
  "Read-only access to Chris Chinchilla's website: blog posts, books, stories, newsletters, music, software, gear, " +
  'courses, games, events, clients, podcasts and videos. Call list_content_types first to see what exists, ' +
  'then list_content / search_content to find entries and get_content to read one in full.';

// Fetch the static API from the deploy this function belongs to (falls back to production).
const baseUrl = (): string => process.env.DEPLOY_URL || process.env.URL || SITE_URL;

let indexCache: { at: number; promise: Promise<ContentIndex> } | undefined;

const fetchJson = async <T>(path: string): Promise<T | null> => {
  const response = await fetch(`${baseUrl()}${path}`, { headers: { Accept: 'application/json' } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Content API ${path} responded ${response.status}`);
  return (await response.json()) as T;
};

const context: ToolContext = {
  getIndex() {
    if (!indexCache || Date.now() - indexCache.at > INDEX_TTL_MS) {
      const promise = fetchJson<ContentIndex>('/api/content/index.json').then((index) => {
        if (!index) throw new Error('Content index missing');
        return index;
      });
      indexCache = { at: Date.now(), promise };
      // Don't cache failures.
      promise.catch(() => {
        if (indexCache?.promise === promise) indexCache = undefined;
      });
    }
    return indexCache.promise;
  },
  // Callers (tool handlers) only pass type/id pairs they found in the index, so the path is
  // always one of our own generated files.
  getDetail(type, id) {
    const path = id.split('/').map(encodeURIComponent).join('/');
    return fetchJson<ContentDetail>(`/api/content/${encodeURIComponent(type)}/${path}.json`);
  },
};

// The low-level Server (rather than McpServer) is deliberate: the tool definitions are plain JSON
// Schema shared with WebMCP, and McpServer.registerTool only accepts zod schemas.
const createServer = (): Server => {
  const server = new Server(
    { name: 'chrischinchilla.com', version: '1.0.0' },
    { capabilities: { tools: {} }, instructions: INSTRUCTIONS },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: CONTENT_TOOLS.map((tool) => ({
      name: tool.name,
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema as { type: 'object' },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { isError, data } = await runContentTool(request.params.name, request.params.arguments ?? {}, context);
    return {
      isError,
      content: [{ type: 'text' as const, text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }],
      ...(!isError && data && typeof data === 'object' ? { structuredContent: data as Record<string, unknown> } : {}),
    };
  });

  return server;
};

// Public, read-only data: allow any origin so browser-based MCP clients and inspectors work.
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id, Authorization',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
  'Access-Control-Max-Age': '86400',
};

const withCors = (response: Response): Response => {
  for (const [key, value] of Object.entries(CORS_HEADERS)) response.headers.set(key, value);
  return response;
};

const jsonRpcError = (status: number, code: number, message: string): Response =>
  withCors(
    new Response(JSON.stringify({ jsonrpc: '2.0', error: { code, message }, id: null }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

export default async (request: Request): Promise<Response> => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });

  // Stateless server: no sessions and no server-initiated SSE stream, so only POST is supported.
  if (request.method !== 'POST') {
    const response = jsonRpcError(405, -32000, 'Method not allowed. POST JSON-RPC to this endpoint.');
    response.headers.set('Allow', 'POST, OPTIONS');
    return response;
  }

  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return jsonRpcError(413, -32001, 'Request body is too large.');
  }

  // Netlify buffers function requests, but its platform ceiling is much larger than this endpoint
  // needs. Enforce an application limit even when Content-Length is absent or untrustworthy.
  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_REQUEST_BYTES) return jsonRpcError(413, -32001, 'Request body is too large.');
  const limitedRequest = new Request(request, { body });

  // A fresh server + transport per request keeps this safe for concurrent, stateless use.
  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  try {
    return withCors(await transport.handleRequest(limitedRequest));
  } finally {
    // handleRequest has already produced the full JSON response; release resources.
    void transport.close();
  }
};

export const config: Config = {
  path: '/mcp',
  rateLimit: {
    windowLimit: 100,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
};
