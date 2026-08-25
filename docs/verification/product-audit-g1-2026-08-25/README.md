# Follow-up production smoke — Lab `b41b7e7`

Date: 2026-08-25 13:28–13:31 Europe/Warsaw  
Scope: `fluent-engineering-lab` after `b41b7e7 fix(a11y): enlarge task workspace controls`

This is a follow-up to `product-audit-g0-2026-08-25`. It records the
post-change local production package and a fresh Browser run. It is not a
claim that G0–G10 are closed: the target-size screenshot harness, canonical
taxonomy release, bundle budgets, and the remaining full release matrix are
still open in the authoritative remediation plan.

## Package boundary

- local package state: `ready`
- source revision: `b41b7e705dc5feb910c670fb4c0029eceee3923e`
- graph release: `2026.08.06-curriculum-graph.3`
- learner route: `http://localhost:49300/onboarding`
- learning API: `http://localhost:49301/api`
- Postgres: `49302`; Redis: `49303`
- readiness: task-runtime, learning-api, learner-web, Postgres, and Redis all
  reported ready

## Browser evidence

The in-app Browser used a fresh tab at its default desktop viewport. Every
route below had one `main`, zero `[role=alert]` nodes, no horizontal overflow,
and zero captured console errors.

| Route | Result |
| --- | --- |
| `/learning-map` (RU) | 283 interactive elements; zero visible interactive elements below 44 CSS px; `Карта знаний` |
| `/learning-map` (EN) | `document.documentElement.lang = en`; `Knowledge map`; no overflow |
| `/practice/questions?question=question.q315` | `Библиотека вопросов`; `1 вопрос · 1 загружено`; one TaskFamily with four links to the rate-limiter family |
| `/practice/lab/go-rate-limiter-001?revision=1&taskFamily=task-family.rate-limiter` | `Rate limiter in Go`; xterm, Task Runtime, Evidence present; public result `4/4`; no console errors |

The published path matrix also passed directly: all nine routes from
`/api/program/map` (`nodejs-typescript`, `java-spring`, `dotnet-csharp`, `go`,
`frontend`, `system-design`, `algorithms`, `behavioral`, `python`) rendered a
distinct H1 with one `main`, no lock state, no 404 state, no overflow, and no
captured console errors.

The question screen was left open with q315's executable-revision disclosure
expanded for review. Four links point to the same TaskFamily rather than four
copied families; language-specific workspace selection remains the next
step.

## Automated checks

- `pnpm nx test web --skip-nx-cache`: 77 files, 374 tests passed.
- `pnpm nx lint web --skip-nx-cache`: 0 errors, 13 existing warnings.
- production build completed; existing warnings remain: initial bundle
  `547.06 kB` vs `520 kB` budget and `lab.route.scss` `62.32 kB` vs `44 kB`.
- `git` status was clean in the workspace and all three child repositories;
  the Lab commit was pushed to `origin/main`.

## Interpretation

The change closes the small task-workspace hit-area regression for the four
controls it owns (theme select, OS-sync label, Grafana run link, and runner
output disclosure). The remaining small items observed in the lab are the
native checkbox box inside its 44px label and dense secondary links/details;
they are tracked as accessibility/design follow-up, not silently counted as
closed.
