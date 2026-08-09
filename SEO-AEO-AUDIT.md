# SEO/AEO Audit — chrischinchilla.com

A point-in-time inventory of how the site currently handles SEO (traditional search
crawlers) and AEO (answer-engine / LLM consumption: llms.txt, structured data, clean
semantic content). Findings only — no prioritization here, see `SEO-AEO-PLAN.md` for
that.

## 1. Meta tags

Two separate, inconsistent layout stacks exist:

- **Standard stack** (`src/layouts/BaseLayout.astro:5,23` → `src/components/common/MetaTags.astro`):
  `BaseLayout` renders `<MetaTags {...meta} />` in `<head>`. `MetaTags.astro` wraps
  `@astrolib/seo`'s `AstroSeo` component (`src/components/common/MetaTags.astro:64-92`),
  producing title (with template `` `%s — ${SITE.name}` ``, `MetaTags.astro:66`),
  description, canonical (`getCanonical()`, or a `publication_url` override for syndicated
  content, `MetaTags.astro:29-33`), Open Graph, Twitter card
  (`cardType: image ? 'summary_large_image' : undefined`, `MetaTags.astro:87-91`),
  `google-site-verification`, GA/Splitbee analytics, and favicon/sitemap `<link>` tags.
  `PageLayout.astro` and `MarkdownLayout.astro` build the `meta` object per page from
  frontmatter (e.g. `MarkdownLayout.astro:44-63`: `description = summary || description ||
  title`, OG `article` fields for `publishedTime`/`modifiedTime`/`authors`/`tags`).

- **Bare stack** (`src/layouts/Layout.astro`): a second, independent layout with only
  `<title>{title}</title>` (`Layout.astro:16`) — no description, no canonical, no Open
  Graph, no Twitter card, no structured data hook. This is **not dead code** — it's the
  layout used by `src/layouts/Client.astro:2,12` and `src/layouts/Event.astro:2,12`, i.e.
  every clients and events detail page renders with zero SEO meta tags beyond a raw
  `<title>`.

## 2. robots.txt

Static file, `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://chrischinchilla.com/sitemap-index.xml
```

Allows all crawling, references the sitemap. Does **not** reference `/llms.txt` or
`/llms-full.txt` — there is no discovery path for AI crawlers to find them other than
guessing the well-known filenames.

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

Individual blog post `lastmod` is hardcoded to `new Date()` at build time
(`sitemap.ts:17-18`, comment: "Set lastmod to current date for now — in production you'd
read file stats"), so every post reports "modified today" on every rebuild regardless of
whether it actually changed — actively misleading to crawlers that use `lastmod` for
re-crawl scheduling.

## 4. llms.txt / llms-full.txt

Two hand-rolled endpoints:

- `src/pages/llms.txt.ts` — index-only (title + link + one-line summary per entry).
- `src/pages/llms-full.txt.ts` — full body content inlined for self-hosted entries; a
  link-only stub (no body) for entries with a `publication_url` (syndicated elsewhere).

Both pull the exact same set of collections (`llms.txt.ts:16-24`,
`llms-full.txt.ts:18-26`): `posts, stories, newsletters, books, music, av, gear`.

**Missing collections**: `podcasts`, `games`, `events`, `clients`, `supportLinks` — none of
these appear in either file. Also missing: the static pages `cv.md`, `community.md`,
`contact.mdx`, `courses.astro`, which have no llms.txt representation at all.

Neither file is linked from `robots.txt` or from a `<link>` tag anywhere in `MetaTags.astro`
— see finding 2.

CLAUDE.md already documents this exact gap: "Update both if a new collection should be
crawlable this way" — the two files have drifted out of sync with the 12 collections now
defined in `content.config.ts`.

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
