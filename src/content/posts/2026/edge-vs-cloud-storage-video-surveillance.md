---
title: 'Edge vs cloud storage for video surveillance - where should the data live?'
publishDate: 2026-10-28T09:00:00.000Z
author: Chris Ward
categories:
  - tech
image: articles/edge-vs-cloud-video-storage.png
tags:
  - Storage
  - Cloud
  - Edge Computing
  - Security
  - Video
summary: >-
  Edge, cloud or hybrid? How to decide where surveillance video should live, covering data volumes, bandwidth, retention, cost, security, and what happens when the network goes down.
---

Video surveillance systems generate more data than ever. Organisations deploy higher-resolution cameras, keep footage for longer, and cover more buildings and locations. The storage question is less about buying a bigger hard drive, and more about where video should live, how quickly you need it, and what happens when a network or device fails.

Genetec's 2026 State of Physical Security report analysed responses [from 7,368 security professionals worldwide](https://www.genetec.com/press-center/press-releases/2025/12/genetec-releases-2026-global-state-of-physical-security-report) and found continued momentum toward hybrid-cloud infrastructure. The previous year's research found that 43% of end users expected hybrid deployments to be their preferred model within five years, compared with 18% favouring fully cloud-based systems. It also found that 41% had slowed cloud adoption because of storage, retention, and bandwidth costs.

Traditional on-site recorders offer control and predictable local access, but capacity, hardware maintenance, and multi-site management get difficult as camera networks grow. Pure cloud models solve some of those problems, but add bandwidth dependency and recurring storage costs.

So the real question isn't whether edge or cloud is better. It's which video, workloads, and retention periods belong in each.

## Storage is a workload decision

Older surveillance setups were simple. Cameras sent footage to a network video recorder (NVR) or server in the same building, and security staff reviewed recordings from there after an incident.

Modern environments are more complicated. Video may need to support real-time monitoring, remote investigations, AI analytics, incident sharing, regulatory retention, and long-term evidence preservation. One organisation may also run dozens or hundreds of locations, each with different network conditions.

That changes how you design storage. Recent footage that staff review often benefits from staying close to the camera for quick retrieval. Important incident video may need copying elsewhere, so the evidence survives theft, fire, hardware failure, or damage to an on-site recorder.

Data volume makes this more significant. A camera continuously streaming at an average of 4 Mbps produces roughly 43 GB of video per day, or about 1.3 TB over 30 days. A 100-camera deployment at the same bitrate generates around 130 TB a month, before redundancy, metadata, backups, or other overhead.

Your storage architecture has to account for that scale, rather than treating every stream identically.

## Where edge storage still wins

Edge storage keeps footage close to where it's generated. That might be storage inside the camera, an on-site appliance, or another local device on the camera network.

Its biggest advantage is independence from the wide-area network. A warehouse, factory, school, or remote site keeps recording when its internet connection drops. Where connectivity is patchy, sending every second of high-resolution video to a remote data centre adds operational risk.

Local storage also reduces upstream bandwidth. Instead of sending full-quality streams to the cloud all the time, a system can keep high-resolution footage locally and send only selected clips, events, metadata, or lower-bandwidth streams.

Latency matters too. If someone needs to check what happened two minutes ago, pulling the video from a local appliance beats retrieving a large file across an external network.

Edge storage has limits, though. Drives fill up, hardware fails, and appliances need maintenance. Storage also has to grow with the camera network. A company expanding from 50 to 300 cameras may find the recorder it chose originally no longer has enough capacity.

Physical location is a risk as well. If the only copy of critical footage sits in the facility where the incident happened, losing the recorder can mean losing the evidence.

## How cloud storage changes the model

Cloud architectures flip this around. Instead of every site maintaining its own long-term storage, you store footage or selected video data remotely and access it through a central system. That helps most with many offices, shops, schools, or warehouses.

Remote storage also separates the recording location from the retained evidence. If an on-site recorder is damaged, stolen, or fails, cloud copies of uploaded footage stay available. Administrators can also manage retention consistently, rather than configuring storage separately at every site.

If you're looking at [cloud storage for video surveillance](https://www.coram.ai/post/best-cloud-storage-for-security-cameras), Coram is one example of a hybrid model. According to its cloud storage guide, the platform combines local and cloud storage, supports retention from 30 to 365 days, allows custom retention policies, and offers AI-powered search to find particular events, objects, or people without reviewing hours of footage.

The benefit isn't just moving video off-site. It's a storage layer you can manage across locations, while still deciding which footage needs immediate local availability and which benefits from remote retention.

That distinction matters because sending everything to the cloud isn't automatically efficient. Continuous high-resolution video can use a lot of upstream bandwidth, especially with hundreds or thousands of cameras.

## Why hybrid is the practical middle ground

The debate increasingly points to a third answer: use both, according to the workload.

A hybrid design might keep several days or weeks of continuous high-resolution recording on-site, and preserve important events or longer-term archives in the cloud. Another might process video locally, send alerts and metadata to a central platform, and upload full footage only when an event needs investigating.

This keeps recording going during internet outages, without giving up central management or remote evidence protection.

The industry data points the same way. Genetec's 2026 research found that larger camera deployments were especially likely to cite scalability and redundancy as reasons for hybrid-cloud strategies. It also found that more than 60% of respondents already ran unified or integrated video surveillance and access control, which suggests security data increasingly needs to move between systems rather than sit inside individual recorders.

Consider a retailer with 200 locations. Keeping every second of every stream in the cloud indefinitely could create large storage and network costs. Keeping everything only in each store makes central investigations harder, and exposes footage to local equipment failure.

A hybrid setup could keep recent continuous recordings at each store, and move selected incidents, key evidence, or long-term archives to remote storage. You get local resilience without making your internet connection the only path between the camera and its recorded history.

## Cost is more than terabytes

Comparing edge and cloud only by cost per terabyte can lead you to the wrong conclusion.

Local storage needs hardware capacity, replacement drives, physical space, power, installation, maintenance, and sometimes dedicated server infrastructure. You also need to plan for future cameras, not just current demand.

Cloud storage turns many of those capital costs into recurring operating expenses. You may not need as much local hardware, but retention duration, resolution, upload volume, and camera count all affect subscription and bandwidth costs.

Recording configuration matters as well. A 4 Mbps continuous stream produces about 1.3 TB a month, but changing the frame rate, compression, resolution, or event-recording rules can change that number dramatically. Calculate expected data generation before deciding how many days of footage should stay at the edge or in the cloud.

Base retention on purpose, not habit. Operational footage with little value after 30 days doesn't need the same policy as video tied to an investigation, insurance claim, safety incident, or legal hold.

Tiered retention makes storage more sustainable. Keep frequently accessed footage immediately available, and move older footage or important evidence to a storage layer built for longer retention.

## Design security, privacy, and resilience together

Neither edge nor cloud storage is automatically secure because of where the files sit.

Edge systems can reduce exposure to external network transmission, but you still need to protect recorders, camera credentials, firmware, user accounts, and physical equipment. A local recording isn't much use if unauthorised users can access it, or if the only copy disappears with a stolen recorder.

Cloud systems need a different set of controls. You need to understand encryption, authentication, access permissions, retention policies, audit trails, deletion practices, and who can retrieve stored footage.

Privacy matters most where cameras record identifiable people routinely, such as workplaces, schools, healthcare settings, and residential properties. Keeping footage longer just because storage is cheap creates unnecessary risk.

A responsible strategy starts by defining what you record, why you keep it, who can access it, how long it exists, and what happens when the retention period ends.

Test redundancy rather than assuming it. Know whether cameras keep recording during an internet outage, how much local capacity is available, whether missing footage uploads afterwards, and what happens if an edge appliance fails completely.

## Place data more intelligently

Future surveillance architecture is unlikely to move every workload to one location.

As analytics improve, edge infrastructure can process useful information close to the camera, while cloud platforms provide central management, longer-term storage, remote access, and compute that would be hard to maintain at every site.

That lets you be more selective about what crosses the network. Instead of one enormous stream of undifferentiated video, systems can decide which data needs immediate local availability, which events need remote protection, and which footage can be deleted once its operational value expires.

For security teams, the goal should be intelligent data placement, not maximising cloud capacity or installing bigger local recorders.

## FAQs

### Is edge storage better than cloud storage for security cameras?

Neither is universally better. Edge storage gives fast local access and keeps recording during internet disruptions. Cloud storage gives remote access, central management, and geographic separation from the recording site. The right choice depends on camera count, bandwidth, retention needs, and operational risk.

### How much storage can a security camera use?

It depends on resolution, frame rate, codec, scene activity, bitrate, and whether the camera records continuously or only on events. As a simple example, a continuously recorded 4 Mbps stream generates roughly 43 GB per day, or around 1.3 TB over 30 days.

### Why do large surveillance systems often use hybrid storage?

Large deployments generate a lot of video and often span locations with different connectivity. Hybrid storage lets you keep video locally for speed and outage resilience, while using remote storage for selected footage, central access, or longer retention.

### Can video surveillance continue recording if the internet goes down?

Yes, if the system includes local or edge recording capacity. A cloud-only architecture depends more on connectivity, while a hybrid setup can keep recording locally and synchronise once the network returns, depending on how it's designed.

### How should an organisation choose a video retention period?

Base it on operational requirements, investigation needs, applicable regulations, privacy policies, available capacity, and cost. Avoid keeping all footage indefinitely without a clear reason, and set procedures for preserving specific video when an incident needs longer retention.

## Conclusion

Where surveillance video should live has no single answer. Edge storage offers local speed, bandwidth efficiency, and resilience when connectivity is unreliable. Cloud storage simplifies remote access, central management, redundancy, and long-term growth.

For many organisations, the strongest architecture combines the two. The important step is deciding which footage needs immediate local availability, which needs remote protection, how long to keep each type, and how the system behaves when hardware or networks fail. As video volumes keep growing, placing surveillance data well will matter as much as the cameras capturing it.
