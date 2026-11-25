---
title: Vale MCP
github_repo: ChrisChinchilla/Vale-MCP
platform: 'Any MCP client (Claude Desktop, Cursor, VS Code) on macOS, Windows, and Linux'
requirements: 'Node.js 22 or later and Vale 3.0 or later'
role: 'Creator'
availability: 'Available on npm as vale-mcp'
software_type: 'SoftwareApplication'
operating_system: ['macOS', 'Windows', 'Linux']
project_label: 'View Vale MCP on GitHub'
license_name: 'MIT'
license_url: 'https://github.com/ChrisChinchilla/Vale-MCP/blob/main/LICENSE'
summary: An MCP server I created that lets AI assistants lint text with Vale and understand the style rules behind each alert.
project_url: https://github.com/ChrisChinchilla/Vale-MCP
tags:
  - Vale
  - MCP
  - AI
  - Software
---

[Vale MCP](https://github.com/ChrisChinchilla/Vale-MCP) is a [Model Context Protocol](https://modelcontextprotocol.io/) server that lets AI assistants such as Claude Desktop and Cursor check text with [Vale](https://vale.sh), the prose linter I use for most of my technical writing and editing work. It finds your `.vale.ini` the same way Vale does, runs the lint, and returns the alerts grouped by severity.

Beyond linting, it can list the rules in your active styles and explain a single rule from an alert, so an assistant can say why something was flagged and not only what. It exposes your active configuration as an MCP resource, includes prompts for fixing and reviewing text, and can sync style packages with `vale_sync`.

Run it with `npx vale-mcp@latest`, or install it globally with `npm install -g vale-mcp`. Version 0.3.0 added the rule tools, the config resource and the prompts; see [the release post](/blog/2026/vale-mcp-0-3-0) for details.

It's a companion to [Vale VSCode](/software/vale-vscode) and [Obsidian Vale](/software/obsidian-vale), and part of the same ongoing Vale tooling work.
