---
title: 6 tools for running Windows & Linux on macOS
publishDate: 2024-08-07T00:00:00.000Z
author: Chris Ward
categories:
  - writing
tags:
  - Emulation
  - Virtualization
  - Containers
image: articles/6-tools.jpg
summary: >-
  I've been happily using [Parallels Desktop][1] for my Windows and Linux
  virtual machine needs for about the past three years. It's performant,
  supports a reasonable variety of guest operating systems, and, with some
  tweaks, can also run headless developer machines and Kubernetes clusters.
---

I've been happily using [Parallels Desktop][1] for my Windows and Linux virtual machine needs for about the past three years. It's performant, supports a reasonable variety of guest operating systems, and, with some tweaks, can also run headless developer machines and Kubernetes clusters.

However, times are financially lean, so every time I see that recurring fee approaching, I wonder if there are any alternatives. With [VMware making Fusion Pro free for personal use in May][2], it seemed a good time to survey the desktop emulation landscape.

## Emulation, virtualisation, compatibility layers…

Before I begin, I want to clarify some of the terminology the tools I cover use and what they mean. Not every tool for running Windows and other operating systems works the same way, or they use different terminology to mean the same thing.

- **Virtual machine**: A virtual representation of a computer system you install an operating system onto.
  - Some use native architecture and virtualisation, e.g., running the Arm version of Windows on an Apple Silicon Mac.
  - Others emulate architecture, i.e. running the Intel version of Windows on an Apple Silicon Mac.
- **Compatibility layer**: The other main tool grouping, all based on [Wine][3]. Instead, uses a "compatibility layer" to translate Windows API calls to POSIX calls for UNIX-like POSIX compatible operating systems, which includes Linux and macOS (well, post MacOS 9 anyway).
- **Containers**: This is a post aimed mainly at end users and not developer users, but as some of the tools in the list also allow you to run containers, it's worth quickly explaining what they are. You can think of them as minimal virtual machines that contain just what's needed to run a particular task, with a shared common framework that the tool provides. Docker is perhaps the best-known option for running containers, but many other tools also offer the possibility.

Those are the main groupings and terms you're likely to hear, but there are a few other smaller tools and terms you might see or hear that are somewhat connected, such as Apple's game porting kit. It is designed for developers to port Windows code to macOS, but you can also use it to run games directly and evaluate performance.

OK then, with that out the way, let's get started.!

<!-- youtube:RsnSfp5JTKg -->

## What I'm looking for

Unless you're trying to use 3D rendering or video production applications, almost all options work fine with simpler and less impactful Windows applications. For example, accounting software, or I have a game scenario editing tool that only works with Windows.

So, instead, I decided to push the tool harder to test it by using two games. These aren't exactly the latest games, but they're two of the games I play regularly, so I know how they should feel when running them natively on macOS. Also, I think they are enough of a test. These games are:

- Divinity Original Sin 2
- Civilization 6

In both cases, they are the Steam version.

As part of this evaluation, I looked at the following aspects of each option:

- Price
- Compatibility with Apple Silicon
- Performance, based loosely on the following:
  - CPU usage
  - Fan activity
  - "Feelings" of sluggishness
- Simplicity for changing settings
- Other non-Windows machine options
- Other miscellaneous features

## Getting images

For virtual machine-based tools, you need an image of the operating system. Some tools provide ways to get this for you, and Linux is generally easy to find, though the ARM versions are typically slightly harder. Windows, however, is harder, especially for the ARM version. During my testing, I came across [CrystalFetch][4], which makes it much easier to download Windows in different architectures and versions.

## Parallels Desktop

I have to begin with what I currently use, [Parallels Desktop][5]. Aside from the large dozens of gigabytes file on my hard drive, which has nothing to do with Parallels but Windows, I have never had any problems or major performance issues with Parallels. My main negative is the occasional spammy notification telling me about other products, and while the recent focus on developer tools is useful, they are buggy and poorly supported.

One nice feature would be a larger range of supported operating systems in the gallery you see on machine creation and, thus, tools to support them more seamlessly.

### Parallels Desktop summary

- Apple Silicon native
- **Performance**: Excellent
  - 180 - 280% of CPU (using game mode)
- **Configuration**: Good
- **Other OSs**: Good
  - I have run macOS, Ubuntu, Red Hat, and BSD
- **Features**: Excellent
  - Headless and Kubernetes
  - Shared clipboard
  - macOS keyboard shortcuts
  - Profiles
- **Price**: Good
  - €99 - 149 per year
  - I have the Pro edition (€119), which, according to the feature list, is needed to run "graphics-intensive" applications such as games.

## VMWare Fusion

[VMware's post that Fusion is now free for personal use][6] sparked this thought process. Maybe Broadcomm's recent acquisition prompted the change, or perhaps the company considers it a "gateway product" to bigger and more lucrative options. The corporate nature of Broadcom and VMware makes it a hellish experience to jump through the umpteen account creation steps to try and download it. Pro tip: if you use Homebrew, [you can install it with that][7] and bypass all of them 😌.

That aside, the performance overall was good. Strangely, downloading and installing was slower than with Parallels, and creating additional disk space was complicated. Showing its VMware heritage, it also has features for use with containers and Kubernetes.

### VMware Fusion summary

- Apple Silicon native
- **Performance**: Excellent
  - 150 - 320% of CPU
- **Configuration**: Average
- **Other OSs**: Average
  - Linux support
- **Features**: Good
  - Containers and Kubernetes
  - Shared clipboard
  - macOS keyboard shortcuts
- **Price**: Excellent
  - Free

## Virtualbox

Traditionally, [Virtualbox][8] was the typical option for anyone looking for a free way to virtualise operating systems. However, it only works on x86 systems, so it is not good for Apple Silicon users.

## Qemu and UTM

Almost as venerable as Virtualbox is [QEMU][9], which is both a virtualiser and an emulator, so is flexible and many other tools use it under the hood. This, combined with its primarily command line interface, means that it's also complex to use, which brings us to [UTM][10].

You can think of UTM as a frontend for QEMU, but it also adds some other tweaks to improve the experience. It's open source, and highly configurable, and you can run many different operating systems, including classic MacOS and Amiga OS to Windows XP, should you want to. It's fiddly and can involve searching documentation and forums to get everything working, but conceptually, I love it.

Yes, there's a "but." You can't run any games that require 3D acceleration on Windows. However, it's open source, so naturally, work is in progress, and if you're not interested in games or want to run something other than Windows, then it could be ideal.

### QEMU and UTM summary

- Apple Silicon native
- **Performance**: Poor for games, good for general use
  - 150 - 300% of CPU
- **Configuration**: Excellent
- **Other OSs**: Excellent
  - Windows, Linux, macOS, and more
- **Features**: Good
  - Shared clipboard
  - macOS keyboard shortcuts
  - Scripting
  - Headless option
- **Price**: Excellent
  - Free

## Wine

Time to enter the "compatibility layer" world of [Wine][11], which has also been around for a long time and, I think, is more popular on Linux than macOS. Anything using Wine works with Apple's Rosetta to emulate an x86 architecture, and I couldn't find any mention if this was something likely to change in the future or not. I think it is because most people use Wine to run Windows applications. Windows is just starting to push its ARM support, so Wine will catch up when there's enough critical mass.

Whilst I never had any real issues getting the two games to work under Windows for ARM with Parallels and VMware Fusion, using x86 "Windows", I guess, means you have a large selection of software available to you.

Wine and anything that uses it stores all Windows-related files in the macOS Finder, which I like, but it is odd to see them there. Conceptually, I like the semi-seamless nature, but I ran into several specific problems and general stability issues.

Most crucially, I was unable to get either of my test games to run. As I got them to run in other Wine-based options in this article, it could be a configuration issue or that the developers of the other applications added something to make games possible.

### Wine summary

- Runs in Rosetta
- **Performance**: Unable to test
- **Configuration**: Good
- **Other OSs**: Poor
  - Windows only
- **Features**: Average
  - System Integration
  - macOS keyboard shortcuts (with configuration)
- **Price**: Excellent
  - Free

## Crossover

Codeweavers makes [Crossover][12] and is one of the main maintainers behind Wine, so you can think of Crossover as a front end to and a commercial version of Wine. It adds some polish to the Wine experience, including different options for 3D graphics and controllers and better configuration surfacing.

However, I still found it unstable and buggy at times, with occasions where it wasn't clear what was happening or the state of running applications. There may be some configuration I could change, but I had a lot of problems with what screen any Wine-based application would use. Every time I launched an application, it wouldn't open on the active screen, which made video capture particularly annoying. The biggest issue I found was that sometimes switching between macOS and CrossOver windows would cause unresponsive windows in Crossover. Because of this, I was unable to test running Civilization 6. But Divinity Original Sin 2 ran well.

### Crossover summary

- Runs in Rosetta
- **Performance**: Mixed (Very good to non-functional)
  - 50 - 200%
- **Configuration**: Good
- **Other OSs**: Poor
  - Windows only
- **Features**: Average
  - System Integration
  - macOS keyboard shortcuts (with configuration)
- **Price**: Good
  - €74 per version or €484 lifetime

## Whisky

I had a lot of hope for [Whisky][13] as it combines Wine with [Apple's game porting kit][14] and is designed and optimised for games. It's also a far more modern macOS application, following a lot of Apple's best practices and aiming for an experience where no one needs to use a CLI unless they want to. It's almost as user-friendly and performant as Crossover, but it's free and open-source.

Most of the small issues I had were the same as any of the other Wine-derived options here, with windows opening on different screens, some instability etc. However, my biggest issue was that I couldn't install Civilization 6. The process always got stuck at around 60%, and I have no idea why. This led to me finding that knowing when Whisky or Wine (yes, as a fan of both, I love the names) had fully shut down is difficult. I frequently had to force quit all processes, delete the hard drive folder (which fortunately with Wine is easy) and try over and over again.

However, I had no issues with Divinity Original Sin 2, and in fact, it worked really well.

### Whisky summary

- Runs in Rosetta, though the main application is Apple Silicon
- **Performance**:
  - 100 - 200%
- **Configuration**: Good
- **Other OSs**: Poor
  - Windows only
- **Features**: Average
  - System Integration
  - macOS keyboard shortcuts (with configuration)
  - CLI tool
- **Price**: Excellent
  - Free

## Play on Mac

An older equivalent to Crossover and Whisky, I tried installing and using [Play on Mac][15], but with no visible activity in two years, I am not sure it's still active and couldn't get it to work. Maybe it works on Intel mac still.

## Will I switch

So, I have arrived at the inevitable conclusion. Will I stick with Parallels or switch to something else?

I love the idea behind the Wine-based tools. It feels tidier to me, and with the files directly visible on my hard drive, I like that I can dig into them and move and delete them if I want to. However, even with a minimal installation, the Windows support files still take up gigabytes of space. I also frequently need Linux machines for testing, so this means that I still need a second tool for that purpose, which brings me to deciding between the virtual machine tools.

Keeping UTM and QEMU around for the occasional obscure operating system need takes up minimal space. A handful of more developer-focused tools for running containers and other types of pseudo-virtual machines often install and use QEMU anyway, so there's a chance you have it installed without realising it. If it ends up supporting games and performing well, then I think this is a big deal and would make it an ideal option.

But in the meantime it brings me to weigh up Parallels and Fusion. Whilst Fusion doesn't feel as polished, it's a much better price, and its options for using it with containers and Kubernetes are more mature than Parallels. I imagine this new competition is why Parallels has pushed the new developer features recently. For example, its driver for Minikube (an option for running Kubernetes locally) has numerous issues and its extension for launching virtual machines in Visual Studio Code (something Fusion doesn't have) endlessly has issues.

In recent months I bought a mini PC for testing and benchmarking. It primarily runs Linux, but came with Windows, so there's also a bit of me that wonders if I even need a Windows virtual machine eating up drive space anymore. So, if that requirement is becoming less necessary for me, a free option looks even more attractive.

[1]: https://www.parallels.com
[2]: https://blogs.vmware.com/teamfusion/2024/05/fusion-pro-now-available-free-for-personal-use.html
[3]: https://www.winehq.org
[4]: https://github.com/TuringSoftware/CrystalFetch
[5]: https://www.parallels.com/products/desktop/pro/
[6]: https://blogs.vmware.com/teamfusion/2024/05/fusion-pro-now-available-free-for-personal-use.html
[7]: https://formulae.brew.sh/cask/vmware-fusion
[8]: https://www.virtualbox.org
[9]: https://www.qemu.org
[10]: https://getutm.app/
[11]: https://www.winehq.org
[12]: https://www.codeweavers.com/crossover
[13]: https://getwhisky.app
[14]: https://developer.apple.com/games/game-porting-toolkit/
[15]: https://www.playonmac.com/
