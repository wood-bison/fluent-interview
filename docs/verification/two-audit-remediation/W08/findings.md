# W08 findings

## Fixed

- Every published card in Brain has exactly one primary placement in the Lab
  release (`1591 / 1591`; missing `0`).
- The initial module catalogue contains 17 explicit families: universal/core,
  backend, data/PostgreSQL, HTTP/security, distributed, messaging,
  OS/networking, testing, delivery/observability, system design,
  behavioral/English, six native runtime families, and a Python preview.
- Shared domains have no path key, so the same card can be projected to all
  applicable TrackViews without a copy. Native cards retain their explicit
  path. Future Python cards are visibly preview-only.
- A full release-local prerequisite DAG is checked; missing prerequisites and
  multi-node cycles fail closed.
- The generated manifest contains no prompt, answer, hidden test, source, or
  provenance field.

## Remaining W08/W09 work

- Placements currently use the conservative `primary` role. Follow-up,
  contrast, and recall roles are supported by the contract but require
  human-reviewed content-graph edges before being promoted.
- Capability-to-question links are represented by module capability families;
  editorial per-card capability review and station bindings remain W08/W09
  work. The release must not be read as proof that every card has a
  human-written capability explanation.
- The module release is a Lab-owned file; a future service projection can
  publish it only if it preserves the same release pins and answer-free
  boundary.

## Evidence

Machine-readable report:

`docs/verification/two-audit-remediation/W08/learning-module-release.json`
