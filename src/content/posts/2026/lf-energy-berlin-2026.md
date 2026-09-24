---
title: What's new for LF Energy in 2026
publishDate: 2026-09-23T09:00:00.000Z
author: Chris Ward
categories:
  - tech
image: articles/lf-energy-26.jpeg
tags:
  - Energy
  - Open Source
  - Linux Foundation
  - Berlin
summary: >-
  A tour of Linux Foundation Energy's project portfolio, and a look at what was announced and demoed at LF Energy Summit Europe in Berlin.
---

I was at [LF Energy Summit Europe](https://events.linuxfoundation.org/lfenergysummit-europe/) in Berlin last week, and it seemed like a good excuse to finally write the "what is LF Energy actually doing" post I've been meaning to put together for a while.

[LF Energy](https://lfenergy.org/) is the Linux Foundation's home for open source projects aimed at modernising and opening all aspects of the energy grid. Everything from transmission-level simulation down to the software that runs your local EV charger. It now hosts over 40 projects, here's the ones that caught my attention, and any related talks from them on stage in Berlin.

## The LF Energy toolbox, curated

- **[PowSyBl](https://lfenergy.org/projects/powsybl/)** — an open platform for power grid modelling, monitoring, and stability assessment. This is one of the more mature, widely deployed projects in the portfolio, RTE, France's Transmission System Operator (TSO) and other European TSOs building production tooling on top of it.
- **[Dynawo](https://lfenergy.org/projects/dyna%cf%89o/)** — power system simulation, stability, and dynamic modelling. Grew out of RTE's own internal tooling.
- **[SEAPATH](https://lfenergy.org/projects/seapath/)** — a high-availability, real-time hypervisor for virtualising substation control. Think of it as a "substation as software" project.
- **[CoMPAS](https://lfenergy.org/projects/compas/)** — open source tools for [IEC 61850](http://iec61850.dvl.iec.ch), an international standard defining communication protocols for intelligent electronic devices at electrical substations. It's intention is to make substation engineering less of a vendor-locked nightmare.
- **[EVerest](https://lfenergy.org/projects/everest/)** — a firmware stack for standards-compliant, interoperable, secure EV charging. If you've ever been annoyed by incompatible charge points, this is the project trying to fix that.
- **[CitrineOS](https://lfenergy.org/projects/citrineos/)** — the backend counterpart to EVerest, Open Charge Point Protocol (OCPP)-compliant charge management software.
- **[OperatorFabric](https://lfenergy.org/projects/operatorfabric/)** — a modular platform for electricity, water, and utility operations, essentially the control-room software layer.
- **[OpenSTEF](https://lfenergy.org/projects/openstef/)** — short-term energy forecasting, used by Dutch grid operator [Alliander](https://www.alliander.com/en) among others.
- **[OpenGridFM](https://lfenergy.org/projects/opengridfm/)** — a newer project, building open source foundation models for power grids.
- **[OpenSynth](https://lfenergy.org/projects/opensynth/)** — an open data community producing AI-generated synthetic and real energy data, useful when you want to train or test something without exposing real customer data.
- **[Grid2Op](https://lfenergy.org/projects/grid2op/)** — a framework for intelligent power grid control, designed for modeling and simulating sequential decision-making processes in the context of power systems.
- **[FlexMeasures](https://lfenergy.org/projects/flexmeasures/)** — an intelligent energy management system supporting real-time flexibility apps.
- **[Power Grid Model](https://lfenergy.org/projects/power-grid-model/)** — a high-performance library for distribution power system analysis.
- **[Battery Data Alliance](https://lfenergy.org/projects/battery-data-alliance/)** — tools and standards for unified battery data.
- **CDS specifications** — a family of [connected data specification (CDS)](https://cds.lfenergy.org/) open data specifications ([Customer Data](https://lfenergy.org/projects/cds-customer-data/), [Power Systems Data](https://lfenergy.org/projects/cds-power-systems-data/), [Registration](https://lfenergy.org/projects/cds-registration/)) aimed at making utility and grid data interoperable between systems.

That's fifteen out of more than forty. If you want the exhaustive list, [the full projects directory](https://lfenergy.org/projects/) is on the LF Energy site.

## LF Energy project changes

LF Energy used the summit to make its usual round of ecosystem announcements. Two new general members joined: [Coreso](https://www.coreso.eu/), the European Regional Coordination Centre, and [Landis+Gyr](https://www.landisgyr.com/), the metering and energy management vendor.

Four projects were accepted as new open source projects:

- **[AssetLife](https://lfenergy.org/projects/assetlife/)** — a Python library using stochastic modelling for utility asset management decisions.
- **[CityLearn](https://lfenergy.org/projects/citylearn/)** — a multi-agent reinforcement learning environment for urban energy and microgrids.
- **[EnerGNN](https://lfenergy.org/projects/energnn/)** — a graph neural network platform for power grid modelling and optimisation.
- **[Smart HEMS Benchmark](https://github.com/lf-energy/tac/blob/main/meetings/2026/2026-06-09/LF-Energy%20Smart%20HEMS-BenchMark.pdf)** — a manufacturer-neutral platform for benchmarking home and community energy management systems.
- **[SEAPATH](https://lfenergy.org/projects/seapath/)** advanced to **Graduated** stage.
- **[CoMPAS](https://lfenergy.org/projects/compas/)** progressed to **Early Adoption**.
- **[Grid2Op](https://github.com/Grid2op/grid2op)** and **[OpenGridFM](https://lfenergy.org/projects/opengridfm/)** both moved from Sandbox to **Incubation**.

## What happened in Berlin

The summit ran from 15–16th September, under the theme "Develop the Modern Grid, Together". Here's what I could match up against the projects above, some of it news, some of it just useful context if you use or are interested in these tools.

**[OpenSTEF got its 4.0 launch](https://lfenergy.org/openstef-4-0-is-here-any-ml-approach-any-it-stack-one-energy-forecasting-ecosystem/)** as the opening session, with AI-powered documentation and a hands-on tutorial using Alliander's 2024 dataset. Given how much European utility providers contribute to the ecosystem, launches like this are an indication of what's operational versus experimental.

**[PowSyBl](https://www.powsybl.org/) had the most single-project coverage on the schedule**: a session on TSO cooperation through its building-block architecture, a PyPowSyBl demo covering core and new features, and a separate talk on the shared roadmap for PowSyBl Open RAO (its remedial action optimisation tool). [TenneT](https://www.tennet.eu) rebuilt their security analysis tooling on PowSyBl and cut calculation times from minutes to seconds.

**[Dynawo](https://dynawo.github.io/)** had a tools-and-usability session, and, more interestingly, RTE researchers presented their analysis of the Iberian blackout using Dynawo, which is about as real-world a validation of an open source simulation tool as you could see.

**[SEAPATH](https://seapathgroup.com/)** presented [a demo of RTE's VIPeR R&D project](https://lfenergy.org/how-virtualization-and-seapath-are-transforming-rtes-energy-systems/) handling substation protection on the platform, and a separate talk on running [SEAPATH on SUSE at the edge](https://www.suse.com/c/suse-commits-to-lf-energys-seapath-project/).

**OpenSynth** has a talk on using it for low-carbon technology detection, with the Centre for Net Zero and Alliander.

Hitachi researchers built a "mini-city prototype" using **OperatorFabric, OpenGridFM, PowSyBl, SEAPATH, and OpenSTEF** together to show them operating as one interconnected system rather than as five separate demos. That's the kind of integration story this ecosystem needs more of.