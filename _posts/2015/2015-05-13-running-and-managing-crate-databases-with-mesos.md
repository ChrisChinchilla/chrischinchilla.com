---
title: 'Running and Managing Crate Databases with Mesos'
created: 2015-05-13
publication_url: 'https://crate.io/a/managing-crate-with-mesos/'
image: Apache-Mesos1.png
categories: Chris writing crate
---

Apache Mesos is a fantastic tool for abstracting CPU, memory, storage, and other compute resources away from machines (physical or virtual). This lets you program against your datacenter like it's a single pool of resources.

Crate's integration with Mesos enables simple management across any number of Crate instances you may require without needing explicit knowledge on the quantity and their specifications.