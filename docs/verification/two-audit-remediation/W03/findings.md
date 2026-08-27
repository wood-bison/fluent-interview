# W03 findings — CI, version truth and aggregate release gate

## Fixed and verified

- Every child workflow is inventoried by a machine-readable root check. The
  check rejects stale Angular/Nx references, stale task-image paths and calls
  to scripts that are not present.
- Brain CI now covers formatting, tests, `go vet` and an isolated Postgres
  backup/restore smoke. Runtime CI covers formatting, tests, vet and immutable
  image-manifest checks. Lab and Vue workflows keep frozen installs and their
  owner checks.
- Root `release-verify.mjs` runs topology, contract, CI-inventory, Docker
  provenance, glossary/code, browser-owner, all five diff checks, both owner
  quality suites, graph release audit, curriculum shape/funnel and bounded live
  development checks.
- The aggregate report is valid and machine-readable. It includes readiness,
  route, semantic placement, question-catalog, accessibility, visual,
  desktop-regression and Vue E2E results.
- A failed `learning-api` test caused by the new required-layer/readiness
  field was fixed at the typed fixture boundary; the complete owner suite is
  green again.
- The aggregate gate now runs 48 steps, including the executable current/current
  and previous/current schema compatibility gate and the W17 negative
  runtime-boundary gate. G12 digest drift was detected after the
  domain release changed and repaired by regenerating the matrix/disposition
  evidence from the live API; both checks are green again.

## Explicit gaps

- Production promotion remains false while the five-root source tuple is
  dirty and Vue has no verified remote. This is a provenance warning, not a
  hidden pass.
- Vue CI still needs a dedicated two-viewport route E2E job; local aggregate
  E2E is green but is not yet a hosted workflow guarantee.
- Umbrella CI/bootstrap, runtime release-join and G14 hardening remain open plan
  items and are not represented as complete by this wave. The production graph
  audit itself is now part of the aggregate gate.
