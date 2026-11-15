---
player_embed: cbb03195-b99a-4644-8468-ca6e9b6dbb61
categories:
  - tech
title: 'Fast by default: Performance engineering with Den Odell'
summary: >-
  I speak with Den Odell, author of a forthcoming Manning book on performance
  engineering, about building performance in from the start, justifying it to
  business stakeholders, and what AI coding and RAM shortages mean for it.
publishDate: '2026-11-14T00:00:00.000Z'
tags:
  - Performance
  - Books
  - AI
  - Web development
youtubeId: IQG8qLv60Cw
oldVideoPath: /videos/fast-by-default-performance-engineering-with-den-odell-IQG8qLv60Cw
modifiedDate: '2026-11-15'
updateNote: Added the video of this episode.
---

For this episode of the Tech Lounge, I spoke with Den Odell about his forthcoming Manning book, Fast by Default, on performance engineering. I reviewed some of the early chapters, and they cover justifying performance work with whatever metric your business cares about, practical ways to apply it at different levels of the stack, and then monitoring and iterating. You can find out more about the book, and many others in the Manning catalogue, through [my discount link](https://go.chrischinchilla.com/manning). This is a condensed Q&A of our conversation.

### Why Fast by Default

#### Why did you write this book?
I've been a software engineer for 25 or 26 years, mostly in the browser, and over the last ten I've done more full stack work and tech lead roles. Performance issues can creep in anywhere. At Volvo, on the checkout flow, customers complained they couldn't pay or put down deposits quickly enough and gave up. That's bad for the business, and for engineers who keep getting pulled off feature work by every sprint's "this is too slow" reports. So I wrote down everything we could do for performance and when it's best done, and structured it so it isn't all left to the end. I call it fast by default.

#### What's the problem with how teams handle performance today?
Testing has been shifted left, through test-driven development and involving QA earlier, but performance has stayed hard to measure up front. It's subjective, and it's best monitored in the field rather than on a fast development laptop. Some of our complaints came from regions with slow connections, especially on mobile. Teams end up in what I call the performance decay cycle: build a feature thinking only about whether it works on your machine, release it, get complaints, and then hold a performance sprint every few sprints. That blocks new features, so the business is disappointed twice.

#### What does the approach involve?
Profiling your code, setting performance budgets and goals that define what a good experience is, giving developers feedback during development without slowing their feature work, and adding an automated check that catches anything that slips through. It's a filter system: you'll never reach perfect performance, and what counts as good differs by application. A checkout flow needs to be as fast as possible, while a 500 MB app might lose people at the download.

### Justifying performance work

#### How do you convince people who don't care about performance?
Talk in business terms, not milliseconds. Say the gap between where we are and where we want to be is probably costing 20% in sales, or around 300 app downloads. Some of that you can get from data, such as a regression in the checkout flow that added 500 milliseconds and coincided with a drop in sales. Some you'll only find by asking customers, because you can't get analytics from people who didn't click. Stakeholders want to report improvements to their own managers, so frame it in the measures they're held to. The well-known claim that every 100 milliseconds improved Amazon's revenue by 1% was never backed by published data, and I doubt the relationship is linear. At some point further gains aren't worth the development time.

#### How do you weigh trade-offs, such as vanilla JavaScript versus a framework?
Everything is a trade-off. Frameworks add page weight, but the most important things are those that stop users doing what they want and create friction, like typing latency where the cursor lags behind what you type. That erodes trust. I read research where the same checkout flow was shown to two groups, one with added delays, and the delayed group trusted the brand less and felt less confident handing over card details. You can also cache what's loaded the first time, and browsers are getting better compression. I start the book by arguing that performance and design are the two biggest factors in user experience.

### Tools, AI and platforms

#### What should someone do if they've vibe-coded an app and it's slow?
AI is great at writing code, but it optimises for correctness: no bugs, passing unit tests. Most of its training data is tutorial material, not heavy senior work, so you get things like queries in loops, and there are plenty of stories of performance tanking in production. The same tools can fix it, though. I use the Chrome DevTools MCP server to have the agent open a browser, run flows 50 or 100 times, and report memory usage, lingering DOM nodes and input latency. Then it can refactor and re-run the measurements to prove the improvement.

#### Are there tools beyond the web?
Yes. Android Studio and Xcode have good built-in performance tools for memory, interaction speed and more, and there are many for back ends, such as response times and databases. I didn't want to limit the book to the web, even though that's what I know best. The same issues come up on every platform, and so does the solution: bring performance earlier in the workflow. There are probably more web tools because the web has historically had the bigger performance problem.

#### What about the back end?
There's a whole architecture chapter. I try not to say you should use microservices or NoSQL, because it depends on your application. Some teams thought they'd made the right choices and improved performance by refactoring their data layer. For load events like Black Friday, scaling up takes time, so you lose traffic in the meantime. Sometimes the best approach is to deny some traffic and let others through, with queues that hold some customers back while others complete their work. The worst case is the whole system going down. Your front end needs to handle and explain that too, and be hard to bypass, since some people got through such systems by changing a cookie.

#### Does the book cover AI features and their performance?
I cover AI coding and AI code review, but I didn't give AI its own chapter, because it's a tool that fits into the individual sections. AI interfaces are also a performance problem: you wait for the first tokens to stream in. Local models help with that initial latency, but there's still a gap, so perceived performance matters again. Later chapters cover making customers feel they aren't waiting, and giving them something productive to do in the meantime.

### The wider picture

#### How is this different from other performance books?
Other books tend to focus on one platform. I cover the full stack, the common pattern of a shared back end with front-end applications on top, and unify profiling, performance-focused code review and the other stages into one concept running from start to finish. It means you don't need performance sprints or a year of catching up. Companies, Apple included, tend to let things slowly get slower, then spend a year on performance. iOS 27 is reportedly mostly that.

#### Will RAM shortages make people care more about performance?
I think so. We're entering a period where RAM is constrained, and it's probably part of why Apple is focusing on performance now, since big RAM upgrades and higher-tier devices are unlikely. I wrote an essay on my blog about how the original Mac OS fit its windowing system and QuickDraw into 64K of ROM, when nobody now blinks at a 64K image on a site. If RAM stays tight in the short to medium term, we need to waste fewer resources.

### Where to find the book

#### When is it out, and where can people find you?
It should be completed before the end of the year, aiming for around October or November, with all 20 chapters, and more chapters will appear in Manning's early access programme before then. My personal site is [denodell.com](https://denodell.com), where I write essays on performance, accessibility and user experience. I'm building [fastbydefault.com](https://fastbydefault.com) to go with the book, which will gather links to the tools I suggest.
