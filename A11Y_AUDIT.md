# Accessibility Audit — chrischinchilla.com

**Date:** 2026-08-09
**Commit audited:** `5bb2983` (post #165 newsletter grid refactor, #163 social share links, #161 Cloudflare R2 image swap, #158 dependency/build hardening)
**Scope:** Static code review of layouts, components, and styles across light and dark mode (Tailwind `class`-strategy dark mode). This is not a substitute for automated tooling (axe, Lighthouse) or manual screen-reader/keyboard testing — both are recommended as a follow-up once the items below are addressed.

This document is a snapshot for planning purposes. It is not implemented yet — see the task checklist at the end for a prioritized to-do list.

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

4. **Dark mode toggle is orphaned and lacks `aria-pressed`.**
   `src/components/common/ToggleTheme.astro` has an `aria-label` (default "Toggle between Dark and Light mode") but no `aria-pressed`/state indicator. More importantly, it is currently commented out and not rendered in `Header.astro:99,151` or `HeaderNoLogo.astro` — there is no way for a user to toggle dark mode via the UI at all right now. This is a product/UX gap as much as an accessibility one; needs a decision on whether the toggle should be reinstated, and if so, fixed to expose state via `aria-pressed`.
   *WCAG: 4.1.2 Name, Role, Value (Level A).*

5. **Borderline/low text contrast, both themes.**
   `text-gray-500` (light mode) / `text-gray-400` (dark mode) is reused widely for icon buttons and secondary text: `ToggleTheme.astro:14`, `ToggleMenu.astro:14`, `Header.astro:154`, `Footer.astro:121`, `ShareLinks.astro:35,46`. Post dates use `text-gray-600 dark:text-gray-400` (`src/layouts/PageLayout.astro:79`). Against `bg-white` (light) / `dark:bg-slate-900` (dark, set in `src/layouts/BaseLayout.astro:28`), several of these combinations are borderline or fail WCAG AA (4.5:1 for text, 3:1 for UI components/icons). Needs a measured contrast pass (not just code inspection) in both themes.
   *WCAG: 1.4.3 Contrast (Minimum) (Level AA), 1.4.11 Non-text Contrast (Level AA).*

6. **Search modal uses hardcoded hex colors, not theme-aware.**
   `SearchComponent.astro`/`SearchBar.astro` use hardcoded grays (`#6b7280`, `#9ca3af`) instead of Tailwind `dark:` variants, so contrast in dark mode hasn't been deliberately tuned and is likely insufficient.
   *WCAG: 1.4.3 Contrast (Minimum) (Level AA).*

7. **`alt` text is only soft-enforced on images, and inconsistently.**
   `alt` is a required TypeScript prop on both image components, but `src/components/common/OptimizedImage.astro:42-44` only `console.warn`s on an empty value rather than failing the build, and `src/components/common/R2Image.astro` doesn't warn at all. Given the recent Supabase→R2 image swap (#161), `alt` text should be spot-checked across content for regressions introduced during migration.
   *WCAG: 1.1.1 Non-text Content (Level A).*

### Minor

8. **Legacy layout hardcodes `lang="en"`.**
   `src/layouts/Layout.astro:10` hardcodes `lang="en"` instead of reading the site's language config the way `src/layouts/BaseLayout.astro:21` does (`<html lang={language} dir={textDirection}>`). Confirm whether `Layout.astro` is still referenced anywhere; if so, bring it in line for consistency (low impact today since the site is English-only, but worth fixing if the layout survives).
   *WCAG: 3.1.1 Language of Page (Level A) — currently satisfied by coincidence, not by design, in the legacy layout.*

9. **Verify heading hierarchy on the new newsletter grid cards.**
   The #165 refactor moved the newsletter list to the standard content grid layout. `src/pages/newsletter/[...page].astro` and its `PageLayoutNoBG` wrapper look structurally sound (single top-level heading, header/main/footer landmarks retained), but the `Newsletter.astro` card component's internal heading level should be spot-checked to confirm it doesn't duplicate or skip levels relative to the page's h1.
   *WCAG: 1.3.1 Info and Relationships (Level A).*

10. **Confirm `prefers-reduced-motion` coverage is complete.**
    A `@media (prefers-reduced-motion: reduce)` rule exists in `src/assets/styles/mobile.css:229-232` and is imported site-wide via `BaseLayout.astro:3` — good baseline. Worth confirming it covers all `transition`/`animate-*` Tailwind utility classes used across components, not just the rules already scoped in `mobile.css`.
    *WCAG: 2.3.3 Animation from Interactions (Level AAA, best practice).*

## Task Checklist

- [ ] Add `aria-expanded` (and toggle it in JS) to the mobile menu toggle (`ToggleMenu.astro`) and desktop nav dropdown buttons (`Header.astro`), following the pattern in `AIShare.astro`
- [ ] Add a skip-to-content link to the base layout, targeting the `<main>` landmark
- [ ] Replace `title`-only labeling on icon-only share links/buttons with `aria-label` or visually-hidden text (`ShareLinks.astro`, `SocialShare.astro`)
- [ ] Decide whether to reinstate the dark mode toggle in `Header.astro`/`HeaderNoLogo.astro`; if kept, add `aria-pressed` to `ToggleTheme.astro`
- [ ] Run a measured contrast check (e.g. axe/Lighthouse) on `text-gray-500`/`text-gray-400` usages in both light and dark mode and adjust shades where they fail WCAG AA
- [ ] Convert hardcoded hex grays in the search modal (`SearchComponent.astro`/`SearchBar.astro`) to theme-aware Tailwind classes
- [ ] Make `alt` text validation fail the build (or at minimum warn consistently) in both `OptimizedImage.astro` and `R2Image.astro`; audit existing content for missing `alt` text post-R2-migration
- [ ] Fix or remove the hardcoded `lang="en"` in the legacy `Layout.astro` if it's still in use
- [ ] Spot-check `Newsletter.astro` card heading level against the page's h1 for correct hierarchy
- [ ] Confirm `prefers-reduced-motion` rules in `mobile.css` cover all `transition`/`animate-*` usage across components
- [ ] Run a full automated pass (axe-core or Lighthouse a11y audit) and a manual keyboard/screen-reader pass once the above items are addressed, to catch anything static code review missed
