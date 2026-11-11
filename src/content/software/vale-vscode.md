---
title: Vale VSCode
github_repo: ChrisChinchilla/vale-vscode
image: https://raw.githubusercontent.com/ChrisChinchilla/vale-vscode/main/img/vale-vscode-problems-view.png
image_alt: Vale diagnostics highlighted in the VS Code editor and problems view
platform: 'Visual Studio Code on macOS, Windows, and Linux'
requirements: 'VS Code 1.109.0 or later and Vale 3.10.0 or later'
role: 'Creator'
availability: 'Available on the Visual Studio Marketplace'
software_type: 'SoftwareApplication'
operating_system: ['macOS', 'Windows', 'Linux']
project_label: 'View Vale VSCode on GitHub'
license_name: 'MIT'
license_url: 'https://github.com/ChrisChinchilla/vale-vscode/blob/main/LICENSE'
summary: A Visual Studio Code extension I created that integrates the Vale prose linter directly into the editor.
project_url: https://github.com/ChrisChinchilla/vale-vscode
tags:
  - Vale
  - VSCode
  - Software
---

[Vale VSCode](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode) is a Visual Studio Code extension for the [Vale](https://vale.sh) CLI, the prose linter I use for most of my technical writing and editing work. It provides customizable spelling, style, and grammar checking for Markdown, AsciiDoc, reStructuredText, HTML, and DITA, surfacing Vale's checks as inline diagnostics while you write instead of requiring a separate terminal run.

It also supports a detailed problems view for browsing alert details (file location, style, rule ID), quick fixes for word usage and capitalization issues, and spell checking via a configurable Hunspell-compatible dictionary.

As of v0.30.0 the extension runs on the [Vale Language Server](https://github.com/vale-cli/vale-ls) rather than shelling out to the CLI directly, which allows tighter integration with Vale's features at the cost of more platform-specific packaging work.

I built and maintain this extension as part of my ongoing involvement in the Vale ecosystem, alongside other Vale-related tools and styles listed here.
