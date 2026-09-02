# Plan progress — G12-025 Question catalog evidence (2026-09-02)

## Status

- **Wave:** G12-025 Question catalog state evidence
- **Target repository:** `fluent-interview-platform`
- **Target branch:** `main` (local only; no push)
- **Target commit:** `13d3e9ef9188d398f1ab1934b5b44882d6e50623`
- **Commit subject:** `feat(g12): capture question catalog state evidence`
- **Master-plan counter:** **658 checked / 476 remaining / 1134 total
  (58.02%)**

This wave adds immutable state evidence only. It does not add curriculum
content or change the master-plan counter.

## What was captured

Live `/questions?locale=en` and deep links were checked on the
compose-project-scoped stack:

1. `all` — complete English catalog;
2. `track-filter` — Java track filter;
3. `lesson-filter` — Node event-loop lesson filter;
4. `ru` — Russian locale and `html[lang]` semantics;
5. `no-match` — deterministic zero-result search boundary;
6. `long-answer` — question deep-link preserving `track` and `lesson`.

Each state has interaction JSON, semantic JSON and a real visual JPEG under:

`fluent-interview-platform/docs/verification/greenfield/G12/state-evidence/question-catalog/`

The wave report is:

`fluent-interview-platform/docs/verification/greenfield/G12/state-evidence/question-catalog-wave-2026-09-02.md`

## Runtime and gates

- session `7afeba77-21d6-4238-8aa8-1d822d99e574`;
- **6/6** services healthy;
- migrations **18/18**, pending **0**;
- state registry: `stateHash=88b98eff…`, `screens=12`, `states=71`,
  `evidenceReadyStates=23`, `openStates=48`, `openDispositions=12`,
  `unresolvedItems=60`, `structuralFailureCount=0`;
- G10S evidence index: **503** historical entries;
- checksum manifest: PASS;
- focused registry tests: **4/4 PASS**;
- target ladder (`status`, `diff --check`, `NX_CI=1 pnpm check`, boundary,
  toolchain, commit): PASS.

## Remaining queue

G12-025 still needs the remaining **48** state captures and **12** human
dispositions. The next bounded wave is Practice corridor/workbench, followed
by G10S-246 human acceptance, G11 breadth, path-specific closure packs,
G12.5 requalification, independent final review and G13 decommission.

No push was performed because GitHub Actions minutes are constrained.
