# W15 findings

## Passed

- Initial JS is 305,380 bytes raw / 94,833 bytes gzip, below the 350,000 /
  110,000 budgets.
- Initial CSS is 48,423 bytes raw / 9,572 bytes gzip, below the 60,000 budget.
- xterm is a 331,270-byte dynamic asset and is absent from the initial import
  graph; CodeMirror/editor code is likewise route/lab loaded.
- Vite manifest contains the route chunks and all referenced assets exist.
- Questions are rendered through a 24-item cursor page with explicit
  `loadNextPage`, not an unbounded 1,591-card DOM.

## Remaining W15 debt

- Interaction/render timing budgets and network traces for every canonical
  route remain part of W17.
- Dependency cleanup (`ts-jest`, Nx inferred targets, color-env warnings),
  evidence retention and remote-cache policy require owner decisions and are
  not silently removed by this build gate.
- Fresh-clone/package-size and promoted SBOM checks remain blocked by dirty
  child repositories and the local-only Vue remote.
