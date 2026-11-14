---
player_embed: 39965efe-29c3-4e6d-ae30-ebfce6305472
categories:
  - tech
title: Daniel Gräfe of Timing and CoTypist
summary: >-
  I speak with Daniel Gräfe, independent developer of the Mac apps Timing and
  CoTypist, about automatic time tracking, local AI autocomplete, relying on
  undocumented Apple APIs, and the future of independent developers in the age
  of AI coding.
publishDate: '2026-11-14T00:00:00.000Z'
tags:
  - macOS
  - Indie development
  - AI
  - Productivity
youtubeId: 4J1HKrfnt1A
oldVideoPath: >-
  /videos/cotypist-developer-daniel-grafe-talks-about-his-journey-and-process-4J1HKrfnt1A
---

For this episode of the Tech Lounge, I spoke with Daniel Gräfe, an independent developer in Berlin who makes [Timing](https://timingapp.com) and [CoTypist](https://cotypist.app). Unusually, Daniel was here in person, so this episode started life as a video interview. My two microphones didn't work out well, and I'm much louder than Daniel in the audio, so the video is the better way to hear him. This is a condensed Q&A of our conversation.

### Timing: tracking time automatically

#### How did Timing start?
I released the first version in 2011. I wanted to know how much time I spent on the computer. On Windows I'd used a free, open source app called ProcrastiTracker that tracked it automatically, and none of the Mac options satisfied me, so as a developer I built my own. I had other apps at the time, but the feedback on Timing was more intense, so I focused on it.

#### Why automatic tracking, rather than picking a project and clicking start?
I knew I wouldn't be disciplined enough to track time manually, and it wasn't for billing, so there was no forcing function. If you're sitting in front of a computer anyway, it makes sense for the computer to do the tracking.

#### How hard has it been to keep it working across apps?
Tracking which app you're in is easy, and tracking the window is fairly easy, though some window titles tell you more than others. Slack was painful until the Slack team started putting the channel or direct message into the window title. I focus on the apps people use for their work, and can't invest dozens of hours in a single app unless it's very important. Visual Studio Code was a recent example: Timing stopped getting the full file path. It turned out that a Chromium update changed how accessibility properties are handled, which broke the matching Electron property, which then broke VS Code, with Cursor on top. Fixing it meant working on the Electron side and then waiting a couple of months for the update to reach the apps built on it.

#### What have you added recently, and why?
Timing is mainly for tracking your work, but it helps to get signals from as many sources as possible. It can now import your Screen Time usage from your phone, which relies on undocumented Apple behaviour, and log phone calls. For calls, if you give Timing access to your contacts, it looks up names, otherwise it stores just the number, and the data isn't used for anything else. It also syncs with ClickUp, so completed tasks show on your timeline and you can sync time entries back, and I've done something similar with Linear using its attachments.

### CoTypist: local AI autocomplete

#### What is CoTypist?
It's AI autocomplete almost anywhere on your Mac. When you type in a text field, such as email, Slack or Messages, it uses a local AI model to generate a completion and shows it inline. You can accept the whole completion, which is usually three or four words, or just the next word, which is the default. The longer the completion, the more likely it is to drift from what you were going to say, and with single-word completion you can take the useful part and carry on typing. Often I only need to type two letters of the next word and the options narrow quickly.

#### Can the shortcuts be changed?
Yes. Originally Tab accepted the full completion and backtick the next word, and I'm still stuck with that through muscle memory. The default is now Tab for the next word, and it's easy to customise. I sometimes catch myself pressing backtick in VS Code or Cursor, which have their own completions.

#### Does it conflict with other tools?
I try to be well behaved, but conflicts can happen. I haven't used Grammarly myself, so I can't say much about clashes with it.

#### It's still labelled free during the beta. Why?
To be honest, I haven't got around to charging for it. For the past year it could probably have been an official version one. For now people get it for free. I haven't decided whether to put it on Setapp. I think a small subscription is justified if it saves you a measurable amount of time every month.

#### What about wrong or rude suggestions?
I haven't seen an expletive myself, but two customers have sent me one. It's not something I programmed in. It's the nature of these models, and it's hard to filter them out perfectly. Languages work as far as the model supports them.

### Permissions and platform risk

#### Do you worry about Apple locking down the APIs you rely on?
It used to be a big worry. Between about 2011 and 2018, Apple kept locking things down with more permission dialogues, and every WWDC I wondered whether this was the year Timing would stop working, because it uses AppleScript, accessibility and many permissions. After that it slowed down, and what I need is still possible. I joke that I can't build an app that needs fewer than five permission dialogues, but on the Mac that's the norm now. I explain what I need and why, for example that CoTypist takes screenshots to improve completions but never saves or sends them. If I earn people's trust, great, and if not, that's fine too.

#### Won't Apple just build this into macOS?
Only the operating system could make it work easily everywhere, but Apple is a big company with reputational risks I don't have. It has to be careful not to seem to tell you what to think, let alone suggest something rude. CoTypist can offer more completions than Apple would be comfortable with.

### Independent development in the age of AI

#### Is AI coding changing the business for independent developers?
It has been on my mind a lot, and I oscillate between very, a little and somewhat worried. It's easier to build an app, and eventually you may not even ask for an app, but just ask a model for what you want, and it builds one to deliver it. That will make life harder for many developers, especially under-differentiated ones. I build proper productivity software, and there's value in having a human to talk to who's accountable for it working. Building has become easier, but so has abandoning an app and losing interest, and I think that's happening a lot. Trust becomes a point of differentiation as things get commoditised. I'm not even sure we'll use computers in the current sense in a couple of years, so for now I'm building the best apps I can.

#### Why are there so many well-made Mac apps from German developers?
I don't know of a historical reason. I came to the Mac via the iPhone: I had a graphing calculator app for Windows Mobile, bought a Mac mini to build an iPhone version, and that led to Timing. I think German developers put a lot of effort into engineering and how things work under the hood, maybe less into UI and UX. Even my own apps aren't super well designed, but I try to engineer them well, and they're mostly in the background anyway.

#### Does the Mac indie community feel healthy?
It's hard to say. Over the past ten years the indie community has become quite a bit smaller, because it's got harder to build and sell apps and make a living from them. There are new opportunities with AI and new players, so there may be more apps overall but fewer of the old-school Mac apps. I'm not sure that's bad, it just reflects the times.

### Wrapping up

You can find Timing at [timingapp.com](https://timingapp.com) and CoTypist at [cotypist.app](https://cotypist.app). I also reviewed CoTypist on its own in [a separate post](/blog/2025/cotypist-ai-autocomplete-macos-review).
