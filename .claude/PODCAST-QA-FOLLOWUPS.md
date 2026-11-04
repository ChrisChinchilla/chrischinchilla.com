# Podcast Q&A merge: open items

Design and file map: see "Done: podcast Q&A merged into episode pages" in `.claude/CLAUDE.md`.

## To do

1. **Migrate the remaining Q&A posts by hand.** Per post: `npm run merge-qa -- <post-file> <podcast-slug>`
   (dry run), then `npm run merge-qa:apply -- ...`. If the episode has a YouTube video, add its ID to
   `src/data/video-matching-ignore.json`. The stub filename must equal the slugified feed title.
2. **Check the 301s on a Netlify deploy preview.** Old `/blog/2026/cybersecurity-dark-wolf` and
   `/blog/2026/next-app-devcon` should redirect to their `/podcast/<slug>` pages.
3. **A11y follow-up.** Measure contrast of the Q&A table-of-contents box and do a keyboard and
   screen-reader pass (see `.claude/A11Y_AUDIT.md`).
4. **Rich results.** Run an episode page through Google's Rich Results Test once deployed.

## Considered, not done

- **Podcasts / Q&A in `rss.xml`.** The show has its own Simplecast feed and how it relates to the
  site feed is muddled, so decide that first. Until then migrated Q&As drop out of the site RSS.
- **Sitemap `lastmod` from the Q&A date** for `/podcast/*` (add it to `DATED_SECTIONS` in
  `src/utils/sitemap.ts`). JSON-LD `datePublished` is currently the RSS `pubDate`; the Q&A date is
  the stub's `publishDate`.
- **`FAQPage` markup.** Skipped on purpose: Google restricts FAQ rich results, and headings plus
  `text` in the JSON-LD cover answer engines.
