# Docker stack and resource audit — 2026-08-23

> **Current-state addendum — 2026-08-25.** This report preserves the original
> 2026-08-23 evidence, but its pre-migration Tempo/per-repository Jaeger
> snapshot is historical. The active stack now uses the shared Question Brain
> Jaeger (`56686`, OTLP `54317/54318`) for Brain, Runtime and Lab; Lab has no
> Tempo service or Tempo volume, and Task Runtime has no Jaeger container.
> Re-run `pnpm status` and `pnpm prune:workspace` for the current state.

## Verdict

PASS after remediation. The Fluent Interview workspace is three explicitly
named Compose projects coordinated by the parent scripts. It is not one giant
Compose project: each repository owns its own boundary, network and durable
data. The packaged Lab learner/API remains a host process started by the Lab
package launcher; its Postgres/Redis dependencies are part of the Lab Compose
project.

Two operational defects were fixed during this audit:

1. Question Brain API/CMS/Jaeger had stale Compose provenance from a removed
   checkout. The stack was recreated from the workspace checkout, without
   deleting its Postgres volume.
2. `scripts/down.sh` stopped only Lab Postgres/Redis. It now removes every
   stack container and network, including optional observability and broker
   profiles, while keeping named volumes.

The local-only boundary was also made explicit: all published host ports are
bound to `127.0.0.1`, and Compose service logs use a bounded `json-file`
policy (`10 MiB × 3`). Sandbox task containers disable Docker daemon log files
because the runtime captures stdout/stderr directly.

## Stack topology

| Compose project | Repository/config | Services in the stack | Durable data |
| --- | --- | --- | --- |
| `fluent-question-brain` | `fluent-question-brain/deploy/compose/compose.yaml` | `api`, `cms`, `postgres`, `jaeger` | `fluent-question-brain-postgres` |
| `fluent-task-runtime` | `fluent-task-runtime/deploy/compose/compose.yaml` | `runtime`, `jaeger` | none in the control stack; each task workspace is disposable |
| `fluent-engineering-lab` | `fluent-engineering-lab/docker-compose.yml` | required: `postgres`, `redis`; optional: `observability` (`prometheus`, `loki`, `promtail`, `grafana`); optional `broker` (`kafka`) | `fluent-engineering-lab-{postgres,prometheus,loki,grafana}-data` |

The parent workspace (`fluent-interview`) is an orchestrator, not a fourth
Docker stack. `scripts/up.sh`, `scripts/down.sh` and `scripts/status.sh` use
the explicit project names above. Networks are isolated as
`fluent-question-brain_default`, `fluent-task-runtime_default` and
`fluent-engineering-lab_default`.

## Provenance and naming check

After recreation, every running Fluent container reported the expected
Compose labels:

- project is one of the three names above;
- `com.docker.compose.project.working_dir` is under
  `/Users/sergeyzhechko/developer/fluent-interview`;
- `com.docker.compose.project.config_files` points to the current repository;
- restart count is `0` and `OOMKilled` is `false`.

The previous duplicate path in `docker compose ls` disappeared. Docker Desktop
now shows one coherent entry for each project, with no mixed old checkout.

## Port and exposure check

All 17 current workspace ports are unique and loopback-only. Internal container ports
remain standard (`5432`, `6379`, `8080`, `3000`, `4317/4318`, etc.); only host
ports are dedicated. The runtime API, databases, Jaeger instances and Lab
observability endpoints are not exposed to the LAN.

Use `./scripts/ports.sh` to validate the registry before startup.

## Resource and cleanup evidence

### Task sandbox

The runtime assembles every task container with:

- `--rm` and a namespaced `fluent-runtime-task-…` name;
- `--network none`, read-only solution/hidden-test mounts and a writable
  disposable output mount;
- task-declared memory/CPU bounds, `--memory-swap` equal to memory and
  `--pids-limit 256`;
- read-only root filesystem, `no-new-privileges`, dropped capabilities and a
  `128 MiB` no-exec `/tmp` tmpfs;
- Docker daemon logging disabled (`--log-driver none`), because the control
  plane captures bounded stdout/stderr itself.

Evidence from this audit:

- one real `node-cache-014` run: `192 ms`, expected starter failure;
- ten concurrent runs: all returned typed `fail` results in `274–339 ms`;
- after both checks: zero `fluent-runtime-task-*` containers, zero files in
  `fluent-task-runtime/.runtime-work` (`0 B`);
- no control-plane restarts or OOM kills.

### Compose services

The Compose services use `json-file` rotation (`10 MiB`, three files) to stop
logs becoming an unbounded disk sink. Durable database/telemetry volumes are
named and intentionally preserved by normal shutdown; `down.sh` never uses
`down -v`.

The optional Kafka profile was measured at roughly `470 MiB` on this Mac and
was removed after the check because the current Lab path does not require it.
The optional Grafana/Loki/Prometheus profile remains available for
observability and measured roughly `0.3 GiB` combined after warm-up. Traces are
sent to the shared Question Brain Jaeger; the normal
`scripts/up.sh` path does not start either optional profile.

The five historical `fluent-engineering-lab_fel-*` volumes from the original
snapshot were removed by the scoped `pnpm prune:workspace` cleanup after
confirming they had no mounts. Current package data lives in the explicitly
named `fluent-engineering-lab-*` volumes.

### Current warm service snapshot

At the end of the audit, all required services were healthy/ready, and the
observability endpoints returned HTTP `200`:

- Question Brain readiness `48127`: `200`;
- Task Runtime readiness `48227`: `200`;
- Lab package `49300`: `200`;
- Grafana `49304`, Prometheus `49305`, Loki `49306`, and the shared Jaeger UI
  `56686`: `200`.

## Known boundaries (not leaks)

- The task runtime still mounts the Docker socket in local Compose. This is an
  intentional development boundary; production should move execution behind
  a dedicated worker service.
- Compose control-plane services do not declare per-service cgroup budgets.
  Docker Desktop's global memory budget is the current local guardrail; a
  production deployment should add measured CPU/memory budgets per service.
- The host contains unrelated stopped Compose projects and old images from
  other workspaces. They are not attached to any of the three Fluent project
  labels and were not deleted by this audit.
- A small set of unlinked, project-labelled legacy Lab volumes is called out
  above and deliberately preserved pending explicit retention approval.

## Reproducible commands

```sh
cd /Users/sergeyzhechko/developer/fluent-interview
./scripts/ports.sh
./scripts/up.sh --production --no-build
./scripts/status.sh
docker compose ls --all
docker stats --no-stream
./scripts/down.sh
```

`./scripts/down.sh` removes the three project stacks and all optional Lab
profile containers/networks, preserving the named volumes.
