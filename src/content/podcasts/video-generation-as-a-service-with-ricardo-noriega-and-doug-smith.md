---
player_embed: 242bed41-2a88-431d-8b21-b98150d8ff2a
categories:
  - tech
title: Video generation as a service with Ricardo Noriega and Doug Smith
summary: >-
  I speak with Ricardo Noriega and Doug Smith from Red Hat about their
  experiments running open source video generation with vLLM Omni and the LTX-2
  model, the Kubernetes setup behind it, and the gaps in routing and
  orchestration.
publishDate: '2026-11-14T00:00:00.000Z'
tags:
  - AI
  - Video generation
  - PyTorch
  - vLLM
  - Open source
youtubeId: 7KwTYjCBvxs
oldVideoPath: >-
  /videos/video-generation-as-a-service-with-ricardo-noriega-and-doug-smith-7KwTYjCBvxs
modifiedDate: '2026-11-15'
updateNote: Added the video of this episode.
---

For this episode of the Tech Lounge, I spoke with Ricardo Noriega and Doug Smith from Red Hat at PyTorchCon in Paris in April. They gave a talk on video generation as a service using vLLM Omni, and I missed it because I was interviewing someone else, so this conversation filled the gap. This episode is also available as [video](https://www.youtube.com/watch?v=7KwTYjCBvxs), and was sponsored by [FlexClip](https://go.chrischinchilla.com/flexclip), an online video maker and editor. This is a condensed Q&A of our conversation.

### Why video generation

#### Video generation is expensive, and some companies have given up on it. Why try it?
**Doug:** The main reason was doing it with open source software. Weights had recently been released for a video model called LTX-2, and there was furious development on vLLM Omni, which is built on top of vLLM. It was a chance to contribute and experiment. We'd also been looking at open source products for omni modality, meaning generative AI across video, audio, images and text.

**Ricardo:** My team focuses on model architectures beyond autoregressive transformers, such as traditional diffusion models based on convolutional networks, and diffusion transformers. vLLM Omni arrived at the end of last year, with an exciting community and incredibly fast development, so we wanted to try it and have some fun building a demo.

#### What hardware do you need?
**Doug:** Surprisingly little. You can get generations out of LTX-2 on consumer hardware, and people run it on Nvidia 50-series GPUs. We have access to more commercial hardware, and I got in trouble on my team for wasting B200 time because it was convenient, though I did most of the work on A100s.

#### How long are the videos, and does the audio keep up?
**Doug:** The sweet spot is around ten seconds. At around 20 seconds things go from weird to very weird, with one side effect people call spaghetti limbs, where limbs keep expanding. The model produces audio and video, and it's incredible what an open weights model can do. The audio was in sync and better than I expected, though music was a bit odd compared with commercial offerings. My first iteration was video only, so I got to audio late. Ricardo mentioned there's a newer 2.3 version of the model that we haven't tested yet.

#### Can you tell a story in ten seconds?
**Ricardo:** We're engineers, not video designers, so we focused on infrastructure. But along the way we discovered ComfyUI, an open source project where you connect boxes and different types of artifacts. I think it's becoming the new paradigm for video generation.

**Doug:** One powerful idea is image-to-video, where you take a series of real or generated images and generate video from them, which gives you some consistency between scenes you want to knit together. Today that's a manual process in something like ComfyUI, but I think we'll see agentic integrations with these workflows that go beyond a six-second clip.

### The setup

#### What infrastructure did you end up with?
**Ricardo:** We're still in an exploration phase. My team added vLLM Omni as a back end for ComfyUI, which acts as the front end. Red Hat provides OpenShift, our Kubernetes distribution, so we ran vLLM Omni on Kubernetes, which handles GPU allocation. We had to write our own auto-discovery mechanism so ComfyUI could find the vLLM Omni nodes, but otherwise there were no surprises. I think it's a good workflow for production systems.

**Doug:** I also mostly used a containerised setup, and found it convenient.

#### Where are the gaps?
**Doug:** Routing. Today in vLLM Omni you typically start one model per instance on a node, say LTX-2 on one instance and another model on another. They don't all use the same endpoints: a model like Qwen Omni takes text in and gives any output from the completions endpoint, but LTX-2, which is frame-by-frame diffusion, only has a video generation endpoint. So with a video endpoint, an image endpoint and others, how do requests reach the right node? I think we'll see progress in routing and orchestration for running a video service at scale, and the community is still working out what the stack will look like.

**Ricardo:** A related project from Red Hat's office of the CTO is the semantic router in the vLLM ecosystem. It redirects prompts based on their meaning, and it supports multimodality, so it can tell a request for a video from one for an image and send it to the right place.

### PyTorch and the community

#### How does PyTorch fit in?
**Doug:** vLLM Omni builds on vLLM, and the first line of its Dockerfile is `FROM vllm`. vLLM wouldn't exist without PyTorch. I spend a lot of time on vLLM continuous integration, and we work closely with the PyTorch maintainers upstream, so it matters for our own release cycle. It's great to meet the people who make the tools my upstream work depends on.

**Ricardo:** As a European, I'm excited that this is the first time PyTorch's event has been outside Silicon Valley and the US. The vibe is still about technology, with really technical discussions.

### Products and use cases

#### What did you learn about turning the experiment into a product?
**Ricardo:** Red Hat is known for the open source development model: take an open source project, contribute to it, build up a base of maintainers, and eventually deliver enterprise software. For vLLM Omni, customers would need to be interested. There are people who want the ChatGPT or Gemini experience of generating images and video, and we want to replicate that in the open source world.

#### Is there a real use for ten-second videos in enterprises?
**Doug:** For imagery in general there are commercial uses, especially for commercial artists. Video is at the beginning of its story, but I see a glimmer of democratisation, with this technology not limited to the biggest players. Today there are significant gaps in how useful it is commercially. Filler content could work, but a feature-length film is a little out there. Image-to-video demos that animate an old family photograph are popular, but there's a big uncanny valley effect, and it can get creepy quickly.

### Try it yourself

#### Where can people recreate this?
**Doug:** We have a GitHub Gist from our talk, and everything we did is open source. I can't guarantee it on consumer hardware, but it should be possible, and a cheap rental of commercial GPUs at under five dollars an hour would let you try it. The community has moved incredibly fast since we proposed the talk, and many of the gaps we found have been filled, so you can create weird, spaghettified video today. Will Smith eating spaghetti has even become a benchmark. It's gone from laughable to passable.
