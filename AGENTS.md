# AGENTS.md — Fluent Interview workspace

This directory is a workspace umbrella for four independent repositories. It
is not a source monorepo and it must not become a second owner of application
code, databases, question content, or task execution.

## Current production closure

The active cross-repository execution plan is
[`docs/CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md`](docs/CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md).
It supersedes historical `RELEASED` claims for current product acceptance.
Dated audits and earlier plans remain evidence, but they are not parallel work
queues. Execute the active plan gate by gate and do not advance past an open
gate.

## Structure

```text
fluent-engineering-lab/   Nest learner API, curriculum projection, progress
fluent-engineering-vue/   only learner/operator web UI (Vue 3 + Vite)
fluent-question-brain/    canonical questions, locales, graph, search, releases
fluent-task-runtime/      task revisions, sandboxes, hidden tests, run traces
workspace.yaml             repository pins, ports, readiness, launch contract
package.json               short pnpm entrypoints for the workspace launcher
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
- Fluent Lab owns learner API, progress, evidence, and the released projection;
  the sibling Vue workspace owns all browser rendering.
- Do not share PostgreSQL tables, ORM entities, local catalogues, or fallback
  data between repositories.
- Cross-service changes use versioned HTTP/event contracts and compatibility
  checks. A future contracts repository may contain schemas and generated
  clients, but not domain ownership.
- Published releases are the only learner inputs: historical release files,
  migration records, and rejection tests are provenance, never runtime
  fallbacks. Payload is draft/review-only; it never writes published content.
- A practice gap is represented explicitly as `runnable`, `brief_only`,
  `recall_only`, or `deferred`; it must not be disguised as a lock, placeholder
  task, or synthetic pass.
- The three Compose projects remain independently stoppable and observable;
  the Vue workspace is a local web repository served by the Lab launcher.
- `fluent-interview` is the orchestrator, not a fourth Compose project; stack
  provenance must always point into this workspace checkout.
- Normal shutdown removes required services and any enabled Lab profiles while
  preserving named durable volumes. Do not leave an optional profile running
  by accident when it is not part of the current check.

## Canonical commands

From this directory:

```bash
pnpm dev                     # Question Brain + Task Runtime + Lab dev
pnpm dev:quick               # same, reusing existing images
pnpm dev:production          # dependencies + packaged Lab release
pnpm status                  # health and ownership report
pnpm down                    # stop services, preserve volumes
```

The shell scripts remain the automation/recovery primitives behind these
aliases. Nx is scoped to the TypeScript Fluent Lab repository; the Go
repositories are coordinated through their versioned service contracts rather
than being flattened into a fake cross-language source graph.

Never use `docker compose down -v` for normal recovery. It removes durable
local data. The workspace targets the 16-inch MacBook Pro and Apple Studio
Display desktop surfaces; mobile is outside the production scope.
