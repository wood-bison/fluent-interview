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
pnpm dev
```

The root `pnpm` command is only a friendly entrypoint: it starts Question Brain
and Task Runtime first, waits for their readiness contracts, then starts Fluent
Lab. The three repositories and their Compose boundaries remain independent.
Open `http://localhost:47300/`.

For the packaged local release:

```bash
pnpm dev:production
```

The packaged learner surface opens at `http://localhost:49300/onboarding`.

Useful variants:

```bash
pnpm dev:quick                 # reuse existing images
pnpm dev:production:quick      # packaged release, reuse existing images
pnpm status                    # Git, Compose, health, and observability report
pnpm down                      # stop services without deleting volumes
pnpm ports                     # verify the workspace port registry has no duplicates
```

The underlying `scripts/*.sh` commands remain available for automation and
recovery. `pnpm dev` is the normal human-facing command.

## Where Nx fits

The architecture is intentionally hybrid, as described in the workspace
decision report:

- `pnpm` at this directory is the polyrepo launcher. It coordinates processes
  and Compose projects; it does not duplicate service source code or database
  ownership.
- Nx is already the project/task graph for the TypeScript Fluent Lab
  workspace. Use `pnpm lab:graph` or `pnpm lab:affected` there.
- Question Brain and Task Runtime are Go repositories. They can be orchestrated
  by a runner, but Nx does not automatically share Go dependency graphs,
  compile-time types, or cross-repository changes. Their boundaries stay
  versioned HTTP/schema contracts and their own Go toolchains.

This gives one short command for development without pretending that different
languages and independent release units are one source tree.

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
