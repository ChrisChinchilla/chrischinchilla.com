# Video ↔ article matching: status and open items

Design and file map: see "Done: video ↔ article canonicalisation" in `.claude/CLAUDE.md`.
Everything below is what is still undecided or unverified.

## Status (2026-11-04)

Steps 1–8 are implemented: schema, matcher, review script, article embed with chapters and
transcript, 301 redirects, content API / llms / MCP, a11y and SEO audit notes, plus an npm script
and a weekly report workflow. 11 videos are paired (all primary; `relatedYoutubeIds` is supported but unused until IFA is decided).

## Decisions made

- **Podcast episodes are never paired.** Where an article and video are also a Tech Lounge podcast
  episode, the podcast is canonical. `next-app-devcon` and `cybersecurity-dark-wolf` were
  un-paired (`youtubeId: false`, videos in `src/data/video-matching-ignore.json`). The rule is in
  `.claude/CLAUDE.md`. Matching now also checks titles against `src/content/podcasts` and skips
  anything that looks like an episode (18 of the 50 newest videos), so most episodes without
  articles no longer appear as "no plausible article". Revisit once the podcast content is tidied.
- **MySQL** (`3oYQP8_weRE`): a separate piece from `2025/30-years-mysql`. Left unpaired.
- **CoTypist developer interview** (`4J1HKrfnt1A`): a separate content item (a podcast episode) from
  the hands-on review, not a related video. Unpaired, kept on `/videos`, and added to
  `src/data/video-matching-ignore.json`.

## Decisions still needed

1. **IFA 2026**: three 2026 videos (`J7oNAXIzRt4` input devices/smart plants/e-ink,
   `GHohnveeItY` mini PCs/local AI/NAS, `Onj_cXZUbR8` audio gear) and IFA 2025 (`wqQnM2DacHI`)
   all score against `2026/ifa-2026`. `relatedYoutubeIds` now makes "one main video plus related
   ones" possible; the alternative is leaving them as plain `/videos` pages. IFA 2025 is probably
   not a match for a 2026 article.
2. **Transcripts for the other 13 videos.** One is stored (`IjAObCPYqNw`, TypeBoost) as a
   sample. VidIQ costs 5 credits per transcript (about 65 more, 195 available on 2026-11-04) and
   they are raw auto-captions with errors (your name comes out as "Christian Chiller", product
   names are misspelled). Decide whether to buy the rest, and whether to correct the TypeBoost
   one before publishing. The page labels them as auto-generated and unproofread.
3. **Weak or unconfirmed**: `ZwayH1JVGf0` ("audio and video editing tools") ↔
   `2024/my-audio-video-setup` (score 0.47); `k9inOINfKOo` (Guardian) has no article.
4. **Videos with no article found** (50 newest). Many of these are probably Tech Lounge podcast
   episodes with no article, so they are correctly unpaired; add any that are to
   `src/data/video-matching-ignore.json` so they stop appearing in the weekly report: Task Bag, Enclave, Luca Belli, OpenMusicAI
   (`A-csrXP6rXk`; maybe `2026/openmusic-helpful`), Den Odell, NameQuick, memory leaks, Ricardo
   Noriega, Ableton walkthrough, Mike McQuaid, Docling, Tailscale, Netlify, Baladad, Keep the
   Heroes Out, Depot, Platform9, Cribl, Momento, Chosen Path, Vale MCP, EFF, FOSDEM, Continue,
   drums, writing tips, Sentry, Onehouse, AsciiDoc guide. Several are interviews that may map to
   articles under other titles (e.g. `2026/lf-energy-berlin-2026`). Re-check by hand.
5. **Older videos** (about 490, before 2025-03-13) are not scanned and are excluded from
   automatic matching (`AUTO_MATCH_FROM`). Run `npm run match-videos` with `GOOGLE_API` set for
   the full report, pair by hand, and move the date back once a batch is reviewed.

## Not verified

- **Redirects with the real playlist.** The local build has no `GOOGLE_API`, so `dist/_redirects`
  was emitted but contained no rules. Check it in a Netlify deploy preview: each paired video's
  old `/videos/<slug>-<id>` URL should 301 to the article.
- **Chapters.** They come from timestamps in the YouTube description, which also needs the
  playlist at build time; none were rendered locally. Check a video whose description has chapters.
- **The weekly workflow.** Needs a `GOOGLE_API` repository secret; not run. Trigger it once from
  the Actions tab (`workflow_dispatch`).
- **Rich results.** Run a paired article through Google's Rich Results Test once deployed.
- **Accessibility.** Keyboard and screen-reader pass on a built article page (see
  `.claude/A11Y_AUDIT.md`).
