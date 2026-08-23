# AGENTS.md — Fluent Interview workspace

This directory is a workspace umbrella for three independent repositories. It
is not a source monorepo and it must not become a second owner of application
code, databases, question content, or task execution.

## Structure

```text
fluent-engineering-lab/   learner product, UI, curriculum projection, progress
fluent-question-brain/    canonical questions, locales, graph, search, releases
fluent-task-runtime/      task revisions, sandboxes, hidden tests, run traces
workspace.yaml             repository pins, ports, readiness, launch contract
scripts/up.sh              start dependencies and the Lab
scripts/down.sh            stop the workspace without deleting volumes
scripts/status.sh          health, Compose, Git, and port report
```

Each child directory retains its own `.git`, `main` branch, tests, release
policy, and remote. The workspace scripts coordinate them but never bypass a
service boundary.

## Ownership rules

- Question Brain is the only question/content authority.
- Task Runtime is the only learner-code execution authority.
- Fluent Lab owns learner UX, progress, evidence, and the released projection.
- Do not share PostgreSQL tables, ORM entities, local catalogues, or fallback
  data between repositories.
- Cross-service changes use versioned HTTP/event contracts and compatibility
  checks. A future contracts repository may contain schemas and generated
  clients, but not domain ownership.
- The three Compose projects remain independently stoppable and observable.
- `fluent-interview` is the orchestrator, not a fourth Compose project; stack
  provenance must always point into this workspace checkout.
- Normal shutdown removes required services and any enabled Lab profiles while
  preserving named durable volumes. Do not leave an optional profile running
  by accident when it is not part of the current check.

## Canonical commands

From this directory:

```bash
./scripts/up.sh                 # Question Brain + Task Runtime + Lab dev
./scripts/up.sh --no-build      # same, reusing existing images
./scripts/up.sh --production    # dependencies + packaged Lab release
./scripts/status.sh             # health and ownership report
./scripts/down.sh               # stop services, preserve volumes
```

Never use `docker compose down -v` for normal recovery. It removes durable
local data. The workspace targets the 16-inch MacBook Pro and Apple Studio
Display desktop surfaces; mobile is outside the production scope.
