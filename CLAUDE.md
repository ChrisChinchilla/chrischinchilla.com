# chrischinchilla.com

Astro-based personal site (blog, books, music, games, client work, etc.) for Chris Chinchilla.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (astro build)
- `npm run check` — astro check (types)
- `npm run lint` / `npm run lint:fix` — eslint
- `npm run format` / `npm run format:check` — prettier

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

### Not done yet

1. **`podcasts`, `videos` (av), `clients`, `newsletters` still use the row/list layout.** Same grid treatment (summary field + compact link list + `listStyle: 'grid'` + dynamic-route case) can be applied on request.
2. **`posts` has messy legacy category data.** Most posts (815+) have an empty `categories:` field; some have garbage single-line values inherited from an old WordPress export (e.g. `categories: projects odtwe`) that aren't valid YAML lists and won't match `getEntryCategories()`. Only a handful of newer 2025 posts have proper `categories: [writing]` lists. Needs real cleanup/backfill.
3. **`podcasts`, `av`, `stories`, `clients`, `newsletters` have zero entries with a `categories`/`category` value matching the new taxonomy.** `stories` and `clients` do have `tags`, but those are unrelated free-form values (e.g. stories: "fiction"/"fantasy"; clients: "Kubernetes"/"Bazel") that don't map to tech/writing/music/games — so these collections currently produce **empty archives** on `/[category]/[contentType]` and are invisible in the new nav until frontmatter is backfilled or a mapping/fallback is added.
4. **Old standalone listing pages still exist in parallel** with the new dynamic route: `src/pages/books/[...page].astro`, `src/pages/games/[...page].astro`, `src/pages/music/[...page].astro`, plus `stories`, `blog`, `podcast`, `videos`, `newsletter`, `clients` pages. Not yet consolidated, redirected, or removed.
5. **No redirects** from old URLs (`/books`, `/games`, `/music`) to new category-based URLs if/when those old routes get removed.
6. **Pre-existing, unrelated bug:** `RelatedPosts.astro` throws `TypeError: currentCategories.map is not a function` on older blog posts whose `category` frontmatter is a plain string rather than an array. This aborts a full `astro build` entirely (confirmed via `npm run build`, exit code 1) before later pages (like the books archive) get generated. `astro dev` is unaffected. Not yet fixed.

### Next priorities

(a) backfill `categories` frontmatter on posts/podcasts/av/stories/clients/newsletters so the new archive routes aren't empty; (b) fix the `RelatedPosts.astro` crash since it blocks production builds; (c) decide whether to keep, redirect, or delete the old standalone listing pages now that `/[category]/[contentType]` covers the same ground — confirm with Chris before deleting routes or committing to a URL redirect scheme, since that affects live site URLs/SEO.
