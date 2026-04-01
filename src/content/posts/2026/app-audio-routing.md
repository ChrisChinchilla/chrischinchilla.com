---
title: I Replaced My Custom Mac App Audio Routing Solution with Elgato Wave Link 3 and Love It
publishDate: 2026-04-02T00:00:00.000Z
author: Chris Ward
categories:
  - writing
tags:
  - macOS
  - Audio
  - Stream Deck
image: articles/johnny-streamdeck.jpg
summary: >-
  macOS has always lacked a built-in way to route and mix audio on a per-application basis. Windows users have had per-app volume control for years, but on macOS, you need third-party tools to get anything close. I had been using a combination of SoundDesk, the Stream Deck MIDI plugin, and a Stream Deck plus with dials to solve this. The setup worked, but configuring it was fiddly. Then Elgato released Wave Link 3, and everything changed.
heroimage: articles/johnny-streamdeck.jpg
herotext: >-
  Elgato's Wave Link 3 is a game-changer for macOS audio routing.
---

macOS has always lacked a built-in way to route and mix audio on a per-application basis. Windows users have had per-app volume control for years, but on macOS, you need third-party tools to get anything close.

I had been using a combination of [SoundDesk](https://www.loudlab-app.com/sounddesk-app), the [Stream Deck MIDI plugin](https://marketplace.elgato.com/product/midi-b068a591-1a69-48fe-9206-b2d24762228b), and a [Stream Deck plus](https://www.elgato.com/us/en/p/stream-deck-plus) with dials to solve this. The setup worked, but configuring it was fiddly. Then Elgato released [Wave Link 3](https://www.elgato.com/us/en/s/downloads), and everything changed.

## The problem with macOS Audio

On macOS, controlling the volume of individual applications requires third-party tools. [Rogue Amoeba](https://rogueamoeba.com) makes solid tools for parts of this, including [Loopback](https://rogueamoeba.com/loopback/), [Audio Hijack](https://rogueamoeba.com/audiohijack/), and [SoundSource](https://rogueamoeba.com/soundsource/). I already use Loopback and Audio Hijack, so initially trying SoundSource made sense. SoundSource sits in the menu bar and lets you control per-application audio, but I couldn't get it to work well with physical controllers like the Stream Deck. You can control it with Apple's Shortcuts, which I could then tie to the Stream Deck, but it wasn't precise, required a lot of setup, and wouldn't persist app volume state.

At the time, I used a [Korg nanoKONTROL2](https://www.korg.com/us/products/computergear/nanokontrol2/) for various purposes, but I also wanted to use it to control audio volumes. Looking for something MIDI-controllable, I found [SoundDesk from Loud Lab](https://www.loudlab-app.com/).

## SoundDesk and the Stream Deck MIDI Plugin

Aimed at professional mixers and sound engineers who likely connect their Macs to external audio equipment, SoundDesk provides powerful per-app audio routing, device mixing and more. It supports Audio Units and VST plugins, and many routing configurations. With its virtual devices add-on, you can route application audio, meaning it crosses over with elements of Loopback, Audio Hijack, and SoundSource. But most crucially, it has support for Mackie, HUI, and MIDI control, making it a good candidate for integration with a wide variety of devices.

While I was still using the Korg NanoKontrol2, it made perfect sense. I could use it to send MIDI CC or Mackie Control messages to SoundDesk, changing various parameters of each channel. At a certain point, I replaced my old AKAI keyboard with a [Novation Launchkey 49](https://us.novationmusic.com/products/launchkey-49), which had many of the NanoKontrol2 controls built into it, so I sold that too. Using a gigantic keyboard to control app volume seemed a bit overkill, I saw the Stream Deck's dials sat before me, bought a second one and instead made use of the fantastic [Stream Deck MIDI plugin](https://marketplace.elgato.com/product/midi-b068a591-1a69-48fe-9206-b2d24762228b).

The MIDI plugin uses two virtual MIDI ports on macOS to communicate with devices, "StreamDeck2Daw" and "Daw2StreamDeck,". You set the SoundDesk MIDI input to "Daw2StreamDeck" and the output to "StreamDeck2Daw." You can create your own in the macOS Audio MIDI Setup app and use those instead.

The Stream Deck MIDI plugin handles MIDI CC (Control Change) messages, which you can use to control SoundDesk, and I used it specifically to control fader volumes for each channel of routed app audio. Each fader has a MIDI CC number, starting at 80. Fader one uses CC 80, fader two uses CC 81, and each next fader increments by one, all on MIDI channel 2. You then assign an application's audio to each channel, meaning that you can control it from SoundDesk.

While it took me a little while to figure out how to get it to work, once I figured it out, the setup was quick. I had my dials controlling podcast volume, music volume, Premiere Pro, and more.

There were some issues with the setup. Like LoopBack, SoundDesk creates virtual audio devices that you route your audio to instead. You have to remember to switch if you ever want more direct control of audio hardware. You can operate  SoundDesk's virtual devices add-on in "takeover" mode, meaning that when you open the application, it switches to the virtual device, and when you quit, it switches back to whatever you had selected before. However, there were still times when I couldn't get an application's audio to play through SoundDesk and quitting and re-opening some combination of the applications I was using would fix it.
%% TODO: Check and pictures %%
## What Elgato Wave Link 3 Does

[Wave Link](https://www.elgato.com/us/en/s/wave-link-app) is Elgato's free audio mixing and routing software. Version 3 is a significant update, rebuilt from the ground up with a new interface and a much broader feature set. It now works with any microphone or audio interface, not just Elgato hardware.

It basically replicates what I was trying to accomplish with SoundDesk. The simplicity of SoundSource but integrates with a Stream Deck.

Applications and hardware appear as input channels on the left of a routing matrix, and you route them to output mixes on the right. You can create up to five mixes, so you could have one for your headphones, one for streaming, one for recording, etc.

## Setting Up Wave Link with Stream Deck

Because Wave Link comes from Elgato, the Stream Deck integration is much tighter than anything else. The dedicated Wave Link Stream Deck plugin lets you assign application volume controls directly to controls, without any MIDI configuration. You pick the channel, the mix, and whether the dial controls the input volume or the mix volume.

No channel setup in _Audio MIDI Setup_, no MIDI CC numbers to look up, and no state reset issues. Moving the dial on the Stream Deck moves the volume in Wave Link, and the plugin reflects the current state in real time. You can also add VST and Audio Unit effects input and mix channels, including some from the Elgato Marketplace which you can also use in other audio applications.

I now have music, podcasts, Adobe Audition, and Premiere Pro each on their own dial, with a fifth dial controlling the mix output and audio levels show on the Stream Deck screens as well as on a handy menu bar icon where you can also change audio levels from.

## What Wave Link Doesn't Do

Unlike SoundDesk, Wave Link 3 gives you no manual control over audio quality, with no buffer size setting or sample rate. In practice, audio quality is fine, but if you need low-latency monitoring or precise buffer control, SoundDesk gives you more configuration options, and the nerd in me _would just like to know_.

I use an XLR microphone through an audio interface rather than an Elgato microphone. Microphone input control works in Wave Link, but I get duplication through the audio interface ([Arturia Minifuse 4](https://www.arturia.com/products/audio/minifuse/minifuse-4)) that I need to resolve. If you use an Elgato microphone or interface directly, this is probably not an issue.

You need to keep the Wave Link window open for routing to work, but this was the same with SoundDesk.

## Performance comparison

Audio routing uses a reasonable amount of CPU, but how much depends on a lot of factors. For a pretty similar setup with both applications, i.e., a handful of applications set to route, with reasonable audio quality, I found the following based on CPU usage, which doesn't mean much, but it's a metric:

- SoundDesk is consistently around 10% CPU
- Wave initially was around 30%, but then after a while dropped to about 10%, perhaps after an update. Wave has also glitched and crashed a couple of times.
## Which should you use?

If you want a simple, well-integrated way to route application audio on macOS and you have a Stream Deck, Wave Link 3 is a fairly obvious choice. It's free, the Stream Deck integration is seamless, and the setup is straightforward. CPU usage is reasonable, and audio quality suits content creation work.

If you need advanced routing, plugin support, or fine-grained audio quality control, SoundDesk remains a strong option. It's more powerful but more complex to configure, especially with physical controllers.

For my use case, controlling application volumes, Wave Link 3 handles everything I need, and I haven't even explored the different mix options yet. I have already paid for SoundDesk and have some live audio work coming up where it might come into its own. I shall wait and see.

[Wave Link 3](https://www.elgato.com/us/en/s/downloads) is free for macOS and Windows. [SoundDesk is available from Loud Lab](https://www.loudlab-app.com/) for macOS. [The Stream Deck MIDI plugin](https://marketplace.elgato.com/product/midi-b068a591-1a69-48fe-9206-b2d24762228b) is available in the Stream Deck Marketplace.