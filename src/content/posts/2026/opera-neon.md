---
title: Testing Neon - Opera's agentic browser
publishDate: 2026-01-24T00:00:00.000Z
author: Chris Ward
categories:
  - writing
tags:
  - Mac
  - Mac Utilities
  - Cloud Storage
  - Maintenance
image: articles/cleaning-chinchilla.png
summary: >-
  CleanMyMac has long been a go-to tool for macOS maintenance, but its recent addition of cloud storage cleanup is worth examining. In this post, I test the new feature to see how well it helps manage cloud storage across services like iCloud and Google Drive, and whether it's a useful addition or just a gimmick.
heroimage: articles/cleaning-chinchilla.png
herotext: >-
  CleanMyMac's new cloud storage cleanup feature helps declutter files across popular cloud services.
---

Opera released Neon, a new browser that includes an AI assistant called the Browser Operator. This assistant interacts with web pages on your behalf, completing tasks that typically need manual clicking, typing, and navigation. I tested the browser with real tasks to see how it performs.

## What's Opera Neon?

Opera Neon represents Opera's latest browser release, built on the Chromium engine. It includes the Browser Operator, an AI assistant that executes tasks by simulating user interactions with web pages. The assistant uses computer vision to understand page layouts, identify interactive elements, and click buttons or fill forms.

The browser maintains Opera's existing features, including the Aria AI assistant, which offers a separate chat interface for general questions. The Browser Operator focuses on task execution rather than conversation.

The interface offers different modes: chat for conversations, do for task execution, research for gathering information, and make for content creation. You need an Opera account to access these AI features, which Opera currently offers as a paid service with trial periods available.

## Installation and Setup

I downloaded and installed Opera Neon on macOS. The installation process matches Opera's standard browser setup. After launching, I found the Browser Operator through a sidebar icon. Clicking the icon opened a panel where I typed task instructions.

The interface displays options for different modes, though switching between them sometimes caused the chat bar to vanish (this is beta software after all). The assistant shows its progress through visual overlays on pages and status updates in the sidebar.

## Testing with Real Tasks

I ran several real-world tests to understand the assistant's capabilities and limitations.

### Flight Search: Berlin to Tenerife

The first substantial test involved booking a flight. I asked the assistant to find flights from Berlin to Tenerife for 3rd to 12th. The assistant started working through Skyscanner, which it seemed familiar with.

The process revealed immediate challenges. The assistant filled in the departure city correctly but struggled with the date picker. Skyscanner's date picker shows prices across a calendar, which makes sense to humans but confused the assistant. It initially set both departure and return dates to the same day.

The assistant recognised its error, displaying a message about "human in the loop" and requesting my help. I corrected the dates manually. The assistant then continued, but progress was slow. What I might have completed in 30 seconds took several minutes.

The assistant then switched to Google Flights for comparison, which presented a different date picker interface. Again, date selection proved problematic. The assistant repeatedly got stuck on the dates, requiring multiple interventions.

After considerable time, the assistant did find flight options, though they were essentially the same flights available through normal search. The prices looked reasonable (though some seemed suspiciously cheap), but I had to verify everything myself anyway.

The experience showed that whilst the assistant can navigate travel sites, date pickers remain a significant obstacle. The "human in the loop" approach means you're more of a supervisor than someone who can leave the task entirely to automation.

### Guitar Shopping on Reverb

I tested e-commerce functionality by asking the assistant to find a Yamaha Pacifica electric guitar. The assistant navigated to Reverb and other music retailers, searching for options.

The assistant found several guitars and even added one to the cart on Reverb. However, it stopped at checkout, which aligns with Opera's safety features. The assistant won't complete purchases without explicit confirmation, which makes sense for financial transactions.

The interesting aspect here was watching it compare prices across different sites, though the results were mostly what I'd find through normal price comparison tools. The assistant opened multiple tabs and navigated between them, but the time saved was questionable compared to doing this manually.

### Research Task: Compiling Reviews

I tested the research mode by asking the assistant to compile reviews about text editors. This triggered a different interface showing "researcher thinking" and "researcher summarizing to supervisor" messages.

The assistant searched for information and compiled results, eventually producing a document with references. However, the output was overly verbose, typical of AI-generated content. The references appeared at the end, and whilst the information was accurate, the presentation lacked focus.

The research mode took considerable time, running for several minutes before producing results. I left it working in the background, which demonstrated one potential advantage: you can start a research task and work on something else whilst it compiles information.

### Analysing My Own Content

I tested whether the assistant could analyse a specific page from my blog. I navigated to my post about seven text editors and asked the assistant to create a presentation based on the content.

Here the assistant showed some confusion. It pulled images from my blog but not always from the correct page. It seemed to analyse my blog generally rather than the specific article I'd specified. After being more explicit about the URL, the assistant produced a summary, though calling it a "presentation" was generous.

The assistant correctly identified the main text editors I'd reviewed and included honourable mentions, so it did extract the right information. The formatting and structure needed work though.

## Interface and Context Issues

Testing revealed several interface quirks. The assistant occasionally switched to German unexpectedly, presumably based on location rather than language preference. This created confusion until I noticed and switched back.

Context switching between modes (chat, do, research) sometimes lost conversation history. When I switched from one task to another, the assistant didn't always retain information from previous exchanges. This meant being very explicit about what I wanted in each new context.

Different modes also presented different interfaces. Sometimes the sidebar showed controls, other times a full-page interface appeared. This inconsistency made it unclear which mode I was actually using at times.

Running multiple tasks simultaneously was possible but confusing. I tested having the flight search running whilst starting the guitar search, and the interface struggled to show clear progress for both. Switching between them sometimes disrupted one task to start another.

## The Date Picker Problem

Date pickers emerged as the assistant's biggest weakness. Almost every travel site uses custom date picker interfaces, often showing price calendars or date ranges in visually complex ways. These interfaces make sense to humans who can quickly scan and select, but the assistant consistently struggled.

The assistant would correctly identify the date picker element but couldn't reliably select dates. It would click wrong elements, select the same date for departure and return, or simply get stuck trying to interact with the calendar interface.

This limitation severely impacts the assistant's usefulness for travel booking, which Opera showcases as a key use case. Until date pickers work reliably, travel bookings will always need human intervention.

## Privacy and Security Considerations

The Browser Operator raises privacy questions. The assistant captures screenshots to understand page layouts, which means it sees everything on screen, including sensitive information.

Opera states that the assistant processes most tasks locally, though some operations may send data to Opera's servers. The browser includes settings to control when and how the assistant operates.

For security, the assistant includes guardrails. It won't complete financial transactions, enter passwords, or submit sensitive forms without user approval. A confirmation prompt appears before these actions, which I encountered during the guitar shopping test.

Review the privacy settings before using the Browser Operator, especially if you work with confidential information.

## When Opera Neon Makes Sense

Opera Neon works best for research tasks where you want information compiled from multiple sources. The research mode can gather information whilst you work on something else, though you'll need to clean up the verbose output.

Form filling works reasonably well for standard forms without complex date pickers or dropdown interfaces. The assistant can complete basic contact forms faster than manual entry.

Price comparison across e-commerce sites shows promise, though it's not dramatically faster than using dedicated price comparison tools. The advantage is having the assistant navigate multiple sites whilst you focus elsewhere.

Opera Neon has limited utility for complex web applications, booking systems with custom interfaces, or tasks requiring subjective judgement. The assistant works best with standard, predictable web interfaces.

## Technical Performance

I monitored resource usage during testing. The Browser Operator increased CPU usage noticeably, especially when running multiple tasks. Memory usage remained reasonable, typically adding 200 to 300 MB to the browser's baseline consumption.

Task execution speed varied dramatically. Simple searches completed quickly, but complex multi-step tasks took minutes. The flight search alone ran for over ten minutes with multiple interventions.

The assistant's error handling needs improvement. When stuck on date pickers, it would sometimes retry endlessly rather than reporting the specific problem. The "human in the loop" prompts helped, but clearer error messages would save time.

## Should You Use Opera Neon?

Opera Neon demonstrates interesting possibilities for AI-assisted browsing, but the technology needs refinement. The Browser Operator works for straightforward tasks but struggles with common web interface patterns like date pickers.

If you're already in the Opera ecosystem and have a paid subscription, Opera Neon offers value for research tasks and simple automation. The ability to run tasks in the background whilst working elsewhere shows promise.

For general browsing and complex tasks, standard browsers remain more efficient. The time spent supervising the assistant and correcting errors often exceeds the time saved through automation.

The technology shows promise but feels like early-stage development. The interface inconsistencies, context switching problems, and date picker struggles indicate Opera Neon needs more development before becoming a reliable daily tool.

## Next Steps

I want to test Opera Neon with more complex workflows, especially data gathering across multiple sites where the background processing advantage becomes more apparent. I also plan to investigate how the assistant handles different types of web applications beyond travel and e-commerce.

The research mode shows the most promise, so I'll focus testing there to understand its capabilities better. If you have suggestions for specific use cases or tests, let me know in the comments.