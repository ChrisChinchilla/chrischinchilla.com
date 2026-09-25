# Accessibility Audit — chrischinchilla.com

**Date:** 2026-08-09
**Follow-up:** 2026-09-16
**Commit audited:** `5bb2983` (post #165 newsletter grid refactor, #163 social share links, #161 Cloudflare R2 image swap, #158 dependency/build hardening)
**Scope:** Static code review of layouts, components, and styles across light and dark mode (Tailwind `class`-strategy dark mode). This is not a substitute for automated tooling (axe, Lighthouse) or manual screen-reader/keyboard testing — both are recommended as a follow-up once the items below are addressed.

This document began as a planning snapshot. All static-review findings and the content
image audit are now implemented; the remaining validation item is described in the task
checklist.

## Findings

### Critical

1. **Menu/dropdown toggles have no `aria-expanded` state.**
   The mobile menu toggle (`src/components/common/ToggleMenu.astro:20`) and the desktop nav dropdown buttons (`src/components/widgets/Header.astro:113`) have no `aria-expanded` attribute, and no client-side JS in the repo sets `aria-expanded`/`aria-pressed` on `data-aw-toggle-menu` or `data-aw-toggle-color-scheme` elements. Screen reader users get no indication of whether a menu is open or closed.
   *WCAG: 4.1.2 Name, Role, Value (Level A).*
   *Reference fix pattern already in the repo:* `src/components/common/AIShare.astro:32,134-144` correctly toggles `aria-expanded` — use as the template for the other toggles.

2. **No skip-to-content link.**
   No skip link exists anywhere in `src/layouts/` or `src/components/widgets/`. Keyboard users must tab through the full navigation on every single page before reaching main content.
   *WCAG: 2.4.1 Bypass Blocks (Level A).*

3. **Icon-only share links use `title` instead of an accessible name.**
   `src/components/common/ShareLinks.astro:34-53` and `src/components/common/SocialShare.astro:14-28` render icon-only `<a>`/`<button>` elements labeled only via the `title` attribute (`ShareLinks.astro:37,47`). `title` is not a reliable accessible name — it's not exposed to touch users and screen reader support is inconsistent.
   *WCAG: 4.1.2 Name, Role, Value (Level A), 1.1.1 Non-text Content (Level A).*

### Moderate

4. **Dark mode toggle is orphaned and lacks `aria-pressed`.** ~~Fixed~~
   `src/components/common/ToggleTheme.astro` has an `aria-label` (default "Toggle between Dark and Light mode") but no `aria-pressed`/state indicator. More importantly, it is currently commented out and not rendered in `Header.astro:99,151` or `HeaderNoLogo.astro` — there is no way for a user to toggle dark mode via the UI at all right now. This is a product/UX gap as much as an accessibility one; needs a decision on whether the toggle should be reinstated, and if so, fixed to expose state via `aria-pressed`.
   *WCAG: 4.1.2 Name, Role, Value (Level A).*
   *Resolution:* reinstated in both headers. Root cause of the original comment-out was that `tabler:sun` wasn't in the `astro-icon` allowlist (`astro.config.ts`), so the build failed — added `sun`/`moon` to the allowlist and switched to a proper sun/moon icon swap via `dark:` classes. `aria-pressed` now syncs with theme state in `BasicScripts.astro`.

5. **Borderline/low text contrast, both themes.** ~~Investigated — no change needed~~
   `text-gray-500` (light mode) / `text-gray-400` (dark mode) is reused widely for icon buttons and secondary text: `ToggleTheme.astro:14`, `ToggleMenu.astro:14`, `Header.astro:154`, `Footer.astro:121`, `ShareLinks.astro:35,46`. Post dates use `text-gray-600 dark:text-gray-400` (`src/layouts/PageLayout.astro:79`). This item originally flagged these as "borderline/failing" from static code inspection alone.
   *WCAG: 1.4.3 Contrast (Minimum) (Level AA), 1.4.11 Non-text Contrast (Level AA).*
   *Resolution:* measured actual contrast ratios against the resolved Tailwind v4 palette: `gray-500` on white = 4.84:1, `gray-400` on `slate-900` = 6.85:1, `gray-600` on white (dates) = 7.56:1 light / 6.85:1 dark. All already clear the WCAG AA thresholds (4.5:1 text, 3:1 icons/UI) — no code change made. Original estimate was overly cautious; left as a corrected finding for the record rather than a to-do.

6. **Search modal uses hardcoded hex colors, not theme-aware.** ~~Partially fixed~~
   `SearchComponent.astro`/`SearchBar.astro` use hardcoded grays (`#6b7280`, `#9ca3af`) instead of Tailwind `dark:` variants, so contrast in dark mode hasn't been deliberately tuned and is likely insufficient.
   *WCAG: 1.4.3 Contrast (Minimum) (Level AA).*
   *Resolution:* the file already handles theme-awareness via `.dark` class selector overrides (not Tailwind's `dark:` utility syntax, but functionally equivalent) — measuring each pair found only one real failure: the search input's `::placeholder` had light/dark colors swapped, giving 2.54:1 (light) and 3.03:1 (dark), both under AA. Swapped the two values to match the already-passing pattern used everywhere else in the file (4.83:1 light / 5.76:1 dark). All other hardcoded grays in the file (close button, result date/description/tags, no-results message) were already using the correct, passing ordering.

7. **`alt` text is only soft-enforced on images, and inconsistently.** ~~Fixed~~
   `alt` is a required TypeScript prop on both image components, but `src/components/common/OptimizedImage.astro:42-44` only `console.warn`s on an empty value rather than failing the build, and `src/components/common/R2Image.astro` doesn't warn at all. Given the recent Supabase→R2 image swap (#161), `alt` text should be spot-checked across content for regressions introduced during migration.
   *WCAG: 1.1.1 Non-text Content (Level A).*
   *Resolution:* added the same `console.warn` check to `R2Image.astro` so both components warn consistently on empty `alt`. Kept as a warning rather than a build failure by decision. The follow-up content and rendered-output audit covered all 1,726 Markdown/MDX content files and all 2,029 generated HTML pages. It added meaningful alt text to 14 screenshots and explicit empty alt text to 19 decorative RSS icons; the existing empty alt text on 1×1 affiliate tracking pixels remains intentionally decorative. The final rendered scan reports zero images without `alt` and zero non-decorative empty values.

### Minor

8. **Legacy layout hardcodes `lang="en"`.** ~~Resolved — deleted as dead code~~
   `src/layouts/Layout.astro:10` hardcodes `lang="en"` instead of reading the site's language config the way `src/layouts/BaseLayout.astro:21` does (`<html lang={language} dir={textDirection}>`). Confirm whether `Layout.astro` is still referenced anywhere; if so, bring it in line for consistency (low impact today since the site is English-only, but worth fixing if the layout survives).
   *WCAG: 3.1.1 Language of Page (Level A) — currently satisfied by coincidence, not by design, in the legacy layout.*
   *Resolution:* traced all references — `Layout.astro` was only imported by `src/layouts/Event.astro` and `src/layouts/Client.astro`, and neither of those was imported by anything in `src/pages` (the live `/events` and `/clients` routes render through the differently-named `src/components/Event.astro`/`Client.astro` instead). All three were confirmed-dead code and deleted per repo convention rather than patched.

9. **Verify heading hierarchy on the new newsletter grid cards.** ~~Verified — correct, no fix needed~~
   The #165 refactor moved the newsletter list to the standard content grid layout. `src/pages/newsletter/[...page].astro` and its `PageLayoutNoBG` wrapper look structurally sound (single top-level heading, header/main/footer landmarks retained), but the `Newsletter.astro` card component's internal heading level should be spot-checked to confirm it doesn't duplicate or skip levels relative to the page's h1.
   *WCAG: 1.3.1 Info and Relationships (Level A).*
   *Resolution:* `Headline.astro` renders the page title as `<h1>`, and each `Newsletter.astro` card renders its title as `<h2>` — correct hierarchy, no skipped or duplicate levels. No stray headings in `Header.astro`/`PageLayoutNoBG.astro`/`LogoChinch.astro` to conflict. No change needed.

10. **Confirm `prefers-reduced-motion` coverage is complete.** ~~Verified — already comprehensive~~
    A `@media (prefers-reduced-motion: reduce)` rule exists in `src/assets/styles/mobile.css:229-232` and is imported site-wide via `BaseLayout.astro:3` — good baseline. Worth confirming it covers all `transition`/`animate-*` Tailwind utility classes used across components, not just the rules already scoped in `mobile.css`.
    *WCAG: 2.3.3 Animation from Interactions (Level AAA, best practice).*
    *Resolution:* the rule targets `*, *::before, *::after` with `!important`, which overrides `animation-duration`/`transition-duration` globally regardless of how the animation/transition was declared (Tailwind utility class, scoped component CSS, or inline style). This already covers every case in the codebase — no gaps found, no change needed.

11. **Dark mode silently stopped applying, making listing-card summaries unreadable.** ~~Fixed~~
    Two defects compounded. (a) The theme bootstrap in `src/components/common/BasicScripts.astro`
    lives in a `<script is:inline>` block, which Astro ships to the browser verbatim — no
    TypeScript transpiling. Two `(elem as HTMLElement).focus()` casts added alongside the Escape-key
    focus-restoration work threw `SyntaxError: Unexpected identifier 'as'` at parse time, killing
    the *entire* block: `initTheme()` never ran, so the `.dark` class was never added to
    `<html>` and every `dark:` utility on the site went dead (as did the mobile menu toggle,
    dropdown handling, the theme toggle's `aria-pressed` sync, and `motion-safe:scroll-smooth`).
    (b) `src/assets/styles/mobile.css` keyed its dark-mode block on `@media (prefers-color-scheme: dark)`
    rather than the `.dark` class the rest of the site uses, so an OS-level dark preference alone
    set `body { background-color: #0f172a }` on viewports ≤640px. With (a) suppressing the class,
    the result was `text-gray-900` body text on a near-black background — measured 1.01:1, i.e.
    invisible. Listing-card summaries (`.post-body`, which has no colour of its own and inherits
    from `<body>`) were the most visible casualty; card titles stayed legible because the same
    media query recoloured links to `#60a5fa`, which is why the symptom read as "summary text
    is missing".
    *WCAG: 1.4.3 Contrast (Minimum) (Level AA).*
    *Resolution:* dropped the two TS casts (plain `elem.focus()` — the values are already
    elements at runtime), and rescoped the `mobile.css` block to `.dark body` / `.dark .prose` /
    `.dark a` so OS preference alone never restyles anything. Verified in headless Chromium at
    390px and 1280px: summary contrast is now 12.0:1 across `/blog`, `/books`, `/clients`,
    `/music`, `/games`, `/newsletter`, `/stories`, `/gear`, `/tech/blog`,
    `/writing/newsletters` and `/`. The (b) fix also removes a light-mode failure that (a) had
    been masking: a visitor on a dark-OS phone who picks light mode used to get `#60a5fa` links
    on white (2.54:1). Scanned every other `is:inline` script in `src/` for TypeScript syntax —
    this was the only instance.

## Task Checklist

- [x] Add `aria-expanded` (and toggle it in JS) to the mobile menu toggle (`ToggleMenu.astro`) and desktop nav dropdown buttons (`Header.astro`, `HeaderNoLogo.astro`), following the pattern in `AIShare.astro` — dropdowns also gained `aria-haspopup`, click/outside-click/Escape handling, and `:focus-within` CSS for keyboard use
- [x] Add a skip-to-content link to the base layout, targeting the `<main>` landmark (added `id="main-content"` to `<main>` across all layouts)
- [x] Replace `title`-only labeling on icon-only share links/buttons with `aria-label` (`ShareLinks.astro`, `SocialShare.astro`)
- [x] Reinstate the dark mode toggle in `Header.astro`/`HeaderNoLogo.astro`; add `aria-pressed` to `ToggleTheme.astro` (also fixed the underlying `astro-icon` allowlist bug that caused the original build failure)
- [x] Measure actual contrast for `text-gray-500`/`text-gray-400` usages in both light and dark mode — confirmed all already pass WCAG AA, no change needed
- [x] Fix the search modal's placeholder text contrast (`SearchBar.astro`) — light/dark colors were swapped, causing a real AA failure; other hardcoded grays in the file were already correct
- [x] Warn consistently (not build-fail) on missing `alt` text in both `OptimizedImage.astro` and `R2Image.astro`
- [x] Fix or remove the hardcoded `lang="en"` in the legacy `Layout.astro` — deleted it and its two dead-code dependents (`Event.astro`, `Client.astro`) instead, since none were referenced anywhere
- [x] Spot-check `Newsletter.astro` card heading level against the page's h1 — confirmed correct (h1 → h2), no change needed
- [x] Confirm `prefers-reduced-motion` rules in `mobile.css` cover all `transition`/`animate-*` usage — confirmed, the global `*` selector already covers every case
- [x] Audit existing content for missing `alt` text introduced during the R2 migration — scanned 1,726 content files and all 2,029 rendered pages; fixed 14 screenshots and 19 decorative RSS icons, leaving zero rendered omissions
- [x] Fix dark mode failing to apply at all (TypeScript casts in an `is:inline` script) and rescope `mobile.css`'s dark block from `prefers-color-scheme` to the `.dark` class — together these had left listing-card summary text at 1.01:1 on mobile; now 12.0:1
- [ ] Complete the external-browser portion of the automated/manual validation. A rendered static audit across 16 representative page types found and fixed an unlabeled search input and duplicate newsletter heading ID, then passed with zero unnamed buttons/links/inputs, duplicate IDs, missing main landmarks, or heading-level skips. Static keyboard review also added search-dialog focus restoration, live-result announcements, and Escape/focus handling for navigation menus. Lighthouse/axe and an actual screen-reader session remain pending because no browser runner was available and the PageSpeed API returned HTTP 429 during the 2026-09-16 follow-up.

## Newsletter sign-up (2026-09-25)

`NewsletterSignup.astro` (site-wide via `Footer.astro`) replaces the home-page embed, which
had the Substack iframe nested inside an `<h2>` (so the heading's accessible name was empty
and the form was announced as heading content) and no iframe `title`. The section is now
`aria-labelledby` its own `<h2>`, and the iframe has a descriptive `title` and loads lazily. (A native
form was tried and reverted; see CLAUDE.md.) Measured contrast on the card background:
light mode — eyebrow `brandGrey` 6.9:1, body `gray-700` 9.3:1, date `gray-600` 6.8:1; dark
mode — eyebrow `brandYellow` 8.9:1, body `slate-300` 10.8:1, date `slate-400` 6.2:1.
