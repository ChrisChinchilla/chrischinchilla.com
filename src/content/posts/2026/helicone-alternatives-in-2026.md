---
title: Helicone Alternatives in 2026 - Where to Move Your LLM Proxy
publishDate: 2026-10-21T00:00:00.000Z
author: Chris Ward
categories:
  - tech
image: articles/helicone.png
tags:
  - helicone
  - llm
  - proxy
summary: >-
    Helicone joined Mintlify in March 2026. Its announcement says the service will stay live "in maintenance mode". It still gets security fixes, bug fixes and support for new models, but it gets no new features. Nothing is shutting down, so there is no deadline. But if every model call in your app passes through Helicone, you should know where you would move it.
---

<a href="https://www.helicone.ai/" rel="nofollow">Helicone</a> joined Mintlify in March 2026. Its announcement says the service will stay live "in maintenance mode". It still gets security fixes, bug fixes and support for new models, but it gets no new features. Nothing is shutting down, so there is no deadline. But if every model call in your app passes through Helicone, you should know where you would move it.

Helicone does several jobs at once: it is a proxy, a request log, a cache, a rate limiter and a prompt store. No single alternative copies all of them in the same way. This guide splits Helicone into those jobs, shows which tools cover each one, and then compares five alternatives.

## The short answer

* **One self-hosted app that replaces the proxy and adds prompts and evals:** <a href="https://acruxcore.com/" rel="nofollow">AcruxCore</a>.
* **The most providers and per-key spend limits:** <a href="https://www.litellm.ai/" rel="nofollow">LiteLLM</a>.
* **No server to run:** <a href="https://www.cloudflare.com/products/ai-gateway/" rel="nofollow">Cloudflare AI Gateway</a>.
* **Your data team already runs MLflow:** <a href="https://mlflow.org/docs/latest/genai/governance/ai-gateway" rel="nofollow">the MLflow AI Gateway</a>.
* **You want deep tracing and can run a separate proxy:** <a href="https://langfuse.com/" rel="nofollow">Langfuse</a>, with LiteLLM in front.

## What Helicone does, job by job

Start with the Helicone features your app really uses. A team that only reads the request log needs much less than a team that relies on caching and per-user limits.

| Helicone job | How Helicone does it | Alternatives that do the same job |
| ----- | ----- | ----- |
| Proxy | You change the provider's base URL to Helicone's | AcruxCore, LiteLLM, Cloudflare AI Gateway, MLflow |
| Request log with cost | Every proxied call is logged with tokens and cost | AcruxCore, LiteLLM, Cloudflare AI Gateway, MLflow, Langfuse |
| Response cache | A request header (Helicone-Cache-Enabled) turns it on | AcruxCore, LiteLLM, Cloudflare AI Gateway |
| Rate limits | Rules you create in the dashboard | AcruxCore and LiteLLM per key, Cloudflare AI Gateway per gateway |
| Per-user tracking | A request header (Helicone-User-Id) | LiteLLM shows spend per user |
| Prompt store | Prompts with typed variables | AcruxCore, MLflow, Langfuse |

The proxy is the job to plan around. A tool **in the request path** sits between your code and the provider, so it can cache an answer, block a call over budget, or switch to a backup model. A tool **outside the request path** only records a call after your code has made it. Langfuse is in the second group, and that is why the Langfuse docs put LiteLLM in front of it.

## The five alternatives compared

| Tool | In the request path | Self-host | License | Response cache | Spend budgets | Prompt versions |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| AcruxCore | Yes | Yes: Postgres and Redis | Apache-2.0 | Yes | Yes | Yes, with conditionals and loops |
| LiteLLM | Yes | Yes | MIT, except the enterprise/ folder | Yes | Yes, per key | No |
| Cloudflare AI Gateway | Yes | No, it runs on Cloudflare | Closed source | Yes | No; rate limits only | No |
| MLflow | Yes, through AI Gateway endpoints | Yes | Apache-2.0 | Not checked | Usage tracking | Yes, Jinja2 |
| Langfuse | No | Yes: Postgres, ClickHouse, Redis, S3 | MIT core; ee/ folders commercial | No | No | Yes, variables only |

Every fact comes from the vendor's own docs, license file or announcement, read in October 2026. "Not checked" means we did not find the feature in the pages we read, not that it is missing. For screenshots of how each tool traces, evaluates and stores prompts, see these nine <a href="https://docs.acruxcore.com/blog/hands-on-llm-ops-comparison" rel="nofollow"><strong>LLM observability tools tested hands-on</strong></a>, Helicone among them.

## 1. AcruxCore

AcruxCore is the closest swap for a team that uses Helicone as a proxy and a prompt store. It puts a gateway, prompt versions, tracing, a tool catalog and evaluations in one Apache-2.0 app. A self-hosted install needs only Postgres and Redis.

**What replaces Helicone.** The gateway accepts OpenAI-style requests, so the move is a base URL change. It holds your provider keys, caches responses, falls back to a second model when the first one fails, and stops calls at a spend budget or a rate limit. Every call becomes a trace with its model, tokens, cost and latency, without extra tracing code. Budgets send an alert at 80% of the limit and again when the limit is reached.

**What it adds.** Prompts are versioned, and your app reads whichever version carries the production label, so a prompt change needs no redeploy. Templates support `{% if %}` conditionals and `{% for %}` loops, which Helicone's typed variables do not. Feedback on traces becomes a dataset, and rules can score live traffic against it. Roles and an audit log of every change are included in the free self-hosted version.

**What you lose.** AcruxCore has no per-end-user report like Helicone's Users page. You can tag each trace with your own user ID, but there is no built-in view per user. The project went public in August 2026, so its community is still small.

**Best for:** a small team that wants the proxy, prompts, traces and evals in one self-hosted app.

## 2. LiteLLM

LiteLLM is an open-source gateway with one OpenAI-compatible endpoint for more than 100 providers. Several observability tools, Langfuse among them, document LiteLLM as the proxy to put in front of them.

**What replaces Helicone.** You give each user, team or project a virtual key with its own budget and rate limit. The gateway records the cost of each request and shows spend per key, team, user and tag, which is the nearest match to Helicone's per-user view. Responses can be cached in Redis, Valkey, S3 or a semantic cache. The Admin UI has pages for models, keys, usage and request logs.

**What you lose.** LiteLLM has no prompt store. Several governance features need an Enterprise license, including audit logs, role-based access control, tag-based budgets and soft budget email alerts. SSO is free for up to five users.

**Best for:** teams that need many providers and per-key cost control, and are happy to add a separate tool for prompts.

## 3. Cloudflare AI Gateway

Cloudflare AI Gateway is a hosted proxy on Cloudflare's network. You create a gateway in the Cloudflare dashboard and point your provider's base URL at it. There is no server to run.

**What replaces Helicone.** It offers caching, rate limiting, retries and model fallbacks. Analytics show request counts, tokens and cost, and logs show each request and its errors. It works with OpenAI, Anthropic, Google Gemini, Workers AI and other providers. Dashboard analytics, caching and rate limiting are free on every Cloudflare plan.

**What you lose.** It is closed source and cannot be self-hosted. It has no prompt store and no evaluations. Log storage depends on your plan: gateways created before 24 September 2026 keep 100,000 logs in total on the Workers Free plan.

**Best for:** a team that only used Helicone as a proxy and a cost log, and already uses Cloudflare.

## 4. MLflow AI Gateway

MLflow is an Apache-2.0 platform for machine learning that now covers LLM apps too: tracing, a prompt registry, evaluation and an AI Gateway.

**What replaces Helicone.** You create a gateway endpoint for each model. An endpoint routes calls to one of more than 60 providers, tracks usage, and can apply guardrails for PII and safety. The prompt registry renders full Jinja2 templates, so it can hold more logic than Helicone's prompts.

**What you lose.** The self-hosted open-source version has no login screen, no teams and no roles. Everyone who can reach the server has full access, so you need to put your own authentication in front of it.

**Best for:** teams that already run MLflow for machine learning models.

## 5. Langfuse, with LiteLLM in front

Langfuse is an open-source tool for LLM tracing and prompt management, with about 36,000 GitHub stars. It is not a proxy. It receives a trace after your code has called the provider, so it cannot cache a response or block a call. To replace Helicone's proxy, you run LiteLLM in front of Langfuse, which is the setup the Langfuse docs describe.

**What replaces Helicone.** Detailed traces of multi-step agent runs, prompt versions, datasets and evaluations on live traffic. Projects sit under an organization, and each has its own roles.

**What you lose.** You now run two products. A Langfuse install needs Postgres, ClickHouse, Redis and S3-compatible storage. Audit logs and project-level roles are in the enterprise folders, even when you self-host.

Langfuse also has a new owner: ClickHouse acquired it in January 2026, and the core stays MIT. If you are leaving Helicone because of an acquisition, that may matter to you. This <a href="https://docs.acruxcore.com/blog/langfuse-alternatives" rel="nofollow"><strong>comparison of Langfuse alternatives for startups</strong></a> covers eight tools that do the same jobs.

**Best for:** teams whose main need is deep tracing of agent runs, and who can run a gateway next to it.

## Tools that older lists still recommend

* **Portkey** was acquired by Palo Alto Networks in May 2026\. Its open-source gateway repository has had no merged code since 25 May 2026\.  
* **Helicone itself** still works. If it covers everything you use today, maintenance mode may be enough for now. Plan the move before you need a feature it will not get.

## How to move off Helicone

1. **List the Helicone headers your code sends.** Other gateways do not read Helicone-\* headers. Caching, user IDs and custom properties set by header must be set up again in the new tool's own way.  
2. **Recreate rate-limit rules and alerts** in the new tool before you switch traffic.  
3. **Move your prompts.** Helicone's typed variables become plain variables in the new tool. This is also the time to replace text you flattened by hand with real conditionals, if the new tool supports them.  
4. **Change the base URL and the API key** in one environment first, and compare a day of cost and latency with Helicone's numbers before you move production.

## Which Helicone alternative should you pick?

Stop at the first question you answer yes to:

1. **Do you want the proxy, prompts and evals in one self-hosted app?** Pick AcruxCore.  
2. **Do you need spend limits per key across many providers?** Pick LiteLLM.  
3. **Do you want no server at all?** Pick Cloudflare AI Gateway.  
4. **Does your team already run MLflow?** Pick the MLflow AI Gateway.  
5. **Is deep agent tracing your main need?** Pick Langfuse, with LiteLLM as the proxy.