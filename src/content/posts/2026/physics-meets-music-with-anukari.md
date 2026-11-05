---
title: Physics meets music with Anukari
description: I speak with Evan, creator of Anukari, a 3D physics-based synthesiser plugin, about building instruments from masses and springs, writing plugins with JUCE, and why he won't make you use iLok.
tags: [Music, Audio, Interview]
section: tech
---

For this episode of the Tech Lounge, I spoke with Evan, the developer behind [Anukari](https://anukari.com), a 3D physics synthesiser and effects plugin. Music and technology are two things I like to combine, and it's a treat when they meet. Anukari is easiest to understand visually, so if you only listen to the audio, watch the video as well. This post is a condensed Q&A of our conversation.

## From fraud prevention to physics synthesis

**You're an ex-Google engineer. How did you get from there to music software?**

I spent around 11 years at Google, mostly on fraud and abuse prevention, stopping things like hate speech being monetised with ads. I enjoyed thinking like the people I was fighting, but I was getting burnt out by the end. I'm a lifelong amateur musician, mainly a guitarist, and I've spent years building small demos and apps at weekends. One of those was a very early prototype of what became Anukari. I thought it was a cool idea, forgot about it for ten years, and when I was working out what to do after Google, the idea came back.

## What Anukari is

**Most synths build sounds from waveforms and envelopes. What does Anukari do instead?**

It's a physical modelling synthesiser. You build physical contraptions out of simple abstract components, mainly masses and springs. Add energy to the system and it vibrates, and that vibration becomes sound. A friend who's into modular synthesis described it as "modular, but for physics", which I found a helpful description.

**Is the 3D view just a visualisation on top of a normal synth engine?**

No, and that's a common misconception. The graphics show the state of the 3D physics simulation one-to-one, so there's no way to use Anukari without them. Blender was an inspiration for the editor, down to details like camera hotkeys, because there is almost no prior art for a 3D editor in the plugin world.

**Are the masses metal, wood or plastic?**

None of them. They're abstract points in space, closer to atoms than to physical objects. A guitar string is made of lots of atoms; in Anukari you build something out of a much smaller number of specks. The environment, such as the blue sky, and the 3D models are purely visual and customisable. Only the physics affects the sound.

## The demo

**What does it look like in practice?**

I started with the simplest preset: a mass that can move, others tied down so they don't fly off into space, a mallet, and two microphones. The microphones are where sound is picked up, and moving them changes the timbre. Connect a loose mass with a single spring and you get wild, flailing sounds, a bit like flexing a piece of metal.

A grid of masses and springs, stretched out at the corners, behaves like a tight drum head being distorted as I drag it around. More complex presets enter what I call "contraption territory", with piston-like LFOs driving parameters.

**Is it samples or synthesis?**

It's purely physical modelling, with no samples at all. Everything can be modulated at audio rate, so an "LFO" can run at 20kHz, which produces some odd sounds. Any parameter can also be controlled over MIDI.

## What people have made with it

**What has anyone made with it so far?**

The most famous example is a track by Mick Gordon, composer on the recent Doom games, made the second day the beta was out. It's a loud, out-there dubstep piece that takes the dissonant sounds you easily get from presets and fits them into a musical context. I love that: sounds I consider too weird to be musical become musical once another instrument joins them. It has also been used for sound effects on Star Trek, and it's well suited to sound design and cinematic sounds.

## Building a plugin

**What do you need to run it?**

The GPU is only for the 3D graphics, which are lightweight. I tested on a pile of old Windows laptops I bought on eBay for around $111 each after users reported bugs. The CPU load depends on the preset: small ones run anywhere, and the huge contraptions strain even a decent machine. It needs about 1GB of disk space, tiny by plugin standards, because there are no samples.

**What's it written in?**

C++. The physics simulation and DSP are performance-sensitive, and I wrote the 3D graphics in C++ too, for speed. For the part that has to work with every digital audio workstation on Mac, Windows and now Linux, I use [JUCE](https://juce.com), which also handles the cross-platform interface. I have my gripes about it, but it makes a lot easier. Coming from other software work, I wasn't prepared for how much of a pain the audio plugin space would be.

**What about all the plugin formats?**

JUCE covers VST, AU, AAX and the others, which would otherwise mean writing separate code for each. CLAP is the new format people are excited about, and I think support is coming. Every time I think about it, I think of the XKCD comic about 14 competing standards becoming 15. I tend to blame Steinberg for the fragmentation, since early VST developers had to sign an agreement and be approved. Had it been open and simple from the start, maybe we'd have just one format.

**On Linux, which hosts do you trust?**

Bitwig, Reaper and VCV Rack. A lot of other software runs on Linux, but do they really support it?

## Licensing and price

**Plenty of plugins need iLok or a separate authentication app. Do you?**

No. I find that kind of thing so irritating that I'm not willing to inflict it on people. It's not a subscription either: you pay once and get a licence key. The audio market is smaller than something like Photoshop, which I think explains some of the paranoia about piracy. My own protection is basic. If it took five minutes to crack, it would embarrass me as an engineer, but it probably takes ten.

**What does it cost?**

€99, per version. I don't have concrete plans for a 2.0, and I wouldn't be comfortable calling something 2.0 and asking for more money unless it were dramatically different. For now, I keep releasing new features in 1.0.

## What's next

**What's on the roadmap?**

Linux support has taken most of my effort in recent weeks, alongside new physics parameters on the body objects. The idea I'm most excited about is what I call the "modulo sphere", a ridiculous made-up word. It's a sphere you can size and drag around in 3D space, and anything inside it has a parameter modified, such as how heavy the masses are. I think it could lead to some really cool performative aspects, almost gravitational, though I haven't yet worked out how to build it. Someone suggested recreating Holst's *The Planets* with it, which would be a blast. The simulation is already rich, so I'm looking for simpler ways to interact with it, and then I want to add physics features for the rest of my life, as long as sales keep me motivated.

**I compose for horror films with a friend, and a freakish-looking instrument making freakish sounds for a freakish film appeals to me. Is that a good fit?**

Definitely. Cinematic sounds are one of its strengths.

It also fits a point I recall Hans Zimmer making about Dune: the far future shouldn't sound like an old-fashioned orchestra, and now you can build the instruments that don't exist.

## Try it

You can find Anukari at [anukari.com](https://anukari.com), where there's a seven-day trial. No strings attached, though maybe some springs.
