# W04 changes

- Pinned Brain Go/distroless/Node base images and Runtime Go/Docker CLI base
  images by registry digest.
- Added fail-closed Docker build checks for `SOURCE_REVISION`.
- Added `scripts/docker-provenance-check.mjs` with static and live modes and
  wired the static check into `release:verify`.
- Added `docker:provenance:check`, `docker:provenance:check:static` and
  `verify` aliases to the umbrella package scripts.
- Added a read-only `--plan` mode to the scoped prune command.
- Rebuilt and recreated Brain/Runtime services without touching durable
  volumes; readiness and live provenance checks passed.
- Added a workspace-owned `development|production` mode guard. The launcher
  claims it before Compose changes, `pnpm down` releases it, and a second
  mode is rejected while the recorded owner or learner endpoint is live.
- Added a deterministic Node test covering acquisition, conflict, stale-owner
  release and clear-state behavior (`pnpm mode:guard:test`).
