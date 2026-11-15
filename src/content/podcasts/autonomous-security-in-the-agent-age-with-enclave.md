---
player_embed: 797b0d0e-d17d-44ba-8ca6-1faa8312e99c
categories:
  - tech
title: Autonomous security in the agent age with Enclave
summary: >-
  I speak with Tal of Enclave, which builds an agentic security engineer that
  uses LLMs and deterministic scanning to find vulnerabilities, work out which
  are actually exploitable, and suggest fixes.
publishDate: '2026-11-14T00:00:00.000Z'
tags:
  - Security
  - AI
  - Agents
  - Vulnerabilities
youtubeId: OfrTw7UgAo8
oldVideoPath: /videos/autonomous-security-in-the-agent-age-with-enclave-OfrTw7UgAo8
modifiedDate: '2026-11-15'
updateNote: Added the video of this episode.
---

For this episode of the Tech Lounge, I spoke with Tal, co-founder of [Enclave](https://enclave.ai), a company building an autonomous security tool for the age of AI and agents. His co-founder Yanir also joined the call, but his recording didn't come through, so this is a conversation with Tal alone. This episode is sponsored by [Ulysses](https://go.chrischinchilla.com/ulysses), the Mac and iOS Markdown editor made in Leipzig. This is a condensed Q&A of our conversation.

### What Enclave does

#### How would you describe Enclave now that the "Cursor for security" pitch has dated?
We build an agentic security engineer. We use LLMs across code and cloud to find vulnerabilities, some with LLMs and some without. More importantly, we point you at the vulnerabilities that are actually exploitable and could put your business at risk. Yanir leads the product and is a vulnerability researcher at heart, and I'm a software developer.

#### What's behind the name?
Partly the secure enclave idea. When you use Enclave, you should feel protected.

#### How did the company start?
We started earlier this year and raised a $6 million round from Eight VC. Yanir and I served together in Unit 8200 and went through the same cybersecurity training. Our third co-founder, Dvir, and I worked together at an application security company that was later acquired by Snyk, and we all previously worked at Check Point. It felt like a pivotal moment: as LLMs got good at writing, reading and reasoning about code, the opportunity for security was obvious.

#### How does it work in practice?
We combine deterministic, rule-based scanning with LLM-based scanning. First we use LLMs to map and reason about your architecture and threat model. Then we find suspicious bugs, and at the other end of the chain we use LLMs to judge whether each one is exploitable, with evidence such as an exploit. It's less about novelty and more about whether a bug is relevant in your specific environment.

#### Do you only report issues, or fix them too?
We offer remediation, because issues without fixes just cause anxiety. We give you a prompt with an attempted fix, which you can turn into a pull request automatically or take into your editor. Some organisations trust coding agents to remediate autonomously, others want a developer to stay accountable. I think human accountability still matters for security bugs.

### Vulnerability scoring and exploitability

#### Are scoring systems like CVSS still useful?
Not very, for a long time. A score doesn't reflect the business impact a vulnerability would have in your environment. A perfect-score vulnerability might sit in code that's never reachable, while a medium-severity bug on an internet-exposed service with no authorisation matters far more. LLMs let you reassess each vulnerability in context.

#### Client-side bugs depend on users updating. How much of a problem is that?
It's worth separating server-side and client-side bugs. Server-side patching is easier, but client-side fixes need customers to update, and my dad doesn't use auto-updates. Updates can also be a risk in themselves, as recent supply chain attacks have shown.

### The AI security landscape

#### Does the attention around big labs' security models help or hurt you?
Cynically, it helps. The Mythos-level models are very impressive, though hardly anyone has been able to test them properly, and Fable recently got blocked. They create a sense of urgency in enterprises, and everyone wants access to those models. But when a Mozilla developer talked about the Firefox vulnerabilities found with Mythos, half the work was the harness, infrastructure and loop around the model. Existing models can already do a lot. The bigger enterprise question is cost: you don't want to throw your most expensive model at everything.

#### What has changed most about finding vulnerabilities?
Finding bugs has become a commodity. The novelty is exploitation: the claim that a model can autonomously build exploit chains. The question is whether a vulnerability is relevant, not just whether it exists.

#### How do teams avoid drowning in AI-generated findings?
By prioritising with context. If code is tied to a cloud service that's exposed to the internet and handles sensitive data such as PII, a bug there matters more than elsewhere. We're building that into the product, with a human in the loop. The measure now isn't how many issues you found but how many you closed. Linus recently called the situation unmanageable, and curl has stopped taking security reports. Security researchers tend to be sceptical and down to earth, and vendors should be too: don't spread fear, but don't underestimate how much has changed.

### What's next

#### How should security teams prepare?
If finding bugs is cheap for attackers, patching as fast as possible stops working in big organisations, because time to exploit drops to seconds. So first, continuously assess where you're exposed and what the business risk is. A fintech has different priorities from other companies. Second, assume you'll be exploited and minimise the impact, which means going back to fundamentals like segregating services.

#### How can people see what Enclave does?
Book a demo at [enclave.ai](https://enclave.ai). If you own an open source repository, we'll give you free access so you can protect it.
