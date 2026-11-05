---
title: 'Videos and podcast episodes now live with their articles'
publishDate: 2026-11-06T00:00:00.000Z
author: Chris Ward
categories:
  - tech
tags:
  - Site updates
  - Podcast
  - Video
  - Astro
  - YouTube
summary: >-
  When I publish the same idea as an article, a video, and sometimes a podcast episode, I used to end up with several near-duplicate pages. Now each content has one home, with the video or Q&A on the same page. Here's what changed, the best examples, and what's next.
heroimage: /src/assets/images/defaults/blog-chinchilla.jpg
herotext: >-
  Each video, podcast episode and article now has one home, with the video or Q&A on the same page.
---

I often cover the same topic in more than one format. A review might be an article and a YouTube video, and an interview might be a Tech Lounge podcast episode, a video, and a written Q&A. Until now each of those had its own page on this site, saying nearly the same thing. That's confusing for readers, and search engines and AI tools have to guess which page is the best option.

So I've spent the last couple of weeks making one page the home for each piece of content.

## Videos with their articles

If an article is the written version of a video, the video now sits on the article page, in place of the hero image. Under the article there's an "About the video" section with the chapters (when the YouTube description has timestamps) and a transcript you can expand. Timestamps link to that point in the video.

Nothing loads from YouTube until you press play, so the page stays fast and nothing is sent to YouTube on arrival.

The video's old `/videos/...` page now redirects to the article, and the `/videos` list links straight there. The article's structured data describes the video too, so search engines and AI tools see one piece of content in two formats rather than two pages.

### How matching works

An article opts in with a `youtubeId` in its frontmatter. For videos published since March 2025, a script also compares video and article titles and dates, and suggests pairs when the match is clear. A weekly GitHub Action reports new candidates, so I don't have to remember to check.

I kept automatic matching away from older videos on purpose. A wrong pair means redirecting a live page to the wrong place, so for anything older I am pairing by hand and the pages with slowly merge.

### Best examples

Eleven videos are paired so far. These show the new work best:

- [Is TypeBoost the AI personal assistant you've been looking for?](/blog/2026/typeboost) is the only one with a stored transcript so far. The transcript is auto-generated, and the page says so.
- [Controlling Ableton Live with AI using Feater and Producer Pal](/blog/2026/ableton-live-ai) is a good example of a video that's better as a walkthrough than as text alone.
- [Testing Neon - Opera's agentic browser](/blog/2026/opera-neon) shows the embed replacing the hero image.
- [I Replaced My Custom Mac App Audio Routing Solution with Elgato Wave Link 3](/blog/2026/app-audio-routing) is a hands-on piece where the video and the written steps complement each other.

## Podcast episodes with their Q&As

For some Tech Lounge episodes I have started producing a condensed Q&A of the conversation. Those used to be separate blog posts, competing with the episode page. Now the Q&A lives on the episode page, below the player, with a skip link and a table of contents of the topics covered. The old post URLs redirect to the episode.

I have migrated two so far:

- [Punk rock cybersecurity with Brian Panarello of Dark Wolf](/podcast/punk-rock-cybersecurity-with-brian-panarello-of-dark-wolf)
- [Running the world's largest mobile developer conference with Greg Fawson of next.app devCon](/podcast/the-worlds-largest-conference-for-mobile-developers-with-greg-fawson)

Episodes are never paired with an article or video through the automatic matcher. If a video is an episode, the podcast page is its home, and the matcher checks video and article titles against the episode list to avoid pairing them.

## Reasons beyond tidiness

- **Search and AI tools:** one canonical URL per piece of content, with video, chapters, and transcript as part of it.
- **Accessibility:** the transcript is page text, the embed is keyboard operable, and headings follow a consistent order.

## What's next

- **Migrate the remaining Q&As.** There are more episode write-ups still living as blog posts and many episodes with no article at all yet.
- **Transcripts for the other paired videos.** Generating transcripts from YouTube is not as easy as it could be. As I produce new content I use Descript to generate a transcript, but I haven't gone back to the older videos yet.
- **Multiple videos per article.** I have several videos for one article. The schema supports an article with one main video and related ones, but I haven't decided how to show them.
- **Go through the older videos.** About 490 predate automatic matching. I'll review them in batches.
- **Decide what `/videos` is for.** Once most videos have a home, the list may only need the leftovers, or may fold into the article and episode pages entirely. I'll avoid changing public URLs until I've decided.
