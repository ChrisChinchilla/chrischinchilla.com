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
stories, videos) provides list + detail + tag pages per collection, each typically backed
by a matching layout in `src/layouts/` (`Client.astro`, `Event.astro`, `Game.astro`,
`PodcastLayout.astro`, `VideoLayout.astro`, `MarkdownLayout.astro`, plus the shared
`BaseLayout`/`Layout`/`PageLayout`). Tag pages (`src/pages/*/tag/[...tag].astro`) use
`groupTagsBySlug` in `src/utils/permalinks.ts` to merge tags that differ only in casing
into one slug.

Two non-visual feed routes exist for AI crawlers/agents: `src/pages/llms.txt.ts` (linked
summary) and `src/pages/llms-full.txt.ts` (full content dump) — both pull from
`getCollection()` across posts/stories/newsletters/books/music/av/gear. Update both if a
new collection should be crawlable this way. `src/pages/rss.xml.ts` is the standard RSS
feed. Sitemap priority/changefreq per path pattern is hand-tuned in
`src/utils/sitemap.ts` (`customizeSitemapItem`), wired in via `@astrojs/sitemap` in
`astro.config.ts` — new top-level sections need an entry here or they fall through to the
generic `priority: 0.6` branch.

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

Note: the "Images: three sources" section above still documents the old Supabase pipeline (`supabase-images.ts`, `SupabaseImage.astro`, `PUBLIC_SUPABASE_URL`) — main's R2 migration replaced these with `r2-images.ts`/`R2Image.astro`, but this doc wasn't updated to match. Worth a follow-up pass, unrelated to the reorg work.

### Not done yet

1. **`podcasts`, `videos` (av), `clients`, `newsletters` still use the row/list layout.** Same grid treatment (summary field + compact link list + `listStyle: 'grid'` + dynamic-route case) can be applied on request.
2. **`posts` has messy legacy category data.** Most posts (815+) have an empty `categories:` field; some have garbage single-line values inherited from an old WordPress export (e.g. `categories: projects odtwe`) that aren't valid YAML lists and won't match `getEntryCategories()`. Only a handful of newer 2025 posts have proper `categories: [writing]` lists. Needs real cleanup/backfill.
3. **`podcasts`, `av`, `stories`, `clients`, `newsletters` have zero entries with a `categories`/`category` value matching the new taxonomy.** `stories` and `clients` do have `tags`, but those are unrelated free-form values (e.g. stories: "fiction"/"fantasy"; clients: "Kubernetes"/"Bazel") that don't map to tech/writing/music/games — so these collections currently produce **empty archives** on `/[category]/[contentType]` and are invisible in the new nav until frontmatter is backfilled or a mapping/fallback is added.
4. **Old standalone listing pages still exist in parallel** with the new dynamic route: `src/pages/books/[...page].astro`, `src/pages/games/[...page].astro`, `src/pages/music/[...page].astro`, plus `stories`, `blog`, `podcast`, `videos`, `newsletter`, `clients` pages. Not yet consolidated, redirected, or removed.
5. **No redirects** from old URLs (`/books`, `/games`, `/music`) to new category-based URLs if/when those old routes get removed.
6. **Pre-existing, unrelated bug:** `RelatedPosts.astro` throws `TypeError: currentCategories.map is not a function` on older blog posts whose `category` frontmatter is a plain string rather than an array. This aborts a full `astro build` entirely (confirmed via `npm run build`, exit code 1) before later pages (like the books archive) get generated. `astro dev` is unaffected. Not yet fixed.

### Next priorities

(a) backfill `categories` frontmatter on posts/podcasts/av/stories/clients/newsletters so the new archive routes aren't empty; (b) fix the `RelatedPosts.astro` crash since it blocks production builds; (c) decide whether to keep, redirect, or delete the old standalone listing pages now that `/[category]/[contentType]` covers the same ground — confirm with Chris before deleting routes or committing to a URL redirect scheme, since that affects live site URLs/SEO.
