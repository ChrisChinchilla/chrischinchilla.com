---
title: Fishman TriplePlay Express MIDI guitar pickup review
publishDate: 2024-12-10T00:00:00.000Z
author: Chris Ward
categories:
  - music
tags:
  - Music
  - MIDI
  - Guitar
  - Ableton Live
image: articles/fishman-tripleplay-chinchilla.png
summary: >-
  I used to be a full time guitar player, and more recently I've been experimenting with electronic drums, MIDI devices, and DAWs. Converting an analogue instrument I'm used to playing into MIDI signals has always interested me, so I tried the Fishman TriplePlay Express, a relatively affordable MIDI guitar pickup, to see how it holds up.
---

I used to be a full time guitar player. More recently, I've been experimenting with electronic drums, MIDI devices, and DAWs. Converting an analogue instrument I'm used to playing into MIDI signals has always interested me, so I was keen to try [the Fishman TriplePlay Express](https://www.amazon.com/Fishman-TriplePlay-Express-Guitar-6-String/dp/B0CPVR5DDS?ref=as_li_ss_tl&ie=UTF8&linkCode=sl1&tag=gregamamma-20&th=1), a relatively affordable but good-quality MIDI guitar pickup. Thanks to Fishman for sending me a review unit.

## What's in the box

The box contains the pickup itself, sitting on a semi-magnetic strip, a receiver that matches the pickup, a USB-C connector, mounting buttons, a quick start guide, and various other bits and pieces: sticky mounts, risers, and screwdrivers.

## Installing the pickup

To install it, you need to get to the guitar's bridge, which means taking the strings off first. On my [Squier Mustang](https://www.amazon.com/Squier-Fender-Classic-Mustang-Electric/dp/B07N2939RC?ref=as_li_ss_tl&ie=UTF8&linkCode=sl1&tag=gregamamma-20&th=1), the bridge is a bit unusual, a mix between styles with a large gap between the scratch plate and the body. That gap caused a few stability issues later, which I'll get to.

With the strings off, the first step is mounting the bracket that everything else attaches to. It's straightforward, fitting over the guitar's starp buttons with a cork lining for softening. Once that's screwed back in, you stick the pickup's magnetic mount in place, and it holds solidly since everything is metal. The receiver slots onto its own mount.

If there's more distance between the guitar body and the strings, Fishman includes height adapters that sit between the pickup and its mount. On my guitar there wasn't much space, so I skipped those.

There's a small cable connecting the pickup to the receiver unit, and on my guitar it's a bit tight, mostly down to the Mustang's unusual shape rather than anything Fishman could control.

Fishman includes a string-spacer checker, shaped like a guitar, to check the distance between the pickup and the strings. Too little space and the pickup buzzes against the strings. Too much space, and the signal is quieter. Two small adjustment holes on either side let you raise or lower it to get this right, and I also had to adjust my guitar's bridge slightly to get the top strings sitting properly.

Once everything's mounted, you end up with both a guitar cable and a USB cable coming out of the instrument, which looks a little odd, plus a pair of control buttons and a dial for adjusting things on the fly.

## Using it as a MIDI device

Plugged into a computer, the TriplePlay Express works as a standard MIDI input in any DAW. I tested it in Ableton Live, where it shows up as two separate inputs and outputs: guitar and control. Guitar is the one that matters for playing.

I set a track's input to the pickup and loaded the [Spitfire Symphony Orchestra](https://www.spitfireaudio.com/products/spitfire-symphony-orchestra)] for something dramatic, picking a violin patch. The mapping between the guitar fretboard and the plugin's note range takes some figuring out, since it varies by plugin. Once I found the right range, playing worked as expected, though not everything translated well. String bending doesn't always work and chords aren't handled cleanly. Though the utility software mentioned next does let you tweak these settings to try and get them to work better. However, a lot comes down to the plugins, many don't expect an instrument like a guitar as a MIDI controller. Individual notes, and small groups of them, come through fine. Instruments with longer sustain than a plucked guitar string feel a little strange, though switching to a pizzicato patch or a simple synth made it feel more natural.

## The bundled software

The pickup ships with two applications: the TriplePlay host and the TriplePlay utility. The host also bundles SynthMaster, a synth plugin.

The host interface takes some getting used to, and I'm still working out some of the finer details. It only supports VST and VST3 plugins, which meant re-adding a few I'd previously removed in favour of Audio Units.

By default, you get a single "split" with a level indicator per string, triggering SynthMaster. The pickup's control buttons cycle through patches, and there's a volume dial.

Splits let you assign different instruments to different strings or frets. I tried mapping a drum plugin, which technically should work, but figuring out a workable mapping proved fiddly, especially since it's unclear whether playing drums via guitar frets is ever really the point. I had better luck running two SynthMaster instances split across string groups, though the combination I landed on was more a demonstration than something musical.

There's also a "guitar" input option in the host, which is just the analogue signal from the pickup itself. Blending that with the MIDI output gives some interesting combinations, essentially layering the live guitar tone under the synthesized one.

The utility app handles the rest. Transposing, bend range and mode, micro-adjusting sensitivity per string (useful if the physical adjustment screws are hard to reach), firmware updates, and remapping the control buttons.

## Should you buy it?

The Fishman TriplePlay Express is a genuinely usable, affordable way into MIDI guitar, with a few caveats. Installation takes some patience and depends a lot on your guitar's bridge shape. The host software's mapping and plugin compatibility take experimentation, and things like chords and string bending don't always translate cleanly to MIDI. But for triggering individual notes and exploring new instrument textures from a guitar, it works, and the creative potential is worth spending more time with.