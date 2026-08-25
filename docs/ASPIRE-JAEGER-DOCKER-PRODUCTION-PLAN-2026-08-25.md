# Fluent Interview: Aspire, Jaeger and Docker production convergence plan

Status: **authoritative gated implementation handoff**  
Created: **2026-08-25**  
Scope: the `fluent-interview` workspace and its three independent repositories.  
Audience: the implementation agent who will execute the work and the
orchestrator who will independently accept or reject every gate.

This document replaces ad-hoc decisions about local startup, health checks,
tracing backends, Docker cleanup, and recovery UI. It does **not** merge the
three application repositories and it does not change their domain ownership.
It defines one operational control plane around them.

The executor must work from G0 to G13 in order. A later gate must not begin
until the current gate has all acceptance checks, reproducible evidence, a
focused commit, and a pushed `main`. A green container alone is not proof that
the product is ready.

## Agent handoff — copy/paste brief

Read this entire document before changing code, then read the root
`AGENTS.md` and the `AGENTS.md` in every repository you touch. Implement G0
through G12 exactly in order. Do not start a later gate with an unchecked
acceptance criterion in an earlier gate. At the end of every gate, run its
listed tests and failure-path checks, write the evidence artifact, inspect
`git diff --check`, commit only that gate, and push the owning repository's
`main`. Preserve unrelated dirty worktree changes. Do not delete Docker data,
rename repositories, introduce a fallback catalogue, or bypass a service
boundary. Stop after G12 and return the commit SHAs, evidence paths, remaining
risks, and the exact commands used. G13 is reserved for an independent
orchestrator acceptance and must not be self-certified.

The non-negotiable end state is one TypeScript Aspire AppHost, one central
OpenTelemetry Collector, one persistent Jaeger v2 Trace Explorer, Prometheus,
Loki, and Grafana; Tempo and the two repository-local Jaeger instances are
removed only after trace-parity evidence. `pnpm dev` is the one live
development command. Docker cleanup is ownership-labelled, budgeted,
previewable, and never a global prune.

---

## 1. Executive decision

The target solution is:

1. Keep the three independent repositories:
   `fluent-engineering-lab`, `fluent-question-brain`, and
   `fluent-task-runtime`.
2. Keep `/Users/sergeyzhechko/developer/fluent-interview` as the workspace and
   operational orchestrator, not as a fourth owner of application code.
3. Replace the hand-written startup graph in `scripts/up.sh` with a
   **TypeScript Aspire AppHost** in the workspace root.
4. Keep `pnpm dev` as the canonical developer command. It must start the
   AppHost, all required resources, and the live Aspire dashboard.
5. Use one central **OpenTelemetry Collector gateway** for all telemetry.
6. Use one central **Jaeger v2** as the trace backend and trace UI.
7. Remove Tempo completely after trace-parity evidence is green.
8. Keep Prometheus for metrics, Loki for logs, and Grafana for historical
   dashboards and alerts. Jaeger does not replace these signals.
9. Use persistent Jaeger storage:
   - local/product workstation profile: Badger in one named volume, with a
     bounded retention policy;
   - future multi-user production profile: OpenSearch with lifecycle/retention
     policy. Do not run OpenSearch on the workstation by default.
10. Introduce an explicit product health model. Browser compatibility and the
    optional local AI model must not make healthy backend services "not ready".
11. Introduce ownership labels, storage budgets, orphan cleanup, and a
    dedicated Fluent BuildKit builder. Never run an unscoped global Docker
    prune from `pnpm dev`, `pnpm down`, or any unattended workflow.

### What this decision solves

- one command starts the distributed product in a deterministic order;
- every service and dependency is visible in one live resource graph;
- one trace can follow Web → Learning API → Question Brain / Task Runtime →
  database or sandbox;
- a recurring failure becomes searchable by trace, service, operation, error,
  learner-safe correlation ID, and time range;
- optional AI degradation is visible without blocking learning;
- stale sandboxes, legacy images, orphan containers, duplicate Compose project
  names, and unbounded build cache cannot silently consume the disk;
- normal stop preserves learner/content data, while cleanup is scoped and
  auditable.

### What this decision deliberately does not do

- It does not turn the polyrepo into a source monorepo.
- It does not share databases, ORM models, question content, or task runners.
- It does not make Aspire the production Kubernetes orchestrator.
- It does not send traces directly from every service to a different Jaeger.
- It does not use Jaeger as a metrics, logs, learner-progress, or content store.
- It does not delete Docker volumes merely because they are currently unused.

---

## 2. Verified starting point

The executor must refresh these facts in G0. They are recorded here to explain
why the migration is necessary, not as immutable expected values.

### 2.1 Current operational topology

| Boundary | Current state | Problem |
| --- | --- | --- |
| Workspace launcher | Bash scripts with hard-coded ports, URLs, release filenames, and Compose project names | `workspace.yaml` is descriptive but is not the executable source of truth; drift is possible. |
| Question Brain traces | Dedicated Jaeger v2 on port `56686` | Isolated trace island. |
| Task Runtime traces | Dedicated Jaeger v1 on port `56687` | Isolated trace island and version drift. |
| Fluent Lab traces | Tempo inside Lab observability profile | Third trace island and a different query UI. |
| Metrics | Prometheus primarily sees Lab | Brain and Runtime product signals are incomplete. |
| Logs | Loki/Promtail primarily owns Lab container logs | Cross-service correlation is incomplete. |
| Health | Service readiness, toolchain prerequisites, browser policy, and optional AI are mixed in learner onboarding | A healthy platform can present a contradictory recovery queue. |
| Docker lifecycle | Three Compose projects plus host processes and runtime-created sandboxes | Crashes can leave resources; old project names and duplicated image tags accumulate. |

### 2.2 Current disk evidence captured on 2026-08-25

```text
Images:        24.42 GB total, 5.731 GB reclaimable
Containers:     0.45 GB total, 99% reclaimable
Local volumes: 14.15 GB total, 9.639 GB reclaimable
Build cache:    3.60 GB total
```

The daemon also contains resources from unrelated projects. Therefore a global
`docker system prune -a --volumes` is forbidden: it can delete data and images
outside Fluent Interview. The existing data demonstrates a real hygiene
problem, but not permission to destroy every unused daemon resource.

Current duplicate/legacy evidence includes old `fel-task-*` and current
`fluent-runtime-task-*` image families, two different Jaeger generations,
detached historical Lab volumes, stopped unrelated containers, and several
anonymous volumes. G8 must classify resources before deleting anything.

---

## 3. Canonical domain and operational language

These names must be used consistently in code, documentation, dashboards,
resource labels, and UI. Do not invent synonyms in individual repositories.

| Canonical term | Meaning | Owner |
| --- | --- | --- |
| **Fluent Interview** | The product family and local workspace. | workspace |
| **Fluent Lab** | Learner-facing application: UI, progress, attempts, evidence, advisory AI. | Lab |
| **Question Brain** | Canonical questions, locales, taxonomy, graph, search, embeddings, and releases. | Brain |
| **Task Runtime** | Task families/revisions, sandbox execution, hidden tests, deterministic result envelope. | Runtime |
| **AppHost** | Development and local product resource orchestrator. | workspace |
| **Control Center** | User-facing label for the Aspire dashboard link. | workspace/Lab |
| **Trace Explorer** | User-facing label for the Jaeger UI link. | workspace/Lab |
| **Metrics & Logs** | User-facing label for Grafana. | workspace/Lab |
| **Product readiness** | Whether a defined learner flow can accept traffic now. | Lab API projection |
| **Resource health** | Whether one process/container/dependency is live or ready. | owning service/AppHost |
| **Client capability** | What this browser can perform; never server readiness. | Web |
| **Optional capability** | AI or another enhancer that may degrade without blocking the core learning loop. | owning service |
| **Durable volume** | Named, allowlisted data that survives normal stop/restart. | owning repository |
| **Ephemeral resource** | Rebuildable container/workdir/cache with an owner label and TTL. | owning repository |

### 3.1 Repository naming decision

Do **not** rename the repositories. Their names communicate their bounded
contexts and are already published on GitHub. A rename would create remote,
documentation, CI, package, and clone-path churn without solving the observed
problem.

Keep:

```text
fluent-engineering-lab
fluent-question-brain
fluent-task-runtime
```

Use shorter product labels only in the learner/operator UI:

```text
Fluent Lab
Question Brain
Task Runtime
Control Center
Trace Explorer
Metrics & Logs
```

### 3.2 OpenTelemetry service names

`service.name` must be stable and low-cardinality:

```text
fluent-lab-web
fluent-learning-api
fluent-question-brain-api
fluent-question-brain-indexer
fluent-question-brain-cms
fluent-task-runtime-api
fluent-task-sandbox
fluent-otel-collector
fluent-jaeger
```

Never create a distinct `service.name` per question, learner, task revision,
language, request, or sandbox container. Put bounded dimensions in span
attributes and unique identifiers in trace/log fields.

Every resource must include:

```text
service.namespace=fluent-interview
service.name=<canonical value>
service.version=<release or git SHA>
service.instance.id=<runtime instance ID>
deployment.environment.name=local-development|local-product|production
```

### 3.3 Docker labels

Every Fluent-created container, network, image, and named volume that supports
labels must include reverse-DNS ownership metadata:

```text
dev.fluent-interview.workspace=fluent-interview
dev.fluent-interview.owner=workspace|lab|question-brain|task-runtime
dev.fluent-interview.lifecycle=durable|ephemeral|build-cache
dev.fluent-interview.schema=resource-labels.v1
dev.fluent-interview.created-by=aspire|compose|task-runtime|buildkit
```

Compose's own `com.docker.compose.*` labels remain authoritative for Compose
provenance. Never write custom labels in Docker's reserved
`com.docker.compose` namespace.

---

## 4. Target architecture

```text
                         pnpm dev
                            │
                            ▼
                TypeScript Aspire AppHost
           resource graph · waitFor · env · endpoints
                 │           │             │
                 │           │             └── Aspire Dashboard
                 │           │                 live resources/logs/traces
                 │           │
        ┌────────┴──────┐    └───────────────────────────────┐
        ▼               ▼                                    ▼
 Question Brain     Task Runtime                        Fluent Lab
 API/CMS/indexer    API/sandboxes                 Web + Learning API
        │               │                                    │
        └───────────────┴──────── OTLP ──────────────────────┘
                                  │
                                  ▼
                    one OpenTelemetry Collector
                       │          │          │
                   traces      metrics      logs
                       │          │          │
                       ▼          ▼          ▼
                    Jaeger    Prometheus    Loki
                       │          │          │
                       ├──────────┘          │
                       │  Jaeger SPM         │
                       ▼                     ▼
                 Jaeger Trace UI       Grafana dashboards

Persistent data:
  Brain Postgres · Lab Postgres · Lab Redis/state · Jaeger Badger
  Prometheus · Loki · Grafana
```

### 4.1 Why both Aspire dashboard and Jaeger exist

The Aspire dashboard answers: *what is running now, which dependency is
waiting, what are the current console logs and live traces?*

Jaeger answers: *what happened in this distributed request, where was time
spent, which service/span failed, and can I find the same failure later?*

Aspire's dashboard telemetry is an inner-loop convenience and is not the
durable trace system. Jaeger is the durable trace explorer.

### 4.2 Why Prometheus, Loki, and Grafana remain

- Jaeger stores and queries traces, not arbitrary application metrics or logs.
- Prometheus stores bounded time series and supports alert expressions.
- Loki stores structured logs with retention controls.
- Grafana provides durable dashboards and alerts across metrics and logs.
- Jaeger Monitor/SPM reads RED metrics from Prometheus through the
  `spanmetrics` connector.

Tempo is redundant after Jaeger receives and persists every required trace.

---

## 5. Final launch and operator experience

### 5.1 Canonical commands

The final workspace interface must be:

```bash
cd /Users/sergeyzhechko/developer/fluent-interview

pnpm dev            # live development via TypeScript Aspire AppHost
pnpm start          # local-product profile using packaged/container workloads
pnpm status         # concise product/resource/release/storage status
pnpm doctor         # deep non-destructive diagnostic report
pnpm down           # stop Fluent resources; preserve durable volumes
pnpm clean:preview  # show only Fluent-owned cleanup candidates and bytes
pnpm clean          # apply the reviewed scoped cleanup policy
```

Remove confusing aliases such as `dev:production` after migration. Preserve a
temporary compatibility alias for one gate only if necessary, make it print a
deprecation message, and delete it in G12.

### 5.2 `pnpm dev` behavior

1. Validate prerequisites and the typed `workspace.yaml` contract.
2. Run a non-destructive disk budget check.
3. Reconcile stale **Fluent-owned ephemeral** resources only.
4. Start the central observability resources.
5. Start Brain data dependencies and wait for real readiness.
6. Start Brain API/indexer/CMS and wait for the declared readiness contract.
7. Apply idempotent reviewed release/mapping operations.
8. Start Task Runtime and wait for its release join and sandbox readiness.
9. Start the Learning API only after its dependencies are ready.
10. Start the learner Web after the Learning API is ready.
11. Print one compact launch card with links to Fluent Lab, Control Center,
    Trace Explorer, Metrics & Logs, and `pnpm status`.

No step may rely on an arbitrary sleep. Use resource state plus HTTP health
checks. TypeScript AppHost cannot currently register arbitrary in-process
custom health checks through `builder.Services`; use supported HTTP resource
health checks and service-owned readiness endpoints instead.

### 5.3 `pnpm down` behavior

- stop AppHost-managed resources and host processes;
- remove Fluent-owned ephemeral containers and networks;
- preserve every allowlisted durable volume;
- report any resource that could not stop cleanly;
- never invoke `down -v`, `system prune`, or global image deletion;
- print the remaining Fluent durable bytes and cleanup-preview command.

---

## 6. Product health model

### 6.1 Service endpoint contract

Every HTTP service must expose or adapt to:

```text
/health/live      process is alive; no remote dependency calls
/health/startup   initialization and migrations completed
/health/ready     instance can serve its owned contract now
/capabilities     optional and required capabilities with typed states
```

Task Runtime may retain its versioned `/v1/health/*` prefix; the AppHost maps
the actual paths rather than inventing a proxy response.

Health responses must be typed, bounded, and secret-free. A configured
connection string is not proof that a database is reachable. A process being
`Running` is not proof that it is ready.

### 6.2 Product flow model

Lab publishes `/api/product-state`, composed from real downstream checks:

| Flow | Required | Optional |
| --- | --- | --- |
| Browse/read questions | Web, Learning API, Brain API, Lab DB | Brain semantic search worker |
| Practice task | Browse/read flow, Runtime API, released task/profile, sandbox engine | local AI coaching |
| Save progress/evidence | Learning API, Lab DB | Redis acceleration |
| Local AI companion | Ollama endpoint and selected model | none |
| Operator diagnostics | AppHost/resource API, Collector, Jaeger/Prometheus/Loki | Grafana presentation |

Each flow returns `ready`, `degraded`, or `unavailable`, a stable reason code,
the last transition time, and safe recovery action.

### 6.3 Browser and AI rules

- Browser feature detection is a client capability check, not server
  readiness. Detect required APIs by feature, not by a Chrome-only user-agent
  allowlist.
- A missing optional API disables only the affected feature and explains why.
- Ollama/model absence is `optional_unavailable`; the deterministic learning
  and task flow remains ready.
- Optional states do not appear in a red "recovery queue" after the product has
  declared "environment ready".
- The learner may continue without AI and prepare/load it later from Studio.

---

## 7. Telemetry contract

### 7.1 Propagation

Use W3C Trace Context (`traceparent`, `tracestate`) across browser fetches,
Learning API calls, Brain calls, Runtime calls, and any internal HTTP work.
Use baggage only for bounded, non-sensitive routing/debug context.

Do not propagate raw question text, answers, prompts, learner source code,
hidden tests, email, secrets, tokens, or model output.

### 7.2 Required trace journeys

The following must produce one connected trace, not separate roots:

1. open a path → fetch path projection → fetch Brain card summary;
2. open a question → load exact localized revision and relations;
3. open a TaskFamily → resolve TaskRevision and runtime profile;
4. run learner code → Runtime → sandbox lifecycle → hidden-test verdict;
5. save evidence → Lab DB → progress projection;
6. request AI explanation → Ollama or typed optional-unavailable result;
7. first-run product-state calculation across all required dependencies;
8. release join validation between Brain, Runtime, and Lab.

### 7.3 Required spans

Use semantic HTTP/database conventions where available. Add explicit domain
spans for operations that are invisible to auto-instrumentation:

```text
lab.path.load
lab.question.open
lab.task-family.resolve
lab.evidence.save
brain.release.resolve
brain.question.fetch
brain.search.execute
brain.graph.project
runtime.release.resolve
runtime.task.prepare
runtime.sandbox.create
runtime.sandbox.execute
runtime.sandbox.cleanup
runtime.result.persist
ai.provider.resolve
product-state.evaluate
```

### 7.4 Bounded attributes

Allowed examples:

```text
fluent.flow=browse|practice|evidence|ai|release-join
fluent.locale=en|ru
fluent.path=nodejs-typescript|java-spring|dotnet-csharp|go|...
fluent.task.language=node|go|java|dotnet|postgres
fluent.task.result=pass|fail|timeout|runtime_error|runtime_not_ready
fluent.release.compatibility=compatible|stale|mismatch
fluent.ai.state=ready|optional_unavailable|error
```

High-cardinality IDs such as question stable key, task revision, run ID, and
correlation ID may appear as trace attributes and structured log fields, but
never as Prometheus label values. Store only safe IDs/hashes.

### 7.5 Sampling

Local development and acceptance tests sample 100% except `/health/*` and
`/metrics`, which must be excluded or heavily downsampled.

The future production profile must retain:

- all error traces;
- all timeout/runtime-error traces;
- all release mismatch and readiness transitions;
- a bounded sample of successful high-volume traffic.

Sampling configuration is central and versioned. A service must not silently
override it.

### 7.6 Operational events and metrics

Emit transitions, not noisy repeated polls:

```text
platform.health.transition
service.readiness.transition
release.join.transition
client.capability.detected
ai.provider.transition
learner_flow.synthetic_result
docker.storage.budget.transition
runtime.orphan.reconciled
otel.export.failure
```

Required bounded metrics include request rate/errors/duration, downstream
dependency outcomes, task verdicts by language/result, sandbox cleanup
failures, Collector accepted/refused/dropped spans, Jaeger storage health,
Docker Fluent-owned bytes, and host free-disk threshold state.

---

## 8. Jaeger design

### 8.1 One Jaeger, not one per repository

Applications export OTLP to `fluent-otel-collector`. The Collector enriches,
filters, batches, applies memory limits, generates span metrics, and exports
traces to `fluent-jaeger`.

Remove these current trace islands after migration proof:

```text
Question Brain dedicated Jaeger :56686
Task Runtime dedicated Jaeger   :56687
Lab Tempo                       :49307/:49308 and tempo volume
```

The final unique local endpoints are registered once in `workspace.yaml`; the
agent must choose unused high ports and validate collisions. Suggested labels,
not mandatory port numbers:

```text
Trace Explorer       http://127.0.0.1:<jaeger-ui>
OTLP gRPC gateway    127.0.0.1:<otel-grpc>
OTLP HTTP gateway    127.0.0.1:<otel-http>
Collector health     http://127.0.0.1:<otel-health>
Collector metrics    http://127.0.0.1:<otel-metrics>/metrics
```

Only loopback host bindings are allowed locally.

### 8.2 Local persistent profile

Pin the current Jaeger v2 image by version and digest after compatibility
validation. Configure an explicit YAML file, not implicit all-in-one defaults.

Use one all-in-one Jaeger v2 process with persistent Badger storage and named
volume `fluent-interview-jaeger-data`. Badger is acceptable for the single-node
Mac workstation because it survives restarts and avoids a heavy local search
cluster. It is not the multi-user scale-out backend.

Requirements:

- persistence verified across Jaeger restart;
- bounded trace TTL, initially 7 days unless measured usage justifies another
  value;
- trace-volume warning budget 6 GB and hard operational budget 10 GB;
- health endpoint and internal metrics enabled;
- no raw learner content in spans;
- backup is not required for ordinary traces, but deleting the volume requires
  explicit confirmation because saved incident traces may be valuable.

If the pinned Jaeger v2 Badger configuration cannot enforce TTL reliably,
the gate is blocked until a tested retention mechanism exists. Do not ship
unbounded trace storage.

### 8.3 Future multi-user production profile

Use Jaeger v2 with OpenSearch and index lifecycle retention. Jaeger's current
official recommendation favors OpenSearch for large-scale production search.
This profile is documented and contract-tested but is not started by default
on the workstation.

### 8.4 Jaeger Monitor/SPM

Configure the OpenTelemetry Collector `spanmetrics` connector:

```text
OTLP traces → trace storage exporter → Jaeger
           └→ spanmetrics → Prometheus exporter → Prometheus
Jaeger Query → Prometheus metrics backend → Monitor tab
```

Enable the Jaeger Monitor menu and verify RED metrics:

- rate;
- errors;
- duration/latency;
- service and operation selectors.

Keep spanmetric dimensions deliberately small. Do not include task ID,
question ID, learner ID, run ID, URL query, or arbitrary exception message.

### 8.5 Trace quality acceptance

For a real rate-limiter run, Jaeger must show one trace containing, at minimum:

```text
fluent-lab-web
  └─ fluent-learning-api
       ├─ fluent-question-brain-api (when context is resolved)
       └─ fluent-task-runtime-api
            └─ fluent-task-sandbox
```

The trace must show an error/timeout on the correct span, not only a generic
HTTP 500 at the root. Searching by the safe correlation ID must find it.

---

## 9. Docker lifecycle and disk policy

### 9.1 Non-negotiable safety rules

1. `pnpm dev`, `pnpm start`, and `pnpm down` never delete durable volumes.
2. No workspace command runs `docker system prune -a --volumes`.
3. No cleanup touches a resource without verified Fluent ownership.
4. Every destructive candidate is shown with type, name/ID, owner, age, size,
   reason, and recoverability in `clean:preview`.
5. Named volume deletion requires an exact allowlist entry, zero active links,
   a retention decision, and interactive confirmation or an explicit
   `--confirm <volume-name>` token.
6. A failed cleanup must not prevent opening the product unless host free disk
   is below the declared critical floor.

### 9.2 Resource classes

#### Protected durable allowlist

Expected classes include:

```text
Question Brain PostgreSQL
Fluent Lab PostgreSQL
Fluent Lab learner state/Redis persistence, if configured durable
Jaeger Badger
Prometheus
Loki
Grafana
```

The exact names must be generated/validated from the AppHost/workspace
contract. Old names do not become protected merely because they start with
`fluent-`.

#### Ephemeral and automatically reconcilable

```text
stopped task sandbox containers with Fluent labels and expired TTL
runtime work directories with no active run lease and expired TTL
orphan Fluent networks with no active endpoints
stopped AppHost/Compose containers from the same workspace generation
temporary release-smoke containers carrying an explicit ephemeral label
```

#### Rebuildable but budgeted

```text
Fluent BuildKit cache
superseded Fluent image tags/digests not referenced by containers/releases
frontend build cache and generated bundles
```

#### Never automatically touched

```text
unlabeled resources
resources owned by another project
any attached volume
any current release image
any image referenced by a running or stopped retained container
unknown legacy volumes before classification/backup decision
```

### 9.3 Dedicated BuildKit builder

Create a dedicated `fluent-interview-builder` using the Docker container
driver. Configure BuildKit garbage collection with a repository-controlled
`buildkitd.toml` and documented Docker Desktop compatibility.

Initial workstation policy, adjustable only after measurement:

```text
reservedSpace = 4GB
maxUsedSpace  = 12GB
minFreeSpace  = 40GB
stale local/source/cache mounts eligible after 48h
unused general cache eligible after 14d
```

The builder must be used consistently by Brain, Runtime profiles, Lab package,
and CI-equivalent local checks. Do not create a new unnamed builder per run.

Do not make `--no-cache` the normal fix. It increases rebuild time and layer
churn. Improve Dockerfile ordering, multi-stage outputs, `.dockerignore`, and
cache mounts instead.

### 9.4 Image policy

- One canonical image repository per service/profile.
- Tag with immutable release/profile version and optionally a moving local
  alias; do not create historical aliases such as both `fel-task-*` and
  `fluent-runtime-task-*` for the same image family.
- Pin base image versions and record architecture.
- Runtime sandboxes reuse prebuilt profile images; they do not build a new
  image per learner run.
- After a release, remove only superseded Fluent-owned images older than the
  retention window and unreferenced by any current/rollback release.

### 9.5 Sandbox reconciliation

Every Runtime-created sandbox container must have:

- `--rm` for normal completion;
- Fluent ownership and run-lifecycle labels;
- no network, bounded CPU/memory/PIDs/time, read-only root where supported;
- daemon logging disabled when Runtime captures bounded output;
- a run lease/state record;
- guaranteed cleanup in success, fail, timeout, cancellation, and shutdown;
- startup janitor for stopped/created orphan sandboxes older than a short TTL;
- a metric and trace span for reconciliation outcome.

The janitor may remove only containers that match the exact Runtime labels and
are not associated with an active lease.

### 9.6 Runtime work directories

Use a namespaced work root, one directory per run, an active lease file, and
atomic cleanup. On startup, quarantine then delete only expired directories
without an active run. Record count and bytes reclaimed. Never recursively
delete an unresolved environment variable or broad parent directory.

### 9.7 Storage doctor and budgets

`pnpm doctor` and `pnpm status` must report:

```text
host free disk
Docker total/reclaimable by type
Fluent-owned containers/networks/images/volumes by owner and lifecycle
BuildKit builder cache and policy
durable volume sizes
Jaeger/Prometheus/Loki retention and current bytes
orphan sandbox/workdir count and bytes
legacy/unknown Fluent-prefixed resources requiring human classification
```

Initial alerts:

- warning when host free disk is below 80 GB;
- critical when below 40 GB;
- warning when total Fluent-owned Docker bytes exceed 30 GB;
- critical when they exceed 50 GB;
- warning when any bounded telemetry store exceeds 80% of its budget;
- critical when Collector/Jaeger reports dropped/refused spans.

These thresholds must live in `workspace.yaml`, not be duplicated in shell,
TypeScript, dashboards, and tests.

### 9.8 Cleanup commands

Implement two phases:

```bash
pnpm clean:preview
pnpm clean
```

`clean:preview` is always non-destructive and writes a machine-readable JSON
report plus a concise table. `clean` consumes a fresh preview, rejects stale
or changed candidates, applies only safe ephemeral/image/cache rules, and
writes before/after evidence.

Volume cleanup is separate:

```bash
pnpm volumes:audit
pnpm volumes:remove -- --confirm <exact-volume-name>
```

There is intentionally no `volumes:prune-all` command.

---

## 10. Gate execution protocol

For every gate:

1. Read root and touched repository `AGENTS.md` files.
2. Inspect all four Git worktrees; preserve unrelated/user changes.
3. Record before-state and exact versions.
4. Change only the owning repository or workspace boundary.
5. Add failure-path tests, not only happy-path tests.
6. Run `git diff --check`, tests, build, live health, and relevant Browser flow.
7. Save evidence under `docs/verification/aspire-jaeger-docker-2026-08-25/` or
   the owning repository's verification folder.
8. Commit the smallest complete gate in each touched repository.
9. Push `main` and record the remote commit SHA.
10. Update this plan's gate checkbox/evidence table in a separate workspace
    documentation commit.

Never use `--no-verify`, disable a test, rewrite expected evidence to hide a
failure, log private content, add a fallback catalogue, or bypass a service
boundary.

---

## G0 — Freeze and classify the baseline

### Work

- [ ] Record branch, HEAD, remote, dirty files, image digests, Compose labels,
      volume names/sizes/links, BuildKit builders/cache, process IDs, ports,
      release IDs, migrations, and current health.
- [ ] Export non-sensitive current service/resource inventory.
- [ ] Classify every Fluent-prefixed Docker resource as current durable,
      current ephemeral, superseded rebuildable, legacy unknown, or unrelated.
- [ ] Back up Brain and Lab databases and prove an isolated restore before any
      legacy volume deletion.
- [ ] Record the current onboarding contradiction with Chrome and Safari user
      agents without changing behavior.
- [ ] Record current trace services visible in both Jaegers and Tempo.

### Verification

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm status
pnpm ports
docker compose ls --all
docker system df
docker system df -v
docker buildx ls
git status --short --branch
git -C fluent-engineering-lab status --short --branch
git -C fluent-question-brain status --short --branch
git -C fluent-task-runtime status --short --branch
```

### Acceptance

- [ ] Every candidate for future deletion has owner, age, size, reason, and
      recoverability.
- [ ] Database restore works without original volumes.
- [ ] No application behavior or Docker resource changed in this gate.
- [ ] Evidence is committed and pushed.

Suggested commit: `docs: freeze Aspire and observability migration baseline`

## G1 — Approve vocabulary, ADR, and machine-readable workspace contract

### Work

- [ ] Add a system ADR selecting TypeScript Aspire AppHost, central OTel
      Collector, Jaeger v2, Prometheus/Loki/Grafana, and the polyrepo boundary.
- [ ] Add glossary terms from section 3 without implementation detail.
- [ ] Add JSON Schema and typed parser tests for `workspace.yaml`.
- [ ] Move ports, endpoints, resource names, health paths, storage budgets,
      retention, repository pins, and release pointer locations into the one
      validated contract.
- [ ] Remove hard-coded duplication from new code; old scripts remain frozen
      until G12.
- [ ] Validate repository naming decision and UI labels.

### Acceptance

- [ ] Invalid/duplicate port, missing health path, unknown lifecycle, broad
      cleanup target, or unpinned service fails validation before startup.
- [ ] AppHost and diagnostics consume the same typed contract.
- [ ] No repository was renamed.

Suggested commit: `docs: define Fluent operational control-plane contract`

## G2 — Scaffold the TypeScript Aspire AppHost

### Work

- [ ] Run the supported TypeScript `aspire init` flow in the workspace root.
- [ ] Pin Aspire CLI/AppHost versions according to current official guidance.
- [ ] Keep generated `.aspire` modules managed by the CLI; do not hand-edit
      them.
- [ ] Model all databases, caches, APIs, workers, CMS, Web, Collector, Jaeger,
      Prometheus, Loki, and Grafana as named resources.
- [ ] Add dependency references, HTTP endpoints, and `waitFor` ordering.
- [ ] Use service-owned HTTP readiness checks.
- [ ] Add `development` and `local-product` profiles.
- [ ] Keep child repository build/test ownership intact.

### Acceptance

- [ ] `pnpm aspire:build` is green.
- [ ] One AppHost dashboard shows every expected resource exactly once.
- [ ] A failed Brain readiness keeps dependent resources waiting and reports
      the actual reason.
- [ ] Stopping AppHost terminates host child processes cleanly.

Suggested commit: `feat(workspace): add TypeScript Aspire AppHost`

## G3 — Correct service and product health

### Work

- [ ] Implement/verify live, startup, ready, and capabilities contracts in
      Brain, Runtime, and Learning API.
- [ ] Make Learning API readiness actively verify required dependencies and
      database access; an environment variable is not a health check.
- [ ] Add `/api/product-state` with flow-level status and transitions.
- [ ] Separate browser capabilities and optional Ollama from backend readiness.
- [ ] Make all readiness/capability reason codes versioned and localized by UI,
      not returned as arbitrary English prose.
- [ ] Wire AppHost HTTP checks to actual readiness endpoints.

### Acceptance

- [ ] Required dependency outage changes only affected flows.
- [ ] Ollama stopped: core browse/practice stays ready, AI becomes optional
      unavailable.
- [ ] Unsupported browser feature: the affected client feature degrades; server
      readiness does not change.
- [ ] Readiness transition appears once in metrics/logs/traces.

Suggested commits:

```text
feat(brain): publish explicit lifecycle health
feat(runtime): publish sandbox readiness capabilities
feat(lab): compose product flow health
```

## G4 — Instrument all workloads and propagate one trace context

### Work

- [ ] Standardize OpenTelemetry SDK configuration for Node/Angular, NestJS,
      Brain Go, Runtime Go, CMS/indexer, and sandbox control spans.
- [ ] Instrument browser document/fetch carefully; redact URL query values and
      never export learner content.
- [ ] Propagate W3C context across every HTTP boundary.
- [ ] Add domain spans and bounded attributes from section 7.
- [ ] Export only to the central Collector endpoint injected by AppHost.
- [ ] Make telemetry shutdown/flush bounded and non-fatal to core requests.
- [ ] Add contract tests for headers and parent/child relationships.

### Acceptance

- [ ] Synthetic browse and task-run journeys produce one connected trace.
- [ ] Service names match section 3 exactly.
- [ ] No raw question, answer, prompt, source, hidden test, secret, or token is
      present in exported spans.
- [ ] Collector outage does not crash the product and is visible as telemetry
      degradation.

Suggested commits per owning repository:

```text
feat(observability): standardize OpenTelemetry resource and propagation
```

## G5 — Deploy the central Collector and persistent Jaeger v2

### Work

- [ ] Add one Collector gateway with OTLP gRPC/HTTP receivers, memory limiter,
      redaction/filtering, batching, spanmetrics, and internal telemetry.
- [ ] Add one pinned Jaeger v2 with explicit config and persistent Badger
      volume for local profiles.
- [ ] Configure Jaeger query/UI, health, internal metrics, and retention.
- [ ] Bind host endpoints to loopback-only unique ports.
- [ ] Add Collector/Jaeger resource budgets and log rotation.
- [ ] Test restart persistence and TTL/space behavior.

### Acceptance

- [ ] Jaeger survives restart and retains a pre-restart trace.
- [ ] Collector accepted and exported span counters reconcile within expected
      test tolerance; no unexplained refused/dropped spans.
- [ ] Jaeger contains all required canonical service names.
- [ ] Trace search by service, operation, error, time, and safe correlation ID
      works.
- [ ] Badger data cannot grow without the declared retention/budget control.

Suggested commit: `feat(observability): centralize traces in persistent Jaeger`

## G6 — Enable Jaeger SPM, metrics, logs, dashboards, and alerts

### Work

- [ ] Send spanmetrics to Prometheus and connect Jaeger Monitor to Prometheus.
- [ ] Scrape Brain, Runtime, Learning API, Collector, Jaeger, and storage
      metrics.
- [ ] Route structured logs to Loki with trace/span IDs.
- [ ] Build Grafana overview for product flows, dependencies, task verdicts,
      telemetry drops, and disk budgets.
- [ ] Add alerts for sustained user-impacting flow failure, release mismatch,
      task cleanup failure, dropped telemetry, and disk thresholds.
- [ ] Do not alert on an optional AI absence or one incompatible client.

### Acceptance

- [ ] Jaeger Monitor shows non-empty rate/error/duration data.
- [ ] A deliberate Runtime timeout appears in Jaeger, Prometheus, Loki, and
      Grafana with the same trace/correlation identity.
- [ ] Metrics labels pass cardinality guard tests.
- [ ] Alert tests prove firing and recovery transitions without alert storms.

Suggested commit: `feat(observability): add Jaeger SPM and product alerts`

## G7 — Fix onboarding, recovery, and operator links

### Work

- [ ] Replace the monolithic prerequisite/recovery model with product flows,
      resources, client capabilities, and optional capabilities.
- [ ] Remove Chrome user-agent gating; use feature detection.
- [ ] Present optional Ollama status separately from required recovery.
- [ ] Add safe links to Control Center, Trace Explorer, and Metrics & Logs.
- [ ] Add a copyable diagnostic bundle with safe IDs, versions, health, and
      links; exclude secrets/raw content.
- [ ] Complete RU/EN copy and test text expansion.

### Acceptance

- [ ] Healthy environment cannot simultaneously show a blocking recovery
      queue.
- [ ] All buttons perform observable actions and have accessible names.
- [ ] RU/EN and Light/Dark/Auto preserve state and layout.
- [ ] MacBook Pro 16-inch and Studio Display screenshots show no overlap or
      clipped copy.

Suggested commit: `fix(lab): make recovery reflect product flow health`

## G8 — Implement scoped Docker ownership and garbage collection

### Work

- [ ] Apply labels from section 3 to every Fluent-created resource.
- [ ] Add the dedicated BuildKit builder and budgeted GC policy.
- [ ] Canonicalize image names/tags and remove duplicate image production.
- [ ] Add Runtime sandbox leases, cleanup-finally paths, and startup janitor.
- [ ] Add workdir quarantine/TTL cleanup.
- [ ] Implement `clean:preview`, `clean`, `volumes:audit`, and exact volume
      removal.
- [ ] Add storage metrics and threshold transitions.
- [ ] Classify historical `fel-*` and detached Lab volumes; delete only after
      backup/allowlist evidence and exact confirmation.

### Failure tests

- [ ] Kill Runtime during a task; restart and prove orphan reconciliation.
- [ ] Kill Docker Desktop during a task; restart and prove cleanup.
- [ ] Interrupt a Brain/CMS image build; prove builder cache remains bounded.
- [ ] Run repeated `pnpm dev`/`pnpm down` cycles; resource count must converge.
- [ ] Create an unrelated labeled/unlabeled test resource; Fluent cleanup must
      leave it untouched.
- [ ] Attach a candidate volume; cleanup must refuse it.

### Acceptance

- [ ] Twenty start/stop cycles do not increase stopped Fluent container/network
      counts.
- [ ] Fifty task runs leave zero orphan sandboxes and zero expired workdirs.
- [ ] Build cache stays within policy after repeated builds.
- [ ] Durable data survives `pnpm down`, `pnpm clean`, Docker restart, and
      AppHost restart.
- [ ] Cleanup preview and actual reclaimed bytes reconcile.

Suggested commits:

```text
feat(runtime): reconcile orphaned sandbox resources
feat(workspace): add scoped Docker storage policy
```

## G9 — Replace launcher scripts with the final command surface

### Work

- [ ] Point `pnpm dev` and `pnpm start` to named AppHost profiles.
- [ ] Make `status`, `doctor`, `down`, and cleanup commands consume the typed
      workspace contract/AppHost resource state.
- [ ] Print concise links and status; write verbose details to an evidence file.
- [ ] Handle SIGINT/SIGTERM and orphan child processes.
- [ ] Add clear error messages for Docker unavailable, port conflict, stale
      release join, disk critical, and failed migration.
- [ ] Prove idempotent repeated start and stop.

### Acceptance

- [ ] A new shell needs only `pnpm dev`.
- [ ] No release filename, port, readiness URL, or project name remains
      duplicated in Bash.
- [ ] Ctrl-C leaves no orphan host process.
- [ ] `pnpm status` distinguishes resource health, product flow health,
      optional AI, telemetry health, and storage health.

Suggested commit: `refactor(workspace): delegate lifecycle to Aspire`

## G10 — Remove Tempo and per-repository Jaegers

### Work

- [ ] Capture trace parity for all journeys before removal.
- [ ] Remove Tempo service/config/volume declarations and code references.
- [ ] Remove Brain and Runtime Jaeger services, ports, verification fixtures,
      and old documentation.
- [ ] Update smoke tests to query the one Trace Explorer.
- [ ] Remove old telemetry volumes only through G8's audited volume flow.
- [ ] Ensure each repository can still run isolated tests with a no-op or
      explicitly supplied external OTLP endpoint.

### Acceptance

- [ ] Repository search finds no active Tempo or old Jaeger endpoint reference.
- [ ] Docker shows exactly one Fluent Jaeger resource.
- [ ] All required traces remain queryable after migration.
- [ ] No old trace volume was silently removed.

Suggested commits:

```text
refactor(brain): use workspace telemetry gateway
refactor(runtime): use workspace telemetry gateway
refactor(lab): replace Tempo with Jaeger trace backend
```

## G11 — Chaos, performance, and retention proof

### Work

- [ ] Exercise Brain, Runtime, Lab DB, Collector, Jaeger, Prometheus, Loki,
      Grafana, Ollama, and Docker outages one at a time.
- [ ] Measure startup convergence, steady CPU/RAM, idle usage, task-run usage,
      telemetry overhead, and disk growth.
- [ ] Run retention/TTL tests with accelerated test configuration.
- [ ] Run a seven-day-equivalent synthetic telemetry volume test.
- [ ] Verify graceful degradation and recovery transitions.

### Acceptance

- [ ] Core product remains truthful for every outage.
- [ ] No optional dependency blocks unrelated flows.
- [ ] Telemetry overhead and storage growth stay within documented budgets.
- [ ] No sustained restart loop, OOM kill, unbounded log, or dropped-span trend.

Suggested commit: `test: prove observability and storage resilience`

## G12 — Delete superseded code and documentation

### Work

- [ ] Delete obsolete launcher logic, old health aggregation, browser UA gate,
      Tempo config, per-service Jaeger config, duplicate dashboards, legacy
      image aliases, stale verification expectations, and deprecated command
      aliases.
- [ ] Update root and repository `AGENTS.md`, READMEs, operations guides,
      onboarding docs, architecture docs, and workspace schema.
- [ ] Preserve historical evidence only under clearly marked history folders;
      it must not be used by runtime scripts.
- [ ] Run dead-code/config/reference scans.

### Acceptance

- [ ] There is one launcher model, one trace backend, one health vocabulary,
      one port/resource registry, and one Docker cleanup policy.
- [ ] No fallback path silently restores removed behavior.
- [ ] Documentation commands match real tested commands.

Suggested commit: `chore: remove superseded operational stack`

## G13 — Independent production acceptance

The implementing agent must stop after pushing G12 and provide commit SHAs and
evidence. The orchestrator then performs an independent checkout/state review;
the executor does not grade its own work.

### Required independent checks

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm install --frozen-lockfile
pnpm doctor
pnpm dev
pnpm status
```

Run repository checks:

```bash
pnpm -C fluent-engineering-lab check
pnpm -C fluent-engineering-lab production:check
(cd fluent-question-brain && make check)
(cd fluent-task-runtime && go test ./...)
```

Run Browser journeys in Chromium at both production desktop targets:

1. onboarding and product-state explanation;
2. RU/EN and Auto/Light/Dark switching;
3. open Node.js, Java, .NET, Go, Frontend, System Design, Algorithms, and
   Behavioral paths in explore mode;
4. open a localized QuestionCard;
5. open a multi-language TaskFamily;
6. run pass, fail, timeout, and runtime-error cases;
7. save evidence and reload progress;
8. stop Ollama and repeat the core task flow;
9. open Trace Explorer from the product and inspect the connected trace;
10. open Control Center and Metrics & Logs;
11. use Back/Forward/refresh and confirm state preservation;
12. inspect console, network failures, accessibility tree, focus order, and
    overflow.

Run lifecycle/disk proof:

```bash
pnpm clean:preview
pnpm down
pnpm status
pnpm start
pnpm status
pnpm down
```

### Final acceptance criteria

- [ ] All required services and flows become ready from one command.
- [ ] All optional degradations are truthful and non-blocking.
- [ ] Exactly one central Jaeger contains connected cross-service traces.
- [ ] Jaeger Monitor shows RED metrics.
- [ ] Tempo and per-repository Jaeger instances are absent.
- [ ] No unexpected Browser console/network/accessibility defects remain.
- [ ] Fifty task runs and twenty lifecycle cycles leave no ephemeral resource
      growth.
- [ ] Durable data survives every normal stop/restart/cleanup test.
- [ ] Cleanup cannot touch unrelated Docker resources.
- [ ] All four `main` branches are clean, pushed, and recorded.

Only the orchestrator may mark this plan **complete** after these checks.

---

## 11. Evidence index required from the implementation agent

At minimum, publish:

```text
G0 baseline inventory and restore proof
G1 ADR, glossary, workspace schema tests
G2 AppHost resource graph export and dashboard screenshot
G3 health/product-state failure matrix
G4 trace propagation/redaction proof
G5 Jaeger persistence/retention/Collector reconciliation proof
G6 SPM, dashboards, and alert tests
G7 RU/EN, theme, accessibility, and desktop screenshots
G8 Docker ownership, cleanup preview/apply, cycle and crash tests
G9 launcher signal/idempotency tests
G10 trace parity and legacy removal scan
G11 chaos/performance/retention results
G12 dead-code/config/documentation scan
G13 independent acceptance report
```

Every artifact must include timestamp, repository SHA, environment/profile,
commands, exit codes, and hashes for machine-readable evidence. Redact secrets
and private learner/content payloads.

---

## 12. Official references used for this decision

- [Aspire overview and TypeScript AppHost](https://learn.microsoft.com/dotnet/aspire/get-started/aspire-overview)
- [Add Aspire to an existing TypeScript workspace](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/add-aspire-existing-app)
- [Aspire health checks and readiness vs liveness](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/health-checks)
- [Aspire executable resources](https://learn.microsoft.com/en-us/dotnet/aspire/app-host/executable-resources)
- [Aspire persistent resource lifetimes](https://learn.microsoft.com/en-us/dotnet/aspire/app-host/persistent-containers)
- [Aspire telemetry](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/telemetry)
- [OpenTelemetry Collector gateway pattern](https://opentelemetry.io/docs/collector/deploy/gateway/)
- [Jaeger v2 deployment](https://www.jaegertracing.io/docs/2.20/deployment/)
- [Jaeger v2 storage backends](https://www.jaegertracing.io/docs/2.20/storage/)
- [Jaeger Badger storage](https://www.jaegertracing.io/docs/2.20/storage/badger/)
- [Jaeger sampling](https://www.jaegertracing.io/docs/2.20/architecture/sampling/)
- [Jaeger Service Performance Monitoring](https://www.jaegertracing.io/docs/2.20/architecture/spm/)
- [Docker Compose project naming](https://docs.docker.com/compose/how-tos/project-name/)
- [Docker system prune safety and filters](https://docs.docker.com/reference/cli/docker/system/prune/)
- [Docker BuildKit garbage collection](https://docs.docker.com/build/cache/garbage-collection/)
- [Docker builder prune storage budget](https://docs.docker.com/reference/cli/docker/builder/prune/)

The official guidance supports the central choices in this plan: Aspire models
and starts a polyglot distributed application; OpenTelemetry provides
vendor-neutral instrumentation and a gateway; Jaeger v2 provides the desired
trace UI and requires persistent storage for non-demo use; Prometheus remains
necessary for Jaeger SPM and alertable metrics; Docker cleanup must be scoped,
measured, and separated from durable volume deletion.
