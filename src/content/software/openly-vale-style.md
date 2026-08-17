---
title: Openly
summary: A Vale linter style I created that aims to replicate Grammarly's checks in an open-source, privacy-friendly way.
project_url: https://github.com/ChrisChinchilla/Openly
tags:
  - Vale
  - Software
---

[Openly](https://github.com/ChrisChinchilla/Openly) is a [Vale](https://vale.sh) linter style that attempts to emulate features of the commercial, closed-source Grammarly, running entirely locally through Vale instead of sending your writing to a third-party service.

It's distributed as a [Vale package](https://vale.sh/docs/keys/packages) - point your `.vale.ini` at the latest release, add `Openly` to `BasedOnStyles`, and run `vale sync`. It's still a work in progress, and the project welcomes contributions.
