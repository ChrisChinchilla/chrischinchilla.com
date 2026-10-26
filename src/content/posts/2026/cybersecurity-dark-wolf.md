---
title: Punk rock cybersecurity with Brian Panarello of Dark Wolf
description: I speak with Brian "BP" Panarello, technical director at Dark Wolf, about securing defence software and drones, SBOMs, AI models as black boxes, and why compliance paperwork doesn't defend a system.
tags: [Security, AI]
section: tech
publishDate: 2026-10-26T00:00:00.000Z
---

For this episode of the Tech Lounge, I spoke with Brian "BP" Panarello, technical director for cybersecurity engineering and risk management at [Dark Wolf](https://darkwolf.io). He styles himself the punk rock cyber engineer, and we talked about what that means, how he secures software for the US military, and how AI is changing the picture. This post is a condensed Q&A of our conversation.

## What does "punk rock cybersecurity" mean?

**Where does the name come from, and what does it have to do with security?**

It started on LinkedIn. Brian has the tattoos, long hair and piercings, but the name is really about the ethos of punk: go against the grain, do it yourself, do it your own way. He sees a lot of entrenchment, bureaucracy and dogmatic thinking in cybersecurity, and likes to ask what happens if you do it a different way.

His favourite example is Fugazi and the DIY hardcore scene around Washington, DC. Those bands refused to play the record label game and charged five dollars a ticket so people could actually come. Brian's version in security is to strip away the box-ticking and focus on actually securing the system.

**Isn't compliance important, though?**

It has its place, but Brian is blunt about it. In the US Department of Defense, work revolves around the Risk Management Framework, STIGs (Security Technical Implementation Guides) and POA&Ms (Plans of Action and Milestones), which list the vulnerabilities you know about and what you're doing about them. His boss likes to say that a system security plan has never once stopped China from hacking a system. As Brian puts it, the framework documents the risks you're aware of. The protections against the risks you don't know about are what actually defend the system.

## What does Dark Wolf do?

**Is Dark Wolf a product or a services company?**

Mostly services. Dark Wolf Solutions has existed in some form for about a decade, and Brian has been there just under five years. Its work is split across four practice areas: cybersecurity, software delivery, cloud mission enablement, and data and AI. It also has a product arm, RackTop, which makes cyber-secure storage. More than 80% of the business comes from the Department of Defense, with the rest mostly from the intelligence community and a few commercial contracts.

## How has cybersecurity changed?

**You've been in the field for about 15 years. What's different?**

When Brian started, he could walk into a data centre and put his hand on the server he was securing. Supply chain risk management meant asking where the hard drives and chips came from, and servers changed rarely. You patched them once a quarter, if that.

Kubernetes abstracted those servers away, and cloud computing sped everything up again. Companies like Netflix push to production hundreds of times a day. Defence doesn't move at that velocity, but it does need to get capabilities to people at the edge quickly, and it can't "put a Band-Aid on it and ship it", because lives are at stake. Brian calls cybersecurity a full-contact, active sport.

His advice to his engineers is to focus on the process, not the product. If the process is right, security becomes a by-product built into what you ship.

## Securing software for people with poor connectivity

**Soldiers can be in places with degraded or no connectivity. How do you patch software there?**

Brian comes from infrastructure architecture rather than software delivery, and he describes his approach as toddler-proofing a house: pad the sharp corners and cover the electrical outlets. You assume some devices can't be patched often, so you build the infrastructure around that, with encrypted comms, encrypted storage and strong access controls. It's the usual cybersecurity basics, applied to edge devices.

**Does that make the process slow and risk-averse?**

Somewhat. Brian would like to see faster patching, but he accepts that the operational mission takes precedence. Risk has two sides: being as secure as possible, and getting the mission done. The question becomes what is a reasonable amount of security for this device.

## Drones and hardware supply chains

**You do penetration testing on drones. What does that involve?**

With the war in Ukraine as a case study in modern warfare, uncrewed aerial systems have become a big part of the business. A vendor hands over a drone and asks Dark Wolf to do its worst. The first step is a teardown that catalogues every component. Dark Wolf's lab in Colorado Springs goes down to the chip level, checking for compliance with the National Defense Authorization Act (for example, no components from prohibited countries) and for data being sent where it shouldn't be. They've found extra chips hidden underneath other chips.

The goal is also that if a drone is lost behind enemy lines, nobody can scrape data off it, and that developers haven't left backdoors or secrets in the software.

**Once the drone ships, can you still vouch for it?**

Not entirely. Dark Wolf assesses the vendor's process and states the risk posture as observed. If anything changes upstream of what they saw, that's a risk someone needs to acknowledge and accept.

## SBOMs and the software supply chain

**Is a software bill of materials (SBOM) enough?**

Brian likes a comparison from Dark Wolf's head of engineering, Will Pine: an SBOM is like the ingredients list on a Twinkie. Knowing the ingredients is one thing; knowing what happens when you eat it is another. When Dark Wolf assesses a team's DevSecOps maturity, the first question is whether they generate an SBOM, and the second is what they do with it. Is something in the pipeline, such as the OWASP dependency checker or Grype and Syft, comparing it against the vulnerabilities published this week?

He also contrasts the SolarWinds attack, a closed-source supply chain compromise that took over a year to find, with the more recent Trivy compromise, which was caught within hours because the code was open source and people were watching. He calls the open source community the first line of defence.

**But finding a problem isn't the same as fixing it.**

I raised the classic open source problem: someone detects an issue, but one maintainer has to fix it. Brian has sympathy for the whole open source community, especially now that everyone has access to AI tools and a developer in Sweden with a nights-and-weekends project is being flooded with reports.

## AI, agents and black boxes

**How should developers audit what coding agents are doing?**

Brian's answer is that cybersecurity is still cybersecurity. The fundamentals haven't changed: good hygiene, good access controls, and knowing what should and shouldn't be on your system. Vibe coding a year ago has become agentic development, and "a hope is not a good design pattern". He prefers building harnesses and agents for specific tasks and treating them like employees you hand tickets to. If you give an agent a key with more access than it needs, it will use that key. It isn't malicious, it just doesn't know any better.

**What about models you can't inspect, such as ones from outside the US?**

We agreed they're black boxes, and Brian admits the industry is still working this out. You can audit what you bring in (is the model what you expect?), but what happens inside is unknowable. So treat it as a black box: don't give it information you wouldn't want anyone else to see. He loves AI and uses it himself, but says to use it responsibly.

**What do you make of the new wave of vulnerability-hunting models?**

Brian is a little sceptical of the hype, partly because IPOs are on the horizon and companies want engagement. But he accepts the capabilities are real. These models aren't doing anything a human penetration tester can't, they're doing it at a scale humans can't: flood a dam with a garden hose and you find a couple of leaks, use a fire hose and you find many more.

**So what do you do with 1,000 vulnerabilities?**

First, build infrastructure so that a compromise has the smallest possible blast zone, with no lateral movement or privilege escalation out of it. Zero trust helps, even if you can't turn a corner without someone selling you a product with the name. Second, contextualise. A CVSS score of 10 is a raw score, and what matters is what it means in your environment. If compensating controls reduce the risk, acknowledge that. If an attacker has got far enough into your network to exploit cURL, you have bigger problems than patching cURL. He recommends *Effective Vulnerability Management* by Chris Hughes.

And eventually, he says, you have to fight fire with fire. The scarier question is who is using these models maliciously.

## Guitars

**We ended on guitars. What are you playing?**

Brian lives in northern Virginia and had a pile of them behind him: a Squier Paranormal Troublemaker he's very fond of, a PRS he'd just bought, and a guitar he's owned for 26 years, since his freshman year of college, that he'll never get rid of.

## Find out more

Dark Wolf isn't a company a casual customer wanders into, but if you need help with cybersecurity at scale, take a look at [darkwolf.io](https://darkwolf.io). If you want to talk security or punk rock with Brian, find him on LinkedIn as Brian "BP" Panarello. The name comes from his workplace having five or six Brians and BP being the easiest label.