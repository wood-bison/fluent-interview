# M1 independent review — green truth and cross-repository contract

Date: 2026-08-25
Status: **PASS**
Active plan: [`CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md`](../../../CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md)

Reviewer: `technical_release_plan` (independent release review)

## Reviewed source

| Repository | SHA | Pushed | Clean |
| --- | --- | --- | --- |
| root | `4cb6ce773e9c3343d6693d83bb0170fdc12f1371` | yes | yes |
| fluent-question-brain | `e698fc2e76c6f8c27ec71dc6231f415467e8fe60` | yes | yes |
| fluent-task-runtime | `45c4519af67a61cee03c6dd02bf2b4b50d5b0bc6` | yes | yes |
| fluent-engineering-lab | `401ee9fe8993fc739f2556deebf3cec4746e4848` | yes | yes |

## Acceptance result

1. `./scripts/workspace-contract.sh check` passed; the canonical fixture and
   all three consumer copies have canonical SHA-256
   `9679a5ffe6b6eb3df1229cec1ab98366cf63252f228bf3e73aa4b38c34eb5bca`.
2. Lab `pnpm check` passed with curriculum drift `0`, all lint/test/build
   targets green, 245 Lab contract suites / 1,241 tests, 162 Learning API
   suites / 701 tests, 77 Web files / 376 tests, and the production bundle
   guard scanning 61 chunks. Existing lint and bundle-budget warnings remain
   non-fatal findings for later performance gates; no error was introduced.
3. Brain `make check` passed. The host Go toolchain was absent, so the
   fail-closed `scripts/go-check.sh` executed `go test ./...` in
   `golang:1.23-bookworm`; no Go test was skipped.
4. Runtime `go test ./...` passed in the documented `golang:1.24-bookworm`
   container. `g8-release-join-smoke.sh` passed with the current v3 source
   manifest and a derived count of **20 tasks**. The generator accepts v1/v2/v3
   release history and emits the v3 join.
5. The six additive records in `capability-mastery-bundle.v1` and the five
   independent readiness/learner dimensions are validated in Brain, Runtime
   and Lab. Required stale-hash, missing assessment plan, inactive registry,
   incomplete primary card, provenance, profile and contradictory release
   rejection paths are implemented; unsupported versions fail closed.
6. Historical 18-revision manifests, cards, TaskFamilies, `completion.v1` and
   legacy files were not rewritten. The only current fixture correction is Lab's
   inventory value `taskRevisionCount: 20`.

## Decision

**M1 is DONE.** M2 may start and is now the only active gate. This review does
not claim that the learner evidence ledger, rate-limiter human golden slice,
readiness compiler, or full release crawl are complete.

## Non-blocking follow-ups

- Mirror the complete negative-test matrix in Brain and Runtime, not only the
  required implementation branches.
- Add a root one-command wrapper for the containerized Runtime Go check.
- Rebuild the Compose images from the M1 SHAs before a future live-binary or
  M12 acceptance crawl.
