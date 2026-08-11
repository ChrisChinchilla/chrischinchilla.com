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

## Structured data coverage — done

Extended `src/components/common/StructuredData.astro` usage to content types that
previously emitted none.

5. **~~Add structured data to books, music, gear~~ — Done.** *AEO*. Added `CreativeWork`
   structured data (same pattern already used for stories) to `src/pages/books/[...id].astro`,
   `src/pages/music/[...id].astro`, `src/pages/gear/[...id].astro`, and — while in the same
   area — `src/pages/newsletter/[id].astro`, which had the same gap but wasn't listed
   explicitly in this item.

6. **~~Add structured data to clients, events, games, courses~~ — Done, via a new `ItemList`
   type instead of `CreativeWork`.** *AEO*. As found while implementing quick win 4 (see
   `SEO-AEO-AUDIT.md` finding 1), `clients`, `events`, and `games` have no individual detail
   pages — only paginated lists — so per-item `CreativeWork` records had no page to live on.
   Added a new `ItemList` schema type to `StructuredData.astro` instead, and wired one into
   each paginated list page (`src/pages/clients/[...page].astro`,
   `src/pages/events/[...page].astro`, `src/pages/games/[...page].astro`,
   `src/pages/courses.astro`) scoped to that page's own items. `newsletters` already has
   individual pages and was folded into item 5 above instead.

7. **~~Wire up Person/WebSite schema on the homepage~~ — Done (Organization skipped).**
   *AEO + SEO*. Added `<StructuredData type="Person" />` and `<StructuredData
   type="WebSite" />` to `src/pages/index.astro`. `Person.sameAs` is populated with profile
   URLs already confirmed elsewhere in the codebase (GitHub and YouTube from
   `Footer.astro`, the `@chrischinch` Twitter handle from `MetaTags.astro`'s Twitter card
   config) rather than guessed. `Organization` was deliberately **not** added — this is a
   personal site representing an individual, and Person is the correct schema.org type for
   that; adding Organization too would misrepresent a personal brand as a company. Also
   fixed a correctness bug found while verifying this item: `generateWebSiteSchema`'s
   `SearchAction` pointed at `/blog?q={search_term_string}`, but site search
   (`SearchBar.astro`/`SearchComponent.astro`) runs entirely client-side via `fuse.js` with
   no query-string-driven results URL — visiting that URL doesn't actually perform a
   search. Removed the `potentialAction` rather than ship structured data that fails
   Google's "the action must work" requirement.

8. **~~Extend Breadcrumb to cv/community/contact~~ — Done.** *SEO*. Rather than inventing an
   artificial middle "section" for these three standalone pages, `MarkdownLayout.astro`'s
   breadcrumb logic now renders a plain `Home > <title>` trail whenever a page has no
   `section` prop (previously breadcrumbs were skipped entirely unless `section` was set).
   Pages that do pass `section` (blog, books, stories, newsletter, music, gear) are
   unaffected — verified only `cv.md`, `community.md`, and `contact.mdx` use
   `MarkdownLayout` without a `section` prop, so no other page's breadcrumb changed.
   While verifying this rendered end-to-end, found and fixed a related bug: `PageLayout.astro`
   (used by the homepage) and `PageLayoutNoBG.astro` (used by clients/events/games/courses)
   never forwarded a `head` named slot to `BaseLayout` at all — `MarkdownLayout.astro` was
   the only layout that did. This silently dropped any `<... slot="head" />` content (like
   the new `StructuredData` calls in items 6–7) passed into pages using those two layouts.
   Both now forward the slot the same way `MarkdownLayout.astro` does.

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

Quick wins (1–4), llms.txt completeness (14), and structured data coverage (5–8) are done.
Next up: content schema consistency (9–10), since it builds on the same frontmatter
structured data now reads from. Sitemap/RSS coverage (11–12) and the dependency check (13)
can happen anytime, lowest urgency.
