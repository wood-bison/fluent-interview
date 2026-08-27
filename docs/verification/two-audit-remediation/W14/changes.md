# W14 changes — token and material boundary

- Added documented type, spacing and motion scales to the shared Vue token
  source (`--fel-type-*`, `--fel-space-*`, `--fel-motion-*`, `--fel-ease-*`).
- Moved the shared Button, RuntimePicker and rail transitions to token-backed
  duration/easing values.
- Added `docs/design-system/fluent-design-tokens.v1.md` with semantic roles,
  Tailwind 4 policy, Liquid Glass boundary and change ownership.
- Added the read-only `scripts/design-token-audit.mjs` gate and root scripts
  `design:tokens` / `design:tokens:check`.

The gate scans feature source, not generated `dist`, and deliberately permits
literal palette values only in the token source.
