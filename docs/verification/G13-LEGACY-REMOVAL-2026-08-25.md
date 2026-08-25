# G13 legacy removal — workspace boundary evidence (2026-08-25)

Status: **in progress**. The active task relation projection is clean; the
remaining work is a final documentation classification and production audit.

## Accepted current boundary

| Concern | Canonical owner | Current join | Proof |
| --- | --- | --- | --- |
| Question cards, locales, graph, capabilities | Question Brain | released HTTP projection | Brain ADR-0003 and G7/G9 evidence |
| Executable task families/revisions and runs | Task Runtime | v3 release manifest | Runtime `df37551`, `docs/contracts/question-brain-release-binding.md` |
| Learner navigation/progress/evidence UI | Fluent Lab | Lab adapter over the two releases | Lab `196ae22`, `docs/verification/G13-LEGACY-REMOVAL-2026-08-25.md` |
| Workspace launch | Fluent Interview | explicit Compose projects and release pins | `scripts/up.sh`, `AGENTS.md`, `workspace.yaml` |

Question-backed tasks use `questionBindings` (stable key, immutable revision,
content hash). Capability-only tasks use `capabilityKeys`. The overloaded
`questionKeys` field is not emitted, parsed, or used to make a task runnable.
Go Runtime and Lab parsers reject it with a migration error, so a stale
descriptor cannot silently become a different relation.

## Verification recorded

```text
Runtime: go test ./...                         PASS
Lab:     lab-contracts 243 suites / 1,227 tests PASS
Lab:     web 77 files / 369 tests               PASS
Lab:     learning-api 162 suites / 695 tests    PASS
Lab:     pnpm check:release                     PASS
Lab:     git diff --check                       PASS
```

The workspace launcher is pinned to the active reconciled Runtime release:
`task-release-2026-08-25-qb-d00a1493-g8.json`. It fails closed when that
manifest or the explicit Question Brain mapping is absent; it does not select
a historical descriptor or local question catalogue.

## Remaining G13 work

1. Classify historical ADRs/reports and migration fixtures so a search hit is
   unambiguously historical, a negative test, or a current invariant.
2. Run the clean workspace/Compose audit and confirm no generated local
   catalogue, orphan process, or stale release pin remains in steady state.
3. Update the production ledger only after that audit and the G12 content
   disposition are complete.

Historical releases and immutable evidence are intentionally preserved for
rollback and provenance; deleting them would destroy the audit trail rather
than remove a runtime fallback.
