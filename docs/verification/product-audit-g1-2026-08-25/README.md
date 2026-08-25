# Follow-up production smoke — Lab `d7a6662`

Date: 2026-08-25 14:00–14:16 Europe/Warsaw
Scope: `fluent-engineering-lab` after `d7a6662 fix(routes): preserve concept route boundaries`

This is a follow-up to `product-audit-g0-2026-08-25`. It records the
post-change local production package and a fresh Browser run. It is not a
claim that G0–G10 are closed: the target-size screenshot harness, canonical
taxonomy release, bundle budgets, and the remaining full release matrix are
still open in the authoritative remediation plan.

## Package boundary

- local package state: `ready`
- source revision: `d7a6662ed84ce085819183d14cdedd7a47792056`
- latest Lab commits in this audit: `4f9ea7f`, `92eeac6`, `d7a6662`
- final operation boundary: `046281b8-e861-4bdf-a5c0-7f4c55d49e0a`
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
| `/practice/questions?question=question.q315` | `Библиотека вопросов`; q315 exposes one TaskFamily with **6** executable revisions |
| `/practice/task-family/task-family.rate-limiter` | six language controls switch task ID and editor URL; Go, C#, Java, TypeScript, JavaScript and SQL all report `1 запускается` |
| `/practice/lab/go-rate-limiter-001` | `Rate limiter in Go`; CodeMirror tokens, xterm, Task Runtime, Evidence and Run present; no alert/overflow |
| `/practice/lab/csharp-rate-limiter-001` | `Rate limiter in .NET`; C# tokens, editable `RateLimiter.cs`, Run and Evidence present; no alert/overflow |
| `/practice/lab/java-rate-limiter-001` | `Rate limiter in Java`; Java tokens, editable `RateLimiter.java`, Run and Evidence present; no alert/overflow |
| `/practice/lab/ts-rate-limiter-001` | `Rate limiter in TypeScript`; TypeScript tokens, editable `rate-limiter.ts`, Run and Evidence present; no alert/overflow |
| `/practice/lab/node-rate-limiter-001` | `Rate limiter in Node.js`; JavaScript tokens, editable `rate-limiter.js`, Run and Evidence present; no alert/overflow |
| `/practice/lab/pg-rate-limiter-001` | `Rate limiter in PostgreSQL`; SQL tokens, editable SQL workspace, Run and Evidence present; no alert/overflow |

The published path matrix also passed directly: all nine routes from
`/api/program/map` (`nodejs-typescript`, `java-spring`, `dotnet-csharp`, `go`,
`frontend`, `system-design`, `algorithms`, `behavioral`, `python`) rendered a
distinct H1 with one `main`, no lock state, no 404 state, no overflow, and no
captured console errors.

The q315 disclosure was expanded and all six language buttons were clicked. The
selected revision changed as follows: Go → `go-rate-limiter-001`, C# →
`csharp-rate-limiter-001`, Java → `java-rate-limiter-001`, TypeScript →
`ts-rate-limiter-001`, JavaScript → `node-rate-limiter-001`, SQL →
`pg-rate-limiter-001`. Runtime-only revisions now pass the server-owned route
context as `ready` instead of being rejected as unknown curriculum labs.

## Automated checks

- `pnpm nx test web --skip-nx-cache`: 77 files, 374 tests passed.
- route-context unit suite: 4 tests passed, including a runtime-only
  TypeScript revision.
- `pnpm nx lint web --skip-nx-cache`: 0 errors, 13 existing warnings.
- Task Runtime Docker smoke: Go, C#, Java, TypeScript, JavaScript and SQL
  solutions returned HTTP 200 with four passing checks each (recorded in
  `fluent-task-runtime/docs/verification/G9-RATE-LIMITER-LANGUAGE-REVISIONS-2026-08-25.md`).
- production build completed; existing warnings remain: initial bundle
  `547.08 kB` vs `520 kB` budget and `lab.route.scss` `62.45 kB` vs `44 kB`.
- `git` status was clean in the Lab after commit `d7a6662`, which is pushed to
  `origin/main`; the workspace launcher is pinned to Runtime release g9.

## Interpretation

The original missing-highlight symptom had two independent causes. Go was not
registered in the shared CodeMirror language registry; commit `4f9ea7f` adds the
Go grammar, extension and label. C# and TypeScript were published in Runtime
but were not admitted by Lab's route-context projection; commit `92eeac6`
admits released runnable revisions while keeping graph metadata canonical for
existing stations. The follow-up safety boundary in `d7a6662` prevents a
runtime task ID from accidentally overriding a real concept station. The
Browser now observes colored CodeMirror token spans for all five requested
languages (and JavaScript), and the Runtime API has returned passing Docker
evidence for all six revisions.
