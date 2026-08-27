# W15 changes — loading boundary and performance evidence

- Vite now emits `dist/apps/web/manifest.json` so initial and dynamic import
  boundaries are inspectable rather than inferred from console output.
- Added `scripts/vue-performance-gate.mjs` and root commands
  `performance:vue` / `performance:vue:check`.
- The gate measures raw/gzip initial JS/CSS, verifies xterm is lazy and within
  its own budget, confirms all manifest assets exist, and checks that the
  question list uses bounded cursor pagination.
- The aggregate development release verifier runs this gate after the Vue
  owner check.

Current build evidence keeps xterm out of the initial route and records the
actual generated asset sizes in `vue-performance.json`.
