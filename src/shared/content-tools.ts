// Transport-agnostic content tools, shared by:
//   - WebMCP (in-browser, src/components/common/WebMCP.astro)
//   - the remote MCP server (Netlify Function, netlify/functions/mcp.ts)
// Keep this file free of Astro/Node/browser-only imports so both bundlers can use it.
// Data comes from the static JSON API generated at build time (src/pages/api/content/**).

import Fuse from 'fuse.js';

export interface ContentRecord {
  type: string;
  id: string;
  title: string;
  /** Site-relative path (list page for types that have no per-entry page). */
  url: string;
  summary: string;
  /** ISO date (YYYY-MM-DD) when the entry has a real one. */
  date?: string;
  tags: string[];
  /** Site categories (tech, writing, music, games) this entry belongs to. */
  categories: string[];
  /** Canonical off-site URL (publication, store, company site, video) when there is one. */
  externalUrl?: string;
}

export interface ContentDetail extends ContentRecord {
  /** Raw Markdown body. Absent for live-feed types (podcasts, videos). */
  body?: string;
  links: { label: string; url: string }[];
  /** Remaining scalar frontmatter (publisher, venue, role, ...). */
  fields: Record<string, string | number | boolean>;
}

export interface ContentTypeInfo {
  slug: string;
  label: string;
  description: string;
  count: number;
  listUrl: string;
  /** Whether get_content returns a full Markdown body for this type. */
  hasBody: boolean;
}

export interface ContentIndex {
  site: { name: string; url: string; description: string };
  categories: { slug: string; title: string; description: string; count: number }[];
  types: ContentTypeInfo[];
  /** Newest first; undated entries last. */
  items: ContentRecord[];
}

export interface ToolContext {
  getIndex(): Promise<ContentIndex>;
  getDetail(type: string, id: string): Promise<ContentDetail | null>;
}

export class ToolError extends Error {}

export interface ContentTool {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler(input: Record<string, unknown>, ctx: ToolContext): Promise<unknown>;
}

const MAX_LIMIT = 100;
const MAX_QUERY_LENGTH = 256;

const str = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const int = (value: unknown, fallback: number, min: number, max: number): number => {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : fallback;
};

const requireType = (index: ContentIndex, value: unknown): string | undefined => {
  const type = str(value);
  if (!type || type === 'all') return undefined;
  if (!index.types.some((t) => t.slug === type)) {
    throw new ToolError(
      `Unknown content type "${type}". Valid types: ${index.types.map((t) => t.slug).join(', ')} (or omit for all).`,
    );
  }
  return type;
};

const requireDate = (value: unknown, name: string): string | undefined => {
  const date = str(value);
  if (date && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(date)) {
    throw new ToolError(`"${name}" must be an ISO date such as 2025, 2025-06 or 2025-06-30.`);
  }
  return date;
};

interface Filters {
  type?: string;
  category?: string;
  tag?: string;
  since?: string;
  until?: string;
}

const readFilters = (index: ContentIndex, input: Record<string, unknown>): Filters => ({
  type: requireType(index, input.type),
  category: str(input.category)?.toLowerCase(),
  tag: str(input.tag)?.toLowerCase(),
  since: requireDate(input.since, 'since'),
  until: requireDate(input.until, 'until'),
});

const applyFilters = (items: ContentRecord[], f: Filters): ContentRecord[] =>
  items.filter((item) => {
    if (f.type && item.type !== f.type) return false;
    if (f.category && !item.categories.includes(f.category)) return false;
    if (f.tag && !item.tags.some((t) => t.toLowerCase() === f.tag)) return false;
    // Date bounds only make sense for dated entries; partial dates compare as prefixes.
    if (f.since && (!item.date || item.date < f.since)) return false;
    if (f.until && (!item.date || item.date.slice(0, f.until.length) > f.until)) return false;
    return true;
  });

const fuseCache = new WeakMap<ContentIndex, Fuse<ContentRecord>>();

const getFuse = (index: ContentIndex): Fuse<ContentRecord> => {
  let fuse = fuseCache.get(index);
  if (!fuse) {
    fuse = new Fuse(index.items, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'summary', weight: 1 },
        { name: 'tags', weight: 1 },
      ],
      threshold: 0.4,
      minMatchCharLength: 2,
    });
    fuseCache.set(index, fuse);
  }
  return fuse;
};

const typeProperty = {
  type: 'string',
  description:
    'Content type slug, e.g. "blog", "books", "podcasts". Omit (or "all") to cover every type. Call list_content_types for the full list.',
};
const categoryProperty = {
  type: 'string',
  description: 'Site category: "tech", "writing", "music" or "games".',
};
const tagProperty = { type: 'string', description: 'Only entries with this tag (case-insensitive exact match).' };
const sinceProperty = { type: 'string', description: 'Only entries dated on/after this ISO date (YYYY, YYYY-MM or YYYY-MM-DD). Undated entries are excluded.' };
const untilProperty = { type: 'string', description: 'Only entries dated on/before this ISO date (YYYY, YYYY-MM or YYYY-MM-DD). Undated entries are excluded.' };
const limitProperty = (fallback: number) => ({
  type: 'number',
  description: `Maximum results (1-${MAX_LIMIT}, default ${fallback}).`,
});

export const CONTENT_TOOLS: ContentTool[] = [
  {
    name: 'list_content_types',
    title: 'List content types and categories',
    description:
      "Describe what is on Chris Chinchilla's site: every content type (blog, books, podcasts, videos, music, games, ...) with entry counts, plus the four site categories (tech, writing, music, games). Start here to discover valid type and category values.",
    inputSchema: { type: 'object', properties: {} },
    handler: async (_input, ctx) => {
      const index = await ctx.getIndex();
      return { site: index.site, categories: index.categories, types: index.types, total: index.items.length };
    },
  },
  {
    name: 'list_content',
    title: 'List content',
    description:
      'Browse a listing of entries, newest first, for one content type or across all types, with optional category/tag/date filters and pagination. Returns metadata and summaries (not full text); use get_content for the body.',
    inputSchema: {
      type: 'object',
      properties: {
        type: typeProperty,
        category: categoryProperty,
        tag: tagProperty,
        since: sinceProperty,
        until: untilProperty,
        sort: {
          type: 'string',
          enum: ['newest', 'oldest', 'title'],
          description: 'Sort order (default "newest"). Undated entries sort last for newest/oldest.',
        },
        limit: limitProperty(20),
        offset: { type: 'number', description: 'Number of results to skip, for pagination (default 0).' },
      },
    },
    handler: async (input, ctx) => {
      const index = await ctx.getIndex();
      const filtered = applyFilters(index.items, readFilters(index, input));
      const sort = str(input.sort) ?? 'newest';
      if (sort === 'oldest') {
        filtered.sort((a, b) => (a.date ? (b.date ? a.date.localeCompare(b.date) : -1) : b.date ? 1 : 0));
      } else if (sort === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sort !== 'newest') {
        throw new ToolError('"sort" must be one of newest, oldest, title.');
      }
      const limit = int(input.limit, 20, 1, MAX_LIMIT);
      const offset = int(input.offset, 0, 0, Number.MAX_SAFE_INTEGER);
      const items = filtered.slice(offset, offset + limit);
      const next = offset + items.length;
      return { total: filtered.length, offset, limit, next_offset: next < filtered.length ? next : null, items };
    },
  },
  {
    name: 'search_content',
    title: 'Search content',
    description:
      'Fuzzy-search titles, summaries and tags across the site, ranked by relevance. Accepts the same type/category/tag/date filters as list_content.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          minLength: 2,
          maxLength: MAX_QUERY_LENGTH,
          description: `Search terms (2-${MAX_QUERY_LENGTH} characters).`,
        },
        type: typeProperty,
        category: categoryProperty,
        tag: tagProperty,
        since: sinceProperty,
        until: untilProperty,
        limit: limitProperty(10),
      },
      required: ['query'],
    },
    handler: async (input, ctx) => {
      const index = await ctx.getIndex();
      const query = str(input.query);
      if (!query || query.length < 2) throw new ToolError('Provide a "query" of at least 2 characters.');
      if (query.length > MAX_QUERY_LENGTH) {
        throw new ToolError(`"query" must be at most ${MAX_QUERY_LENGTH} characters.`);
      }
      const filters = readFilters(index, input);
      const limit = int(input.limit, 10, 1, MAX_LIMIT);
      const matches = getFuse(index)
        .search(query)
        .map((r) => r.item);
      const items = applyFilters(matches, filters).slice(0, limit);
      return { query, count: items.length, items };
    },
  },
  {
    name: 'get_content',
    title: 'Get a content entry',
    description:
      'Fetch one entry in full: metadata, links, and the Markdown body (where the type has one). Identify it by type + id (as returned by list_content/search_content) or by its site path.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Content type slug of the entry (with "id").' },
        id: { type: 'string', description: 'Entry id as returned by list_content/search_content (with "type").' },
        path: { type: 'string', description: 'Alternative to type+id: the entry\'s site path, e.g. "/blog/2026/some-post".' },
        max_chars: { type: 'number', description: 'Truncate the body to this many characters (default 60000).' },
      },
    },
    handler: async (input, ctx) => {
      const index = await ctx.getIndex();
      let record: ContentRecord | undefined;
      const path = str(input.path);
      if (path) {
        const normalised = path.replace(/^https?:\/\/[^/]+/i, '').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
        record = index.items.find((i) => i.url.replace(/\/+$/, '') === normalised);
      } else {
        const type = requireType(index, input.type);
        const id = str(input.id);
        if (!type || !id) throw new ToolError('Provide either "path", or both "type" and "id".');
        record = index.items.find((i) => i.type === type && i.id === id);
      }
      if (!record) throw new ToolError('No matching entry. Use search_content or list_content to find valid type/id values.');

      const detail = (await ctx.getDetail(record.type, record.id)) ?? { ...record, links: [], fields: {} };
      const maxChars = int(input.max_chars, 60000, 500, 500000);
      const body = detail.body;
      const truncated = body !== undefined && body.length > maxChars;
      return { ...detail, body: truncated ? body.slice(0, maxChars) : body, truncated };
    },
  },
  {
    name: 'list_tags',
    title: 'List tags',
    description: 'List tags used across the site (or one content type) with how many entries use each, most used first.',
    inputSchema: {
      type: 'object',
      properties: { type: typeProperty, limit: limitProperty(50) },
    },
    handler: async (input, ctx) => {
      const index = await ctx.getIndex();
      const type = requireType(index, input.type);
      const counts = new Map<string, number>();
      for (const item of index.items) {
        if (type && item.type !== type) continue;
        for (const tag of item.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
      const tags = [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, int(input.limit, 50, 1, MAX_LIMIT * 5))
        .map(([tag, count]) => ({ tag, count }));
      return { count: tags.length, tags };
    },
  },
];

/** Run a tool by name; always resolves to text content, flagging errors. */
export const runContentTool = async (
  name: string,
  input: Record<string, unknown>,
  ctx: ToolContext,
): Promise<{ isError: boolean; data: unknown }> => {
  const tool = CONTENT_TOOLS.find((t) => t.name === name);
  if (!tool) return { isError: true, data: `Unknown tool "${name}".` };
  try {
    return { isError: false, data: await tool.handler(input ?? {}, ctx) };
  } catch (error) {
    if (error instanceof ToolError) return { isError: true, data: error.message };
    console.error(`Tool ${name} failed:`, error);
    return { isError: true, data: 'The content service is temporarily unavailable. Try again shortly.' };
  }
};
