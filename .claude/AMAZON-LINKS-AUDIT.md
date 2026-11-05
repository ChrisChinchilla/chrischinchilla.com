# Amazon affiliate links audit

Task list for adding Amazon.com affiliate links (`tag=gregamamma-20`) to physical products mentioned in content. Rules are in "Amazon affiliate links" in `.claude/CLAUDE.md`: verify the listing is live, match the exact model, never guess an ASIN, and leave a `%% TODO %%` when unsure.

Link format: `https://www.amazon.com/dp/<ASIN>?tag=gregamamma-20`

## Status

Started 2026-11-05. Only the first item is done.

| Item | Status |
|---|---|
| `gear/blue-yeti.md`: Logitech Creators Blue Yeti, Blackout (`B00N1YPXW2`) | Done. Listing found in search results; not opened on Amazon. Check the price and stock before publishing. |
| Gear pages without an Amazon link | To do (see below) |
| Posts from 2024 to 2026 | To do |
| Posts from 2023 and earlier | To do, lower priority |

## Scope and method

1. Pick a batch (one year, or the gear collection).
2. List physical products mentioned without a link. Skip software, services, and anything already covered by a `go.chrischinchilla.com` link in `src/data/support.json`.
3. For each product, find the Amazon.com listing and confirm the exact model and that it is buyable today. Do not link pre-orders, announced products, or crowdfunding.
4. Link the first mention in the post body only. Leave existing links alone.
5. Record the product, ASIN, and decision in the log below.

## Gear pages

Without an Amazon link at the time of writing:

- `gear/keychron-mechanical-keyboard.md`: already uses the Keychron go link. Likely skip.
- `gear/flexispot-desk.md` and `gear/flexispot-lotus-chair.md`: use Flexispot's own campaign links. Likely skip.
- `gear/adobe-*.md`, `gear/descript.md`, `gear/obs.md`: software. Skip.

## Posts

Posts that already have an Amazon link: 2024 has 2 of 15, 2025 has 0 of 18, and 2026 has 1 of 24. Older posts are not counted here. Likely candidates are reviews and gear posts. Start with:

- `posts/2026/transcription-devices-eurekamind-vs-plaude.md` (check for an existing affiliate link first, such as `go.chrischinchilla.com/eurekamind`)
- `posts/2026/ifa-2026.md` (many products, mostly new; confirm each is on sale)
- `posts/2024/my-audio-video-setup.md`
- `posts/2025/focus-macos-raycast.md` (probably software only)

## Decisions to make while working

- EU readers: no EU Associates tag exists, so links go to Amazon.com only.
- Bundles and renewed units: link the standard new listing, not a bundle.

## Log

| Date | Post | Product | ASIN | Decision |
|---|---|---|---|---|
| 2026-11-05 | `gear/blue-yeti.md` | Logitech Creators Blue Yeti, Blackout | `B00N1YPXW2` | Linked. Chris said any current Yeti model is fine. |
