---
layout: post
title: How I set up a RaspberryPi to share my files and media
created_at: 2021-09-28
categories: writing chrischinchilla
tags: 
  - ebooks
  - calibre
  - nextcloud
  - minidnla
image: images/raspberry-pi.jpeg
layout: post
---

Over the past months, I've been slowly assembling a suite of self-hosted tools and services on a shiny new RaspberryPi 400, and finally, I think I am finished and ready to write up my experiences. At the least, it will help remind me what I have, but I hope it might also help others taking similar journeys.


## Disclaimer

Blogs take time to write, and I hope this helps you. Some of the products here are affiliate links, but If you don't like affiliate links, but would still like to say thanks, subscribe to my [YouTube](https://www.youtube.com/channel/UCgnrx8qi4qhmN6sBebdDrmg) or [Twitch](https://www.twitch.tv/chrischinchilla) channel, or find [other ways to support me on my website](https://chrischinchilla.com/support/).

## Hardware - RaspberryPi 400

I chose a RapsberryPi 400 because of the built-in keyboard. I remember my experiments with a more traditional RaspberryPi in the past and found the short-term need for a keyboard annoying. Though I admit, I have used the keyboard (and mouse included in the package) probably for less than 5 minutes and am now quite happy with VNC and SSH connections for management, and considering swapping it for another RaspberryPi with a smaller footprint. Those concerns and changes of opinion aside, the 400 has been flawless, never had any memory or performance issues, and the only time I had any issues with it was when a cat sitter accidentally unplugged it.

I connected the 400 directly to my router via Ethernet, a [Fritz!Box 6490][1], which are feature-full and quite fantastic, but largely unavailable outside Europe. Plugged into the Pi is a [4TB Seagate Backup Plus][2] for archive data I don't access that much, and [a SanDisk Flash drive][3] for regularly accessed data, i.e., Nextcloud data (more on that later).

## Basic Raspbian setup

I didn't change much from the default [Raspbian](http://www.raspbian.org/) settings, but here's a few small things I changed after installation.

- Uninstalled packages I would never need, such as LibreOffice, etc.
- Enabled SSH and VNC, and disabled just about everything else I wasn't going to need, such as WiFi, Bluetooth, and audio.
- I installed [Cockpit][4], a convenient browser-based interface to manage services, logs, updates, and more on a Linux machine.

## Allowing access across the internet

As I step through the various services in this post, to access them, you need to expose ports to the internet. How you do this depends a lot on your setup, and you should be aware of the prerequisites and security aspects of doing so.

My Fritzbox allows you to expose individual ports to devices and matching ports and configure an address online (with an unmemorable address which I guess makes it more secure 🤷‍♂️). If you want to, it also lets you set up an SSL certificate (but not in the most flexible way), a VPN, use a Dynamic DNS service, and more. I can't really show you what I did without giving away a bit too much detail about my setup, but exposing the ports was all I needed to do. Your setup may be more or less complex if you have a different router or need to route traffic through another service.

## Self-hosted cloud with Nextcloud

My initial intention with the RaspberryPi was to attempt to reduce my personal dependence on cloud-based file storage such as Dropbox or Google Drive. I'll sadly always need access to some of these for collaboration or some apps that only sync with them ([Looking at you Scrivener][5]!), but I want to reduce it as much as possible.

I can't remember how I ended up discovering it, but I ended up using the wonderful [NextCloudPi from Own your own bits][6]. Finding the correct and/or best instructions to follow is a little confusing, and I feel like I chanced upon a random post somewhere that ended up being the easiest option. Whether my memory fails me now, I am not sure, but if you want to take a more organised approach, [follow the official documentation][7]. I don't recall having any major issues, and the installer took a little time to download, install, and setup all dependencies that Nextcloud needs. Once it's installed, access the configuration interface via one of [the methods mentioned in the documentation][8]; again, whichever option suits you varies.

NextcloudPi handled a lot of the configuration for me, but there's a couple of specific things worth bringing to attention or changing.

- Setting up the data directory for Nextcloud, which in my case was the USB drive, formatted to BTRFS.
- I automount all USB drives. I am not sure if I need this enabled, but just in case.
- I enabled the Web UI. I like UIs 😁.
- I forced HTTPS. I think this is essential when making the instance public.
- I activated "pretty URLs", _index.php_ in URLs is so early 2000s.
- I have the RaspberryPi on a static IP address, so I enabled that in NextcloudPi too.
- I have most of the autoupdate features enabled.

## SSL Certificates

So I can access the domain over HTTPS across the internet, I initially used the configuration option provided by NextcloudPi, but as I also needed an SSL certificate for other subdomains on the domain provided by Fritzbox, I ended up using [Let's Encrypt with certbot](https://certbot.eff.org/instructions), following instructions in their documentation.

If you only need SSL for Nextcloud, then using the feature is probably enough for you.

## File sharing over the internet

I wanted to share two other folder and file locations across my internal network as well as the internet. The first is a large archive of miscellaneous data from across my years of computer use, and a couple of large [Calibre](https://calibre-ebook.com/) libraries that contain things like RPG books and comics, i.e., several GBs in size each.

I wanted a solution that was relatively easy to access on a local network and elsewhere. Preferably the same solution used the same way in both cases. This requirement ruled out [Samba](https://www.samba.org/) shares, as it's not designed for sharing across the internet. I looked at [NFS](https://en.wikipedia.org/wiki/Network_File_System_(protocol)), but encountered speed and reliability issues, and recent macOS support is poor with documented workaround to enable version 4 seemingly not working anymore.

So far I am most happy with using the curious [SSHFS][9], which allows you to mount directories across networks as an extension to the SSH protocol. It needs no extra components on server side, and I have found it performant and stable. On client side it needs some extra components, depending on your operating system. Unfortunately, on macOS, this requires installing the closed source [macFUSE][10], it used to be open source, and [recent decisions to become closed source have attracted much discussion][11]. This license change has also caused issues for projects that used to bundle macFUSE, including installing it with Homebrew.

Anyway, I digress. These issues aside, SSHFS works really well, and I have had next to no issues with speed or stability. If you're happy mounting and unmounting drives from the command line that is. If you are reading this post, then I assume you are, but I have been pondering the ways my not-so-happy-with-the-command-line partner could mount and unmount the drives. I haven't figured that out yet, so watch this space for updates. For more details on the commands to use, I have so far (bizarrely) found [this wiki page][12] from [the Institute of Geophysics and Planetary Physics ][13] the most useful guide, but a quick search finds many more.

So I didn't need to keep using a password, I set up password-less login using key pairs, [following these instructions][14], and now this means I can mount drives with commands such as:

```shell
sshfs pi@{RASPBERRYPI_ADDRESS}:/media/Data/Calibre /Volumes/Calibre -o volname=Calibre
```

And unmount with:

```shell
umount /Volumes/Calibre
```

## Sharing eBook libraries over the internet

Calibre is one of those tools with many issues, and every few months, you look for an alternative. But every time you look for an alternative, you can't find one and carry on making do with its esoteric ways. Walled garden ecosystem tools aside, it's basically the only option for eBook management, editing, serving, and more. I have cultivated multiple libraries containing gigabytes of eBooks, PDFs, CBZs, and mobi files for years, and they're precious to me. I wanted to find a way to offload these files to network storage, give my partner the ability to access them in their copy of Calibre, and be able to access them in reader applications (or elsewhere) via the [OPDS](https://opds.io) protocol.

I weighed up a variety of Calibre and OPDS aligned tools but eventually settled on just getting the [Calibre server](https://manual.calibre-ebook.com/server.html) component to work well for my aims. If you [install Calibre from Debian repositories][15], it's two versions behind, and [the official method involves running a shell command][16]. For reasons I can't even remember now, I had issues with following the official steps (ARM processor maybe?) and stuck with the outdated version, experiencing no compatibility issues so far. I'll upgrade it at a later date.

Another caveat. Once you start searching around for options to sharing Calibre libraries, you generally encounter harsh warnings discouraging you from doing so, accompanied by workarounds to get it to kinda work. The setup I describe is mostly just me accessing the libraries, and while I intend my partner to access them too, it's unlikely we will ever access them at the same time and cause the issues Calibre warns against. As always, your mileage may vary, and the workarounds may work fine for you if you're careful.

Before I get into the solution, let me summarise the requirements, as that explains some of the decisions I made. When I refer to a "library", I mean the Calibre library file(s) as well as the actual folders and files, as this is where some of the complexity came in to play.

- One library that is my "current reads", I wanted this hosted in my personal Nextcloud sync folder so I could sync it to my Mac, as well as available via OPDS for reader application.
- Three other libraries that host comics, RPG books, and an archive of books we've read but want to keep somewhere. These libraries needed to be accessible in Calibre, network-mounted storage is fine, and available via OPDS.

I start with the three archive libraries as they are the simplest. They are spread across the various storage attached to the RaspberryPi, based on which I access the most frequently (USB drive for comics and RPGs, HDD for book archive). There are a bunch of CLI and GUI ways to add and manage libraries with Calibre, but because I am used to the GUI version, I created all the libraries there and pointed the libraries at the various folder locations.

The "current reads" library proved more problematic to get working as Nextcloud expects certain permissions on any storage it accesses. This includes those you set as "external storage", which is how I set up the folder so it could live outside of the main Nextcloud folder, and Calibre and OPDS could access it.

<!-- IMAGE -->

I followed [the local external storage documentation][17], but then ran into issues with using the permissions Nextcloud mentions, as then Calibre was unable to write metadata. I took the drastic step of giving full read and write permissions to make every application and service happy. I didn't face any issues with this approach, but there's probably some good reasons not to do it. I am not completely sure what other solution there might have been.

For the Calibre server to resume after restarts, it's best to add it as a service, and there are a lot of different instructions for this online, but I found these steps best for up to date versions or Raspbian.

Create a systemd service in _/etc/systemd/system/calibre-server.service_ with something like the following depending on what setup you want:

```
[Unit]
Description=calibre content server
After=network.target

[Service]
Type=simple
User={USER_NAME}
Group={GROUP_NAME}
ExecStart=calibre-server \
--port=8090 --enable-use-bonjour

[Install]
WantedBy=multi-user.target
```

Most of this I based on the instructions in [the Calibre Server docs][18], including the steps for enabling and starting the service. I couldn't find a full list of arguments for the `calibre-server` command, but using `--help` gets you started. I didn't specify a library path, which means the server loads all libraries I defined with the GUI. I changed the port to something that doesn't conflict with other services and enable [bonjour][19]. I am not completely sure if bonjour works, but enabled it anyway. There's more I want to configure over time, [especially enabling user accounts][20], and/or SSL support.

That took care of the OPDS share, so what about when I want to connect to the libraries on my Mac? For this I mount the relevant drive hosted on the Pi with SSHFS and setup the library in my local copy of Calibre. When I am done, I unmount the drive. Depending on the file size, transfer speeds are reasonably fast, and I haven't experienced any disconnection issues so far.

## Sharing movies and TV shows

I'm old, so I have an archive of ripped DVDs from when they were a thing. I don't watch them that much, but it's nice to have them around, especially as there are a lot of movies and TV shows that are hard to find on streaming services (legally). In the past, I had a Plex server setup, but it was a lot of overhead for something I didn't use much, and would frequently reset the library, or I would change network setups, and the library wouldn't work anymore, etc. I also found Plex's push for commercial versions got overwhelming, and my previous experiments with XBMC found it overly complex for non-technical users. You can install VLC or other apps (for example, our TV has one builtin) that can access media shared via [DLNA][21] or [UPnP][22] on pretty much any device, so this time I kept it simple and used minidlna [using these instructions][23]. DLNA and UPnP (in particular) can open a lot of security risks, but it's only for local network usage, so I was mostly OK with using it. If I want to watch something stored on the RaspberryPi when not at home, Instead I connect to the relevant network drive, download the file, and watch locally. I tested connecting to the DLNA share from Android, our TV, and macOS, and all worked well.

## Pi punch

And that's it for now. It's taken a lot of time and experimentation to get to this point, and now I review the post it doesn't seem like much at all, but that's frequently the way with technology. I've tested the setup(s) at home, in Berlin, and when travelling, and have so far had no issues, variable speeds aside. I am still figuring out the best ways to make everything accessible to my partner, and that's something for future posts. That said I have been using Nextcloud to send files to clients and other external parties, and once I solved the SSL issue, that has also worked well.

[1]:	https://en.avm.de/products/fritzbox/fritzbox-6490-cable/
[2]:	https://www.amazon.com/gp/product/B07CRGSR16/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gregamamma-20&creative=9325&linkCode=as2&creativeASIN=B07CRGSR16&linkId=1d4e8f90af6e656f102d088ed29b34ba
[3]:	https://www.amazon.com/gp/product/B015CH1PJU/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gregamamma-20&creative=9325&linkCode=as2&creativeASIN=B015CH1PJU&linkId=bb51abb12c16b056c820448c4dd1f6fc
[4]:	https://cockpit-project.org
[5]:	https://scrivener.tenderapp.com/help/kb/cloud-syncing/using-scrivener-with-cloud-sync-services
[6]:	https://ownyourbits.com/nextcloudpi/
[7]:	https://docs.nextcloudpi.com/en/how-to-install-nextcloudpi/
[8]:	https://docs.nextcloudpi.com/en/how-to-access-nextcloudpi/
[9]:	https://en.wikipedia.org/wiki/SSHFS
[10]:	https://osxfuse.github.io
[11]:	https://github.com/osxfuse/osxfuse/issues/616
[12]:	https://igppwiki.ucsd.edu/display/igppwiki/Mounting+Network+Shares+with+SSHFS+on+macOS
[13]:	https://www.igpp.ucsd.edu
[14]:	https://www.redhat.com/sysadmin/passwordless-ssh
[15]:	https://packages.debian.org/buster/calibre
[16]:	https://calibre-ebook.com/download_linux
[17]:	https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/external_storage/local.html
[18]:	https://manual.calibre-ebook.com/server.html#id13
[19]:	https://developer.apple.com/bonjour/
[20]:	https://manual.calibre-ebook.com/server.html#id9
[21]:	https://www.lifewire.com/what-is-dlna-1847363
[22]:	https://nordvpn.com/blog/what-is-upnp/
[23]:	https://pimylifeup.com/raspberrypi-minidlna/