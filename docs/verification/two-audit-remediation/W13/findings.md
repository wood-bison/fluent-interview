# W13 findings

## Passed in the current dev stack

- Vue Chromium E2E is green for both supported desktop profiles (76 scenarios
  in the current run), including the Program → Path → Questions and
  Program → Practice → TaskFamily → Workspace journeys.
- Runtime picker choices survive the Path projection into an exact workspace
  URL; editor tabs and language labels follow the selected profile.
- Event Loop evidence, code-workspace hidden checks, retry/outage/timeout and
  reload restoration are covered without stale evidence or browser console
  errors.
- RU/EN locale switches, light/dark theme, rail collapse, docked Navigator,
  AI settings and contextual AI identity are covered.

## Remaining W13 debt

- Synthetic-profile progress isolation still needs a dedicated scenario (not
  inferred from route reachability).
- The scroll owner is intentionally `.fel-main`; its Back/Forward and reload
  restoration is now explicit and guarded against router-generated zero events.
- Project-book promotion remains honest: missing/unreleased books must stay an
  explicit empty/locked state until a released book contract exists.
