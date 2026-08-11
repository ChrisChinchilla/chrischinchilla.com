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
or a Supabase Storage path, resolved at render time (see Images below).

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
their pagination pages. List/detail pages are typically backed by a matching layout in
`src/layouts/` (`PodcastLayout.astro`, `VideoLayout.astro`, `MarkdownLayout.astro`, plus
the shared `BaseLayout`/`PageLayout`/`PageLayoutNoBG`). Tag pages
(`src/pages/*/tag/[...tag].astro`) use `groupTagsBySlug` in `src/utils/permalinks.ts` to
merge tags that differ only in casing into one slug.

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

### Images: three sources, resolved by convention

`src/utils/supabase-images.ts` builds Supabase Storage URLs (with optional
width/height/quality/format transforms) from `PUBLIC_SUPABASE_URL` /
`PUBLIC_SUPABASE_IMAGES_BUCKET` env vars. `shouldUseSupabase`/`getImageUrl` decide by
convention: paths starting `/src/assets` are local (Astro-optimized), full Supabase
storage URLs pass through, and anything else is treated as a Supabase bucket path.
`src/components/common/SupabaseImage.astro` and `OptimizedImage.astro` are the two
rendering paths content ends up on; `src/utils/remark-supabase-images.mjs` rewrites plain
markdown image references in post bodies the same way.

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
