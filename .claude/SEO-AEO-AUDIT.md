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
- `/stories`, `/videos`, `/podcast/`, `/books/`, `/music`, `/gear`, `/newsletter`, `/events`,
  `/clients`, `/games` → 0.7–0.8, weekly/monthly (see below — `/newsletter` etc. now have
  dedicated branches instead of falling through)
- `/courses` → 0.6 / monthly (explicit branch, same value as the fallback but no longer
  falling through to it)
- **Still generic fallback** (0.6 / monthly): `/contact`, `/community`, `/cv`, `/support`

**Status: Fixed.** Individual blog post `lastmod` was previously hardcoded to `new Date()`
at build time, so every post reported "modified today" on every rebuild regardless of
whether it actually changed. `customizeSitemapItem` now reads each post's real
`publishDate` from its frontmatter (via a small `gray-matter`-based file scan of
`src/content/posts/`, since `@astrojs/sitemap`'s `serialize` callback only receives the
built URL, not collection data) and uses that as `lastmod`.

**Status: Fixed.** The per-collection sitemap coverage gap for `clients`, `events`, `games`,
`newsletter`, `courses` (previously falling through to the generic 0.6/monthly branch) is
closed — dedicated branches added, see the bullet list above. Fixing this surfaced a real
bug: newsletter issue slugs are 6-digit `ddmmyy` date codes (e.g. `/newsletter/010825`),
which the first version of the new pagination-detection regex matched too, misclassifying
every individual newsletter issue as a pagination page. Narrowed the regex to match only
1-2 digit page numbers; verified against the built `sitemap-0.xml` that every
`/newsletter/*` URL now gets the correct priority.

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
purpose the file is for. The static pages `cv.md`, `community.md`, `contact.mdx`, and
`courses.astro` (not content collection entries, so out of scope for the mechanical
collection-add above) now have their own "About" section in both files instead.

`robots.txt` now links both files — see finding 2 (fixed). Neither file is yet linked from
a `<link>` tag in `MetaTags.astro` (open).

## 5. Structured data (JSON-LD)

**Status: Fixed.** `src/components/common/StructuredData.astro` is a general-purpose
schema generator supporting `Article`/`BlogPosting`, `Person`, `Organization`, `WebSite`,
`PodcastEpisode`, `VideoObject`, `CreativeWork`, and now `ItemList` (added — see below),
dispatched by a `type` prop.

Coverage, previously only 4 call sites (blog → `BlogPosting`, stories → `CreativeWork`,
videos → `VideoObject`, podcasts → `PodcastEpisode`), is now:

| Content type | File | Schema used |
|---|---|---|
| Blog posts | `src/pages/blog/[...id].astro` | `BlogPosting` |
| Stories | `src/pages/stories/[...id].astro` | `CreativeWork` |
| Videos | `src/layouts/VideoLayout.astro` | `VideoObject` |
| Podcasts | `src/layouts/PodcastLayout.astro` | `PodcastEpisode` |
| Books, music, gear, newsletters | detail pages | `CreativeWork` |
| Clients, events, games, courses | list pages | `ItemList` (new type) |
| Homepage | `src/pages/index.astro` | `Person`, `WebSite` |

`clients`, `events`, and `games` got `ItemList` rather than per-item `CreativeWork`
because — corrected in finding 1 — they have no individual detail pages, only paginated
lists; each list page now emits one `ItemList` scoped to its own page of items.
`Organization` was deliberately not added to the homepage: this is a personal site, and
`Person` is the correct schema.org type for an individual, not a company. The
`generatePersonSchema`/`generateWebSiteSchema` functions that were previously unreachable
dead code are now wired up; `generateWebSiteSchema`'s `SearchAction` (pointing at
`/blog?q={search_term_string}`) was removed in the process after verifying the site's
search (`SearchBar.astro`/`SearchComponent.astro`, `fuse.js`) runs entirely client-side
with no query-string-driven results URL — the action wouldn't have actually performed a
search.

Fixing this also surfaced a real bug: `src/layouts/PageLayout.astro` (homepage) and
`src/layouts/PageLayoutNoBG.astro` (clients/events/games/courses/support) never forwarded
a `head` named slot to `BaseLayout` at all — only `MarkdownLayout.astro` did. Any
`slot="head"` content passed into a page using either of those two layouts was silently
dropped. Both layouts now forward the slot.

`src/components/common/Breadcrumb.astro` independently emits its own `BreadcrumbList`
JSON-LD, previously rendered only when `MarkdownLayout.astro`'s `section` prop was passed
and truthy. `cv.md`, `community.md`, and `contact.mdx` set `layout:
'~/layouts/MarkdownLayout.astro'` in frontmatter but never set `section`, so they got no
breadcrumb. `MarkdownLayout.astro` now renders a plain `Home > <title>` breadcrumb whenever
`section` is absent, instead of skipping the breadcrumb entirely — fixing this without
inventing an artificial intermediate category for these three standalone pages.

## 6. Content collection schema (`src/content.config.ts`)

**Status: Fixed** (summary coverage and date optionality). SEO-relevant field coverage
across the 12 collections:

- `summary` (optional): present on `posts`, `clients`, `books`, `music`, `newsletters`,
  `stories`, `gear`, and now `av`, `events`, `games` too. `podcasts` deliberately still uses
  its existing `description` field instead of also adding `summary` — same purpose, no need
  for both.
- Dates: `posts.publishDate` is now required (previously
  `z.date().or(z.string()).optional()`) after auditing actual content — 0 of 928 post files
  were missing it, so tightening the schema needed no backfill. `stories.date` turned out to
  already be required at the schema level (`z.date().or(z.string())`, no `.optional()`); an
  earlier draft of this audit mischaracterized it as optional. The `.filter()` calls in
  `llms.txt.ts`/`llms-full.txt.ts` that worked around the old optional `posts.publishDate`
  have been removed as redundant.
- Images: required (non-optional) on `games`, `clients`, `books`, `music`, `av`; optional
  everywhere else including `posts`, `events`, `podcasts`, `newsletters`, `stories`, `gear`
  (unchanged — not in scope for this pass).

## 7. RSS feed

**Status: Fixed (scope decision made, partial extension).** `src/pages/rss.xml.ts`
aggregated only `posts` (via `fetchPosts()`), `newsletters`, `stories`, `books`, `music` —
narrower than llms.txt, which also includes `av` and `gear`. Rather than a blanket
all-or-nothing extension, each missing collection was checked individually and either
added or explicitly excluded with a reason:

- **`av` added** — has a required `publish_date` field, sorts correctly into the
  chronological feed.
- **`gear` excluded** — the collection has no date field at all; nothing to sort a
  chronological feed by.
- **`podcasts` excluded** — the content collection carries metadata but not a publish
  date; the real date only exists in the external Simplecast RSS feed that
  `src/pages/podcast/[...id].astro` fetches and merges at build time, which this feed
  doesn't replicate.
- **`games`, `events`, `clients` excluded** — portfolio/reference content rather than
  periodically-published material (a new client or past speaking engagement isn't "new
  content to subscribe to" the way a blog post or book release is); `games.publish_date`
  is also optional and frequently absent.

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
