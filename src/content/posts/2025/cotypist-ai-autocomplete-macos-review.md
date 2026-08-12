---
title: Cotypist AI-powered autocomplete for macOS review
publishDate: 2025-03-31T00:00:00.000Z
author: Chris Ward
categories:
  - writing
tags:
  - macOS
  - AI
  - Productivity
  - Writing Tools
image: articles/cotypist-review.png
summary: >-
  Autocomplete has existed on macOS in some form for years, and it's always been inconsistent. I tried Cotypist, an AI-powered autocomplete tool that works across almost every app on the Mac, to see if it does a better job.
---

Autocomplete has existed in one form or another on macOS for years. It's always been inconsistent. Some implementations are cleverer than others, some don't pick up the context of what you're writing, and sometimes just getting it to trigger is a small exercise in frustration. AI tools open up some new possibilities here, so I tried [Cotypist](https://cotypist.app/), an app that does exactly what it sounds like. It types alongside you.

## Setting it up

Opening Cotypist for the first time takes you through an onboarding flow which includes permissions, a short intro to how it works, recommendations for models to download and use based on your computer setup, and a few single-word and single-sentence examples of what a completion looks like.

The permissions aren't surprising. Accessibility, which is what most input-monitoring tools use, screen recording, and clipboard which enables Cotypist to get context of what you're writing. This is optional and Cotypist can work without it. At this point it's worth noting that Cotypist runs everything locally, so even if you do enable screen recording, nothing leaves your machine.

Cotypist runs its models locally rather than in the cloud, and during setup you can choose between a couple of different model sizes and it makes recommendations based on your system.

I tweaked a few personalisation settings. For example, that I often write in non-American English, my nickname, and turning off typographically correct quotes in favour of straight ones.

You can also enable and customise the prompt per application, but I haven't yet done this.

## Using it day to day

According to the developer, Cotypist works from about a page of surrounding context, wherever that context is available. In a blank document it doesn't have much to go on beyond what you type, and it's not obvious whether that context carries over between windows or applications. Testing this directly, mentioning something in one document didn't visibly change completions in another.

Testing it in Discord, where there's more to work from, made the app-awareness clearer. Cotypist picked up that I was in Discord specifically, and completions there differed from ones in Mail. Whether it was pulling from the actual conversation content was harder to tell. I mentioned a fairly obscure board game by name early in a chat and didn't get strong evidence it had picked that up later, though it's a niche enough term that it may simply not be one it knows.

I also tested UK versus US English, since my system language settings were a bit of a mess at the time (a leftover from briefly using Apple Intelligence, which only supported US English). Cotypist did eventually produce a UK-specific completion, "boot" instead of "trunk", though getting there took a few attempts and it's hard to say how much of that was context versus luck.

There's an option to disable Cotypist in the current app, globally, for a set time, or indefinitely. This is useful, since there are times you don't want it running, screen recording software being an obvious example.

## Comparing it to macOS's own autocomplete

macOS has its own built-in autocompletion, and it's genuinely unclear which apps support it and when it decides to show up, and pressing Option+Escape reveals a suggestion in some apps that otherwise wouldn't show one, an easy shortcut to miss if nobody points it out. It doesn't work at all in Mail, and even across Apple's own apps, behaviour is inconsistent. iOS has a similar version of this above the keyboard.

None of it feels as clear as Cotypist and over time it should visibly improve in terms of app updates and knowledge of you. Whereas Apple's update cycles are a mystery.

## Should you use it?

For what it's trying to do, Cotypist works better than what's already built into macOS. It's local, it's aware of which app you're in, and should get better over time. The context awareness at time of writing was a little bit of a black box. I couldn't reliably tell what it was and wasn't picking up, and getting a completion to trigger sometimes took a few attempts. If you write a lot across different apps and want something more consistent than Apple's own effort, it's worth trying.

## What's changed since I recorded this

> Update August 2026

This post is a couple of years old now, and Cotypist has moved on a lot since the version I tested. It's now on general release rather than early access, works across a much wider set of apps (including AI chat prompt boxes and IDE sidebar chats, though not the main editor in tools like VS Code, where something like Copilot is a better fit), and has more features for reviewing and resetting the knowledge it has of you. 

Pricing has also settled into three tiers: a free plan with a daily cap on accepted completions, a Plus plan at $6 a month for unlimited completions, and a Pro plan at $9 a month that adds the full model catalog and per-app instructions. It needs an Apple Silicon Mac running macOS 14 or later.