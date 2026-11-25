---
player_embed: 72987ab8-b7d4-47d7-a0c7-3147a9b3618a
categories:
  - tech
title: Live from HumanX - LaunchDarkly and PRS for Music
summary: >-
  Live at HumanX Amsterdam, I speak with Edith Harbaugh of LaunchDarkly and
  Andrea Czapary Martin of PRS for Music about controlling AI-speed releases,
  and how a 110-year-old collection society adapts to AI.
publishDate: '2026-11-19T00:00:00.000Z'
tags:
  - AI
  - Music
  - Events
  - Feature Flags
youtubeId: nKwsyZRa7xE
oldVideoPath: >-
  /videos/live-from-humanx-launchdarkly-and-prs-for-music-nKwsyZRa7xE
---

For this episode of the Tech Lounge, I recorded live at HumanX in Amsterdam with two guests doing quite different things. Edith Harbaugh is CEO and co-founder of [LaunchDarkly](https://launchdarkly.com), and Andrea Czapary Martin is the outgoing CEO of [PRS for Music](https://www.prsformusic.com), the UK's collection society for musicians. I used to be a PRS member, so I'm a weird connector between the two. This episode is also available as [video](https://www.youtube.com/watch?v=nKwsyZRa7xE), and was sponsored by [NoteGPT](https://go.chrischinchilla.com/notegpt), an AI tool that summarises documents, recordings and notes. This is a condensed Q&A of our conversation.

### Who are you, and what do you do?

#### Edith, what is LaunchDarkly?
**Edith:** I'm CEO and co-founder of LaunchDarkly. We're runtime control for the AI era, and we have thousands of customers worldwide.

#### Andrea, what is PRS for Music?
**Andrea:** PRS represents 180,000 composers, writers and publishers. We're the second-biggest exporter of music in the world, and we process three times more data than Visa processes transactions. I'm leaving after seven years as CEO, and I was brought in for my background in tech and data rather than music.

### LaunchDarkly: from feature flags to agent control

#### What did people traditionally use LaunchDarkly for?
**Edith:** I co-founded the company in 2014, when teams were moving from very long releases to shorter ones. LaunchDarkly lets you roll out a feature, see how it does in the real world, roll it back if it's going badly and keep deploying if it's going well. AI has amplified all of that. You used to ship once or twice a year, and now people shipping with agentic code can release once or twice a minute.

#### Feature flagging sounds older than ten years. Why start a company around it?
**Edith:** Feature flagging had existed for a long time, but only as homebrew systems built by hand. There wasn't a productised version. I'd been at TripIt, where we had our own system that was always secondary to the core product, and I knew the big companies like Facebook and Google had sophisticated in-house versions. I thought everyone should have that power without needing thousands of engineers. When I searched for a feature flag system, nothing came up.

#### Where does the name come from?
**Edith:** From "dark launches", where you ship features switched off and gradually turn them on. We said "launch darkly" because a not-very-popular British sci-fi show was already called Dark Launch. The best part of the job is hearing customers say it gave them their nights and weekends back, because they know they can always control a bad feature.

#### How does LaunchDarkly help control rapid, AI-driven releases?
**Edith:** It's the same problem, amplified. You can iterate quickly, get feedback and switch things on or off, including per region, which matters with European compliance. What used to be a release once or twice a month can now be hundreds in a minute with an agent, and LaunchDarkly keeps them controlled.

You can also put guardrails around an agent itself. If it drifts or performs poorly, you can turn it off, and that can happen automatically. For example, if a customer service agent suddenly gets lots of bad survey responses, it can go on a timeout before anything reaches a supervisor, and a human can then work out what happened. Some of our customers are pushing agentic coding hard and working out where a human belongs in the loop.

#### Is LaunchDarkly drifting towards security?
**Edith:** You can use us to gate features, but we're not a cybersecurity company. I was talking with a chief product officer at HackerOne last night, and he made it clear that's their domain.

#### How do you stay focused on the core product when everyone is becoming an AI company?
**Edith:** I go back to our mission: we help people launch, measure and control software. None of that changes with AI. You launch more often, and there's more risk in what you control because AI may have generated it. We also use agentic coding heavily ourselves, to modernise a code base with over a decade of history and to add new functionality.

### PRS for Music: a 110-year-old company meets AI

#### How old is PRS, and why does it exist?
**Andrea:** It's over 110 years old, and it exists to protect the copyright of composers and writers and make sure the money goes back to them. People think the music industry is modern, but it's archaic. The data is a mess, with several different identifiers for labels, works and recordings, and the digital service providers like Spotify and YouTube send us huge volumes of it.

#### Does the scale of data make matching harder?
**Andrea:** Yes, and it isn't linked up. When I joined in 2019 we were processing on hardware and doing a lot of manual matching, and we served customers and members on green screens, with no CRM. On average there are six composers per song, and PRS manages songs with 50. In the days of vinyl and CDs, a release couldn't go out until all the data was in place. Now labels release tracks before they know who the composers, writers and publishers are, so we're always chasing the data.

#### You mentioned a difficult launch. What happened?
**Andrea:** PRS co-owns a company called ICE with the German society GEMA and the Swedish society STIM. It handles licensing, processing the data from digital service providers, and a shared database. We launched a new database last year, and it was a fiasco. At one point in April we didn't know how we'd get money out to composers and writers, for a society distributing £1.2 billion, so we had to do it in phases. It's a great system now, but if we'd had LaunchDarkly's feature flags we could have rolled back.

#### How is AI affecting the music industry?
**Andrea:** A lot of people are listening to AI music without knowing it, and it isn't rubbish any more. A large part of our work is lobbying, and the difficulty is that legislation differs around the world. It took a while to get a 110-year-old company to embrace AI, so I led it myself, learned it and set up a small group reporting directly to me.

#### Where is PRS using AI positively?
**Andrea:** We've run several proofs of concept. We built agents to find revenue we're owed from other societies abroad, which don't always pay us and take a long time when they do, and that has produced a double-digit gain. We also use AI for live concerts. Music recognition doesn't work well at live events yet, so set lists are collected by hand, and we don't always get them. Our agents have found millions of set lists on the web for artists who tour worldwide, so we can pay our members.

#### What about DJs and background music in public places?
**Edith:** I asked this one, because there was a DJ mixing samples in the lobby at 9am.

**Andrea:** Public performance is the hardest case. Hairdressers, pubs and venues like this are tough, and there are different recognition technologies for each. It's easier with big corporations like McDonald's or Amazon warehouses, which know their playlists. Here they should be paying, but we don't always get it.

#### What are artists telling you about AI?
**Andrea:** They want us to protect the input, but that's largely done, because the AI companies started training two or three years ago. Now the focus is licensing the output, and then the question is who you pay when a song combines several artists and composers. We work with UK Music and others around the world on regulation. We're also pushing the streaming services to label AI tracks, and I believe Apple will start soon, so listeners can choose between AI and authentic music.

#### Will AI music hurt human musicians?
**Andrea:** There will be a downturn, though I don't think it will be as bad as the 20 to 24 per cent drop people feared. With close to 100,000 AI tracks uploaded every week, scarcity moves to human creators, and I think the real human will become more important. Live music is booming, and vinyl and CDs are coming back. People listen to the same song over and over in a way they don't with books or films. I think the media writers, whose music goes into video and is well paid, will find it toughest.

### Jobs, craft and moving up the stack

#### What happens to the people who do the more routine creative or engineering work?
**Edith:** In my lifetime, very manual jobs have gone away for the better. In college I filed paper expense reports, alphabetised them and wheeled them down the hall to storage, and I'm very glad I never have to do that again. In software, people will look back and ask why you wrote test cases or made synthetic data by hand. My metaphor is that people move up the stack, so you think about what you're trying to do. Music is about delighting people, not putting notes on a composer's sheet.

**Andrea:** Björn Ulvaeus of ABBA spoke at an event in Geneva about working on a new musical. He can take his compositions and have AI play them back with different voices and instruments, so he's at the top of the stack, judging what AI has produced while keeping his human touch.

**Edith:** And you could give me the same tools and I'd come up with something terrible. The judgement is what matters.

#### Where does that judgement come from?
**Andrea:** That's the big challenge. How do younger people get enough experience to reach the Björn level, where they can tell what's good and what isn't? Our education system isn't set up for it. I was at a Deloitte event this morning, and it applies to every company and industry.

**Edith:** The same is true of Warhol, who literally called his studio a factory. In software we talk a lot about the software factory, where building software becomes a known process instead of bespoke creation every time.

### What's next?

#### What's coming up for LaunchDarkly?
**Edith:** We've made our own discoveries about moving faster with less risk while producing more, using agentic coding internally. We're going to productise that and release it to the market later this fall. There's also a permanently free tier, because we're developers.

#### And for PRS, and for you?
**Andrea:** A new CEO, who comes from Google, was due to start in October. I think that's a good choice, because he understands tech even better than I do, and he's inheriting a strong foundation. We've doubled our revenues, but there's still a lot of manual work to automate.

I want to stay in the music industry because it's messy and archaic. I want composers and writers paid more fairly, more transparently and faster. On average, they're paid nine months after a song is played. PRS is about three times faster than that, which still doesn't make sense for a paycheque. I also want to remove middlemen, especially in digital. SoundCloud has just announced that composers and writers can be paid directly, and I'll be interested to see what happens there.

**Edith:** I could see real-time payments, where a song played in the Netherlands pays someone in New York within the hour.

**Andrea:** It should happen. Most of the obstacles are human ones.

#### Should musicians register with PRS?
**Andrea:** Yes. Many people don't realise they can, and it's fun money for the year, sometimes close to minimum wage. It costs £100 for life, not £100 a year, so register your music.

### Find out more

Visit [launchdarkly.com](https://launchdarkly.com) to try LaunchDarkly. If you're a musician, composer or writer, find out about membership at [prsformusic.com](https://www.prsformusic.com).
