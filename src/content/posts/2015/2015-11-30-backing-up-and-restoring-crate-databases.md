---
title: Backing up and restoring Crate databases
publishDate: 2015-11-30T00:00:00.000Z
publication_url: 'https://crate.io/a/backing-up-and-restoring-crate/'
image: /src/assets/images/articles/opengraph.png
categories:
  - writing
  - crate
tags:
  - Databases
summary: >-
  Our databases contain valuable and business critical information and whilst
  there have always been manual ways to create restorable backups of Crate
  databases, as of version 0.53, we are pleased to announce the 'Snapshots'
  feature.
---
Our databases contain valuable and business critical information and whilst there have always been manual ways to create restorable backups of Crate databases, as of version 0.53, we are pleased to announce the 'Snapshots' feature.

Snapshots allow you to create incremental backups of entire databases, specific tables or partitions and restore them through Crate's command line interface, Crash.
