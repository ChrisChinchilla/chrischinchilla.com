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

## Content schema consistency — done

9. **~~Add `summary` to `av`, `events`, `games` collections~~ — Done (podcasts skipped).**
   *AEO + SEO*. Added `summary: z.string().optional()` to `av`, `events`, and `games` in
   `src/content.config.ts`, matching the pattern already used on `posts`/`books`/`music`.
   `podcasts` was excluded from this item on inspection: it already has a `description`
   field serving the identical purpose (already used throughout `llms.txt.ts`,
   `llms-full.txt.ts`) — adding `summary` too would just be two fields doing the same job.
   Wired the three new fields into `llms.txt.ts`/`llms-full.txt.ts`'s AV/Games/Events
   sections, which previously had no summary line since the field didn't exist yet when
   those sections were added (llms.txt completeness, item 2/14). Schema-only for existing
   content — no current `av`/`events`/`games` entries have a `summary` yet, but new/edited
   ones can add one going forward.

10. **~~Resolve optional dates on `posts.publishDate` and `stories.date`~~ — Done.**
    *SEO + AEO*. Audited actual content first rather than guessing: `grep`-checked all 928
    files in `src/content/posts/` and all 39 in `src/content/stories/` for the relevant
    date field — zero were missing it. `stories.date` was already required at the schema
    level (`z.date().or(z.string())`, no `.optional()` — the audit's original claim that it
    was optional was imprecise, it requires *a* value, just accepts either type). Only
    `posts.publishDate` was genuinely optional; since no real content relies on that
    (0 of 928 missing it), made it required in `src/content.config.ts` rather than leaving
    defensive fallbacks scattered across consumers. Removed the now-redundant
    `.filter((p) => p.data.publishDate)` calls in `llms.txt.ts`/`llms-full.txt.ts` (and the
    matching `!` non-null assertions) since the schema now guarantees presence. Verified
    with a full production build — all 928 posts still validate against the tightened
    schema, confirming the audit was accurate before changing it.

## Sitemap coverage — done

11. **~~Add explicit sitemap entries for clients, events, games, newsletter, courses~~ —
    Done.** *SEO*. Added dedicated branches to `src/utils/sitemap.ts`: newsletter index +
    pagination 0.8/weekly, individual issues 0.7/monthly; events index + pagination
    0.7/weekly (no individual pages); clients index + pagination 0.7/monthly (no individual
    pages); games index + pagination 0.7/monthly (no individual pages); courses 0.6/monthly.
    Caught and fixed a bug while verifying against the built sitemap: newsletter issue slugs
    are 6-digit `ddmmyy` date codes (e.g. `/newsletter/010825`), which the first version of
    the pagination-detection regex (`/^\/newsletter\/\d+\/?$/`) matched too, misclassifying
    every individual issue as a pagination page. Narrowed it to `\d{1,2}` (pagination page
    numbers) so it no longer collides with the 6-digit issue slugs — verified by parsing the
    built `sitemap-0.xml` and checking every `/newsletter/*` URL got the right priority.

## RSS coverage — done

12. **~~Decide RSS scope and extend if needed~~ — Done (partial extension + documented
    exclusions).** *SEO*. `src/pages/rss.xml.ts` was narrower than llms.txt (missing `av`,
    `gear`, `podcasts`, `games`, `events`, `clients`). Rather than an all-or-nothing choice,
    added only `av` and explicitly excluded the rest, each for a concrete reason checked
    against the actual schema/data:
    - **`av` added**: has a required `publish_date` field, so it sorts into the
      chronological feed correctly, same as books/music.
    - **`gear` excluded**: the collection has no date field at all (checked
      `content.config.ts`) — nothing to sort an RSS feed by.
    - **`podcasts` excluded**: its content collection entries carry metadata but not a
      publish date — the real date only exists in the external Simplecast RSS feed that
      `src/pages/podcast/[...id].astro` fetches and merges at build time. Pulling a date in
      here would mean duplicating that fetch, out of scope for this item.
    - **`games`, `events`, `clients` excluded**: portfolio/reference content, not
      periodically-published material — a new client or a past speaking engagement isn't
      naturally "new content to subscribe to" the way a blog post or a book release is, and
      `games.publish_date` is optional/frequently absent anyway.

## Dependency health

13. **Evaluate `@astrolib/seo` beta status** — *SEO, low urgency*. Still on a `1.0.0-beta.8`
    release with `MetaTags.astro` as the sole consumer of its `AstroSeo` component. Check for
    a stable 1.0 release or evaluate whether the wrapper is thin enough to inline directly
    (removing a beta dependency from the critical meta-tag path). Effort: **S** to check,
    **M** if migration is warranted.

## Suggested sequencing

Everything is done except item 13 (the `@astrolib/seo` dependency check) — low urgency,
can happen anytime.
