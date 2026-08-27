# W17 findings

## Passed

- All 35 Vue route records are unique, lazy-loaded, covered by a concrete
  browser sample and have an explicit history/scroll policy with a recovery
  route and canonical aliases.
- All 43 sampled web routes returned the SPA HTML shell with HTTP 200,
  including stale/unpublished, project, lesson, TaskFamily, workspace,
  ordering and Studio paths.
- All 16 API probes passed. Program, inventory, Practice and Progress share
  the same graph and manifest identity; Question Brain and Runtime expose the
  same published universe.
- The bounded Question Brain page is limited to 24 records and is cursor
  aware. Brain/Lab both report 1,591 published cards, and the published Brain
  release excludes fixtures.
- Code and PostgreSQL rate-limit TaskFamilies remain separate; no SQL revision
  is advertised by the code family.
- The current Vue E2E suite remains green at 102 scenarios on the MacBook Pro
  light and Studio Display dark projects.
- Current/current and previous/current Question Brain envelopes are accepted by
  the released Vue boundary schema (14 contract tests), including learner-safe
  placement metadata.
- The browser route matrix passed on both desktop projects for every sample:
  each view exposed a meaningful h1, emitted no console error/warning, produced
  no failed request, stayed within the document and shared-main width, and all
  captured internal hrefs returned HTTP 200.
- The semantic path matrix passed 27/27 checks: all nine path projections
  reconcile their published counts, expose native/shared/proposed/unmapped
  placement metadata without leaking source mapping fields, keep native
  language/runtime markers isolated, and preserve Algorithms/System
  Design/Behavioral coherence. Python exposes no fake runnable runtime.
  W17-026 remains open because the released Frontend path has no Vue-native
  topic yet.
- The negative boundary gate passed five checks: invalid release IDs, stale and
  malformed revisions, incompatible family selection and the owner retry/
  idempotency/timeout suite (54 targeted tests) all fail closed or replay
  deterministically.
- The seven-test named golden suite passes 14/14 executions across both desktop
  projects. It
  covers theory-only, incomplete and rich answer layers; five rate-limiter
  language revisions; PostgreSQL row-lock SQL boundary; project-book
  checkpoint; and local-AI cancellation. The visual/state suite passes 8/8
  executions for locale/theme, keyboard, reduced motion/transparency and 200%
  zoom.
- The language-editor row opens all five released rate-limiter workspaces on
  both desktop profiles and verifies that CodeMirror's lazy grammar matches the
  selected JavaScript, TypeScript, Go, Java or C# revision.
- W17-040 is now closed by a real isolated Task Runtime run: `pg-locks-016`
  on PostgreSQL 17 returned 5/5 passing concurrency checks (including
  overlapping-claim, skip-locked and running-state assertions).
- W17-041 is now closed by an isolated server-owned ordering commit for
  `ordering-docker-build-cache` (8/8 cards correct; explanation still gated).
- W17-042 is now closed by an isolated `node-cpu-bound-002` runtime run on
  Node.js 24 (4/4 worker, responsiveness, cancellation and cleanup checks).
- W17-045 is now closed by a real AppModule HTTP integration: initial run,
  accepted explanation, linked cold-repeat, pass stamp and retained comeback
  projection all passed without exposing private identifiers.
- The Brain ↔ Runtime release-join gate passed 27/27 checks: the published
  question release and Runtime dependency share the same ID, 22 task bindings
  match revision/content hashes, and 19 runnable plus one explicitly deferred
  revision carry immutable hashes.
- The latest aggregate development verifier passes 50/51 steps. The only
  non-pass is the explicit `package-provenance-plan` warning caused by dirty or
  unpinned source roots; no production promotion was attempted.
- A concurrent cold-load probe initially reproduced a real Question Brain
  quality instability: four Postgres-backed `/v1/quality` projections could
  compete for the local pool, while Lab's 1.2s client budget expired before a
  healthy 1–2s operator read completed. Brain now coalesces identical quality
  reads behind a short process-local snapshot cache bounded to 32 entries, and
  Lab gives this operator-only projection a 4s bounded budget. A 20-request concurrent probe,
  the catalogue integrity check, and the full aggregate gate now return 200 /
  pass with no browser console error on `studio-system`.
- The canonical-route guard passes 8/8, and the live validation matrix now
  includes the two legacy `/program` and `/map` aliases (107/107 checks).

## Explicit remaining work

- The automated named golden and visual/state rows are green, but the plan
  still requires human screenshot diff and independent visual sign-off.
  Package-mode language drills remain open.
