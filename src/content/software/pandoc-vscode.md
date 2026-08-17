---
title: Pandoc VSCode
summary: A Visual Studio Code extension I created for rendering markdown to PDF, Word, or HTML using Pandoc, without leaving the editor.
project_url: https://github.com/ChrisChinchilla/vscode-pandoc
tags:
  - VSCode
  - Markdown
  - Software
---

[Pandoc VSCode](https://github.com/ChrisChinchilla/vscode-pandoc) lets you render markdown documents to PDF, Word, or HTML from directly within Visual Studio Code, using [Pandoc](https://pandoc.org) as the conversion engine. Trigger a render via the command palette or a keyboard shortcut, then pick the output format from a list.

Pandoc reads the file from disk rather than the editor buffer, so unsaved changes are saved first and rendering is cancelled rather than exporting stale content if the save fails. Rendering PDFs additionally needs a LaTeX-based PDF engine installed (BasicTeX on macOS, MiKTeX on Windows, TeX Live on Linux).

I built this as a convenience layer for my own technical writing workflow, where I frequently need to hand off markdown drafts as formatted documents, building on earlier work by [dfinke](https://github.com/dfinke).
