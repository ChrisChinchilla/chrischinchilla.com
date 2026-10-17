---
title: 'Making this site easy for AI tools to use: MCP, WebMCP, and more'
publishDate: 2026-10-16T00:00:00.000Z
author: Chris Ward
categories:
  - tech
tags:
  - AI
  - MCP
  - WebMCP
  - Astro
  - Netlify
summary: >-
  I've added several ways for AI assistants and agents to read, search, and cite this site properly: a remote MCP server, in-browser WebMCP tools, a JSON content API, llms.txt, and an "Open with AI" menu on articles. Here's what each does and how to use them.
---

%% TODO: Opening paragraph in my own voice. Why I care about this at all (people already ask assistants about my work, and I'd rather they got my actual words than a guess), and a sentence on whether I'm excited or sceptical about it. %%

People already use AI assistants to find and summarise things on the web, including things I've written. I can't stop that, but I can make it work better, so over the last few weeks I've added a handful of features to this site aimed at AI tools. Some are for people using assistants, and some are for the agents themselves.

## An "Open with AI" menu on every article

In the bottom right of articles, books, stories, and other long-form pages, there's an "Open with AI" button. It can copy the page as Markdown (with the frontmatter), or open it in Claude, ChatGPT, or Gemini with a prompt to read and summarise it.

The menu now has a "For AI agents" section too. It can copy the MCP server URL (more on that next), copy a prompt that tells an assistant which tools to use for the section you're reading, and link to the same page or section as JSON.

%% TODO: Screenshot of the open menu. %%

## A remote MCP server

The biggest addition is a [Model Context Protocol](https://modelcontextprotocol.io) server at `https://chrischinchilla.com/mcp`. If your assistant supports remote MCP servers, you can add it and ask questions about my work, and it will search and read the site rather than relying on whatever it remembers.

With Claude Code, for example:

```sh
claude mcp add --transport http chrischinchilla https://chrischinchilla.com/mcp
```

It exposes five read-only tools:

- `list_content_types` describes everything on the site, with counts.
- `list_content` browses a listing, for one content type or all of them, with filters for category, tag, and date.
- `search_content` does fuzzy search across titles, summaries, and tags.
- `get_content` returns one entry in full, as Markdown.
- `list_tags` lists the tags in use.

There's no sign-in, because everything it serves is already public. The [AI page](/ai) has setup instructions for other clients.

%% TODO: Example of a real question and answer from an assistant using it, ideally something it couldn't have answered well without the server. %%

## WebMCP

[WebMCP](https://webmachinelearning.github.io/webmcp/) is a proposed web standard that lets a page offer tools to the browser's own AI agent, rather than the agent having to click around and scrape. Every page here registers the same tools as the MCP server, plus one for reading any page on the site, like my CV.

It's an early draft and browser support is limited, so most people won't see any difference yet. The code feature-detects the API and does nothing if it isn't there. I've also had to handle the fact that the API has moved around in recent drafts.

%% TODO: Which browsers I actually tested this in, if any. I only tested with a mocked API so far. %%

## One content model behind all of it

Rather than building the MCP server and the WebMCP tools separately, both read the same static JSON API, generated at build time from the site's content. It lists every content type (blog posts, books, stories, newsletters, music, games, events, and more) and has a full version of each entry, including the Markdown. You can use it directly: start at [`/api/content/index.json`](/api/content/index.json).

The tool definitions are shared too, so a change to one shows up in both. The MCP server itself is a small Netlify Function that fetches the static JSON, so it never touches the content files directly and can only serve what was published.

%% TODO: Mention how I built this, including any help from AI tools, if I want to say. %%

## The older, simpler pieces

Two other things were already here and fit the same picture. [`/llms.txt`](/llms.txt) is an index of the whole site in a format aimed at language models, and [`/llms-full.txt`](/llms-full.txt) contains the full text. Articles also carry structured data and the usual RSS feed, which helps with traditional search as well.

## Caveats

This is all read-only and none of it is a way to get paid or credited for training use. It only makes the site easier to use accurately. There's also nothing yet to rate-limit the MCP server, so I may need to add that if it gets heavy use.

%% TODO: My actual opinion on AI crawlers and training, and whether robots.txt says anything about it. Check what public/robots.txt currently allows before writing this. %%

%% TODO: Closing paragraph and a call to action: try the MCP server and tell me what breaks or what tools are missing. %%
