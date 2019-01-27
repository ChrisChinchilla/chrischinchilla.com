---
title: Running and creating Crate databases with Mesos
created: 2015-05-13T00:00:00.000Z
publication_url: 'https://crate.io/blog/managing-crate-with-mesos/'
image: image-running-and-creating-crate-databases-with.mesos.jpg
categories: Chris writing crate
tags: mesos containers
---

Apache Mesos is a fantastic tool for abstracting CPU, memory, storage, and other compute resources away from machines (physical or virtual). This lets you program against your datacenter like it's a single pool of resources.

Crate's integration with Mesos enables simple management across any number of Crate instances you may require without needing explicit knowledge on the quantity and their specifications.
