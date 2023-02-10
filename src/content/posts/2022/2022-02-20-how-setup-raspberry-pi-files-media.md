---

title: How I set up a RaspberryPi to share my files and media
publishDate: 2022-02-20
categories:
 - writing
 - chrischinchilla
tags: 
  - ebooks
  - calibre
  - nextcloud
  - minidnla
image: ~/assets/images/articles/raspberry-pi.jpeg

---

Over the past months, I've been slowly assembling a suite of self-hosted tools and services on a shiny new RaspberryPi 400, and finally, I think I am finished and ready to write up my experiences. At the least, it will help remind me what I have, but I hope it might also help others taking similar journeys.

_Updated on 20th February 2022 to include changes I added to the setup._

## Disclaimer

Blogs take time to write, and I hope this helps you. Some of the products here are affiliate links, but If you don't like affiliate links, but would still like to say thanks, subscribe to my [YouTube](https://www.youtube.com/channel/UCgnrx8qi4qhmN6sBebdDrmg) or [Twitch](https://www.twitch.tv/chrischinchilla) channel, or find [other ways to support me on my website](https://chrischinchilla.com/support/).

## Hardware - RaspberryPi 400

I chose a RapsberryPi 400 because of the built-in keyboard. I remember my experiments with a more traditional RaspberryPi in the past and found the short-term need for a keyboard annoying. Though I admit, I have used the keyboard (and mouse included in the package) probably for less than 5 minutes and am now happy with VNC and SSH connections for management Those concerns and changes of opinion aside, the 400 has been flawless, never had any memory or performance issues, and the only time I had any issues with it was when a cat sitter accidentally unplugged it.

I connected the 400 directly to my router via Ethernet, a [Fritz!Box 6490](https://en.avm.de/products/fritzbox/fritzbox-6490-cable/), which are feature-full and quite fantastic, but largely unavailable outside Europe. Plugged into the Pi is a [4TB Seagate Backup Plus](https://www.amazon.com/gp/product/B07CRGSR16/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gregamamma-20&creative=9325&linkCode=as2&creativeASIN=B07CRGSR16&linkId=1d4e8f90af6e656f102d088ed29b34ba) for archive data I don't access that much, and [a SanDisk Flash drive](https://www.amazon.com/gp/product/B015CH1PJU/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gregamamma-20&creative=9325&linkCode=as2&creativeASIN=B015CH1PJU&linkId=bb51abb12c16b056c820448c4dd1f6fc) for regularly accessed data, i.e., Nextcloud data (more on that later).

## Basic Raspbian setup

I didn't change much from the default [Raspbian](http://www.raspbian.org/) settings, but here's a few small things I changed after installation.

- Uninstalled packages I would never need, such as LibreOffice, etc.
- Enabled SSH and VNC, and disabled just about everything else I wasn't going to need, such as WiFi, Bluetooth, and audio.

## Allowing access across the internet

As I step through the various services in this post, to access them, you need to expose ports to the internet. How you do this depends a lot on your setup, and you should be aware of the prerequisites and security aspects of doing so.

My Fritzbox allows you to expose individual ports to devices and matching ports and configure an address online (with an unmemorable address which I guess makes it more secure 🤷‍♂️). If you want to, it also lets you set up an SSL certificate (but not in the most flexible way), a VPN, use a Dynamic DNS service, and more. I can't really show you what I did without giving away a bit too much detail about my setup, but exposing the ports was all I needed to do. Your setup may be more or less complex if you have a different router or need to route traffic through another service.

## Self-hosted cloud with Nextcloud

My initial intention with the RaspberryPi was to attempt to reduce my personal dependence on cloud-based file storage such as Dropbox or Google Drive. I'll sadly always need access to some of these for collaboration or some apps that only sync with them ([Looking at you Scrivener](https://scrivener.tenderapp.com/help/kb/cloud-syncing/using-scrivener-with-cloud-sync-services)!), but I want to reduce it as much as possible.

I can't remember how I ended up discovering it, but I ended up using the wonderful [NextCloudPi from Own your own bits](https://ownyourbits.com/nextcloudpi/). Finding the correct and/or best instructions to follow is a little confusing, and I feel like I chanced upon a random post somewhere that ended up being the easiest option. Whether my memory fails me now, I am not certain, but if you want to take a more organised approach, [follow the official documentation](https://docs.nextcloudpi.com/en/how-to-install-nextcloudpi/). I don't recall having any major issues, and the installer took a little time to download, install, and setup all dependencies that Nextcloud needs. Once it's installed, access the configuration interface via one of [the methods mentioned in the documentation](https://docs.nextcloudpi.com/en/how-to-access-nextcloudpi/); again, whichever option suits you varies.

NextcloudPi handled a lot of the configuration for me, but there's a couple of specific things worth bringing to attention or changing.

- Setting up the data directory for Nextcloud, which in my case was the USB drive, formatted to BTRFS.
- I automount all USB drives. I am uncertain if I need this enabled, but just in case.
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

I wanted a solution that was relatively easy to access on a local network and elsewhere. Preferably the same solution used the same way in both cases. This requirement ruled out [Samba](https://www.samba.org/) shares, as it's not designed for sharing across the internet. I looked at [NFS](<https://en.wikipedia.org/wiki/Network_File_System_(protocol)>), but encountered speed and reliability issues, and recent macOS support is poor with documented workaround to enable version 4 seemingly not working anymore.

So far I am most happy with using the curious [SSHFS](https://en.wikipedia.org/wiki/SSHFS), which allows you to mount directories across networks as an extension to the SSH protocol. It needs no extra components on server side, and I have found it performant and stable. On client side it needs some extra components, depending on your operating system. Unfortunately, on macOS, this requires installing the closed source [macFUSE](https://osxfuse.github.io), it used to be open source, and [recent decisions to become closed source have attracted much discussion](https://github.com/osxfuse/osxfuse/issues/616). This license change has also caused issues for projects that used to bundle macFUSE, including installing it with Homebrew.

Anyway, I digress. These issues aside, SSHFS works really well, and I have had next to no issues with speed or stability. If you're happy mounting and unmounting drives from the command line that is. If you are reading this post, then I assume you are, but I have been pondering the ways my not-so-happy-with-the-command-line partner could mount and unmount the drives. I haven't figured that out yet, so watch this space for updates. For more details on the commands to use, I have so far (bizarrely) found [this wiki page](https://igppwiki.ucsd.edu/display/igppwiki/Mounting+Network+Shares+with+SSHFS+on+macOS) from [the Institute of Geophysics and Planetary Physics ](https://www.igpp.ucsd.edu) the most useful guide, but a quick search finds many more.

So I didn't need to keep using a password, I set up password-less login using key pairs, [following these instructions](https://www.redhat.com/sysadmin/passwordless-ssh), and now this means I can mount drives with commands such as:

```shell
sshfs pi@{RASPBERRYPI_ADDRESS}:/media/Data/Calibre /Volumes/Calibre -o volname=Calibre
```

And unmount with:

```shell
umount /Volumes/Calibre
```

### Spinning down external drives when idle

One negative with hosting the media on an external hard drive is that it spins. I am a little obsessive with saving as much electricity as possible, and spinning drives are noisy. So I wanted to spin the drive down when nothing was accessing it, and spin it back up when something is. I am aware this could degrade the drive over time, but this was a compromise I was OK with.

Getting this to work took some time, and many of the recommendations I tried (including the classic “it should just work”) didn’t spin the drive down.

Finally, I got the new fork of [hd-idle](https://github.com/adelolmo/hd-idle) to work. I set it up as a service as detailed in the instructions, and added the following to _/etc/default/hd-idle_:

```shell
START_HD_IDLE=true

hd-idle -i 0 -a sda -i 1200
```

This sets the external drive to spin down after ten minutes of inactivity. So far it works flawlessly and I haven’t found any delay in mounting the drive across the network when waking the drive from idle.

## Sharing eBook libraries over the internet

Calibre is one of those tools with many issues, and every few months, you search for an alternative. But every time you search for an alternative, you can't find one and carry on making do with its esoteric ways. Walled garden ecosystem tools aside, it's basically the only option for eBook management, editing, serving, and more. I have cultivated multiple libraries containing gigabytes of eBooks, PDFs, CBZs, and mobi files for years, and they're precious to me. I wanted to find a way to offload these files to network storage, give my partner the ability to access them in their copy of Calibre, and be able to access them in reader applications (or elsewhere) via the [OPDS](https://opds.io) protocol.

I weighed up a variety of Calibre and OPDS aligned tools but eventually settled on just getting the [Calibre server](https://manual.calibre-ebook.com/server.html) component to work well for my aims. If you [install Calibre from Debian repositories](https://packages.debian.org/buster/calibre), it's two versions behind, and [the official method involves running a shell command](https://calibre-ebook.com/download_linux). For reasons I can't even remember now, I had issues with following the official steps (ARM processor maybe?) and stuck with the outdated version, experiencing no compatibility issues so far. I'll upgrade it at a later date.

Another caveat. Once you start searching around for options to sharing Calibre libraries, you generally encounter harsh warnings discouraging you from doing so, accompanied by workarounds to get it to kinda work. The setup I describe is mostly just me accessing the libraries, and while I intend my partner to access them too, it's unlikely we will ever access them at the same time and cause the issues Calibre warns against. As always, your mileage may vary, and the workarounds may work fine for you if you're careful.

Before I get into the solution, let me summarise the requirements, as that explains some of the decisions I made. When I refer to a "library", I mean the Calibre library file(s) as well as the actual folders and files, as this is where some of the complexity came in to play.

- One library that is my "current reads", I wanted this hosted in my personal Nextcloud sync folder so I could sync it to my Mac, as well as available via OPDS for reader application.
- Three other libraries that host comics, RPG books, and an archive of books we've read but want to keep somewhere. These libraries needed to be accessible in Calibre, network-mounted storage is fine, and available via OPDS.

I start with the three archive libraries as they are the simplest. They are spread across the various storage attached to the RaspberryPi, based on which I access the most frequently (USB drive for comics and RPGs, HDD for book archive). There are a bunch of CLI and GUI ways to add and manage libraries with Calibre, but because I am used to the GUI version, I created all the libraries there and pointed the libraries at the various folder locations.

The "current reads" library proved more problematic to get working as Nextcloud expects certain permissions on any storage it accesses. This includes those you set as "external storage", which is how I set up the folder so it could live outside of the main Nextcloud folder, and Calibre and OPDS could access it.

I followed [the local external storage documentation](https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/external_storage/local.html), but then ran into issues with using the permissions Nextcloud mentions, as then Calibre was unable to write metadata. I took the drastic step of giving full read and write permissions to make every application and service happy. I didn't face any issues with this approach, but there's probably some good reasons not to do it. I am not completely sure what other solution there might have been.

For the Calibre server to resume after restarts, it's best to add it as a service, and there are a lot of different instructions for this online, but I found these steps best for up-to-date versions or Raspbian.

Create a systemd service in _/etc/systemd/system/calibre-server.service_ with something like the following depending on what setup you want:

```shell
[Unit]
Description=calibre content server
After=network.target

[Service]
Type=simple
User={USER_NAME}
Group={GROUP_NAME}
ExecStart=calibre-server \
--port=8090 --enable-use-bonjour
--enable-local-write

[Install]
WantedBy=multi-user.target
```

Most of this I based on the instructions in [the Calibre Server docs](https://manual.calibre-ebook.com/server.html#id13), including the steps for enabling and starting the service. I couldn't find a full list of arguments for the `calibre-server` command, but using `--help` gets you started. I didn't specify a library path, which means the server loads all libraries I defined with the GUI. I changed the port to something that doesn't conflict with other services and enable [bonjour](https://developer.apple.com/bonjour/). I am not completely sure if bonjour works, but enabled it anyway. There's more I want to configure over time, [especially enabling user accounts](https://manual.calibre-ebook.com/server.html#id9), and/or SSL support.

That took care of the OPDS share, so what about when I want to connect to the libraries on my Mac? For this I mount the relevant drive hosted on the Pi with SSHFS and setup the library in my local copy of Calibre. When I am done, I unmount the drive. Depending on the file size, transfer speeds are reasonably fast, and I haven't experienced any disconnection issues so far.

### Securing Calibre

Initially I wasn’t too fussed about my Calibre libraries shared publicly over the internet, as they had no private or sensitive information, and the address was hard to guess anyway. Then someone pointed out to me that I could be accused of piracy if someone did find the collection, so I realised it was time to secure the libraries.

First I added [user authentication](https://manual.calibre-ebook.com/server.html#id9). You can do this from the Calibre UI, or on the command line, I used the UI.

And then I added the following lines to the service file from the step above:

```shell
--userdb /srv/calibre/users.sqlite --enable-auth \
--auth-mode auto \
```

Restart the service, and next time you access the Calibre library from the browser or 3rd party interface, it prompts for the account details.

Next I wanted to ensure Calibre was served over a secure connection. This was more complex as there’s no centralised source of documentation on how to do this. Here’s what I ended up doing.

Calibre server requires a path to the private key and the cert file set in the same service file:

```shell
--ssl-keyfile /home/pi/privkey.pem \
--ssl-certfile /home/pi/fullchain.pem
```

Creating those files is more involved, and I endlessly hit permissions issues, which is why I ended up creating copies of them in my home directory from the lets encrypt source files. I realise this will require manual updating when I renew the certificate, and need to find a better method eventually.

For the private key I copied with this command:

```shell
sudo cp /etc/letsencrypt/live/{PI_URL}/privkey.pem ~/
```

And then change the ownership to the appropriate user and group that runs Calibre server with `chown`.

Do the same for the cert file:

```shell
sudo cp /etc/letsencrypt/live/{PI_URL)/fullchain.pem ~/
```

Once again restart the service and it should now serve on a secure connection.

## Sharing movies and TV shows

I'm old, so I have an archive of ripped DVDs from when they were a thing. I don't watch them that much, but it's nice to have them around, especially as there are a lot of movies and TV shows that are hard to find on streaming services (legally). In the past, I had a Plex server setup, but it was a lot of overhead for something I didn't use much, and would frequently reset the library, or I would change network setups, and the library wouldn't work anymore, etc. I also found Plex's push for commercial versions got overwhelming, and my previous experiments with XBMC found it overly complex for non-technical users. You can install VLC or other apps (for example, our TV has one builtin) that can access media shared via [DLNA](https://www.lifewire.com/what-is-dlna-1847363) or [UPnP](https://nordvpn.com/blog/what-is-upnp/) on pretty much any device, so this time I kept it simple and used miniDLNA [using these instructions](https://pimylifeup.com/raspberrypi-minidlna/). DLNA and UPnP (in particular) can open a lot of security risks, but it's only for local network usage, so I was mostly OK with using it. If I want to watch something stored on the RaspberryPi when not at home, Instead I connect to the relevant network drive, download the file, and watch locally. I tested connecting to the DLNA share from Android, our TV, and macOS, and all worked well.

miniDLNA needs a configuration file at _ /etc/minidlna.conf_. I didn’t add much to it apart from the location of my media files and the network name for the server:

```shell
media_dir=V,/{FILE_PATH}/Movies
media_dir=V,/{FILE_PATH}/TV Shows
friendly_name=raspberrypi
```

I found over time that miniDLNA would fail to start as the external drive that it relies on for media wasn’t mounted yet. Again this took some trial and error to fix, but I ended up adding the following to the default service configuration in the `[Unit]` section:

```shell
[Unit]
After=udisks2.service
```

Which means that miniDLNA waits until the disk service has completed before starting.

I also repeatedly hit permissions issues with miniDNLA accessing the files (though inconsistently), so against my better judgement I switched the service user in _ /lib/systemd/system/minidlna.service_ to root:

```shell
[Service]
Type=forking
User=root
```

This fixed those issues, and as I only access miniDNLA on the internal network, I felt OK with it.

## Remote admin

Sure, accessing the Pi over SSH is fine, but I like an admin UI for quick monitoring or other tasks. I can’t remember where I first heard of it, but [Cockpit](https://cockpit-project.org) fit the bill perfectly.

I installed with:

```shell
sudo apt install cockpit
```

I don’t recall doing much else, so I think the default configuration and service setup worked fine for me.

As Cockpit is an admin tool, it should run over a secure connection, and again I needed to move some lets encrypt files to additional locations using the following commands:

```shell
cat /etc/letsencrypt/live/{PI_DOMAIN}/fullchain.pem >> /etc/cockpit/ws-certs.d/1-my-cert.cert
```

```shell
cat /etc/letsencrypt/live/{PI_DOMAIN}/privkey.pem >> /etc/cockpit/ws-certs.d/1-my-cert.cert
```

You need to do this every time the certificate gets renewed, so again, I’d like to find a way to automate this.

## Pi punch

And that's it for now. It's taken a lot of time and experimentation to get to this point, and now I review the post it doesn't seem like much at all, but that's frequently the way with technology. I've tested the setup(s) at home, in Berlin, and when travelling, and have so far had no issues, variable speeds aside. I am still figuring out the best ways to make everything accessible to my partner, and that's something for future posts. That said I have been using Nextcloud to send files to clients and other external parties, and once I solved the SSL issue, that has also worked well.
