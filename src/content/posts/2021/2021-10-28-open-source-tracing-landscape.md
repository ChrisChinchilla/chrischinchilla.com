---
title: The open source tracing landscape
publishDate: 2021-10-28
author: "Chris Ward"
categories:
 - writing chronosphere
tags:
  - observability
  - open source
  - tracing
publication_url: https://chronosphere.io/learn/the-open-source-tracing-landscape/
image: "/src/assets/images/defaults/blog-chinchilla.jpg"

---

Distributed tracing tools help you track a request through an application or system that consists of multiple applications, services, and infrastructure. This gives you a deeper understanding of what is happening within the system through  graphical representations of how much time the request took on each step. A span is the building block of any distributed trace, with each component in a service contributing a span to the distributed workflow. There are a handful of well known open source tracing tools, and another handful of lesser known ones. Most work in similar ways, with one or two nuanced differences, and this post walks through most of them to help find the right tracing tool for you.