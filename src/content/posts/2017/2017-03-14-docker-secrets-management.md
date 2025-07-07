---
title: "Docker Secrets Management"
publishDate: 2017-03-14 15:15:03 UTC
author: "Chris Ward"
categories:
 - writing
 - codeship
tags:
  - Development
publication_url: "https://blog.codeship.com/docker-secrets-management/"
image: "/src/assets/images/articles/964db6a6-69da-4366-afea-b129019aff07.png"

---
I’m sure we’ve all been there. That moment when you realize that important and sensitive access details have leaked online into a public space and potentially rendered your services to unrequited access. With the ever-growing amount of services we depend on for our development stack, the number of sensitive details to remember and track has also increased. To cope with this problem, tools have emerged in the field of “secrets management.” In this post, I am going to look at Docker Secrets, the new secrets management feature available in Docker 1.13 and higher.

