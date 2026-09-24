# Project knowledge: chrischinchilla.com

Consolidated project knowledge for Chris Chinchilla's personal website. This file is
imported by the root `CLAUDE.md` (via `@.claude/CLAUDE.md`) so it loads automatically,
while living here so all project knowledge stays consolidated in one syncable place.

## Commands

- `npm run dev` / `npm start` — dev server at `localhost:4321`
- `npm run build` — production build to `./dist/`
- `npm run buildv` — build with verbose output
- `npm run preview` — preview a production build locally
- `npm run check` — `astro check` (type-checking, incl. content collection schemas)
- `npm run lint:eslint` — ESLint over `.js`, `.ts`, `.astro`
- `npm run lint` / `npm run lint:fix` — ESLint over all files (no extension filter)
- `npm run format` / `npm run format:check` — Prettier (has `prettier-plugin-astro`)

There is no test suite/framework in this repo (no test script, no Jest/Vitest/Playwright
dependency) — `npm run check` and lint are the only correctness gates.

## Git workflow

Never run `git commit` or `git push` in this repo, even if asked to as part of a larger
task — the user handles committing and pushing themselves. Leave changes staged/unstaged
in the working tree and say so; don't create commits on their behalf.

## Accessibility

Accessibility is a standing requirement, not a separate task — factor it into every change
to markup, components, or styles, not just when explicitly asked for an a11y pass. In
practice: semantic elements over `<div>`/`<span>` with handlers, accessible names on
icon-only controls (`aria-label`, not `title` alone), `aria-expanded`/`aria-pressed` on
stateful toggles, keyboard operability (not just mouse/hover), and sufficient color
contrast in both light and dark mode (this site uses Tailwind's `class`-strategy dark
mode — check both). `.claude/A11Y_AUDIT.md` is a living record of past findings and their
resolutions (or the reasoning for leaving something as-is, e.g. a measured contrast ratio
that already passes) — check it before re-investigating something, and update it when a
change touches an area it covers or introduces a new a11y-relevant pattern.

## Architecture

### Content collections live in `src/content.config.ts`, not `src/content/config.ts`

Astro's newer `loader`-based collection API is used. Each collection is a `glob()` loader
over `src/content/<type>/**/*.{md,mdx}` (most exclude underscore-prefixed files via the
`[^_]*` glob segment) with a Zod schema: `posts`, `clients`, `games`, `events`, `books`,
`music`, `av`, `podcasts`, `newsletters`, `stories`, `gear`. `supportLinks` is the outlier —
a `file()` loader reading `src/data/support.json` rather than markdown. When adding a new
content type or field, edit this file, not a `src/content/<type>/config.ts`.

Most schemas share a pattern worth knowing: `image`/`heroimage` fields are
`z.union([z.string(), image()])` — they accept a local Astro-optimized asset, a full URL,
or a Cloudflare R2 object path, resolved at render time (see Images below).

### Per-content-type settings live in `src/config.mjs`

One `CONFIG` object holds per-type settings (`blog`, `game`, `podcast`, `book`, `music`,
`event`, `client`, `video`) — `list`/`post`/`category`/`tag` pathnames, `noindex`,
`disabled`, `postsPerPage` — then re-exports named slices (`SITE`, `BLOG`, `BOOK`, `MUSIC`,
`CLIENT`, `EVENT`, `GAME`, `PODCAST`, `VIDEO`, `DATE_FORMATTER`). Routing/permalink helpers
in `src/utils/permalinks.ts` read from these exports rather than a collection's own schema,
so a content type's URL structure is changed here, not in `content.config.ts`.

The `~` import alias (tsconfig + Vite alias in `astro.config.ts`) points at `src/`, so
`~/config.mjs` resolves to `src/config.mjs`.

### Routing mirrors collections

`src/pages/<type>/` (blog, books, clients, events, games, gear, music, newsletter, podcast,
stories, videos) provides list pages per collection, and detail pages too for the
collections that have individual content (blog, books, stories, newsletter, music, gear,
podcasts, videos) — `clients`, `events`, and `games` are list-only (paginated, no
per-entry page), so their content only ever appears on `/clients`, `/events`, `/games` and
their pagination pages, rendered via `src/components/Client.astro`/`Event.astro`/
`Game.astro` (components, not layouts). List/detail pages are typically backed by a
matching layout in `src/layouts/` (`PodcastLayout.astro`, `VideoLayout.astro`,
`MarkdownLayout.astro`, plus the shared `BaseLayout`/`PageLayout`/`PageLayoutNoBG`) — a
same-named `src/layouts/Client.astro`/`Event.astro` pair existed previously but was
unreferenced dead code and has been removed; `src/layouts/Game.astro` is unreferenced too
and likely the same. Tag pages (`src/pages/*/tag/[...tag].astro`) use `groupTagsBySlug` in
`src/utils/permalinks.ts` to merge tags that differ only in casing into one slug.

See "SEO and AEO" below for what to update when adding or changing a content type — routing
is only part of the story.

### SEO and AEO

`.claude/SEO-AEO-AUDIT.md` and `.claude/SEO-AEO-PLAN.md` are the canonical reference for
this site's SEO (search engine ranking) and AEO (LLM/answer-engine consumption) surface
area — read them before large content-type or routing changes, and keep them current when
you touch any of the surfaces below.

Every content collection touches several of these surfaces independently — there is no
single place that wires a new collection into "SEO." When adding a new collection, a new
top-level page, or changing a content type's shape, check each of the following and update
it if it should apply to the new/changed content:

- **Meta tags**: does the page route through `BaseLayout.astro` → `MetaTags.astro` (via
  `PageLayout.astro`, `PageLayoutNoBG.astro`, or `MarkdownLayout.astro`) with a real
  `meta.title`/`meta.description`? All three of those layouts forward a `head` named slot
  to `BaseLayout` — required for `StructuredData` (below) to render at all; a layout that
  doesn't forward it will silently drop anything passed with `slot="head"`.
- **Structured data (JSON-LD)**: does the content type have a `<StructuredData
  slot="head" type="..." data={...} />` call somewhere? `src/components/common/
  StructuredData.astro` supports `Article`/`BlogPosting`, `CreativeWork`, `PodcastEpisode`,
  `VideoObject`, `Person`, `Organization`, `WebSite`, and `ItemList` (for list-only
  collections with no per-entry detail page — see `clients`/`events`/`games` for the
  pattern). Pick the closest-fitting type rather than skipping it.
- **`summary` field**: does the collection's Zod schema in `content.config.ts` have a short
  description field (`summary` by convention, or `description` where that's already
  established, e.g. `podcasts`) to feed meta descriptions, structured data, and llms.txt —
  rather than falling back to the title?
- **Dates**: does the collection have a real, ideally-required date field? Optional dates
  quietly break sorting and `lastmod`/`datePublished` downstream; if a field must stay
  optional, check the actual content first (e.g. `grep` frontmatter across
  `src/content/<type>/`) before assuming it's needed — content may already be complete
  enough to tighten the schema instead of adding defensive fallbacks everywhere.
- **`src/pages/llms.txt.ts` / `llms-full.txt.ts`**: both hand-list collections via
  `getCollection()` — a new collection needs adding to both, with a summary/index line in
  `llms.txt.ts` and a full-body dump (or metadata-only block, for collections with no
  useful body) in `llms-full.txt.ts`. Not every collection belongs here — data with no
  per-entry canonical URL (like `supportLinks`) doesn't serve the "content index" purpose
  of the file; document the exclusion if you skip one.
- **`src/pages/rss.xml.ts`**: narrower in scope than llms.txt by design — only add a
  collection here if it's genuinely periodically-published content with a real date to
  sort by (not portfolio/reference data like clients/events/games, and not something whose
  real publish date lives only in an external feed, like podcasts).
- **`src/utils/sitemap.ts`** (`customizeSitemapItem`): new top-level path prefixes need an
  explicit branch or they fall through to the generic `priority: 0.6` fallback. When a
  collection has short, human-authored slugs that could look like page numbers (numeric or
  short strings), double-check the pagination-detection regex doesn't misclassify them —
  this already bit the `/newsletter/<6-digit-date-code>` slugs once.
- **`public/robots.txt`**: rarely needs touching, but should keep referencing both
  `llms.txt` and `llms-full.txt`.
- **Breadcrumbs**: `MarkdownLayout.astro` renders `Home > <title>` by default and
  `Home > <section> > <title>` when a `section` prop is passed — pass `section` for any
  content type that has a natural parent listing page.

### Images: local assets, Cloudflare R2, and external URLs

`src/utils/r2-images.ts` resolves content image strings using `PUBLIC_R2_URL` and the
optional `PUBLIC_R2_IMAGES_PREFIX`. Paths beginning `/src/assets` stay local, URLs on the
configured R2 host pass through, and other relative strings are treated as R2 object keys.
Arbitrary external HTTP(S) URLs remain external.

`src/components/common/R2Image.astro` optimizes local and R2 images through Astro's image
service; `astro.config.ts` allow-lists the configured R2 hostname. If an R2 object cannot
be fetched during a static build, the component uses the site's default image instead of
failing the build. `OptimizedImage.astro` and `ContentImage.astro` route content through
the same helpers, while `src/utils/remark-r2-images.mjs` rewrites Markdown image references
to R2 URLs. Because Astro config runs before normal environment loading, it reads the
public R2 variables with Vite's `loadEnv`.

### Content maintenance scripts (not part of the build)

One-off/manual scripts operating on `src/content/**` frontmatter, run by hand as needed —
not invoked by `npm run build` or CI:

- `fix_frontmatter.py` — repairs YAML frontmatter missing a newline before the closing `---`
- `normalize_tags.py` — normalizes tag casing/naming via a `TAG_MAPPING` table (acronyms
  like AI/API/IDE, brand names like GitHub/macOS, title-cased topics)
- `scripts/add-summaries.mjs` — backfills `summary` frontmatter

### Deployment

Netlify, building on push to `main` (`netlify.toml` — esbuild bundler, plus two path
redirects). `netlify/functions/scheduled-deploy.js` is unrelated to normal deploys: a
scheduled function (cron `0 0 * * 2,4,6`) that POSTs to a Netlify build hook URL, used to
force periodic rebuilds independent of content pushes (e.g. so time-sensitive content like
"current" client badges stay fresh).

### Styling and icons

Tailwind v4 via the `@tailwindcss/vite` plugin (not the legacy PostCSS integration) —
`tailwind.config.cjs` defines brand colors (`brandBlue`/`brandYellow`/`brandGrey`) and
fonts (Bitter for body/serif, Albert Sans for headings/buttons), dark mode via the `class`
strategy. Icons use `astro-icon` with an explicit per-icon-set `include` allowlist in
`astro.config.ts` (`tabler`, `simple-icons`, `fa`, `carbon`, `fluent`, `ri`, `ph`,
`simple-line-icons`) — a new icon must be added to that list or it won't be bundled.

### Search

Client-side search (`SearchBar.astro` / `SearchComponent.astro`) is powered by `fuse.js`
over statically-generated content, not a hosted search service.

### Amazon affiliate links

Chris's Amazon Associates tag is `gregamamma-20`, used consistently across existing content
(`grep -r "tag=gregamamma-20" src/content` to see prior examples). Older posts use the full
`ref=as_li_tl&...&tag=gregamamma-20&linkId=...` SiteStripe URL format or `amzn.to` shortlinks
(both need the Associates dashboard/browser extension to generate — not reproducible from
here); the simplest link that still works and is easy to build by hand is:

```
https://www.amazon.com/dp/<ASIN>?tag=gregamamma-20
```

When asked to add affiliate links for products mentioned in a post:

1. **Verify real availability first** — search the web (or fetch the Amazon listing
   directly) for each product; don't link anything that's pre-order-with-no-price,
   announced-but-unlisted, or crowdfunding-only. "Currently active" means actually buyable on
   Amazon today.
2. **Match the exact SKU** — brands frequently sell near-identical variants (different
   generations, ANC vs non-ANC, bundle/case options, a sub-brand name dropped from the Amazon
   title). Don't substitute a similar-looking listing for the one actually being written
   about; if the exact match can't be confirmed, leave it unlinked and note why rather than
   guessing an ASIN. Never fabricate an ASIN or product URL — it must come from a real,
   verified listing.
3. **Only Amazon.com (US)** has been used so far — no confirmed EU Associates tag exists for
   `.de`/`.co.uk`, so don't assume `tag=gregamamma-20` works there.
4. For products that can't be confirmed yet (too new, no listing found, ambiguous SKU), leave
   an inline `%% TODO: ... %%` comment explaining what's blocking it, matching the style
   already used for unresolved facts in draft posts (see `src/content/posts/2026/ifa-2026.md`
   for an example of this whole workflow).

## Current initiative: activity-based site restructure

Branch: `chrischinch/reorg`. Started at commit `5367b01e` "Start of design change".

**Goal:** reorganize navigation and archives around core activities/topics — **Tech, Writing, Music, Games** — instead of content types (Blog, Books, Stories, Work, etc.). Chris does many different kinds of creative/professional work and wants visitors to browse by the kind of activity they're interested in, not by media format.

### Taxonomy layer (built)

- `src/utils/content-categories.ts` — `SITE_CATEGORIES` = tech, writing, music, games. `CATEGORY_CONTENT_TYPES` maps each content collection (posts, books, podcasts, av, stories, games, clients, newsletters, music) to a content-type slug (blog, books, podcasts, videos, stories, games, clients, newsletters, music), each with a `listStyle` of `'grid'` or `'list'`.
- `getEntryCategories()` derives an entry's site categories from its `categories`/`category`/`tags` frontmatter fields (matched via `cleanSlug` against the 4 `SITE_CATEGORIES` slugs), with hardcoded fallbacks: entries in the `games` collection always get `'games'`, entries in `music` always get `'music'`.
- Dynamic route `src/pages/[category]/[contentType]/[...page].astro` renders paginated archives per category+content-type combo, built from `getCategoryContentTypes()`.
- `Header.astro` / `HeaderNoLogo.astro` nav is built from `SITE_CATEGORIES` dropdown menus (via `getCategoryMenuLinks`). "About" (Contact/Community/Gear), "Support", "Events", "Newsletters" remain separate top-level items outside the category system.

### Done: grid layouts for books, music, games (2026-08-02)

The `/books` (and equivalent per-category) listings were rendering one-item-per-row instead of a blog-style grid. Root cause: the `Book`/`Music`/`Game` card components rendered the full article body (`<Content />` or raw `game.body`) plus buy/stream link lists inline, making every card huge, and their `content-categories.ts` entries had `listStyle: 'list'`, forcing a single column on the new `/[category]/[contentType]` route.

Fixed for all three, same pattern:
- Card components (`Book.astro`, `Music.astro`, `Game.astro`) now match `Post.astro`/`Story.astro`: image, linked title, meta line, a short `summary` field, and a compact buy/stream link list (only rendered when the relevant `store_urls`/`stream_urls` array is non-empty) — no more full-body dump.
- `listStyle` changed from `'list'` to `'grid'` for `books`, `music`, `games` in `content-categories.ts`.
- `[category]/[contentType]/[...page].astro`'s grid branch has a case per collection.
- Books: had `categories` but no `summary` — backfilled `summary:` on all 17 from body text.
- Music: already had `summary` on all 10 entries.
- Games: schema had no `summary` field at all — added `summary: z.string().optional()` to `content.config.ts`, backfilled all 27 entries from body text.

**Gotcha:** never chain `git stash` into one Bash call with other commands (e.g. `git stash && npm run build ...; git stash pop`) — if that call is rejected mid-flight, the stash half can still execute while the pop doesn't, silently reverting in-progress edits. Run `git stash` standalone.

### Merged from main (2026-08-02)

Main had moved ahead 11 commits, including social-share links (`ShareLinks.astro`) added to `Book.astro`/`Music.astro`/`Post.astro`/etc., and a Supabase→Cloudflare R2 image migration. Conflicts (in `Book.astro`, `Music.astro`, `content.config.ts`, `content/games/europop-vampire.md`, and this `CLAUDE.md`/`.claude/CLAUDE.md` split) were resolved by combining both sides — reorg branch's grid/summary layout plus main's `ShareLinks` component — following the established pattern already shared by `Post.astro`/`Story.astro` on main. `Book.astro`/`Music.astro` also dropped their old `slugify`/`id={idOfTitle}` anchor-id pattern during this merge, matching `Post.astro`/`Story.astro` which no longer use it.

### Done: podcast and real-video coverage in the tech category (2026-08-21)

`RelatedPosts.astro` crash is fixed (confirmed via a clean full build) and `software` (open-source
projects Chris created/contributed to) was added as a new grid content type under Tech — see
its own section above the taxonomy notes for details. This entry covers the follow-up: podcasts
and real YouTube videos still weren't showing anywhere in `/tech`, for two different reasons.

**Podcasts**: first pass bulk-added `categories: [tech]` to all 356 files in
`src/content/podcasts/*.md` (a slug-matched metadata overlay on real episodes fetched live from
the Simplecast RSS feed, most files near-empty or literally 0 bytes) and pointed the `podcasts`
taxonomy slug at that collection — it worked, but looked nothing like the real `/podcast` page,
since `Podcast.astro` actually expects a raw RSS episode object (`podcast.title`,
`podcast.image.att_href`, `podcast.summary`), not a sparse markdown entry. Chris asked for the
`/tech/podcasts` archive to look identical to `/podcast`, so the source was switched to match:
extracted the RSS fetch (previously duplicated across `podcast/[...page].astro` and
`podcast/[...id].astro`, with slightly different XML parser options between the two - now
unified) into a shared, memoized `src/utils/podcast-feed.ts`, and `getPodcastEpisodeEntries()` in
`content-categories.ts` wraps each live episode the same way `getYouTubeVideoEntries()` wraps
videos - `categories: ['tech']` attached automatically, raw episode fields preserved via spread so
`<Podcast podcast={entry} />` renders byte-for-byte the same card as the real page. The `podcasts`
collection's `categories: [tech]` backfill and the `getEntryHref()`/schema changes from the first
pass are harmless leftovers (still accurate metadata) but are no longer what drives the archive -
the `podcasts` collection itself is untouched by the taxonomy system now, only used for its
original purpose (transcript/tag overlay on `/podcast/[...id].astro`).

**Videos**: the public `/videos` page is 100% YouTube Data API-driven
(`src/utils/youtube.ts`, playlist `PL1fnzsSshABw25W5Qscxw_gQII_MlCoOS`) with zero markdown/content-
collection backing — there was never a file to add `categories` to. Meanwhile the *taxonomy's*
pre-existing `videos` slug was actually mapped to the unrelated `av` collection ("Video Courses &
Audio/Visual", e.g. Sitepoint screencasts — only 3 entries, still uncategorized and still
invisible today, unchanged). Renamed that mapping's slug to `courses` and gave the freed-up
`videos` slug to a new synthetic source: `getYouTubeVideoEntries()` in `content-categories.ts`
fetches the same playlist (via the new shared `getAllYouTubeVideos()`, memoized so the build only
hits the YouTube API once total, not once per page/category that needs it — `/videos`,
`/videos/[id]`, and the tech archive all now share one fetch) and wraps each video in an
entry-like object with `data.categories: ['tech']` attached automatically — there's no frontmatter
to hand-edit, so this stands in for it. `getEntryHref()` and the two `[category]` route files'
render branches (`<Video video={entry} />`, reusing the existing `Video.astro` card) got a
`'youtube'` case each. All ~250+ real videos now appear under `/tech/videos`.

### Done: clients listing switched to grid layout (2026-09-03)

`/clients` (`src/pages/clients/[...page].astro`) now uses the same blog-style grid
(`grid gap-6 row-gap-5 md:grid-cols-2 lg:grid-cols-3`, `max-w-6xl`) instead of a
one-per-row `<ul>`. `src/components/Client.astro` was rewritten from the wide two-column
list card to the compact grid card: image on top (`md:h-72`), linked title, a meta line
(`type` + a `start_date–end_date` year range), and a short blurb. No client has a `summary`
field, so the blurb falls back to the first paragraph of the body, stripped of light
markdown and truncated to ~220 chars. The `opacity-55` dimming for non-`current` clients is
preserved on the card `<article>`. Tags were dropped (the old card never rendered them, and
there are no client tag pages to link to). `getStaticPaths`/`Astro.props` got explicit
types (same pattern as the podcast page). Clients stays list-only and outside the category
taxonomy — this is purely the `/clients` page itself.

### Done: podcast listing switched to grid layout (2026-09-03)

`/podcast` (`src/pages/podcast/[...page].astro`) now renders the same blog-style grid
(`grid gap-6 row-gap-5 md:grid-cols-2 lg:grid-cols-3`, `max-w-6xl`) as `/blog`, `/books`,
etc. instead of a one-episode-per-row `<ul>`. `src/components/Podcast.astro` was rewritten
from the wide two-column list card to the compact grid card shared by
`Post.astro`/`Story.astro`/`Music.astro`: image on top (`md:h-72`), "Tech Lounge" tag,
linked title, date (`podcast.pubDate` via `formatShortDate`), a plain-text summary
truncated to ~220 chars (`stripHtml` of `podcast.summary`), and `ShareLinks`. Its `Props`
type was corrected to `PodcastEpisode` (the raw Simplecast RSS shape it actually receives)
instead of the wrong `CollectionEntry<'podcasts'>`.

To keep `/tech/podcasts` identical to `/podcast` (per the note in the video-coverage entry
above), `podcasts` `listStyle` was flipped `'list'` → `'grid'` in `content-categories.ts`
and a `podcast-feed` case added to the grid branch of both `[category]` route files
(`[category]/[contentType]/[...page].astro`, `[category]/index.astro`). The now-unreachable
`podcast-feed` entries in those files' list branches were left as harmless fallback.

### Done: post, newsletter, and course taxonomy coverage (2026-09-16)

- All 940 post files now contain valid taxonomy categories; the earlier legacy-category
  cleanup item is complete.
- All 29 newsletter files now have `categories: [writing]`. The taxonomy archive uses the
  same compact `Newsletter.astro` card as `/newsletter`, with `listStyle: 'grid'` and an
  explicit newsletter case in both category route renderers. `/writing/newsletters` and its
  second pagination page are generated successfully.
- All three `av` entries now have `categories: [tech]`, making `/tech/courses` visible while
  retaining its existing row-style `Course.astro` presentation.
- A full production build completed successfully with 2,032 pages. Restricted-network feed
  and R2 fetches used their existing fallbacks and did not fail the build.

### Not done yet

1. **Old standalone listing pages still exist in parallel** with the new dynamic route for
   blog, books, stories, podcasts, videos, and newsletters. Not yet consolidated,
   redirected, or removed. The older note naming separate games and music listing files was
   stale; those files no longer exist.
2. **No redirects** from any old archive URLs to category-based URLs if those old routes are
   eventually removed.

### Next priorities

The remaining archive consolidation and redirect decision is deliberately deferred at
Chris's request. Do not change those live URLs proactively; confirm before implementing it
because it affects public routes and SEO.
