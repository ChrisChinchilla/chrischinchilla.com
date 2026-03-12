---
title: Testing Neon - Opera's agentic browser
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

Opera released [Neon](https://www.operaneon.com), a new browser that includes an AI assistant. This assistant interacts with web pages on your behalf, completing tasks that typically need manual clicking, typing, and navigation. I, like many, am sceptical about agentic browsers, so wanted to test the browser with real tasks to see how it performs.

## What's Opera Neon?

Opera Neon uses Opera's latest browser release, built on the Chromium engine and uses forms of computer vision to understand page layouts, identify interactive elements, and click buttons or fill forms.

The browser maintains Opera's existing features, including a VPN, ad blocker, and integrated messaging.

The interface offers different modes: chat for conversations, do for task execution, research for gathering information, and make for content creation. You need an Opera account to access these AI features, which Opera currently offers as a paid service with trial periods available.

## Installation and Setup

I downloaded and installed Opera Neon on macOS. The installation process matches Opera's standard browser setup once you have enrolled for an Opera account and subscription. After launching, a side panel displays options for different modes, though switching between them often caused the chat context to vanish, which I guess makes sense, but there was no hint that this would happen. As you might expect, the assistant shows its progress through visual overlays on pages and status updates in the sidebar.

## Testing with Real Tasks

I ran several real-world tests to understand the assistant's capabilities and limitations.

### Flight Search: Berlin to Malaysia

The first test involved booking a flight. I asked the "do" assistant to find flights from Berlin to Malaysia. The assistant started working through various travel comparison sites.

The process revealed immediate challenges. The assistant filled in the departure city correctly but struggled with the date picker. Skyscanner's date picker shows prices across a calendar, which makes sense to humans but confused the assistant. It initially set both departure and return dates to the same day.

The assistant recognised its error, displaying a message about "human in the loop" and requesting my help. I corrected the dates manually. The assistant then continued, but progress was slow. What I might have completed in 30 seconds took several minutes.

The assistant then switched to Google Flights for comparison, which presented a different date picker interface. Again, date selection proved problematic. The assistant repeatedly got stuck on the dates, requiring multiple interventions.

The experience showed that whilst the assistant can navigate travel sites, date pickers remain a significant obstacle. The "human in the loop" approach means you're more of a supervisor than someone who can leave the task entirely to automation.

One interesting caveat is that Berlin is a poorly served airport, which highlights that no tool, no matter how smart, can solve real world limitations. After considerable time, the assistant did find flight options, though they were essentially the same flights available through normal search. The prices looked reasonable (though some seemed suspiciously cheap), but I had to verify everything myself anyway.

### Guitar Shopping on Reverb

I tested e-commerce functionality by asking the "do" assistant to find and buy a [Yamaha Pacifica electric guitar](https://usa.yamaha.com/products/musical_instruments/guitars_basses/el_guitars/pacifica/index.html). The assistant navigated to Reverb and other music retailers, searching for options.

The assistant found several guitars and even added one to the cart on Reverb. However, it stopped at checkout, which I assume aligns with Opera's safety features. The assistant won't complete purchases without explicit confirmation, which makes sense for financial transactions.

The interesting aspect here was watching it compare prices across different sites, though the results were mostly what I'd find through normal price comparison tools. The assistant opened multiple tabs and navigated between them, but the time saved was questionable compared to doing this manually. Also what it considered "cheapest" was interesting, it picked a guitar based in the USA, which was cheaper than the same model available in Germany, but the shipping costs and import taxes would likely make it more expensive overall. As everything with AI, you need to be specific with prompts.

### Research Task: Compiling Reviews

I tested the research mode by asking the "research" assistant to compile reviews about text editors to form the basis of an article. This triggered a different interface showing "researcher thinking" and "researcher summarizing to supervisor" messages.

The assistant searched for information and compiled results, eventually producing a document with references. However, the output was overly verbose, typical of AI-generated content. The references appeared at the end, and whilst the information was accurate, the presentation lacked focus.

The research mode took considerable time, running for a long time before producing results.

### Analysing My Own Content

I tested whether the assistant could analyse a specific page from my blog and asked the "make" assistant to create a presentation based on the content.

Here the assistant showed some confusion. It pulled images from my blog but not always from the correct page. It seemed to analyse my blog generally rather than the specific article I'd specified. After being more explicit about the URL, the assistant produced a summary, though calling it a "presentation" was generous.

The assistant correctly identified the main text editors I'd reviewed and included honourable mentions, so it did extract the right information. The formatting and structure needed work though, and again, the content was overly verbose.

## Interface and Context Issues

Testing revealed several interface quirks. The assistant occasionally switched to German unexpectedly, presumably based on location rather than language preference. This created confusion until I noticed and switched back.

Context switching between modes (chat, do, research) sometimes lost conversation history. When I switched from one task to another, the assistant didn't always retain information from previous exchanges and sometimes switching to another task would cause others to lose context or stop running completely.

Running multiple tasks simultaneously was possible but confusing. I tested having the flight search running whilst starting the guitar search, and the interface struggled to show clear progress for both. Switching between them sometimes disrupted one task to start another.

Different modes also presented different interfaces. Sometimes the sidebar showed controls, other times a full-page interface appeared. This inconsistency made it unclear which mode I was actually using at times.

## The Date Picker Problem

Date pickers emerged as the assistant's biggest weakness, which is odd as "booking a trip" is often the example companies use to demonstrate assistant tools. Almost every travel site uses custom date picker interfaces, often showing price calendars or date ranges in visually complex ways. These interfaces make sense to humans who can quickly scan and select, but the assistant consistently struggled.

The assistant would correctly identify the date picker element but couldn't reliably select dates. It would click wrong elements, select the same date for departure and return, or simply get stuck trying to interact with the calendar interface.

## When Opera Neon Makes Sense

Opera Neon works best for research tasks where you want information compiled from multiple sources. The research mode can gather information whilst you work on something else, though you'll need to clean up the verbose output.

Form filling works reasonably well for standard forms without complex date pickers or dropdown interfaces. The assistant can complete basic contact forms faster than manual entry.

Price comparison across e-commerce sites shows promise, though it's not dramatically faster than using dedicated price comparison tools. The advantage is having the assistant navigate multiple sites whilst you focus elsewhere.

Opera Neon has limited utility for complex web applications, booking systems with custom interfaces, or tasks requiring subjective judgement. The assistant works best with standard, predictable web interfaces.

## Should You Use Opera Neon?

Like all agentic browsers, Opera Neon demonstrates interesting possibilities for AI-assisted browsing, but the technology needs refinement. It works for straightforward tasks but struggles with common web interface patterns like date pickers.

If you're already in the Opera ecosystem, Opera Neon offers value for research tasks and simple automation. The promise to run tasks in the background whilst working elsewhere shows promise.

For general browsing and complex tasks, standard browsers remain more efficient. The time spent supervising the assistant and correcting errors often exceeds the time saved through automation.

The technology shows promise but feels like early-stage development. The interface inconsistencies, context switching problems, and interface struggles indicate Opera Neon needs more development before becoming a reliable daily tool.