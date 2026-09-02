# Progress checkpoint — G12 Settings wave (2026-09-02)

## Master plan

Evidence-only волна не добавляет curriculum items. Актуальный счётчик мастер-плана:

| checked | remaining | total | completion |
| ---: | ---: | ---: | ---: |
| 658 | 476 | 1,134 | 58.02% |

## Completed bounded wave

- Target repository: `fluent-interview-platform`, branch `main`.
- Commit: `db7817d` — `feat(g12): capture settings state evidence`.
- Scope: 8 Settings states, including model unavailable/ready, RU/EN, all themes,
  and destructive-action confirmation.
- Result: 8/8 PASS; the persisted-model select regression was fixed and covered by
  smoke test.
- Registry after wave: 66/71 evidence-ready, 5 open states, 12 open
  dispositions, 17 unresolved items, 0 structural failures.
- Historical G10S index: 639/639 verified, 0 rewrites.
- Push: intentionally not performed while GitHub Actions quota is constrained.

## Next executable wave

Implement and verify the five remaining Control Center states:
`ready`, `starting`, `degraded`, `stopped`, and `incident-capture`. Keep the
default route honest, make simulated fixtures explicit, preserve the single
scroll owner, add state-specific smoke/evidence artifacts, run the target
ladder, and commit locally. Do not mark the master curriculum counter complete
from evidence-only work.
