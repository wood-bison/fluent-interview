# W04 findings — Docker, OCI provenance and lifecycle

## Fixed and verified

- The three product Compose projects render and run without duplicate project
  names. The unrelated exited `spearad-test-stack` remains outside the owned
  cleanup boundary.
- Brain API/indexer/CMS and Task Runtime Dockerfiles now pin every `FROM`
  image by digest and fail the build when `SOURCE_REVISION` is not a real Git
  SHA.
- The umbrella launcher exports the exact current Brain/Runtime revisions
  before build, so normal `pnpm dev` cannot create an `unknown` source label.
- Live inspection confirmed immutable image IDs and matching 40-character OCI
  revision labels for all four built service containers.
- Task Runtime already rejects mutable task image references, uses `--pull
  never`, and verifies the inspected digest immediately before execution.
- `status` reports Lab API readiness and observability readiness; `down` no
  longer hides Compose/package stop failures.
- `prune --plan` is now a read-only first step that lists exact owned legacy
  candidates and explicitly preserves durable volumes and unrelated resources.
- Development and packaged mode now have one explicit ownership guard. A live
  launcher lock is observable via `pnpm mode:check`; a second mode cannot
  start, and an endpoint left behind without a lock is treated as an unmanaged
  conflict instead of being silently adopted.

## Still open

- The production package still needs a clean, committed five-root release
  tuple before W04 can be promoted as production evidence.
- Service images in the package release should receive an explicit digest
  manifest (local development images intentionally remain locally built tags).
- SBOM/provenance attestations and a tested exact-digest rollback are not yet
  part of the release artifact.
- Normal-down/restart data-preservation and optional-profile stop need a fresh
  lifecycle run after the clean package tuple exists.
- The current development restart proves the lock path; package-mode
  persistence and exact digest rollback remain intentionally deferred until a
  clean production package boundary exists.
