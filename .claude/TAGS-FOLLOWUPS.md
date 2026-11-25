# Tag follow-ups

Tag clean-ups are done with `normalize_tags.py` (see `.claude/CLAUDE.md`). Rounds so far:
2026-11-25, 826 → 725 distinct tags.

## Conventions

- Tags use British spelling (`Humour`, `Visualisation`, `Data Centre`). US spellings redirect
  automatically: `src/utils/tag-redirects.ts` derives them from the live tags.
- Title Case for every tag, apart from established brand/acronym casing (`iOS`, `macOS`, `gRPC`).
- After merging or renaming tags, run `python3 normalize_tags.py --redirects-from <last-deployed-ref>`
  to add the old tag pages to `src/data/tag-redirects.json`.
- `Tech`, `Writing`, `Music` and `Games` tags also drive site categories (`getEntryCategories()`).
  `Technology` was merged into `Tech` deliberately, so those entries now appear under `/tech`.

## Open items

- **Proofreading tags, deliberately left separate:** `Grammar`, `Grammar checking`,
  `Spell checking`, `Style checking`, `Linting`. Decide whether they should become one
  `Proofreading` tag or stay split by technique (Vale posts use `Linting`).
- **Ambiguous pairs to revisit:**
  - `CD` vs `Continuous Delivery` vs `Continuous Deployment`: `CD` is used for both.
  - `Mac` (hardware) vs `macOS` (software) vs `Apple`.
  - `Developing` vs `Development`.
- **Data tags left alone:** `Data`, `Big Data`, `Data Science`, `Data Privacy`, `Data Streaming`,
  `Time-series Data`. Only `Data Analysis` was merged into `Data Analytics`.
- **Other possible merges:** `Cloud Considerations`, `Cloud Storage` and `Public Cloud`/`Private Cloud`
  (not merged into `Cloud Computing`); `Monitoring` (separate from `Observability`);
  `AIMusic` and `OpenMusicAI` (could become `AI` + `Music`); `Web3Js` vs `Web3`.
- **Tag `Ces 2020`** became `CES` rather than being dropped, since it names an event, not a year.
