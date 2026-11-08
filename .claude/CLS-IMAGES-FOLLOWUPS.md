# CLS and remote images: follow-ups

Google Search Console (2026-11-08) flagged desktop CLS above 0.1 on:

- `/videos/5-alternative-web-browsers-for-macos-that-arent-safari-or-chrome-P8JUzs2BNq4` (0.12, 62 URLs in group)
- `/blog/2025/grammarly-desktop-alternatives` (0.11, 24)
- `/blog/2024/7-alternative-text-editors-and-ides-for-macos` (0.14, 7)

## Suspected cause (unverified)

Markdown body images (`![alt](https://...supabase.co/...)`, or relative paths rewritten to R2 URLs by
`src/utils/remark-r2-images.mjs`) render as plain `<img>` with no `width`/`height`, so no space is
reserved and the page shifts as each loads. The video page's cause wasn't investigated (check the
YouTube embed, footer `NewsletterSignup` iframe, `SupportBlock` affiliate widgets, fonts).

## Ideas

- Add the Supabase and R2 hosts to `image.domains` in `astro.config.ts` (R2 host via Vite `loadEnv`,
  as the config runs before .env loads) so Astro infers dimensions for remote Markdown images.
  Caveat: the build then fetches every such image and may fail on a dead URL. Note that
  `.claude/CLAUDE.md` claims `astro.config.ts` already allow-lists the R2 host; it doesn't.
- Alternatively finish the Supabase to R2 migration (63 Markdown images still on Supabase), then
  handle R2 only.
- Or a rehype plugin / build script that records dimensions for remote images and injects them.
- Measure first: run Lighthouse/PageSpeed on the three URLs and read the "Avoid large layout shifts"
  element list rather than guessing.
- Audit other sources of shift site-wide: web font swap, `SupportBlock` inline sponsor, embeds.
