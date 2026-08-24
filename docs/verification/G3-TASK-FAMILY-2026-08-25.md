# G3 verification — TaskFamily and language revisions

Date: 2026-08-25
Status: **complete**
Owner: `fluent-task-runtime`
Runtime commit: `4a9c3c9`

## Result

Task Runtime now owns a versioned, language-neutral `TaskFamily` contract and
immutable language-specific `TaskRevision` metadata. The release contains all
18 task descriptors exactly once. Four objective-identical rate-limiter
implementations are grouped under one family (`Go`, `Java`, `Node.js`, and
`PostgreSQL`). The catalogue also exposes a `.NET` profile through its own
language-specific family; a C# rate-limiter revision is intentionally not
invented until the same objective and contract are authored.

The project-book family is represented explicitly as `unreleased` and
`brief_only`; it is not runnable and cannot be unlocked through a fallback.
The new v2 task release pins `taskFamilyKey` and canonical capability keys for
every revision. Historical v1 release files were not rewritten.

## Contract and API checks

- `task-families/manifest.json` is the immutable family release
  `task-family-release-2026-08-25` with 15 families and 18 revisions.
- Every released revision resolves to exactly one family, language/profile, and
  SHA-256 directory hash; a missing or mismatched reference fails catalogue
  startup.
- `GET /v1/task-families` and `GET /v1/task-families/{key}` expose localized
  metadata, capability bindings, rubric references, and availability only.
- Safe learner projections contain no source, commands, image names, starter
  files, solutions, hidden tests, or sandbox policy.
- A family is `runnable=true` only when at least one revision is runnable;
  the project-book family is `runnable=false`.

## Verification commands and live evidence

```sh
docker run --rm -v "$PWD":/src -w /src golang:1.24 \
  sh -c 'export PATH=/usr/local/go/bin:$PATH; gofmt -w ... && go test ./...'
docker compose -p fluent-task-runtime -f deploy/compose/compose.yaml build runtime
docker compose -p fluent-task-runtime -f deploy/compose/compose.yaml up -d runtime jaeger
curl -fsS http://127.0.0.1:48227/v1/health/ready
curl -fsS http://127.0.0.1:48227/v1/tasks/summary
curl -fsS http://127.0.0.1:56687/api/services
git diff --check
```

All Go tests passed. The runtime image digest was
`sha256:9048934b86f72ad78b861cb8d287d249cff4795f9ef00d4a5bc7503285cff6a2`.
Compose readiness returned `200/ready`; Jaeger reported
`fluent-task-runtime` and `jaeger-all-in-one`.

Real Docker-backed pass/fail runs were recorded for each affected profile:

| Profile | Task | Pass correlation | Fail correlation |
| --- | --- | --- | --- |
| Node.js | `node-event-loop-001` | `g3-node-pass` | `g3-node-fail` |
| Go | `go-rate-limiter-001` | `g3-go-pass` | `g3-go-fail` |
| Java | `java-rate-limiter-001` | `g3-java-pass` | `g3-java-fail` |
| .NET | `dotnet-cancellation-001` | `g3-dotnet-pass` | `g3-dotnet-fail` |
| PostgreSQL | `pg-rate-limiter-001` | `g3-sql-pass` | `g3-sql-fail` |

Every pass returned `results.status=pass`; every intentionally incomplete
submission returned `results.status=fail`. Machine-readable evidence and the
full Runtime contract are in:

- `/Users/sergeyzhechko/developer/fluent-interview/fluent-task-runtime/docs/verification/G3-TASK-FAMILY-2026-08-25.md`
- `/Users/sergeyzhechko/developer/fluent-interview/fluent-task-runtime/docs/verification/runtime-task-families-2026-08-25.json`
- `/Users/sergeyzhechko/developer/fluent-interview/fluent-task-runtime/docs/contracts/task-family.v1.md`
