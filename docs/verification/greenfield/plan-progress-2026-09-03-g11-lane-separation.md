# Progress snapshot — G11 lane separation

Date: 2026-09-03

## Fixed defect

The PREP_ONLY review plan previously placed three source documents (`README`,
an audit and a raw backlog file) in the same worksheet as real Question Cards
and assigned all six records the same ten-field question-authoring workflow.
That would invite authors to manufacture questions and answers from repository
documentation.

Target implementation commit `5d11527` introduces explicit workflow lanes:

- `content-authoring`: 1,594 question, concept, behavioral and best-practice
  records in 80 bounded packets;
- `source-disposition`: 3 non-content source documents in one bounded packet,
  requiring only source identity, content-kind verification, canonical
  disposition and reviewer decision.

The first packet `G11-P001` now contains only `NT-701`, `NT-702` and `NT-710`.
The source-document packet is isolated as `G11-P081`. Total coverage remains
exactly 1,597/1,597 records with no source body copied and no serving/release
write. Evidence commit `0b29557` refreshes the R14 lifecycle index.

## Verification

- focused lane/worksheet tests: 9/9 PASS;
- complete content gates: PASS;
- evidence-input and evidence-schema checks: PASS;
- evidence lifecycle: 95/95 files classified, 35 current and 60 retained as
  superseded, zero unclassified/overlapping;
- full `pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check`, and
  `git diff --check`: PASS;
- live stack: six expected services ready, 18/18 migrations;
- 12 acceptance routes: 12/12 returned HTTP 200.

## Progress boundary

This fixes the preparation workflow but does not replace human mapping,
authoring, review or current-main G10S-246 acceptance. Counters therefore stay
at 665 checked / 469 formal remaining, 277 executable remaining and 127
non-destructive remaining. No push or deletion was performed.

