---
title: Text-based diagrams taken mainstream with Mermaid Chart
publishDate: 2025-03-13T00:00:00.000Z
author: Chris Ward
categories:
  - writing
tags:
  - Mermaid
  - Diagrams
  - Documentation
  - Tools
image: articles/mermaid-chart-chinchilla.png
summary: >-
  A while ago I made a video on Mermaid, the markdown-style syntax for creating diagrams and charts. It's still one of my more popular videos, and it needs an update. In the meantime, the people at Mermaid Chart, a new commercial company formed by some of Mermaid's original creators, reached out to show me their platform. So in this post, I take a look at what it adds on top of the default Mermaid syntax.
---

A while ago I made a video on [Mermaid](https://mermaid.js.org/), the markdown-style syntax for creating diagrams and charts. It's still one of my more popular videos, and it needs an update; I have a few more "diagrams as code" posts planned too. In the meantime, the people at [Mermaid Chart](https://go.chrischinchilla.com/mermaid), a new commercial company formed by some of Mermaid's original creators, reached out to show me their platform. So here's a look at what it adds on top of the default Mermaid syntax.

## A quick reintroduction to Mermaid

Mermaid is a JavaScript library that renders diagrams from a simple text syntax. Since it's a library, tools need to implement it to actually display anything, and plenty do. If you want to experiment with the syntax without installing anything, the [live editor](https://mermaid.live/) is a good place to start: changes update automatically, and there are sample diagrams to explore.

If you'd rather work in an editor you already use, that's also possible. This is where Mermaid Chart's connection to the open-source project gets a little unclear. The prominent plugin link on Mermaid's own site actually takes you to Mermaid Chart's commercial plugin, not the open-source one. Digging further, there's a page listing over 20 integrations. Many editors, like Obsidian, support Mermaid by default. For VS Code, I use two extensions: one for syntax preview and one for syntax highlighting, though there are several more to choose from.

## The Mermaid Chart editor

I opened a flowchart in the VS Code preview to see the basics. The diagram type and direction are both configurable, and you can't drag nodes around directly, contrary to what I expected. Editing the connections between nodes changes the diagram live. The bracket style around a node determines its shape: curly brackets give a diamond, round brackets a rounded rectangle, square brackets a normal rectangle.

Pie charts calculate percentages automatically from whatever numbers you give the nodes, which is a nice touch, though the pie chart doesn't render well in dark mode.

Switching to the Mermaid Chart web interface itself, you get a synchronised split view between the text syntax and a visual editor. You can change shapes, borders, colours, and text directly in the visual side. One confusing bit: styling a node with icons uses Font Awesome shorthand in the text field, with no picker, so unless you already know the shorthand it's not obvious what you're typing.

Moving nodes around is inconsistent. You can't reposition an existing connection, but if you delete one and create a new one, that works fine, repeatedly. Mermaid itself has no real concept of fixed location, since everything just connects, so this might be expected behaviour rather than a bug, but it caught me out a few times.

Templates are available for common chart types, like pie charts, though starting from a template after you've already begun a diagram isn't obvious. You mostly have to go back and start again.

## The whiteboard feature

Beyond the visual editor, Mermaid Chart has a collaborative whiteboard. I tested this by opening the same board in an incognito window to simulate a second collaborator, and changes synced close to instantly. You can see other collaborators' cursors, which is a little disconcerting the first time.

The genuinely useful part is that you can extract pure Mermaid syntax from whatever you've built on the whiteboard, syntax that's admittedly a bit messier than what you'd write by hand, but usable. Right now, the whiteboard only supports flowcharts.

## The AI chat feature

Mermaid Chart also has an AI chat for generating diagrams from a text prompt. My first attempt, deliberately vague, only returned a text response rather than a diagram, so I learned you need to be fairly specific. Using one of the built-in sample prompts worked well and produced an editable flowchart quickly.

I tried a pie chart next, since that needs actual data. The AI generated plausible-looking numbers, with a caveat that you should verify they reflect real data. I attempted to point it at a source to pull real numbers from, but it couldn't extract the data itself. That would be a genuinely useful addition if Mermaid Chart adds it later, especially paired with something like a RAG pipeline to fetch and chart real data.

## Presentations and the VS Code extension

There's also a presentation feature: select a chart, and it embeds into a simple slide. It's functional, but I couldn't find a way to edit the chart again from within the presentation view, so its usefulness feels limited for now.

Finally, there's a VS Code extension. It's not entirely clear whether it's built specifically for Mermaid Chart or is an existing extension Mermaid Chart took over, given its unusually large install count for a new tool. It adds a sidebar view listing your diagrams, and clicking one opens it, but only as a link back to the Mermaid Chart website rather than an inline editor. I'd hoped for the ability to create and sync diagrams directly from VS Code, but it's really just another front end onto the web app.

## Should you try it?

Mermaid Chart is an interesting service with some good ideas, though it still feels early days in places, dragging and repositioning nodes is inconsistent, and some features like the presentation view and VS Code extension don't yet do much beyond what you'd get from the website directly. The AI chat feature has the most potential, especially if it eventually supports pulling in real data, and the whiteboard's ability to export clean Mermaid syntax from a collaborative session is genuinely useful. If you want a more visual, collaborative way to build Mermaid diagrams without leaving plain text syntax behind entirely, it's worth a look.
