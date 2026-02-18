---
title: Testing Opera's agentic Browser, Neon
publishDate: 2026-01-24T00:00:00.000Z
author: Chris Ward
categories:
  - writing
tags:
  - Browser
  - AI
  - Agentic
  - Web
image: articles/opera-chinchilla.png
summary: >-
  Opera Neon, a new browser with an AI assistant called the Browser Operator, was released. This assistant interacts with web pages on your behalf, completing tasks that typically need manual clicking, typing, and navigation. Here's how the browser performs when you put it through its paces.
---

Opera released [Neon](https://www.operaneon.com), a new browser that includes an agentic AI assistant. Opera demonstrated the underpinnings of Neon early in 2025, but their actual public release now looks a little late to the agentic browser party. A party many are still unsure they want to join. This assistant interacts with web pages on your behalf, completing tasks that typically need manual clicking, typing, and navigation. Here's how the browser performs when you put it through its paces.

## Installation and setup

The installation process matches Opera's standard browser setup. After launching, you find the Browser Operator through a sidebar icon. Clicking the icon opens a panel where you type task instructions.

The interface displays a text input box for describing the task you want completed. Once you submit a request, the assistant begins working immediately, showing its progress through visual overlays on the page and status updates in the sidebar.

## Testing the Browser Operator

Here are tests that explore the assistant's capabilities and limitations.

### Basic Web Navigation

The first test involved a simple search task. You ask the assistant to search for images of chinchillas. The assistant opens a new tab, navigates to Google, enters the search query, and clicks the Images tab. The process takes about 10 seconds to complete.

The assistant displays each action as it works, showing clickable elements highlighted on the page. You can see when it identifies the search box, enters text, and clicks buttons.

### Multi-Step Tasks

To test whether the assistant handles more complex, multi-step requests, you can ask it to find vegan restaurants in Berlin and open some of them in new tabs. The assistant completes this task, though it takes slightly longer, around 20 seconds.

The assistant performs these steps:

1. Navigated to Google
2. Entered the search query
3. Identified restaurant results
4. Opened results in separate tabs

You'll notice the assistant pauses between actions, likely while processing the next step.

### Form Completion

You can test the assistant's ability to fill web forms. Using a contact form on a test website, you give the assistant information to enter, including name, email, and message content. The assistant locates each form field, enters the correct information, and submits the form.

You'll encounter one limitation though. When you ask the assistant to use an email address without specifying it in the prompt, it can't access that information. It needs explicit data in your request.

### Shopping Tasks

Running a shopping test shows how the assistant handles e-commerce sites. You ask it to find vegan protein powder on Amazon, add items to the cart, and navigate to checkout.

The assistant searched for products, identified relevant results, and added items to the cart. It stopped at the checkout page, which aligns with Opera's safety features. The assistant won't complete financial transactions without explicit user confirmation.

### Limitations to Note

Limitations became clear during testing.

The assistant struggled with websites that use non-standard layouts or heavy JavaScript frameworks. On one test site with a complex navigation structure, the assistant clicked the wrong elements before eventually completing the task.

Authentication presents another challenge. The assistant can navigate to login pages but can't access stored passwords or authentication credentials for security reasons. You must log in manually before the assistant can perform tasks that need authentication.

The assistant sometimes misinterpreted visual elements. In one case, it clicked an advertisement instead of the intended button because both elements appeared visually similar. The assistant relies on visual positioning rather than semantic HTML structure.

Task descriptions need clarity. Vague instructions like "find something interesting" produced inconsistent results. The assistant works best with specific requests.

## How It Compares

Browser automation tools have existed for years. Tools like Selenium and Puppeteer offer programmatic browser control. Opera Neon differentiates itself by using natural language instructions instead of code.

Other AI browsers exist. Claude can interact with browsers through computer use features. Google announced similar capabilities for Chrome. Opera's implementation stands out by integrating the assistant directly into the browser interface rather than needing external tools or extensions.

The approach differs from browser extensions that add AI features. Extensions layer functionality on top of an existing browser. Opera built the Browser Operator into the browser itself, offering better integration with browser internals.

## Privacy and Security Considerations

The Browser Operator raises privacy questions. The assistant captures screenshots to understand page layouts, which means it sees everything displayed on screen, including sensitive information.

Opera states that the assistant processes most tasks locally, though some operations may send data to Opera's servers. The browser includes settings to control when and how the assistant operates.

For security, the assistant includes guardrails that prevent certain actions. It won't complete financial transactions, enter passwords, or submit forms that request sensitive information without user approval. A confirmation prompt appears before these actions.

Review the privacy settings before using the Browser Operator, especially if you work with confidential information.

## When the Browser Operator Makes Sense

The Browser Operator works well for repetitive tasks that follow predictable patterns. Research tasks that involve opening search results, collecting information from websites, or comparing products across different pages benefit.

Form filling represents another practical use case, if you're comfortable giving the information in your prompt. The assistant can complete standard forms faster than manual entry, though you need to verify the results.

Testing websites benefits from the assistant. Instead of manually clicking through workflows, you describe the test scenario and let the assistant execute it. You'll need to verify the results though.

The assistant has limited utility for creative or exploratory browsing. Tasks that need judgement, taste, or subjective decision-making don't translate well to automated execution.

## Technical Performance

Monitoring resource usage during testing, the Browser Operator increases CPU usage noticeably, especially during complex multi-step tasks. Memory usage remains reasonable, typically adding 200 to 300 MB to the browser's baseline consumption.

Task execution speed varied widely. Simple searches completed in under 10 seconds. Multi-step tasks with page loads took 30 to 60 seconds. Complex workflows that needed navigation across sites occasionally took minutes.

The assistant handles errors inconsistently. When encountering a broken link or unavailable page, it sometimes retried the action, other times it stopped and reported the error. The error reporting offers limited detail about what went wrong.

## Should You Use Opera Neon?

Opera Neon demonstrates interesting possibilities for AI-assisted browsing. The Browser Operator works reliably for straightforward tasks and saves time on repetitive workflows.

The technology has limitations though. The assistant needs clear instructions, struggles with complex websites, and can't handle tasks that need subjective judgement. You'll spend time learning how to phrase requests effectively.

For users who perform repetitive research tasks, fill forms, or often execute multi-step workflows, Opera Neon offers tangible benefits. The time saved on these tasks may justify learning the assistant's capabilities and limitations.

For general browsing, standard browsers remain more efficient. The Browser Operator adds complexity and resource overhead that casual browsing doesn't need.

It's worth continuing to test Opera Neon to see how the Browser Operator improves with updates. The idea shows promise, but the implementation needs refinement before it becomes indispensable for everyday browsing.

## Next Steps

You might want to test the Browser Operator with more complex workflows, especially those involving data aggregation across sites. You could also investigate how the assistant handles dynamic content and single-page applications that rely on JavaScript.

If you have suggestions for tests or specific use cases to explore, share them in the comments. The goal is to find real-world tasks where AI browser automation offers practical value.
