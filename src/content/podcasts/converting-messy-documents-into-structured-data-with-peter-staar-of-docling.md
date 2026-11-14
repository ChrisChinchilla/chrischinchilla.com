---
player_embed: 2715894d-6acd-488d-8b10-55fa22ff531b
categories:
  - tech
title: Converting messy documents into structured data with Peter Staar of Docling
summary: >-
  I speak with Peter Staar of Docling, the open source project that converts
  messy documents into a standard structured format, about PDFs, a proposed
  standard for unstructured content, and training models that output it
  natively.
publishDate: '2026-11-14T00:00:00.000Z'
tags:
  - AI
  - Documents
  - PyTorch
  - Open source
  - PDF
youtubeId: vRg6StHiMdI
oldVideoPath: >-
  /videos/converting-messy-documents-into-structured-data-with-peter-staar-of-docling-vRg6StHiMdI
---

For this episode of the Tech Lounge, I spoke with Peter Staar, who works on [Docling](https://github.com/docling-project/docling), at PyTorchCon in Paris in April. I do a lot of documentation work and help maintain some Pandoc-related projects, so Docling looked like something I should love, though I couldn't quite work out what it was. This episode is also available as [video](https://www.youtube.com/watch?v=vRg6StHiMdI), and was sponsored by [Mermaid Chart](https://go.chrischinchilla.com/mermaid). This is a condensed Q&A of our conversation.

### What Docling is

#### What is Docling, and who is it for?
It became popular during the RAG boom around two years ago, and we've focused on simplicity and developers. From 30,000 feet, you have a pile of unstructured documents in different formats and you want to handle them in Python as easily as possible. You point Docling at a source and always get back the same structure. PDF is the hard one and the reason it's so popular, because everybody has to deal with it. Then come the "what about" questions: Word, PowerPoint, Excel, AsciiDoc. The design makes it easy to add formats, and we're adding email, we already support audio, and we're working on video. Whatever you put in, you get a Docling document you can operate on.

#### Where did it come from?
It started as an IBM project, and last March we donated it to the Linux Foundation, and now work with many partners. Large data platforms have a structured side and an unstructured side, and many only claim to handle the unstructured side. We wanted a structured approach, and with so many variations we need a community to help us navigate them.

#### How is it used?
It reached about a quarter of a million downloads a day recently, with lots of integrations. It has a CLI, but it targets developers, so the getting started material is mostly code. A public software as a service offering is planned, and I'm working on demonstrators, for example for oil and gas and finance. Our users are engineers in manufacturing companies, back offices and large funds. They don't need another copilot. They need a tool they can develop locally, use through a cheap API for non-confidential material, and run locally for confidential material. Agents such as Claude Code increasingly use command line tools, and I think there will soon be more agents running than people.

### A standard for unstructured content

#### What is the standard you're working on?
We're about to release, through the Linux Foundation, a standard for unstructured content, in the spirit of an ISO standard. On one side you have content in many formats, such as meeting recordings, PDFs, forms and images, and the aim is to represent the content, not the original layout. HTML can be anything, and Markdown lacks features, so the goal is to limit the scope while staying flexible enough for any work. That tension means making decisions, which the standard will define. It's also meant to be optimised for LLMs, so it can be represented efficiently for tokenisers. Complex tax forms are a good example: ask ten people to structure one and you'll get ten structures.

#### Can I convert from Docling's format to other formats?
Yes. The Docling library handles conversion into the Python data structure, the Docling document. A thin package defines the data structures and transforms, including serialisation to PDF, HTML, Markdown or whatever format you like. The standard is the funnel in, and serialisation is the funnel out.

### Models, PDFs and edge cases

#### Why come to PyTorchCon?
Docling is a framework that incorporates third-party OCR models, but we also build our own. Visual language models take page images and translate them into content. Having defined the standard, we're training new models that output it natively, and we want to run them efficiently with vLLM, PyTorch and Triton kernels. We're also testing whether pretraining models on that structured representation, with an extended vocabulary, gives better models by default. Early indications are that it does.

#### What makes PDFs so hard?
They're not as standard as people think. Some are programmatic and you can extract the text, but people sometimes draw text, so you miss it. A lot of the work is mundane. For speed we convert PDF pages to images for the VLMs, but the PDF library we used isn't thread-safe. At 20 milliseconds a page, a 200-page document takes four seconds before inference even starts, while the GPUs sit idle. I recently merged work to parallelise that. We also normalise ligatures, such as the single Unicode character for "ffi", so developers don't have to deal with them before embedding.

#### How do you handle files like Excel or Word, where people use formatting loosely?
We keep the Docling document as the content as it is. In Word, some people use bold and bigger text as a section heading instead of a real heading level. We debated whether to infer a section, and decided to follow what the file says and propagate the formatting. Then there's a separate layer we call enrichment, where you can add things that aren't the content: summaries, a model to extract tabular data from a chart, or code to recreate a figure. If you activate those, they run on top.

### What's next

#### What's on the roadmap?
First, releasing the standard, along with governance work. Second, a new model trained on it. Third, an agent that reasons over documents. I always hated chunking in RAG, so we have a chunkless version: it reasons over the summaries in the document tree to decide which sections to read. Docling Graph builds entities and relationships and compares them with a public ontology, so you can see what's missing or unique in your organisation's documents, and judge what your company's moat might be. Around mid-year we want to launch a full evaluation framework with partners, so companies can build their own datasets. Public benchmarks mean little when everyone has trained on them, even unintentionally.

#### Can I run it locally?
Yes, you can run it on a laptop. I think there's also a European angle: we can't just hand everything over, and if everyone uses the same tools from the same hyperscalers, it's hard to differentiate.
