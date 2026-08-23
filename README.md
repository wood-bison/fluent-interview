# Fluent Interview workspace

This is the desktop-first workspace for the Fluent Interview platform. It
coordinates three independent repositories without merging their source or
ownership:

| Repository | Responsibility |
| --- | --- |
| `fluent-engineering-lab` | learner UI, curriculum projection, progress, evidence |
| `fluent-question-brain` | canonical questions, locales, graph, search, releases |
| `fluent-task-runtime` | task revisions, sandboxes, hidden tests, execution traces |

## One command

Start the complete local development stack from this directory:

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
./scripts/up.sh
```

The launcher starts Question Brain and Task Runtime first, waits for their
readiness contracts, then starts Fluent Lab. Open `http://localhost:47300/`.

For the packaged local release:

```bash
./scripts/up.sh --production
```

The packaged learner surface opens at `http://localhost:49300/onboarding`.

Useful variants:

```bash
./scripts/up.sh --no-build   # reuse existing images
./scripts/status.sh           # Git, Compose, health, and observability report
./scripts/down.sh             # stop services without deleting volumes
./scripts/ports.sh            # verify the workspace port registry has no duplicates
```

## Service surfaces

| Service | API/readiness | Operator UI |
| --- | --- | --- |
| Question Brain | `127.0.0.1:48127` | Payload `localhost:48128/admin`; Jaeger `localhost:56686` |
| Task Runtime | `127.0.0.1:48227` | Jaeger `localhost:56687` |
| Fluent Lab dev | web `localhost:47300`, API `localhost:47000` | learner UI |
| Fluent Lab package | web `localhost:49300`, API `localhost:49301` | learner UI |
| Fluent Lab durable data | Postgres `localhost:49302`, Redis `localhost:49303` | package-owned volumes |

Each service keeps its own Compose project and durable volumes. Do not use
`docker compose down -v` during normal operation. The workspace does not share
database tables or ORM models; cross-service communication uses versioned
HTTP contracts and released projections. Host-facing binds are kept in the
dedicated high-port registry in `workspace.yaml`; container-internal ports stay
standard and are never exposed directly to the host.

The parent is an orchestrator, not a fourth Compose project. `scripts/status.sh`
shows the required services and any enabled Lab observability profile;
`scripts/down.sh` removes all three named projects plus enabled Lab profile
containers/networks without deleting their volumes. All local runtime, database and telemetry
binds are loopback-only. See the [Docker stack and resource audit](docs/audits/docker-stack-resource-audit-2026-08-23.md)
for provenance, cleanup and memory evidence.
