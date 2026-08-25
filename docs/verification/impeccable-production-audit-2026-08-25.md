# Fluent Interview — production UI and stack audit

**Date:** 2026-08-25  
**Scope:** desktop production package (`http://localhost:49300`), Question Brain,
Task Runtime, shared Jaeger, Lab Grafana, and the three Compose projects.  
**Primary target:** 16-inch MacBook Pro / Apple Studio Display. Mobile is not a
release gate for this audit.

## Verdict

**PASS for the current desktop release candidate.** No P0/P1 blocker was found
in the bounded browser and runtime pass. The product now has one explicit
content release, nine freely explorable paths, a real task-family language
switch, and one shared trace UI. The remaining items are audit-tooling and
performance follow-ups, not reasons to keep the release locked.

The provisional evidence score is **17/20 — Good**:

| Dimension | Score | Evidence / boundary |
| --- | ---: | --- |
| Accessibility | 3/4 | Skip link, landmarks, semantic navigation, keyboard-visible controls and RU/EN state were present in the DOM snapshot; a full computed-contrast scan still needs the optional detector parser. |
| Performance | 3/4 | Production package is healthy and editor/runtime are lazy boundaries; the build still reports a non-fatal bundle-budget warning. |
| Theming | 4/4 | Light/dark tokens are shared and the RU/EN path/library switches were exercised without layout or data loss. |
| Responsive | 3/4 | Desktop target is verified; mobile remains intentionally outside this release gate. |
| Implementation integrity | 4/4 | Question Brain → Lab → Task Runtime joins are explicit, release-pinned, and observable; no fallback content path is used. |

## Content and route inventory

The active release reports:

- 1 program (`Backend Engineer`)
- 9 paths: Node.js + TypeScript, Java + Spring, .NET + C#, Go, Frontend,
  System Design, Algorithms, Behavioral, Python
- 15 areas and 81 published stations
- 1,591 Question Brain cards in 135 topic groups
- 15 task families and 20 executable language revisions
- 1,591 accepted placement mappings, 0 proposed, 0 unmapped
- 6 station-bound executable card relations and 66 runnable stations

The numbers intentionally describe different layers: cards are content,
stations are graph curriculum units, and task revisions are executable
implementations. A card is not silently converted into a runnable task.

## Browser acceptance pass

All checks below were performed against the rebuilt production package after
the locale-window fix (`fluent-engineering-lab` revision `49dfd0f`).

| Surface | Result |
| --- | --- |
| Knowledge Map | All 9 path links loaded as `RELEASED PATH`; every path said “In Explore mode every station is open”; no standalone `LOCKED`/`ЗАКРЫТ` state appeared. |
| .NET + C# path | 75 accepted cards, 50 stations, 40 Run-ready; RU and EN copy switched correctly. |
| Question Library | 24 visible rows stayed 24 after RU → EN; Russian labels include `ПОВТОРЕНИЕ`, `Все разделы`, and `Question Brain · только опубликованные`. |
| Task Family: rate limiter | Six runnable revisions were visible: Go, C#, Java, TypeScript, JavaScript, SQL. No locked revision label was present. |
| Go rate limiter editor | A fresh run returned `4/4 passed`, exit `0`, runtime evidence accepted by the server, and a persisted run id. |
| Accessibility snapshot | `Skip to main content`, `Primary navigation`, `navigation`, `main`, and the RU/EN controls were exposed semantically. |

The first run in the already-open editor showed a transient `runner.failed`
state; the retry completed successfully and the error state cleared. This was
not reproducible after the package/runtime restart, but the run remains covered
by Jaeger and should stay visible in telemetry rather than being hidden.

## Observability and Compose acceptance

The active topology is one shared Jaeger, not one tracing UI per repository:

- Jaeger UI: `http://localhost:56686`
- OTLP gRPC/HTTP: `54317/54318`
- Jaeger services observed: `question-brain-api`, `fluent-task-runtime`,
  `learning-api`, `jaeger`
- Lab Grafana: `http://localhost:49304`
- Grafana datasources: Jaeger (`fel-jaeger`), Loki (`fel-loki`), Prometheus
  (`fel-prometheus`); no active Tempo datasource
- Question Brain readiness: `200` (`/health/ready`)
- Task Runtime readiness: `200` (`/v1/health/ready`)
- Lab package: `200` (`/onboarding`)

All three Compose files passed `docker compose ... config`. The workspace port
registry contains 17 unique loopback-only host ports. `pnpm prune:workspace`
removed zero current resources and did not delete durable Postgres/Redis
volumes; it is deliberately scoped and never runs a global `docker system
prune`.

## Automated checks

- Lab web: **77 suites / 376 tests passed**
- Lab observability: **7 suites / 39 tests passed**
- Shell validation: `bash -n` passed for `up.sh`, `status.sh`, `ports.sh`, and
  `prune.sh`
- Git state: root, Lab, Question Brain, and Task Runtime are clean and aligned
  with their `main` remotes

## Detector limitations and follow-ups

Impeccable 4.1.1 static detection was also run. The local environment does not
have the detector's optional `puppeteer`, `htmlparser2`, `css-select`,
`css-tree`, or `domutils` modules, so URL rendering and computed contrast were
not available; the regex fallback explicitly reports that its findings are an
undercount. The fallback found 253 items: 249 advisory type/radius-ramp
deviations and four warnings on intentional accent/side borders in failure and
project-book surfaces. These are not release blockers, but they should be
reviewed in the next visual pass.

Remaining bounded work:

1. Add the optional Impeccable detector dependencies to the audit environment
   and rerun the desktop URL pass with computed contrast.
2. Decide whether the four side-border findings are intentional tokenized
   affordances; if so, document the detector exceptions rather than changing
   the visual language.
3. Reduce the non-fatal production bundle-budget warning (current package is
   roughly 547 kB; the route stylesheet is roughly 62 kB) in a separate
   performance gate.
4. Keep a Go toolchain in CI or on the host if local `go test ./...` parity is
   required; the Docker runtime health and browser run were verified here, but
   the host did not expose a `go` executable.

These follow-ups do not reopen the content graph or reintroduce a fallback
path. They are explicit quality gates for the next release.
