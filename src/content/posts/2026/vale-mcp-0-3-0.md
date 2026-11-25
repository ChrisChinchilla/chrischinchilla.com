---
title: 'Vale MCP 0.3.0: rule tools, a config resource and prompts'
publishDate: 2026-11-25T00:00:00.000Z
author: Chris Ward
categories:
  - tech
tags:
  - Vale
  - MCP
  - AI
  - Open Source
summary: >-
  Vale MCP 0.3.0 adds tools to list and explain Vale rules, an MCP resource for your active configuration, three prompts, and a set of fixes to path handling and error output.
---

[Vale MCP](https://github.com/ChrisChinchilla/Vale-MCP) is an MCP server that lets AI assistants such as Claude Desktop and Cursor lint text with [Vale](https://vale.sh/). [Version 0.3.0](https://github.com/ChrisChinchilla/Vale-MCP/releases/tag/v0.3.0) is out. It adds ways for an assistant to understand your style rules, not only see the alerts they produce.

## Understanding rules

Two new tools help an assistant explain an alert:

- `list_rules` lists the rules in the styles your active configuration uses, with level, check type, message and whether each is enabled. It also lists Vale's built-in `Vale.*` rules, and accepts `max_rules` to limit large results.
- `explain_rule` takes a `Style.Rule` name from a lint result and returns the rule's YAML definition and where it is active.

`vale_status` now also reports the active config path, declared packages and the style folders it found on your `StylesPath`.

## A resource and prompts

The server now exposes the active `.vale.ini` as an MCP resource, `vale://config`.

It also ships three prompts: `fix_style_issues`, `review_text` and `explain_style_rule`. They are instruction templates that tell the assistant which tools to call.

%% TODO: Say how these appear in a client (for example, slash commands in a particular tool) once checked. %%

## Fixes and hardening

This release is mostly about reliability:

- A relative `config_path` now works in every tool. Before, it was resolved from Vale's working directory and gave an `E100 ... does not exist` error.
- `VALE_ALLOWED_ROOTS` no longer rejects folders whose names merely start with two dots, such as `..drafts`.
- `vale_status` notices if you install Vale after the server has started.
- Error replies no longer include stack traces, and so no local file paths, unless you run with `--debug`.
- Output over 10 MB now fails with a clear message instead of a JSON parse error.

## Smaller changes

- You can change Vale's 60 second timeout with the `VALE_TIMEOUT_MS` environment variable.
- The decorative start-up banner is gone.
- The README now gives `npm install -g vale-mcp` for a global install.
- Releases marked as prereleases on GitHub (`X.Y.Z-rc.N`) publish to the `next` npm tag, so `latest` stays on the stable version. This release went through two release candidates first.

## Try it

```bash
npx vale-mcp@latest
```

You need Node.js 22 or later and Vale 3.0 or later. See the [README](https://github.com/ChrisChinchilla/Vale-MCP#readme) for setup in specific assistants, and the [release notes](https://github.com/ChrisChinchilla/Vale-MCP/releases/tag/v0.3.0) for the full list of changes.

%% TODO: The site has no page for Vale MCP under /software. Decide whether to add one and link to it here. %%
