---
title: Is TypeBoost the AI Personal Assistant You've Been Looking For?
publishDate: 2026-03-04T00:00:00.000Z
author: Chris Ward
categories:
  - writing
tags:
  - AI
  - agentic browsers
  - Opera
  - Browsers
image: articles/opera-chinchilla.png
summary: >-
  Opera Neon is a new browser with an AI assistant that interacts with web pages on your behalf, completing tasks that typically require manual clicking, typing, and navigation. In this post, I test the browser with real tasks to see how well it performs.
heroimage: articles/opera-chinchilla.png
herotext: >-
  Opera Neon's AI assistant helps automate web tasks, making browsing more efficient.
---

[TypeBoost](https://www.typeboost.ai/) is one of a growing number of tools that use AI to boost writing productivity. Select text in any application, hit a keyboard shortcut, and apply a prompt, such as making text more formal, translating it, or shortening it, directly in place. It supports voice input as well as text, and claims to work system-wide across any text field.

In this post, I put it through its paces to see how well it performs and how much it improves my productivity.

## How Does TypeBoost Work?

TypeBoost sits in your macOS menu bar and activates via a global keyboard shortcut. Select some text, press *Control + Space*, and a small prompt picker appears. Choose a prompt, and TypeBoost sends your text to an AI model, then replaces the selected text with the result.

It ships with a range of default prompts, including options for grammar fixing, making text more formal, translating to other languages, creating LinkedIn posts, and a few developer-oriented ones like writing Git commit messages. You can also create your own custom prompts, and share these across devices via cloud sync.

Beneath the surface, TypeBoost passes your text and a system prompt to an external AI model. Older tools did similar things when they first appeared, and other applications have since absorbed most of those features. This pits TypeBoost against some stiff competition.

## Installation and Setup

On first launch, TypeBoost walks you through permissions. You need to grant microphone access, accessibility access, and automation access. These are generally standard requirements for any tool that interacts with other applications.

The default shortcut is *Control + Space*, which conflicts with some common system shortcuts. You can change it in settings.

Unfortunately, TypeBoost is an Electron app. This means it could consume more resources than a native app, and it doesn't integrate with other macOS APIs and features well.

## Testing it out

### Text manipulation in a browser

I tried selecting some text in a web browser and triggering the prompt picker. The picker appeared correctly, and I chose to polish it as a LinkedIn post. The transformed text appeared in the TypeBoost panel, but clicking to replace the text did nothing. Web browsers don't allow accessibility tools to replace text in most fields, so this is a known limitation rather than a bug.

The workaround is copying the result manually. That works, but it removes some appeal of an inline tool.

### Text manipulation in Obsidian
<!-- TODO: Check this was correct -->
The next test used [Obsidian](https://obsidian.md/), also an Electron app, which makes it an interesting case. I selected a chunk of notes and triggered TypeBoost. This time, text replacement worked. I tried the voice brain dump to structure prompt on a rambling list of ideas. The result was reasonable, though it condensed rather aggressively.

I also tried working with a file that contained images mixed in with text. TypeBoost handled the text portions correctly and ignored the images, which is sensible behaviour.

### Translating in Apple Notes

I selected a note I'd written some time ago and tried translating it to German. The translation replaced my note text successfully, and then I translated it back to check accuracy. The result was close to the original, with some minor phrasing differences. TypeBoost correctly preserved some German-language terms I had in the original text.

### Voice mode

Voice mode is the most interesting part of TypeBoost. Instead of selecting existing text, you speak directly to the app. I tried a short voice input describing what I was testing, and the app transcribed and processed it into a coherent paragraph. The result was shorter than what I'd spoken, but the meaning carried through.

Voice input switches between text manipulation and a more direct capture mode, which is useful for capturing ideas without typing.

## Limitations

The Electron foundation has a real impact on the experience. Features like macOS services and sharing, which many Mac-native apps expose for similar text manipulation tasks, can work in Electron apps, but often aren't added. The prompt picker panel also looks and behaves like a web interface rather than a native macOS popover, which is noticeable, but I acknowledge is a "me problem".

The prompt selection list is small and needs to be taller. With more prompts loaded, scrolling through them becomes fiddly.

Text replacement in web browsers doesn't work. That's a platform limitation, but worth knowing before assuming TypeBoost works "everywhere."

There's no offline mode. Every action goes out to an external AI model, which means credits and an internet connection are always required.

## Pricing

The free plan includes a one-time allocation of 50,000 credits and 10 minutes of voice mode. The Pro plan is $8 per month (or $96 billed annually). It includes 1 million credits per month, 180 minutes of voice mode, and access to many model providers including OpenAI, Anthropic, and Google. An enterprise tier with shared team prompts is available at a custom price.

The credit model maps to API usage costs. How far your credits go depends on the length of your texts and how often you use the tool.

## Other options

If you already use [Raycast](https://go.chrischinchilla.com/raycast), it has AI prompt features that integrate well with macOS. PopClip is another Mac-native and extensible option, with AI actions available. MacWhisper handles voice-to-text more directly. macOS itself exposes text services that some apps can use, though these are inconsistent across applications.

TypeBoost's advantage is its cross-platform focus. If you work across Mac and iOS and want prompts to sync, it handles that cleanly.

## Should you use TypeBoost?

TypeBoost does what it says. The core idea, applying saved AI prompts to selected text with a keyboard shortcut, works, and voice mode adds a useful capture option. The prompt customisation is straightforward, and the default prompt library covers common use cases.

The Electron foundation is a real trade-off. You get cross-platform consistency but lose Mac-native integration. If that doesn't bother you, TypeBoost is worth trying. The free plan gives you enough credits to test it without committing.

If you prefer Mac-native tools, Raycast or PopClip suit you better. If you're cross-platform or just want something simple to set up and use, TypeBoost is a solid choice.