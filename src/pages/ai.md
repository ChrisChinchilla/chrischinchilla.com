---
title: 'Use this site with AI'
summary: 'How to read and search this site with AI agents: a remote MCP server, in-browser WebMCP tools, a JSON content API, and llms.txt.'
layout: '~/layouts/MarkdownLayout.astro'
---

Everything on this site is public, and I want it to be easy for the AI tools you already use to read it, search it, and cite it properly. There are four ways in, from most to least interactive.

## MCP server

The site runs a read-only [Model Context Protocol](https://modelcontextprotocol.io) server. Point an MCP-capable assistant at it and it can browse and search everything here, rather than guessing from search results.

**Server URL:** `https://chrischinchilla.com/mcp` (Streamable HTTP, no sign-in)

To add it:

- **Claude Code:** `claude mcp add --transport http chrischinchilla https://chrischinchilla.com/mcp`
- **Claude (web and desktop):** add a custom connector in your connector settings and paste the URL above.
- **Other clients:** most accept a remote HTTP server URL in their MCP settings. The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is handy for trying it out.

Tools it offers:

| Tool | What it does |
| --- | --- |
| `list_content_types` | Lists every content type (blog, books, podcasts, videos, music, games, and more) with counts, plus the four site categories: tech, writing, music, and games. |
| `list_content` | Browses a listing, newest first, for one content type or all of them. Filter by category, tag, or date, and page through the results. |
| `search_content` | Fuzzy search across titles, summaries, and tags, with the same filters. |
| `get_content` | Fetches one entry in full, with its Markdown text and links, by type and id or by page path. |
| `list_tags` | Lists the tags in use and how many entries use each. |

Try asking: "Using the chrischinchilla.com MCP server, what has Chris written about podcasting?" or "List Chris's most recent music releases."

## WebMCP in the browser

In browsers that support [WebMCP](https://webmachinelearning.github.io/webmcp/), an early web standard that lets a page offer tools to the browser's built-in AI agent, every page here registers the same tools directly. There is nothing to install or configure. It also adds a tool for reading any page on the site, such as the CV. Browser support is still limited, so if your browser doesn't have it, the page simply behaves as normal.

## JSON content API

The same data the tools use is available as plain static JSON:

- [`/api/content/index.json`](/api/content/index.json) lists every entry with its type, summary, date, tags, and categories.
- `/api/content/<type>.json` lists one content type, for example [`/api/content/books.json`](/api/content/books.json).
- `/api/content/<type>/<id>.json` returns a full entry, including the Markdown text.

## llms.txt

If your tool prefers a single text file, [`/llms.txt`](/llms.txt) is an index of everything on the site, and [`/llms-full.txt`](/llms-full.txt) contains the full text. Each article also has an "Open with AI" menu in the bottom right that can copy it as Markdown or open it in an assistant.

## Notes

All of this is read-only and covers content that is already public. If you build something with it, or something doesn't work, [get in touch](/contact).
