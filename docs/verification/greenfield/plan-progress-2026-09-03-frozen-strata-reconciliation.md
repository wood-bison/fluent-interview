# Progress snapshot — immutable Strata reconciliation

Date: 2026-09-03

## Outcome

The target platform no longer requires the mutable Strata working tree to be
checked out at the retirement commit. Target implementation commit `9ba2789`
adds an explicit git-ref mode; evidence commit `56988d3` binds the repeat to
`strata-archive-2026-09-01-g10s-217` at
`ec3b6804ecc1d08e3ab355be0c78930a46b34815`.

The immutable snapshot reconciles successfully:

- source manifest: `41/41` files, `159,515` bytes, zero drift, zero missing;
- transfer: `13` mappings + `28` dispositions, zero uncovered;
- target migrations: contiguous `18/18`;
- PostgreSQL: `12/12` inherited + `16/16` platform invariants and `12` role checks;
- focused tests: `6/6`;
- evidence index: `733/733`, zero historical rewrites;
- full check, boundary, toolchain, evidence-input and diff gates: PASS.

Current Strata `main` at `0921dd0271983244a5cc96301ba0b242369cafd2` remains
visible as a separate clean working-tree fact. It is not silently promoted to
the retirement snapshot and does not invalidate the frozen-ref comparison.

## Progress boundary

This is corrective hardening of the already-checked G10S-210 gate. It does not
close a new checkbox, so counters remain:

- formal: **665 / 469 / 1,134**;
- executable: **665 / 277 / 942**;
- non-destructive: **665 / 127 / 792**;
- product closure remaining: **72**;
- requalification and independent review remaining: **55**;
- deferred G13 decommission: **150**.

G10S-246 still needs a human owner decision bound to current target `main`.
G11 authoring packets therefore remain PREP_ONLY and cannot promote serving or
learner releases. No repository, Docker resource, volume, cache, or legacy
entity was deleted. No push was performed because CI usage is intentionally
being conserved.

## Next safe order

1. Present the refreshed G10S-246 current-main packet for human acceptance.
2. After that exact acceptance, execute the bounded G11-P001 human
   mapping/authoring/review slice.
3. Record its immutable evidence commit and re-run G11.2–G11.6 focused gates.
4. Continue packet-by-packet without direct serving writes or auto-promotion.

