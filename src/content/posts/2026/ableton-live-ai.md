---
title: Controlling Ableton Live with AI using Feater and Producer Pal
publishDate: 2026-04-06T00:00:00.000Z
author: Chris Ward
categories:
  - writing
tags:
  - Music
  - AI
  - MCP
  - Ableton Live
  - Claude
summary: >-
  AI tools promise to automate the tedious parts of starting a music project. I tried two MCP-based options for Ableton Live, Feater and Producer Pal, to see how much they help me make music.
---

Almost every creative pursuit is being disrupted by AI tools, and music is no different. AI-like technologies have been in music for a long time, but the new generation promises something different. It promises to automate the tedious tasks at the start of a project, so you can focus on the creative parts.

Or at least that's the promise.

I looked at two options for Ableton Live that connect to an AI assistant using MCP. I used [Claude](https://claude.ai) for both. There are other Ableton MCP projects, but most stopped after an initial commit. These two are the most mature and the most integrated.

## Feater

[Feater](https://www.feater.ai) installs as an Audio Unit and a VST3 plugin. Setup takes a few steps.

1. In Ableton's Link, Tempo & MIDI settings, set Feater as a control surface on one of the MIDI channels.
2. Add the plugin to the main channel.
3. Add Feater as a connector in your AI tool of choice using the URL from the documentation.

It needs an internet connection, but the documentation says everything runs locally. It handles project analysis, MIDI generation, arrangement, mixing, automation, and custom workflows from your own prompts. It isn't good at arranging tracks or tuning some things.

The connection between the plugin and the AI tool sometimes drops. Toggling plugins on and off fixes it. I recommend you start by asking Claude if it can connect to Feater before I get too deep into a project.

### The test prompt

> Create a track with a four to the floor 808 drum pattern. Four bars with the fourth bar having a variation. Add a bass pattern to match in C minor and add a lead synth that plays every two bars.

Feater works in the background without asking for approval at each step. That's less risky than it sounds, because automating a music tool is rarely destructive. It's also slow, and I hit Claude's tool limit part way through.

The results varied. In the first run, the drums were missing, and last time I tried it they worked fine. I asked again, the 808 core kit loaded, and the drums appeared. The drum velocities had a nicely humanised variation. The bass and lead were too loud, so I mixed them down myself. It sounded a bit like an 80s game soundtrack, but that's what 808s do.

I then asked it to change the instrument, add chorus and switch the key to D Dorian. It handled non-default plugins too, though I had to open the plugin myself to pick the model. For the key change, it removed and recreated the notes instead of editing them. I liked the result enough to save it.

## Producer Pal

[Producer Pal](https://producer-pal.org/) takes a different approach. It's open source and free, whereas Feater is in private beta, so I don't know if it will stay free. It runs as a Max for Live device, which needs a version of Ableton that includes Max or a separate Max install. That adds cost and fiddliness.

It also needs a different Claude setup. You download and install an extension, and you approve the tool when you start a conversation. It has its own chat UI, but I stuck to Claude.

Given the same prompt, Producer Pal took a much more step by step approach. It created extra tracks, added drum racks to every one, and picked different instruments. It kept stopping to suggest I finish the lead manually. I would rather it just did the work, since I only want a starting point.

It obsessed over plugin parameters and kept adding effects. I find endless virtual dial twiddling tedious, so that might be a good use for it. The drums were missing until I prompted again, and then it told me to use another tool. The result sounded more krautrock than four to the floor. It only knows Ableton's native devices, which is a plus if you share projects with people who don't have your plugins.

If both are enabled, they start working with each other. That's an experiment for another day.

## Which one to use

I got results quicker with Feater. Producer Pal does things differently, and I wasn't as happy with the output. For now I plan to use both. Feater gets me started and Producer Pal handles tweaking. If I share a project, Producer Pal is safer because it only uses stock Ableton devices.

I think Feater suits less technical people, and Producer Pal suits people who know more about what they want to do.

If you've tried either, or something else, let me know what you think.