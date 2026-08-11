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
