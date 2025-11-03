---
title: 'Bacalhau v1.7.0 - Day 5: Distributed Data Warehouse with Bacalhau and DuckDB'
publishDate: 2025-03-28T00:00:00.000Z
author: Chris Ward
publication_url: 'https://blog.bacalhau.org/p/cloud-orchestration-cost-optimization'
categories:
  - writing
tags:
  - DuckDB
  - Data
summary: >-
  With many applications that rely on data warehouses, you need to keep data sources in different locations. This could be due to privacy or regulatory reasons or because you want to keep processing close to the source. However, there are still times when you want to perform analysis on and across these data sources from one location but not move the data.

  This post uses Bacalhau to orchestrate the distributed processing and DuckDB to provide the SQL storage and querying capacity for some mock sales data based in the EU and the US.
---