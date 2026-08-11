# SEO/AEO Audit — chrischinchilla.com

A point-in-time inventory of how the site currently handles SEO (traditional search
crawlers) and AEO (answer-engine / LLM consumption: llms.txt, structured data, clean
semantic content). Findings only — no prioritization here, see `SEO-AEO-PLAN.md` for
that.

**Update:** the "Quick wins" items from `SEO-AEO-PLAN.md` have since been implemented on
this branch. Findings below are marked `Status: Fixed` where applicable; the rest remain
open and are tracked in the plan.

## 1. Meta tags

**Status: Fixed** (dead-code part) — see below.

All rendered pages go through one consistent stack:
`src/layouts/BaseLayout.astro:5,23` → `src/components/common/MetaTags.astro`.
`BaseLayout` renders `<MetaTags {...meta} />` in `<head>`. `MetaTags.astro` wraps
`@astrolib/seo`'s `AstroSeo` component (`src/components/common/MetaTags.astro:64-92`),
producing title (with template `` `%s — ${SITE.name}` ``, `MetaTags.astro:66`),
description, canonical (`getCanonical()`, or a `publication_url` override for syndicated
content, `MetaTags.astro:29-33`), Open Graph, Twitter card
(`cardType: image ? 'summary_large_image' : undefined`, `MetaTags.astro:87-91`),
`google-site-verification`, GA/Splitbee analytics, and favicon/sitemap `<link>` tags.
`PageLayout.astro`, `PageLayoutNoBG.astro`, and `MarkdownLayout.astro` build the `meta`
object per page from frontmatter (e.g. `MarkdownLayout.astro:44-63`: `description =
summary || description || title`, OG `article` fields for
`publishedTime`/`modifiedTime`/`authors`/`tags`).

**Correction to an earlier draft of this audit**: a previous pass claimed a second, bare
layout (`src/layouts/Layout.astro`, with only `<title>` and no description/canonical/OG/
Twitter) was live and used by `src/layouts/Client.astro`/`src/layouts/Event.astro` for
clients/events detail pages. That was wrong — re-checked directly against the actual
routes: `src/pages/clients/[...page].astro` and `src/pages/events/[...page].astro` render
via `~/components/Client.astro`/`~/components/Event.astro` (list-card *components*, a
different pair of files from the similarly-named *layouts*) inside `PageLayoutNoBG.astro`,
which uses the standard `BaseLayout`/`MetaTags` stack with real `meta.title`/
`meta.description` objects. Neither `clients` nor `events` currently has individual
per-entry detail pages at all (only paginated list pages) — this differs from the
llms.txt/RSS findings below, which are real coverage gaps for these two collections.
`src/layouts/Layout.astro`, `src/layouts/Client.astro`, and `src/layouts/Event.astro` had
no importers anywhere in `src/` and have been deleted as dead code so they can't be
accidentally reused as an SEO-incomplete layout later.

## 2. robots.txt

**Status: Fixed.** `public/robots.txt` now also references `/llms.txt` and
`/llms-full.txt` (as a comment, per the informal `llmstxt.org` convention — `robots.txt`
has no formal directive for this) alongside the existing sitemap reference, so crawlers
checking robots.txt have a discovery path to them instead of having to guess the
well-known filenames.

## 3. Sitemap

`@astrojs/sitemap` is wired in `astro.config.ts` (`sitemap({...})` around line 82) with
`serialize: customizeSitemapItem` from `src/utils/sitemap.ts`. That function
(`src/utils/sitemap.ts:4-64`) hand-assigns `priority`/`changefreq` per path prefix:

- `/` → 1.0 / weekly
- `/blog` index → 0.9 / daily; individual posts → 0.8 / monthly
- `/stories`, `/videos`, `/podcast/`, `/books/`, `/music`, `/gear` → 0.7–0.8, weekly/monthly
- **Everything else** (including `/clients/*`, `/events/*`, `/games/*`, `/newsletter/*`,
  `/courses`, `/contact`, `/community`, `/cv`, `/support`) → generic fallback, 0.6 / monthly
  (`sitemap.ts:58-61`)

**Status: Fixed.** Individual blog post `lastmod` was previously hardcoded to `new Date()`
at build time, so every post reported "modified today" on every rebuild regardless of
whether it actually changed. `customizeSitemapItem` now reads each post's real
`publishDate` from its frontmatter (via a small `gray-matter`-based file scan of
`src/content/posts/`, since `@astrojs/sitemap`'s `serialize` callback only receives the
built URL, not collection data) and uses that as `lastmod`.

The generic-fallback and per-collection sitemap coverage gaps for `clients`, `events`,
`games`, `newsletter`, `courses` (still falling through to the generic 0.6/monthly branch)
remain open — see `SEO-AEO-PLAN.md` item 11.

## 4. llms.txt / llms-full.txt

**Status: Mostly fixed.** Two hand-rolled endpoints:

- `src/pages/llms.txt.ts` — index-only (title + link + one-line summary per entry).
- `src/pages/llms-full.txt.ts` — full body content inlined for self-hosted entries; a
  link-only stub (no body) for entries with a `publication_url` (syndicated elsewhere).

Both now pull `posts, stories, newsletters, books, music, av, gear, podcasts, games,
events, clients` — `podcasts`, `games`, `events`, and `clients` were added, closing the
gap CLAUDE.md flagged ("Update both if a new collection should be crawlable this way").
Since `games`, `events`, and `clients` have no individual detail pages (see finding 1),
their llms.txt entries link out to an external URL when the frontmatter has one
(`store_urls`, `pres_url`, `company_url`) and fall back to the section's list page
(`/games`, `/events`, `/clients`) otherwise.

**`supportLinks` was deliberately excluded**, not added: it's affiliate/promotional card
data rendered onto a single page (`src/pages/support.astro`) with no per-entry URL or
canonical content, unlike every other collection — including it would mean many llms.txt
lines all pointing at the same `/support` URL, which doesn't serve the "content index"
purpose the file is for. Also still missing: the static pages `cv.md`, `community.md`,
`contact.mdx`, `courses.astro`, which have no llms.txt representation at all (open, not
addressed here).

`robots.txt` now links both files — see finding 2 (fixed). Neither file is yet linked from
a `<link>` tag in `MetaTags.astro` (open).

## 5. Structured data (JSON-LD)

`src/components/common/StructuredData.astro` is a general-purpose schema generator
supporting `Article`/`BlogPosting` (`:11-58`), `Person` (`:60-74`), `Organization`
(`:76-85`), `WebSite` (`:87-103`), `PodcastEpisode` (`:114-142`), `VideoObject`
(`:144-156`), and `CreativeWork` (`:158-187`) — dispatched by a `type` prop
(`:189-204`).

Actual usage, per grep, is narrow — only 4 call sites:

| Content type | File | Schema used |
|---|---|---|
| Blog posts | `src/pages/blog/[...id].astro` | `BlogPosting` |
| Stories | `src/pages/stories/[...id].astro` | `CreativeWork` |
| Videos | `src/layouts/VideoLayout.astro` | `VideoObject` |
| Podcasts | `src/layouts/PodcastLayout.astro` | `PodcastEpisode` |

**No structured data emitted for**: books, music releases, gear, clients, events, games,
newsletters, courses, or the homepage. The `Person`/`Organization`/`WebSite` generator
functions exist in the component but a grep for their invocation (`type="Person"`,
`type="Organization"`, `type="WebSite"`) finds no call sites anywhere outside the
component's own definition — they are currently unreachable dead code, and the site has no
`Person`/`Organization`/`WebSite` JSON-LD anywhere, including the homepage
(`src/pages/index.astro`).

`src/components/common/Breadcrumb.astro` independently emits its own `BreadcrumbList`
JSON-LD (`Breadcrumb.astro:16-25`), rendered only when `MarkdownLayout.astro`'s `section`
prop is passed and truthy (`MarkdownLayout.astro:24,76`). Grep of pages that pass `section`
shows blog, books, stories, newsletter, music, and gear detail pages do; `cv.md`,
`community.md`, and `contact.mdx` all route through `MarkdownLayout` (via `PageLayout`) but
never set `section`, so they get no breadcrumb and no `BreadcrumbList` schema.

## 6. Content collection schema (`src/content.config.ts`)

SEO-relevant field coverage is inconsistent across the 12 collections:

- `summary` (optional): present on `posts`, `clients`, `books`, `music`, `newsletters`,
  `stories`, `gear`. **Absent** on `games`, `events`, `av`, `podcasts` (`podcasts` has
  `description` instead, `:186`).
- No description-equivalent field at all on `events` — only `event`/`action`/`venue` fields,
  nothing to feed a meta description or `Article.description`.
- Dates: mostly required `z.date()`, but `posts.publishDate` (`:37`) and `stories.date`
  (`:227`) are optional (`z.date().or(z.string()).optional()` /
  `z.date().or(z.string())` — `posts` is fully optional, `stories` requires *a* date value
  but as string-or-date). `llms.txt.ts:27,31` and `llms-full.txt.ts:29,33` already defensively
  `.filter()` out posts/stories missing a date before sorting — evidence this optionality
  causes real problems downstream (items with no date silently vanish from both llms.txt
  files, and would sort incorrectly in RSS/sitemap if not filtered).
- Images: required (non-optional) on `games`, `clients`, `books`, `music`, `av`; optional
  everywhere else including `posts`, `events`, `podcasts`, `newsletters`, `stories`, `gear`.

## 7. RSS feed

`src/pages/rss.xml.ts:16-52` aggregates only `posts` (via `fetchPosts()`), `newsletters`,
`stories`, `books`, `music`. **Missing**: `av` (videos), `gear`, `podcasts`, `games`,
`events`, `clients` — narrower than even llms.txt, which at least includes `av` and `gear`.
Feed is gated by `BLOG.disabled` returning a 404 (`rss.xml.ts:9-14`).

## 8. Existing SEO/AEO documentation

None. Grep across `*.md` and `src/` turns up only unrelated content-body mentions of "SEO"
inside blog post bodies (e.g. `src/content/posts/2024/9-transcription-tools-podcasters-video-creators.md`)
and one unrelated TODO in a draft post. No SEO/AEO-specific docs, TODOs, or issues exist
prior to this audit.

## 9. SEO/AEO-related dependencies

`package.json`: `@astrojs/sitemap` (^3.7.3), `@astrojs/rss` (^4.0.19), `@astrolib/seo`
(^1.0.0-beta.8 — still in beta), `@astrolib/analytics`. No `schema-dts` or other JSON-LD
type-safety package; llms.txt/llms-full.txt are fully hand-rolled with no dedicated package
for the emerging llms.txt convention.

## 10. Semantic HTML / heading hierarchy

`MarkdownLayout.astro:77` renders a single `<h1>{frontmatter.title}</h1>` followed by the
markdown body in a `.prose` wrapper — correct single-H1-per-page pattern. `astro.config.ts`'s
markdown pipeline adds `rehype-slug` + `rehype-autolink-headings` for anchor-linkable body
headings (h2+), which helps both classic SEO deep-linking and AEO citation/quoting of
specific sections. `Breadcrumb.astro:28` uses semantic `<nav aria-label="Breadcrumb"><ol>`.
No issues found in this area.
