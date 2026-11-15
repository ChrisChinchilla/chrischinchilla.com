# Podcast Q&A merge: open items

Design and file map: see "Done: podcast Q&A merged into episode pages" in `.claude/CLAUDE.md`.

## To do

0. **Luca Belli (Hidden Influences) Q&A written straight into the stub** (2026-11-14), no source post. Needs the specific Manning book URL (the body links manning.com generically) and, if a YouTube video exists, its ID in `src/data/video-matching-ignore.json`.

0b. **Enclave Q&A written straight into the stub** (2026-11-14), no source post. Only Tal appears (Yanir's recording was lost). If a YouTube video exists, add its ID to `src/data/video-matching-ignore.json`.

0c. **Daniel Gräfe (Timing/CoTypist) Q&A written straight into the stub** (2026-11-14), from a MacWhisper transcript with many ASR errors (checked names/terms by hand). Video `4J1HKrfnt1A` is already in the ignore list. Check the in-body link to the CoTypist review post resolves.

0d. **Ricardo Noriega / Doug Smith (video generation, vLLM Omni) Q&A written straight into the stub** (2026-11-14), from a MacWhisper transcript; speakers attributed by topic (Doug = vLLM CI/LTX-2 experiments, Ricardo = Kubernetes/OpenShift). The GitHub Gist from their talk is not linked yet. Video `7KwTYjCBvxs` added to the ignore list.

0e. **Peter Staar (Docling) Q&A written straight into the stub** (2026-11-14), from a MacWhisper transcript. Check the Docling GitHub link and the "ISO-style standard" wording against the standard's release. Video `vRg6StHiMdI` added to the ignore list.

0f. **Den Odell (Fast by Default) Q&A written straight into `den-odell.md`** (2026-11-14), from a transcript attached by Chris (no Descript project found). Needs the specific Manning book URL (only the go link is used) and, if a YouTube video exists, its ID in `src/data/video-matching-ignore.json`.

0g. **Rita Barbosa (Guardian Labs) Q&A written straight into `ai-powered-protection-from-digital-fraud-with-guardian.md` (renamed from `guardian-proactive-...` to match the feed title)** (2026-11-15), from Descript project "Chris and Rita". The stub filename (`guardian-proactive-...`) differs from the feed title ("AI powered protection from digital fraud with Guardian"), so check the page resolves. No YouTube video found; if one exists add its ID to `src/data/video-matching-ignore.json`. Confirm guardianlabs.eu.

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
