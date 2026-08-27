# W16 changes — observability and learner analytics

## Implemented

- Added the root `observability-gate.mjs` with deterministic source/topology
  checks and an opt-in live probe. The gate fails closed for contract or
  privacy violations and reports offline optional collectors as warnings.
- Added root commands `observability:check`, `observability` and
  `observability:live`; the static gate is now part of `release-verify`.
- Extended the shared `observability.v1` forbidden-field boundary with
  `hiddenTests`, so operator records cannot accidentally carry private runner
  material.
- Extended `AiTelemetryService` with an internal conversation join,
  first-token capture and bounded aggregate latency/TTFT statistics. The
  snapshot exposes counts and averages only; conversation ids, prompts,
  provider output and run ids remain server-side.
- Wired the canonical AI conversation id and first-token event through
  `AiCompanionService` and the project-book guidance adapter. Duplicate terminal
  signals are idempotent and cannot double-count latency.
- Added a finite learner-event vocabulary for CTA/readiness/help/reveal,
  failed-run, explanation, repeat and semantic-gate outcomes. Labels stay
  bounded and contain no profile, task, question or correlation identifiers.
- Added a browser-tab session marker and a label-free
  `fel_learner_time_to_first_run_seconds` histogram. The API ignores invalid or
  stale markers, records only after the first run is persisted, and
  de-duplicates the same marker with a bounded process-local registry.
- Propagated source revision, release id and environment through Lab health,
  logs and traces; Runtime and Brain images now expose their exact release
  identity in readiness responses.

## Existing contracts verified by W16

- Correlation id and W3C trace propagation across Lab, Runtime and Brain.
- Pick-only structured logging, bounded metric labels and bounded replay/retention.
- Studio-only aggregate diagnostics and redacted replay; learner routes are
  rejected by the Studio boundary guard.
- Pinned local Prometheus, Loki, Promtail, Grafana and Jaeger topology with
  explicit retention and named volumes.
- Added an explicit `question-brain` Prometheus scrape target and ADR-0042;
  the live target inventory now proves both Brain and Task Runtime are `up`.
- Added `observability-journey-gate.mjs` and `jaeger-continuity.json`: a
  disposable `node-rate-limiter-001` run passes 4/4 released tests, carries
  one correlation id from learner route through Lab to Task Runtime, and
  shares a Jaeger trace across the two services. The same run increments the
  first-run histogram once and leaves Sergey’s stable progress projection
  hash unchanged.
- The current live gate passes 24 static checks and 15 live checks (9 required
  and 6 optional) with zero warnings or failures. The remaining W16 contract
  gap is the full route → question → family → revision → attempt join
  (W16-003), not collector health or trace continuity.
