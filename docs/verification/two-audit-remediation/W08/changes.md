# W08 changes

- Added the deterministic `learning-module-release.v1` manifest with 17
  reusable module families and 1,591 answer-free primary placements.
- Added `derive-learning-module-release.mjs`, which joins the published Brain
  release to Lab-owned modules and fails if the Brain projection is empty or
  missing release identity.
- Added `learning-module-release-gate.mjs` and package commands. The gate
  checks exact Brain/graph release pins, all-card coverage, duplicate tuples,
  contiguous positions, module-family presence, full prerequisite DAGs,
  shared/native/future visibility, and private-field absence.
- Shared domains are represented once and pathless; language/runtime cards keep
  explicit native paths. Python remains a future preview placement until its
  sandbox profile is released.
- Added ADR-0041 and integrated the gate into the root development release
  verifier. No question payloads, answers, Docker volumes, or history were
  deleted.
