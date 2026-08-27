# Runtime release join gate

- Status: **PASS**
- Generated: 2026-08-27T22:23:42.218Z
- Brain question release: `question-release-d00a14931e607336`
- Runtime question release dependency: `question-release-d00a14931e607336`
- Runtime task release: `task-family-release-2026-08-26-g10`
- Catalog bindings checked: 22
- Revisions checked: 20 (19 runnable, 1 deferred)

Every Runtime question binding matches the published Brain revision and content hash; every runnable revision is released and immutable, while deferred revisions are explicitly non-runnable.

## Checks

- [x] brain-release-readable: JSON projection available
- [x] brain-catalog-readable: JSON projection available
- [x] runtime-readiness-readable: JSON projection available
- [x] runtime-catalog-readable: JSON projection available
- [x] brain-catalog-release-identity: question-release-d00a14931e607336 == question-release-d00a14931e607336
- [x] runtime-question-release-identity: question-release-d00a14931e607336 == question-release-d00a14931e607336
- [x] brain-production-only: Question release excludes fixtures
- [x] runtime-ready: Task Runtime reports ready
- [x] runtime-release-id: task-family-release-2026-08-26-g10
- [x] family:task-family.deferred:released: released
- [x] family:task-family.dotnet-cancellation:released: released
- [x] family:task-family.fluent-calculator:released: released
- [x] family:task-family.rate-limiter:released: released
- [x] family:task-family.authentication-authorization:released: released
- [x] family:task-family.cache-invalidation:released: released
- [x] family:task-family.bounded-concurrency:released: released
- [x] family:task-family.cpu-bound-work:released: released
- [x] family:task-family.event-loop-ordering:released: released
- [x] family:task-family.idempotent-delivery:released: released
- [x] family:task-family.memory-retention:released: released
- [x] family:task-family.streams-backpressure:released: released
- [x] family:task-family.postgresql-query-planning:released: released
- [x] family:task-family.postgresql-row-locks:released: released
- [x] family:task-family.postgresql-rate-limiting:released: released
- [x] family:task-family.project-book-boundary:deferred: deferred capability-only family is non-runnable
- [x] runtime-question-bindings: 22 binding(s) match Brain revision and content hash
- [x] runtime-revisions-immutable-runnable: 20 revision(s) have immutable hashes; 19 runnable and 1 explicitly deferred
