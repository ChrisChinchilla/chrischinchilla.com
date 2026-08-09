# SEO/AEO Plan — chrischinchilla.com

Prioritized backlog derived from `SEO-AEO-AUDIT.md`. Each item lists affected files, rough
effort, and why it matters — split by whether it primarily serves classic **SEO** (search
engine crawlers/ranking) or **AEO** (LLM/answer-engine consumption via llms.txt, structured
data, clean semantics), since the two audiences want different things: search engines
mostly care about the sitemap, meta tags, and canonical URLs; answer engines care most
about llms.txt/llms-full.txt discoverability and machine-readable structured data.

## Quick wins

Low effort, clear value, no schema/architecture changes required.

1. **Link llms.txt/llms-full.txt from robots.txt** — *AEO*. Add a comment/reference to
   `/llms.txt` and `/llms-full.txt` in `public/robots.txt` next to the existing `Sitemap:`
   line so AI crawlers that check robots.txt for the convention can discover them without
   guessing the filename. Effort: **S**.

2. **Add missing collections to llms.txt / llms-full.txt** — *AEO*. `src/pages/llms.txt.ts`
   and `src/pages/llms-full.txt.ts` both need `podcasts`, `games`, `events`, `clients`, and
   `supportLinks` added to the `getCollection()` calls and a corresponding section in the
   output, mirroring the existing per-collection blocks. Also consider adding the static
   pages (`cv.md`, `community.md`, `contact.mdx`, `courses.astro`) as a short "About" section.
   Effort: **M** (mechanical but touches two files with several new sections each).

3. **Fix sitemap `lastmod` for blog posts** — *SEO*. `src/utils/sitemap.ts:17-18` hardcodes
   `lastmod = new Date()` for every blog post on every build. Replace with the post's actual
   `publishDate` (or a real `modifiedDate` field if one exists) passed through from the
   sitemap integration's entry data, so `lastmod` reflects reality instead of "always just
   changed." Effort: **S–M** depending on whether `@astrojs/sitemap`'s serialize callback has
   access to frontmatter (may need to pass content dates through a lookup map keyed by URL).

4. **Give clients/events pages real meta tags** — *SEO*. `src/layouts/Client.astro` and
   `src/layouts/Event.astro` currently import the bare `src/layouts/Layout.astro` (only
   `<title>`, no description/canonical/OG/Twitter/structured data). Switch them to the
   standard `BaseLayout.astro` + `MetaTags` pattern used by `PageLayout.astro`/
   `MarkdownLayout.astro`, building a `meta` object from `clients`/`events` frontmatter.
   This is the single highest-impact fix in this list — two entire content types currently
   have no discoverable meta description or social preview. Effort: **M**.

## Structured data coverage

Extend `src/components/common/StructuredData.astro` usage (the generator already supports
most of what's needed) to content types that currently emit none.

5. **Add structured data to books, music, gear** — *AEO*. Use the existing `CreativeWork`
   schema (already used for stories) on `src/pages/books/[...id].astro`,
   `src/pages/music/[...id].astro`, `src/pages/gear/[...id].astro`. Effort: **S** per page,
   **M** total.

6. **Add structured data to clients, events, games, newsletters, courses** — *AEO*. Pick the
   closest-fitting existing schema type per content type (e.g. `CreativeWork` or a light
   custom type for `events`/`games`) once item 4 gives clients/events real layouts to hang it
   on. Effort: **M**.

7. **Wire up Person/Organization/WebSite schema on the homepage** — *AEO + SEO*. The
   generator functions already exist in `StructuredData.astro` (`generatePersonSchema`,
   `generateOrganizationSchema`, `generateWebSiteSchema`) but have zero call sites anywhere —
   currently unreachable. Add `<StructuredData type="Person" />` (with real `sameAs` social
   profile URLs filled in — currently a commented-out empty array) and/or `Organization`/
   `WebSite` (the `WebSite` schema includes a `SearchAction` pointing at `/blog?q=...`, worth
   verifying that search endpoint actually exists) to `src/pages/index.astro`. This is what
   powers Google's Knowledge Panel and many "who is X" answer-engine queries. Effort: **S**.

8. **Extend Breadcrumb to cv/community/contact** — *SEO*. These pages route through
   `MarkdownLayout.astro` but never pass a `section` prop, so they get no `BreadcrumbList`
   and no visible breadcrumb nav. Decide on a sensible parent ("Home") and pass `section`.
   Effort: **S**.

## Content schema consistency

9. **Add `summary` to `av`, `podcasts`, `events`, `games` collections** — *AEO + SEO*. These
   four collections in `src/content.config.ts` have no dedicated short-description field,
   forcing meta descriptions and llms.txt summaries to fall back to the title or nothing.
   Add `summary: z.string().optional()` matching the pattern already used on `posts`,
   `books`, `music`, etc. Effort: **S** (schema-only; existing content won't retroactively
   populate but new/edited entries can).

10. **Resolve optional dates on `posts.publishDate` and `stories.date`** — *SEO + AEO*.
    Both llms.txt files already have to defensively `.filter()` these out
    (`llms.txt.ts:27,31`) before they can sort — a sign the optionality is actively causing
    missing-content bugs, not a deliberate feature. Either make the fields required (and
    backfill any content missing them), or explicitly document why some content is
    undated and audit every consumer (`sitemap.ts`, `rss.xml.ts`, `StructuredData.astro`'s
    `datePublished`) to confirm they all handle the missing case the same way llms.txt does.
    Effort: **M** (needs a content audit to find entries actually missing dates before
    tightening the schema).

## Sitemap coverage

11. **Add explicit sitemap entries for clients, events, games, newsletter, courses** — *SEO*.
    `src/utils/sitemap.ts` currently sends these to the generic 0.6/monthly fallback branch.
    Add dedicated branches (index pages ~0.7-0.8/weekly, detail pages ~0.6-0.7/monthly,
    matching the pattern already used for stories/videos/music/gear). Effort: **S**.

## RSS coverage

12. **Decide RSS scope and extend if needed** — *SEO*. `src/pages/rss.xml.ts` is narrower
    than llms.txt (missing `av`, `gear`, `podcasts`, `games`, `events`, `clients`). If this
    is intentional (RSS as a "written content only" feed vs. llms.txt as "everything"),
    document that decision in `.claude/CLAUDE.md`'s routing section. If not intentional, add
    the missing collections following the existing `.map()` pattern per entry
    (`rss.xml.ts:22-52`). Consider whether podcasts/videos want a separate typed feed instead
    of blending into the general one. Effort: **S** (extend) or **XS** (just document).

## Dependency health

13. **Evaluate `@astrolib/seo` beta status** — *SEO, low urgency*. Still on a `1.0.0-beta.8`
    release with `MetaTags.astro` as the sole consumer of its `AstroSeo` component. Check for
    a stable 1.0 release or evaluate whether the wrapper is thin enough to inline directly
    (removing a beta dependency from the critical meta-tag path). Effort: **S** to check,
    **M** if migration is warranted.

## Suggested sequencing

Quick wins (1–4) first — they're low-risk, high-value, and item 4 in particular closes a
real SEO gap (two content types with zero meta tags). Structured data (5–8) and content
schema (9–10) next, since they build on consistent frontmatter. Sitemap/RSS coverage (11–12)
and the dependency check (13) can happen anytime, lowest urgency.
