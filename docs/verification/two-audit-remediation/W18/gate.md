# Gate W18 — PASS

The compact-shell and Question Library remediation is verified against the
released local package at `http://localhost:49300`.

- Vue owner checks: typecheck, lint, 14 unit tests and production build PASS.
- Desktop 1440×900: the incumbent rail remains expanded, the advanced filter
  set remains available, the internal scroll owner has 6,319px of content, and
  the page has no horizontal overflow or console/page errors.
- Compact 390×844: the rail is semantically collapsed (`aria-expanded=false`),
  the contextual rail card is absent, controls meet the compact target, and
  advanced filters start behind an explicit disclosure. The internal scroll
  owner has 15,568px of content and reaches the question grid without a broken
  document scroll.
- Search typing is bounded by a 240ms debounce: no request is emitted during
  the first 80ms of a burst and exactly one released query follows.
- Cross-service route validation is green: 43 web routes, 16 API probes and 27
  semantic path checks; release identities and the 1,591-card published count
  remain aligned.
- The package upgrade used a fresh redacted backup and restore preflight; data
  is preserved and no learner progress or content release was modified.

This closes the concrete P1 compact-shell/filter/search findings from the
independent Impeccable review. The remaining P2 work (further vocabulary
distillation and a richer search command palette) is intentionally tracked as
follow-up UX work rather than hidden by this gate.
