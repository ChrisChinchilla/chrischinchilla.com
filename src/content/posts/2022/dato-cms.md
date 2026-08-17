---
title: Testing DatoCMS, another headless CMS that promises an easier life
categories:
  - tech
publishDate: 2022-02-23
summary: I put DatoCMS through its paces to see if it finally solves the gap between a great editing experience and simple content delivery that every other headless CMS has left me with.
tags:
  - CMS
  - Headless CMS
  - DatoCMS
  - Jamstack
---

I'm on an endless mission to find a headless CMS that works as easily as the marketing copy claims. I love the concept. I spent a long time building content management systems, and I got tired of the weight they add. Static site generators and markdown files solved that for a while, but they hit their own limits.

So headless CMS appeal to me. I've tested a few already, including [Contentful](https://contentful.com)] and [Strapi](https://strapi.io/)]. Every time, I get let down at the same point. The editing experience is great. Then I try to render that content, and it turns out to be far more complex than I expect. This time I tried [DatoCMS](https://www.datocms.com/)] to see if it breaks the pattern.

## Getting started

DatoCMS lists Vercel as a client, which surprised me since I assumed Vercel ran their own equivalent. The pitch is familiar: a central hub for content, distributed via API to more than 25,000 businesses. It isn't open source. Beyond that, the getting started docs use language I recognise from my time at Contentful. Content delivery API, content management API, models, records, fields. If you've used any other headless CMS, none of this will surprise you.

The concepts click quickly. A model defines the shape of your content, like a blog post having a date, tags, and an author. A record is an actual piece of content based on that model. Roles, permissions, and environments all work the way you'd expect, with staging and production separated and controlled per project. Content-level permissions, workflow permissions, and asset permissions round it out. It's one of the more clearly explained onboarding flows I've seen from a headless CMS.

## Building the model

I decided to recreate part of my own website to test it properly. I created a project, started from blank, and built a blog model. DatoCMS asks whether you need a collection of records or a single one, which took me a second to parse but made sense once I saw the distinction.

Adding fields felt familiar: a title field, a body field using DatoCMS's structured text type (I skipped their Notion-style rich editor and asked for plain markdown instead), a field set for an external link, and a media field for an image. Creating a record and publishing it was straightforward, once I set the alt text DatoCMS requires before it lets you save.

The editing experience here is genuinely good. A few rough edges, like the block editor being slightly fiddly with images, but nothing that got in my way.

## Where it gets harder

This is where I always hit the same wall, and DatoCMS is no exception.

I started with their Jekyll gem, since I find Jekyll easier to reason about even though it's fallen out of fashion. Adding the gem and running bundle install worked fine. Running the actual dump command didn't. I got an uninitialized constant error pointing at ActiveSupport, and since DatoCMS isn't open source, there was no way for me to dig into why. I tried a few things to work around it and gave up.

I switched to Hugo instead. Same story, different error: a missing config file, with no clear documentation on what that file needed to contain. Third time, I gave up on a dedicated integration and went down the path DatoCMS clearly wants you to take: query the GraphQL API directly and render the result into a template yourself.

This works, but it's exactly the kind of manual wiring I was hoping to avoid. DatoCMS already knows my content model. It knows every field I created. I don't understand why it can't generate the boilerplate to consume that content, at least as a starting point. Instead, every time someone adds a field, you go back and update your rendering code by hand.

## Pricing

The free developer plan is generous: three projects, one editor per project, GraphQL, a CDN, and most of the core features. Video streaming and translations sit on higher tiers, and image transformations look useful if DatoCMS gets them right, though I didn't get far enough to test them properly.

## My take

DatoCMS has a genuinely nice content modelling and editing experience. The delivery side is the same story I've had with every headless CMS I've tried: a promise of simplicity that doesn't hold up once you actually need to render the content somewhere. I hit real problems with both Ruby-based integrations, and the GraphQL path, while it works, still means writing your own rendering layer from scratch.

DatoCMS is a small team, just six people as far as I could tell, and they're clearly still building. I'd like to see the delivery experience get as much attention as the editing side has. Until then, I'm still more inclined to reach for a static site generator with plain YAML or JSON files than commit to a headless CMS.