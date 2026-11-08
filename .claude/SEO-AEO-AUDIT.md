# SEO/AEO Audit — chrischinchilla.com

A point-in-time inventory of how the site currently handles SEO (traditional search
crawlers) and AEO (answer-engine / LLM consumption: llms.txt, structured data, clean
semantic content). Findings only — no prioritization here, see `SEO-AEO-PLAN.md` for
that.

**Update:** the "Quick wins" items from `SEO-AEO-PLAN.md` have since been implemented on
this branch. Findings below are marked `Status: Fixed` where applicable; the rest remain
open and are tracked in the plan.

## 1. Meta tags

**Status: Fixed** (dead-code part) — see below.

All rendered pages go through one consistent stack:
`src/layouts/BaseLayout.astro:5,23` → `src/components/common/MetaTags.astro`.
`BaseLayout` renders `<MetaTags {...meta} />` in `<head>`. `MetaTags.astro` directly
renders the title (with template `` `%s — ${SITE.name}` ``),
description, canonical (`getCanonical()`, or a `publication_url` override for syndicated
content), Open Graph, Twitter card,
`google-site-verification`, GA/Splitbee analytics, and favicon/sitemap `<link>` tags.
`PageLayout.astro`, `PageLayoutNoBG.astro`, and `MarkdownLayout.astro` build the `meta`
object per page from frontmatter (e.g. `MarkdownLayout.astro:44-63`: `description =
summary || description || title`, OG `article` fields for
`publishedTime`/`modifiedTime`/`authors`/`tags`).

**Correction to an earlier draft of this audit**: a previous pass claimed a second, bare
layout (`src/layouts/Layout.astro`, with only `<title>` and no description/canonical/OG/
Twitter) was live and used by `src/layouts/Client.astro`/`src/layouts/Event.astro` for
clients/events detail pages. That was wrong — re-checked directly against the actual
routes: `src/pages/clients/[...page].astro` and `src/pages/events/[...page].astro` render
via `~/components/Client.astro`/`~/components/Event.astro` (list-card *components*, a
different pair of files from the similarly-named *layouts*) inside `PageLayoutNoBG.astro`,
which uses the standard `BaseLayout`/`MetaTags` stack with real `meta.title`/
`meta.description` objects. Neither `clients` nor `events` currently has individual
per-entry detail pages at all (only paginated list pages) — this differs from the
llms.txt/RSS findings below, which are real coverage gaps for these two collections.
`src/layouts/Layout.astro`, `src/layouts/Client.astro`, and `src/layouts/Event.astro` had
no importers anywhere in `src/` and have been deleted as dead code so they can't be
accidentally reused as an SEO-incomplete layout later.

## 2. robots.txt

**Status: Fixed.** `public/robots.txt` now also references `/llms.txt` and
`/llms-full.txt` (as a comment, per the informal `llmstxt.org` convention — `robots.txt`
has no formal directive for this) alongside the existing sitemap reference, so crawlers
checking robots.txt have a discovery path to them instead of having to guess the
well-known filenames.

## 3. Sitemap

`@astrojs/sitemap` is wired in `astro.config.ts` (`sitemap({...})` around line 82) with
`serialize: customizeSitemapItem` from `src/utils/sitemap.ts`. That function
(`src/utils/sitemap.ts:4-64`) hand-assigns `priority`/`changefreq` per path prefix:

- `/` → 1.0 / weekly
- `/blog` index → 0.9 / daily; individual posts → 0.8 / monthly
- `/stories`, `/videos`, `/podcast/`, `/books/`, `/music`, `/gear`, `/newsletter`, `/events`,
  `/clients`, `/games` → 0.7–0.8, weekly/monthly (see below — `/newsletter` etc. now have
  dedicated branches instead of falling through)
- `/courses` → 0.6 / monthly (explicit branch, same value as the fallback but no longer
  falling through to it)
- **Still generic fallback** (0.6 / monthly): `/contact`, `/community`, `/cv`, `/support`

**Status: Fixed.** Individual blog post `lastmod` was previously hardcoded to `new Date()`
at build time, so every post reported "modified today" on every rebuild regardless of
whether it actually changed. `customizeSitemapItem` now reads each post's real
`publishDate` from its frontmatter (via a small `gray-matter`-based file scan of
`src/content/posts/`, since `@astrojs/sitemap`'s `serialize` callback only receives the
built URL, not collection data) and uses that as `lastmod`.

**Status: Fixed.** The per-collection sitemap coverage gap for `clients`, `events`, `games`,
`newsletter`, `courses` (previously falling through to the generic 0.6/monthly branch) is
closed — dedicated branches added, see the bullet list above. Fixing this surfaced a real
bug: newsletter issue slugs are 6-digit `ddmmyy` date codes (e.g. `/newsletter/010825`),
which the first version of the new pagination-detection regex matched too, misclassifying
every individual newsletter issue as a pagination page. Narrowed the regex to match only
1-2 digit page numbers; verified against the built `sitemap-0.xml` that every
`/newsletter/*` URL now gets the correct priority.

## 4. llms.txt / llms-full.txt

**Status: Fixed.** Two hand-rolled endpoints:

- `src/pages/llms.txt.ts` — index-only (title + link + one-line summary per entry).
- `src/pages/llms-full.txt.ts` — full body content inlined for self-hosted entries; a
  link-only stub (no body) for entries with a `publication_url` (syndicated elsewhere).

Both now pull `posts, stories, newsletters, books, music, av, gear, podcasts, games,
events, clients` — `podcasts`, `games`, `events`, and `clients` were added, closing the
gap CLAUDE.md flagged ("Update both if a new collection should be crawlable this way").
Since `games`, `events`, and `clients` have no individual detail pages (see finding 1),
their llms.txt entries link out to an external URL when the frontmatter has one
(`store_urls`, `pres_url`, `company_url`) and fall back to the section's list page
(`/games`, `/events`, `/clients`) otherwise.

**`supportLinks` was deliberately excluded**, not added: it's affiliate/promotional card
data rendered onto a single page (`src/pages/support.astro`) with no per-entry URL or
canonical content, unlike every other collection — including it would mean many llms.txt
lines all pointing at the same `/support` URL, which doesn't serve the "content index"
purpose the file is for. The static pages `cv.md`, `community.md`, `contact.mdx`, and
`courses.astro` (not content collection entries, so out of scope for the mechanical
collection-add above) now have their own "About" section in both files instead.

`robots.txt` links both files — see finding 2 (fixed). Every HTML page also advertises both
files from `MetaTags.astro` with the llms.txt v2 standard `rel="describedby"` relation and
`type="text/markdown"`; both endpoint responses now use the matching `text/markdown`
content type, reinforced by explicit Netlify rules in `public/_headers` for the static
deployment.

## 5. Structured data (JSON-LD)

**Status: Fixed.** `src/components/common/StructuredData.astro` is a general-purpose
schema generator supporting `Article`/`BlogPosting`, `Person`, `Organization`, `WebSite`,
`PodcastEpisode`, `VideoObject`, `CreativeWork`, and now `ItemList` (added — see below),
dispatched by a `type` prop.

Coverage, previously only 4 call sites (blog → `BlogPosting`, stories → `CreativeWork`,
videos → `VideoObject`, podcasts → `PodcastEpisode`), is now:

| Content type | File | Schema used |
|---|---|---|
| Blog posts | `src/pages/blog/[...id].astro` | `BlogPosting` |
| Stories | `src/pages/stories/[...id].astro` | `CreativeWork` |
| Videos | `src/layouts/VideoLayout.astro` | `VideoObject` |
| Podcasts | `src/layouts/PodcastLayout.astro` | `PodcastEpisode` |
| Books, music, gear, newsletters | detail pages | `CreativeWork` |
| Clients, events, games, courses | list pages | `ItemList` (new type) |
| Homepage | `src/pages/index.astro` | `Person`, `WebSite` |

`clients`, `events`, and `games` got `ItemList` rather than per-item `CreativeWork`
because — corrected in finding 1 — they have no individual detail pages, only paginated
lists; each list page now emits one `ItemList` scoped to its own page of items.
`Organization` was deliberately not added to the homepage: this is a personal site, and
`Person` is the correct schema.org type for an individual, not a company. The
`generatePersonSchema`/`generateWebSiteSchema` functions that were previously unreachable
dead code are now wired up; `generateWebSiteSchema`'s `SearchAction` (pointing at
`/blog?q={search_term_string}`) was removed in the process after verifying the site's
search (`SearchBar.astro`/`SearchComponent.astro`, `fuse.js`) runs entirely client-side
with no query-string-driven results URL — the action wouldn't have actually performed a
search.

Fixing this also surfaced a real bug: `src/layouts/PageLayout.astro` (homepage) and
`src/layouts/PageLayoutNoBG.astro` (clients/events/games/courses/support) never forwarded
a `head` named slot to `BaseLayout` at all — only `MarkdownLayout.astro` did. Any
`slot="head"` content passed into a page using either of those two layouts was silently
dropped. Both layouts now forward the slot.

`src/components/common/Breadcrumb.astro` independently emits its own `BreadcrumbList`
JSON-LD, previously rendered only when `MarkdownLayout.astro`'s `section` prop was passed
and truthy. `cv.md`, `community.md`, and `contact.mdx` set `layout:
'~/layouts/MarkdownLayout.astro'` in frontmatter but never set `section`, so they got no
breadcrumb. `MarkdownLayout.astro` now renders a plain `Home > <title>` breadcrumb whenever
`section` is absent, instead of skipping the breadcrumb entirely — fixing this without
inventing an artificial intermediate category for these three standalone pages.

## 6. Content collection schema (`src/content.config.ts`)

**Status: Fixed** (summary coverage and date optionality). SEO-relevant field coverage
across the 12 collections:

- `summary` (optional): present on `posts`, `clients`, `books`, `music`, `newsletters`,
  `stories`, `gear`, and now `av`, `events`, `games` too. `podcasts` deliberately still uses
  its existing `description` field instead of also adding `summary` — same purpose, no need
  for both.
- Dates: `posts.publishDate` is now required (previously
  `z.date().or(z.string()).optional()`) after auditing actual content — 0 of 928 post files
  were missing it, so tightening the schema needed no backfill. `stories.date` turned out to
  already be required at the schema level (`z.date().or(z.string())`, no `.optional()`); an
  earlier draft of this audit mischaracterized it as optional. The `.filter()` calls in
  `llms.txt.ts`/`llms-full.txt.ts` that worked around the old optional `posts.publishDate`
  have been removed as redundant.
- Images: required (non-optional) on `games`, `clients`, `books`, `music`, `av`; optional
  everywhere else including `posts`, `events`, `podcasts`, `newsletters`, `stories`, `gear`
  (unchanged — not in scope for this pass).

## 7. RSS feed

**Status: Fixed (scope decision made, partial extension).** `src/pages/rss.xml.ts`
aggregated only `posts` (via `fetchPosts()`), `newsletters`, `stories`, `books`, `music` —
narrower than llms.txt, which also includes `av` and `gear`. Rather than a blanket
all-or-nothing extension, each missing collection was checked individually and either
added or explicitly excluded with a reason:

- **`av` added** — has a required `publish_date` field, sorts correctly into the
  chronological feed.
- **`gear` excluded** — the collection has no date field at all; nothing to sort a
  chronological feed by.
- **`podcasts` excluded** — the content collection carries metadata but not a publish
  date; the real date only exists in the external Simplecast RSS feed that
  `src/pages/podcast/[...id].astro` fetches and merges at build time, which this feed
  doesn't replicate.
- **`games`, `events`, `clients` excluded** — portfolio/reference content rather than
  periodically-published material (a new client or past speaking engagement isn't "new
  content to subscribe to" the way a blog post or book release is); `games.publish_date`
  is also optional and frequently absent.

Feed is gated by `BLOG.disabled` returning a 404 (`rss.xml.ts:9-14`).

## 8. Existing SEO/AEO documentation

None. Grep across `*.md` and `src/` turns up only unrelated content-body mentions of "SEO"
inside blog post bodies (e.g. `src/content/posts/2024/9-transcription-tools-podcasters-video-creators.md`)
and one unrelated TODO in a draft post. No SEO/AEO-specific docs, TODOs, or issues exist
prior to this audit.

## 9. SEO/AEO-related dependencies

**Status: Fixed.** `@astrolib/seo` remained on `1.0.0-beta.8` with no stable release and
peer support capped below the site's Astro version. Its only consumer was the thin
`MetaTags.astro` wrapper, so the required title, description, robots, canonical, Open Graph,
article, and Twitter tags are now rendered directly and the dependency/override have been
removed. This also corrects the old library's invalid `og:article:*` property names to the
standard `article:*` namespace. `package.json` retains `@astrojs/sitemap` (^3.7.3),
`@astrojs/rss` (^4.0.19), and `@astrolib/analytics`. No `schema-dts` or other JSON-LD
type-safety package is used; llms.txt/llms-full.txt remain hand-rolled.

## 10. Semantic HTML / heading hierarchy

`MarkdownLayout.astro:77` renders a single `<h1>{frontmatter.title}</h1>` followed by the
markdown body in a `.prose` wrapper — correct single-H1-per-page pattern. `astro.config.ts`'s
markdown pipeline adds `rehype-slug` + `rehype-autolink-headings` for anchor-linkable body
headings (h2+), which helps both classic SEO deep-linking and AEO citation/quoting of
specific sections. `Breadcrumb.astro:28` uses semantic `<nav aria-label="Breadcrumb"><ol>`.
No issues found in this area.

## 11. Content freshness: `modifiedDate` / `updateNote`

Resurfacing an updated article without losing its ranking or citations means keeping the URL
and the original publish date, and reporting a separate, honest "last substantive edit" date
everywhere. Implemented 2026-11-02 via two optional frontmatter fields shared by every
collection that has a detail page (posts, stories, newsletters, books, music, gear, software —
defined once as `updateFields` in `src/content.config.ts`):

- `modifiedDate` — date of the last *substantive* edit (new facts, corrected steps, new
  sections, replaced screenshots). Do **not** set it for typo fixes; fake freshness is
  penalised by Google and is detectable by agents comparing content to dates.
- `updateNote` — short "what changed" note. Only surfaced when `modifiedDate` is set.

Where it surfaces:

- **Page**: `MarkdownLayout.astro` shows "Updated <date>" (a `<time datetime>`) beside the
  published date, plus a "What changed:" line. Hidden if the dates fall on the same day.
  `article:published_time` / `article:modified_time` are emitted as ISO strings.
- **JSON-LD**: each detail page passes `modifiedDate` to `StructuredData`, which already
  emitted `dateModified` (falling back to the publish date).
- **Sitemap**: `src/utils/sitemap.ts` now sets `lastmod` for all detail-page types from
  `modifiedDate`, else the original date (previously posts only, publish date only).
- **llms.txt / llms-full.txt**: `(updated YYYY-MM-DD)` on index lines; `Updated:` and
  `What changed:` lines in the full dump.
- **JSON API / MCP / WebMCP**: `modifiedDate` and `updateNote` on every record; `list_content`
  and `search_content` accept `updated_since`, and `list_content` has a `recently_updated`
  sort. `modifiedDate` is dropped from API output if it isn't after the original date.
- **RSS: deliberately unchanged.** Entries keep their original `pubDate`; changing it (or the
  guid) makes readers treat an edited post as new. Revisit only for major rewrites.

Not automated by design: there is no script listing stale posts; refresh candidates are chosen
by hand. After a meaningful update, request indexing in Search Console (and IndexNow for Bing).

## 12. Video ↔ article canonicalisation (2026-11-04)

When an article has a video version, the article is the single canonical URL and the video's own
page is removed rather than kept as a near-duplicate.

- **Pairing:** `youtubeId` (and `relatedYoutubeIds`) in post frontmatter, or an automatic
  title/date match for videos published since `AUTO_MATCH_FROM` in `src/utils/video-match.mjs`
  (conservative: high score, clear lead, one video per article). Older videos need explicit
  frontmatter. `src/utils/video-articles.ts` builds the map; `npm run match-videos` and the weekly
  `.github/workflows/video-matches.yml` report candidates.
- **Podcast episodes** are excluded from pairing (heuristic against `src/content/podcasts`, plus
  `youtubeId: false` and `src/data/video-matching-ignore.json`); see `.claude/CLAUDE.md`.
- **Redirects:** `/videos/<slug>-<id>` for a paired video is no longer built.
  `src/pages/[redirectsFile].ts` emits Netlify `_redirects` with `301!` rules to the article.
  The `/videos` list, the tech archive and the JSON API point at the article instead. No
  `canonical`/sitemap work was needed because the old page no longer exists. Not verified
  against a build that has the playlist (no `GOOGLE_API` locally), so check `dist/_redirects` in a
  deploy preview.
- **Structured data:** the article's `BlogPosting` carries a nested `video` `VideoObject` per
  video: `embedUrl`, `contentUrl`, `thumbnailUrl`, `uploadDate`, `duration`, `url` = the article,
  `transcript` (when stored) and `hasPart` `Clip`s for chapters. The VideoObject description is
  the article summary for the primary video.
- **Meta:** the article keeps its own title, description and image, so social cards are unchanged.
- **AEO:** `llms.txt` appends the watch URL to the article's line; `llms-full.txt` adds the video,
  chapters and a pointer to the transcript; `/api/content/blog/<id>.json` (and the MCP
  `get_content`) returns a `videos` array with chapters and the transcript text.
- **Data:** `src/data/videos/<id>.json` holds duration and upload date so article pages build
  without the YouTube API; chapters come from the YouTube description when the playlist is
  fetched, so they are absent in a build without `GOOGLE_API`.

## 13. Podcast episodes with a condensed Q&A (2026-11-04)

Q&A write-ups of Tech Lounge episodes live in the episode's stub (`src/content/podcasts/<slug>.md`),
not in `posts`; see "Done: podcast Q&A merged into episode pages" in `.claude/CLAUDE.md` for the
script and file map. The old `/blog/...` URLs 301 to `/podcast/<slug>` via `netlify.toml`.

What carries the Q&A: the episode page (meta description from `summary`, `PodcastEpisode` JSON-LD
with `text`/`keywords`/`dateModified`), `llms.txt` (summary), `llms-full.txt` (full body), and the
JSON API / MCP / WebMCP (`podcasts` entries have a `body` when a stub has one). Episode pages only
exist for episodes in the live RSS feed, so the stub filename must equal the slugified feed title.

Deliberately not done (consider later):
- Adding podcasts / Q&A to `rss.xml`. The show has its own Simplecast feed and the relationship
  between the two is muddled, so decide that first. Until then, migrated Q&A posts drop out of the
  site RSS.
- Using the Q&A's publish date for sitemap `lastmod` on `/podcast/*`.
- `FAQPage` markup: skipped, Google has restricted FAQ rich results; headings plus `text` cover it.

## Music release embeds (2026-11-08)

`src/utils/music-embed.ts` picks the player (Bandcamp > SoundCloud > Spotify; the Bandcamp numeric id
is scraped from the release page at build time, memoized, falling back to the next provider on
failure). `/music/<id>` `CreativeWork` JSON-LD now carries `sameAs` (every store/stream URL) and
`audio` (`AudioObject` with `embedUrl`); `StructuredData` passes `sameAs`/`audio` through for any
`CreativeWork` that supplies them. `llms-full.txt` lists each release's `Listen/buy (<label>): <url>`
links. Not done: `MusicAlbum`/`MusicRecording` types (would need track data), and `llms.txt` links.
