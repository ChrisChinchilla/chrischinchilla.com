---
player_embed: 0b8a0cc3-b520-487a-9591-7ab4d9c37670
categories:
  - tech
title: AI powered protection from digital fraud with Guardian
summary: >-
  I speak with Rita Barbosa of Guardian Labs, who is building a Europe-based app
  that uses an on-device AI model to block scam calls and messages before they
  reach vulnerable phone users, plus an intelligence platform for banks and
  telecoms.
publishDate: '2026-11-15T00:00:00.000Z'
tags:
  - AI
  - Security
  - Mobile
  - Scams
youtubeId: k9inOINfKOo
oldVideoPath: /videos/ai-powered-protection-from-digital-fraud-with-guardian-k9inOINfKOo
modifiedDate: '2026-11-15'
updateNote: Added the video of this episode.
---

For this episode of the Tech Lounge, I spoke with Rita Barbosa of [Guardian Labs](https://guardianlabs.eu) at the Open Source Summit in Prague. Guardian is working on an app and a platform to reduce phone scams, mainly aimed at older people who get pulled into banking scams, and on extending that across the languages of Europe. This episode was sponsored by [Tiiny Host](https://go.chrischinchilla.com/tiinyhost), which lets you upload files and share your work online. This is a condensed Q&A of our conversation.

### What Guardian does

#### What is Guardian, and how is it different from tools that waste scammers' time or flag suspicious numbers?
Guardian blocks scams proactively and invisibly, so the calls and messages never get through. You install an app with a localised AI model running directly on the device, and it screens incoming calls and messages against our parameters and blocks them before they reach you. If a scammer gets your number, they have no way to contact you.

#### Why did you build it?
My grandma was scammed by a phone call. Besides the money, she lost her autonomy: she stopped trusting herself with the phone, stopped picking up and stopped making calls. She lived alone, and we visited many times a week, but it was still hard to reach her. It only became possible recently because very quantised models can now run on a device. I built a prototype at the biggest AI hackathon in Germany and won first prize, out of about 400 people and 100 projects.

#### Don't iOS and Android already have call and message filtering?
Some, but scams are national, so the ones in Portugal differ from those in Germany or Australia. We started in February and have a signed protocol with the police in Portugal, and we use their data to train our models, so we can stop scams in a focused way. In Portugal many scams arrive by message, which phones don't block because they don't know what a scam looks like. And the people who most need protection are less tech-savvy and won't use a set of built-in settings. One app that filters everything and just works is easier for them.

#### Will it cover WhatsApp, Telegram and other platforms?
We're launching with calls and messages. Scams usually jump across platforms, from WhatsApp to Telegram, for example. Since the AI runs on the device, it can see the full context, which is where we want to go.

### Trust and false positives

#### How do people see what was blocked, in case it was legitimate?
The home screen lists every blocked call and message with the reason it was flagged as a possible scam, which also builds trust, because you can see what's happening on your own phone. You can allow specific numbers, and we're talking to institutions, such as hospitals, to collect lists of legitimate numbers. We deliberately lean conservative. For my grandmother, it's better to miss a call and call back than to take a call that turns out to be a scam.

#### Why should people trust a scam prevention app?
For us it started personally, and everything we do is about protecting people. We also work with institutions, such as the police, that share our goal.

### Technical questions

#### Do you need a recent phone for the local model?
The model adapts to the capacity of the phone. It's very small and quantised, so a ten-year-old phone still works well. The problem is phones 20 years old. A smaller model may be slightly less accurate, but most scams use social engineering and look alike, so accuracy doesn't change much.

#### What about devices where people don't update apps?
We can push new scam information, though weekly app updates are best for protection. We don't offload to a cloud model, because we don't want to leak any data, especially in Europe. Instead we anonymise information and provide it to banks as a live feed of scams, at national level.

### Business model and scaling

#### How do you fund it?
We have private backing, including one of the biggest accelerators. For revenue, the customers are not the people being protected. Banks, insurers and telecom operators pay, since in places like the UK banks now have to refund scam victims. The intelligence platform gives banks, telecoms and law enforcement information on active international scam campaigns. For example, mule accounts used by scammers can be frozen, so money sent to them bounces back.

#### Do you need a new model for every country?
We fine-tune it. Once we collaborate with the institutions in a region, it's easy to protect people there. We tell countries we can have it running in two weeks, and they're surprised, but it's very scalable.

#### How do you handle cross-border scams and spoofing?
We work with the police to trace where calls come from, and the intelligence platform gives an international view of where scams originate and where they're going. A lot of scams into Portugal come from Romania, for example. Spoofing is a problem, where scammers use other people's numbers, and that's something we can work on with telecom operators. Scam numbers and messages often have identifiable patterns.

#### What's the hardest part of expanding?
Legislation, not technology. Australia already makes telecom operators responsible, and the UK is similar, but only now are laws in Europe starting to require banks to refund victims. The challenge is getting banks and governments to see the need for prevention. We're talking to governments, banks, insurers and telecom operators. In Portugal there's an SMS pretending to be the health service saying you owe a small fee, and last year it made around 2 million. Scammers also catch people when they're distracted. I heard of a cybersecurity professional who paid one while about to board a flight with a new baby.

### Wrapping up

#### Where can people find Guardian?
At [guardianlabs.eu](https://guardianlabs.eu). We're launching the app first in Portugal and building the intelligence platform with several countries, and we're already talking to countries outside Europe.
