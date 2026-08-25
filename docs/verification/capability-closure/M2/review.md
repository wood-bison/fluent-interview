# M2 independent review — durable capability evidence ledger

Date: 2026-08-25  
Status: **PASS**  
Active plan: [`CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md`](../../../CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md)

Reviewer: `technical_release_plan` (independent release review)

## Reviewed source

| Repository | SHA | Pushed | Clean |
| --- | --- | --- | --- |
| root | `d76f271179c82d0cfb8e6d3f8a883471a856c3a4` | yes | yes |
| fluent-question-brain | `e698fc2e76c6f8c27ec71dc6231f415467e8fe60` | yes | yes |
| fluent-task-runtime | `45c4519af67a61cee03c6dd02bf2b4b50d5b0bc6` | yes | yes |
| fluent-engineering-lab | `00460faac4c41762518a75278e72c9f5ff5849ad` | yes | yes |

## Acceptance result

1. The append-only `capability-mastery-ledger.v2` contract is implemented with
   server-owned projection, human provenance rules, revision identity and
   fail-closed ordering for recall, prediction, run, observation, explanation,
   reflection and delayed repeat. Browser and LLM inputs cannot write mastery.
2. In-memory and Postgres repositories share the contract state machine. Exact
   duplicate event IDs are idempotent; a duplicate event ID with different
   profile, capability or payload is rejected as typed `conflicting_duplicate`
   before a capability-scoped write, so no cross-profile overwrite is possible.
3. Focused tests pass: the in-memory contract suite is **3/3** and the Postgres
   integration collision/idempotency suite is **1/1** against the disposable
   integration database.
4. The live backup artifact covers **28/28** learner surfaces. The restore gate
   passes twice consecutively and refuses same-schema restore. Its bounded
   synthetic fixture has non-empty rows on all **13 M2 surfaces**; source,
   artifact and restored counts, identity references and per-surface SHA-256
   digests match. Exact fixture rows and the disposable schema are zero after
   cleanup, and cleanup stays armed if residual rows ever remain.
5. The final Lab check passed: curriculum drift `0`; lab-contracts `247`
   suites / `1254` tests; learning-api `163` suites / `705` passed tests with
   `1` skipped; web `77` files / `376` tests; production build and the
   61-chunk browser-boundary guard passed. Existing lint and bundle-budget
   messages remain non-fatal follow-ups and are not release evidence.

## Decision

**M2 is DONE.** The next and only active gate is **M3**, the real rate-limiter
human golden slice from QuestionCard through deterministic runtime evidence and
the honest delayed cold repeat. This review does **not** claim a product
release: M3–M13 remain open and no mastery is awarded from fixtures, E2E runs,
screenshots or historical completion data.

## Non-blocking follow-ups for M3+

- Connect the real rate-limiter session producers to the ledger and prove the
  full browser/runtime path with Sergey-owned human provenance.
- Keep the 48–72 hour cold-repeat due time real; do not advance the profile clock
  to manufacture mastery.
- Rebuild Compose images from the pinned SHAs before a future live release
  crawl, then verify the shared Jaeger/observability stack from the fresh
  binaries.

