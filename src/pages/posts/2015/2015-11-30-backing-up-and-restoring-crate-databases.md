---
layout: "../../../layouts/Post.astro"
title: Backing up and restoring Crate databases
date: 2015-11-30T00:00:00.000Z
publication_url: 'https://crate.io/a/backing-up-and-restoring-crate/'
image: images/opengraph.png
categories: writing crate
tags: databases
---

Our databases contain valuable and business critical information and whilst there have always been manual ways to create restorable backups of Crate databases, as of version 0.53, we are pleased to announce the 'Snapshots' feature.

Snapshots allow you to create incremental backups of entire databases, specific tables or partitions and restore them through Crate's command line interface, Crash.
