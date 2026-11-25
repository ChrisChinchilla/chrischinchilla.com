---
player_embed: 62f5f3d0-8c97-49b8-a328-3b6cd3661096
categories:
  - tech
title: The hidden influences behind the algorithms that run our lives with Luca Belli
summary: >-
  I speak with Luca Belli about his forthcoming Manning book, "Hidden
  Influences", which explains how recommendation systems work from a
  socio-technical and ethical perspective, and why engagement is a poor proxy
  for value.
publishDate: '2026-11-14T00:00:00.000Z'
tags:
  - AI
  - Ethics
  - Algorithms
  - Recommender Systems
  - Books
youtubeId: 2w9EzGI9OZY
oldVideoPath: >-
  /videos/the-hidden-influences-behind-the-algorithms-that-run-our-lives-with-luca-belli-2w9EzGI9OZY
modifiedDate: '2026-11-15'
updateNote: Added the video of this episode.
---

For this episode of the Tech Lounge, I spoke with Luca Belli, author of [Hidden Influences](https://www.manning.com/), a book on how algorithmic recommendation systems work. It's not a technical manual, and it's as much about ethics as engineering. The book is in Manning's early access programme, and you can get it, or any other Manning book, with [my discount link](https://go.chrischinchilla.com/manning). This is a condensed Q&A of our conversation.

## What the book is about

### This doesn't look like a typical Manning book. What is it?

It isn't a technical manual, and you won't learn how to build a recommender system from it. Plenty of books already cover that. I'm more interested in a socio-technical view: technology shouldn't be studied in the abstract, because it interacts with the people who use it. Recommender systems are a good example. We interact with the items they show us, that feeds back into the system, and the recommendations in turn change us, perhaps by showing us something we didn't know we were interested in. It's a two-way relationship.

### What do you want readers to take away?

A better understanding of these systems. Discussions about their societal impact, including how misinformation spreads, often lack nuance, and generative AI makes that more pressing because anyone can now produce their own misinformation. The central question of the book is what it means for a recommender system to work properly. There's no single answer. Unlike a system with a clear accuracy metric, recommenders have to account for personal preferences, so you have to ask who the system is working for. I want to bring that nuance to a non-technical audience.

### Why did you write it?

I studied pure maths, then worked as a data scientist and machine learning engineer. In 2017 I joined Twitter, where I co-founded the machine learning ethics, transparency and accountability team, which looked at exactly these questions. My time there ended with the acquisition in November 2022, but I felt there was still a lot to say. The book isn't about a single technology or algorithm, but the whole ecosystem, from the user onwards.

## Recommenders, generative AI and engagement

### Why does this matter now, when attention is on generative AI?

We tend to forget how much we still rely on recommender systems. Most young people get their information from social media, which is still a stream of content in an order an algorithm picks. I'd argue this is infrastructure, but nobody talks about it that way because it's in private hands and isn't regulated like a utility. How we form opinions on important topics is shaped by it, and much of the training data for generative AI comes from social media, so more popular content may carry more weight there too. I'm not sure how chatbots handle recommendations internally. Recommender systems reshuffle a fixed set of items, whereas generative AI creates new output, perhaps with retrieval-augmented generation behind it.

### Are there any positives to recommender systems?

I've asked myself that for months, as the book spends a lot of time on problems. Community is the big one. They help people connect in ways that are impossible physically, from social movements like Black Lives Matter and Me Too to a queer kid in the middle of nowhere who can't find acceptance at home. But the technology is content-agnostic, so communities can form around love or around hatred.

### Are recommender systems and engagement algorithms the same thing?

Some argue that engagement-optimised recommenders are the problem, not recommenders themselves. When you train a model, you have to choose what to optimise. We'd like to rank content that's most valuable to the reader, but value can't be measured. It differs between people, and even for one person between morning and evening. So we pick a proxy, and engagement looked reasonable. To a point it is, but clickbait exploits it without delivering value. Engineers and companies also like a single number to push up, and societal effects don't fit into one number, so they get postponed, and "later" never comes. In that sense, my book is about measurement.

### Couldn't companies just consider the consequences earlier?

Some unintended consequences could have been predicted if companies had listened to researchers who'd studied them for decades. But these are venture-funded, for-profit companies, and the top-level metric is ultimately valuation. That makes the work hard to do from the inside. You can't just say "let's get rid of engagement-based recommendation" and expect it to fly.

## Structure and advice

### What does the book cover?

I wanted it to be timeless, so it covers frameworks rather than specific algorithms, which would be outdated as soon as I wrote them down. The first part is a broad look under the hood of what happens when you refresh a feed, which I hope helps policymakers who write rules for systems they've never worked on. It also explores why content moderation is more complicated than it looks. The second part is about measurement: defining algorithmic amplification and what "working properly" means. The third covers societal impact, mixing psychology and technology. The last asks what we should do about it, as a society and as individuals.

### Why should busy engineers care?

For meta-awareness of the system and the incentives it was built under, including the incentives of the company behind it. One chapter looks at Silicon Valley companies and demystifies the "changing the world" narrative. We start scrolling and two hours disappear, which is by design. Understanding why the system works that way helps you decide how to protect yourself. Regulation of recommender systems is increasing, mostly in Europe and elsewhere rather than the United States, and awareness helps keep those efforts alive and enforced.

### Is there a best practice for people building these systems?

Don't look only at aggregates. At the scale of hundreds of millions of users you can't look at people one by one, but you should ask whether a subpopulation is poorly served and hidden by the overall number. Take a medical test for a condition 1% of people have. A test that always says "you don't have it" is 99% accurate on paper and useless. It's difficult for a global platform that wants to be culturally mindful, but check subpopulations.

## Writing and where to find Luca

### How is the book going?

It's close. Two chapters are left to write, and the first six are available through Manning's early access programme, with two more coming soon. Writing it has been like running a marathon: I'm grateful to have had the time to think deeply about these topics, and very happy to be near the end.

### What are you working on now?

Something quite different, though still about the impact of technology: the safety of chatbots in a mental health context. You can find everything at [lucabe.phd](https://lucabe.phd).
