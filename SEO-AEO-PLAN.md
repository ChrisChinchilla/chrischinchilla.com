# SEO/AEO Plan — chrischinchilla.com

Prioritized backlog derived from `SEO-AEO-AUDIT.md`. Each item lists affected files, rough
effort, and why it matters — split by whether it primarily serves classic **SEO** (search
engine crawlers/ranking) or **AEO** (LLM/answer-engine consumption via llms.txt, structured
data, clean semantics), since the two audiences want different things: search engines
mostly care about the sitemap, meta tags, and canonical URLs; answer engines care most
about llms.txt/llms-full.txt discoverability and machine-readable structured data.

## Quick wins — done

Low effort, clear value, no schema/architecture changes required. All four implemented on
this branch; see `SEO-AEO-AUDIT.md` for the corresponding `Status: Fixed` notes.

1. **~~Link llms.txt/llms-full.txt from robots.txt~~ — Done.** *AEO*. `public/robots.txt`
   now references `/llms.txt` and `/llms-full.txt` alongside the existing `Sitemap:` line.

2. **~~Add missing collections to llms.txt / llms-full.txt~~ — Done.** *AEO*.
   `src/pages/llms.txt.ts` and `src/pages/llms-full.txt.ts` now include `podcasts`,
   `games`, `events`, and `clients`. `supportLinks` was deliberately excluded (affiliate
   card data with no per-entry URL — see audit finding 4) rather than force-fit; if that
   changes, revisit. Adding the static pages (`cv.md`, `community.md`, `contact.mdx`,
   `courses.astro`) as a short "About" section is still open — folded into a new item 14
   below since it wasn't part of the original mechanical scope.

3. **~~Fix sitemap `lastmod` for blog posts~~ — Done.** *SEO*. `src/utils/sitemap.ts` no
   longer hardcodes `lastmod = new Date()`. It now reads each blog post's real
   `publishDate` from its frontmatter file directly (via `gray-matter`, already a
   dependency) at module load, since `@astrojs/sitemap`'s `serialize` callback only
   receives the built URL, not collection data.

4. **~~Give clients/events pages real meta tags~~ — Turned out to be already true; did
   cleanup instead.** *SEO*. Re-investigation found the original premise was wrong: the
   live `/clients` and `/events` list pages already render through `PageLayoutNoBG.astro`
   → `BaseLayout`/`MetaTags` with real `meta.title`/`meta.description`. Neither collection
   has individual detail pages at all (only paginated lists) — `src/layouts/Client.astro`,
   `src/layouts/Event.astro` (bare-`<title>`-only layouts), and the `src/layouts/Layout.astro`
   they both imported had zero importers anywhere in `src/` and were dead code, not a live
   SEO gap. Deleted all three so they can't be accidentally wired up later and reintroduce
   the gap. See `SEO-AEO-AUDIT.md` finding 1 for the full correction.

## llms.txt completeness

14. **~~Add static pages to llms.txt / llms-full.txt~~ — Done.** *AEO*. `cv.md`,
    `community.md`, `contact.mdx`, and `courses.astro` now have an "About" section in both
    files. `llms.txt` links each with a hand-written one-line summary (no shared frontmatter
    schema across these four pages to generate one from). `llms-full.txt` reads the real
    body content of `cv.md`/`community.md`/`contact.mdx` directly from `src/pages/` via
    `gray-matter` (stripping MDX `import`/self-closing-component lines from `contact.mdx`
    for a clean text dump); `courses.astro` has no static body to extract (it's built from
    the `av` collection at request time), so it gets a short hand-written blurb instead.

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

Quick wins (1–4) and llms.txt completeness (14) are done. Next up: structured data
coverage (5–8) and content schema consistency (9–10), since they build on consistent
frontmatter. Sitemap/RSS coverage (11–12) and the dependency check (13) can happen
anytime, lowest urgency.
