# Plan progress — G12-025 Practice corridor evidence (2026-09-02)

## Status

- **Wave:** G12-025 Practice corridor state evidence
- **Target repository:** `fluent-interview-platform`
- **Target branch:** `main` (local only; no push)
- **Target commits:** `42616207cd705d3214476d0016e1a86ff72bffa8`, then
  `b4b37f2aaf0a74d22dd9fa28efa1a895a6a29ab8`
- **Commit subjects:** `feat(g12): capture practice corridor state evidence`;
  `fix(g12): align practice evidence index`
- **Master-plan counter:** **658 checked / 476 remaining / 1134 total
  (58.02%)**

This wave adds immutable state evidence only. It does not add curriculum
content, tasks, or progress records and therefore does not change the formal
master-plan counter.

## What was captured

Live `/practice` routes were checked on the compose-project-scoped stack:

1. `node-released` — Node.js lane, 8 lessons, one released executable task;
2. `java-preview` — Java lane, 6 lessons, no falsely released task family;
3. `go-preview` — Go lane, 6 lessons, no falsely released task family;
4. `empty` — Go controlled-lab mode with deterministic zero-entry state and
   Atlas recovery link;
5. `degraded` — advisory evidence POST fails closed while API is temporarily
   unavailable; retry stays enabled and assessment state is unchanged.

Each state has interaction JSON, semantic JSON, and a real visual JPEG under:

`fluent-interview-platform/docs/verification/greenfield/G12/state-evidence/practice-corridor/`

The canonical report is:

`fluent-interview-platform/docs/verification/greenfield/G12/state-evidence/practice-corridor-wave-2026-09-02.md`

## Runtime and gates

- base URL: `http://127.0.0.1:47360/`;
- session `7afeba77-21d6-4238-8aa8-1d822d99e574`;
- **6/6** services healthy after API recovery;
- migrations **18/18**, pending **0**;
- state registry: `stateHash=b197769f…`, `screens=12`, `states=71`,
  `evidenceReadyStates=28`, `openStates=43`, `openDispositions=12`,
  `unresolvedItems=55`, `structuralFailureCount=0`;
- G10S evidence index: **519** historical metadata-only entries;
- checksum manifest: PASS for every listed artifact;
- focused registry tests: **4/4 PASS**;
- required target ladder (status, diff check, `NX_CI=1 pnpm check`, boundary,
  toolchain, commit): PASS for the feature and corrective commits.

The second commit is a required integrity correction: after the G12 checksum
line changed, the G10S historical index was regenerated and committed so its
metadata digest remained exact. No historical evidence body was rewritten.

## Remaining queue

G12-025 still needs the remaining **43** state captures and **12** human
dispositions. The next bounded wave is Practice workbench (`idle`, `running`,
`passed`, `mismatch`, `error`, `cancelled`, `runner-down`, `focus-mode`,
`resized`), followed by G10S-246 human acceptance, G11 breadth, path-specific
closure packs, G12.5 requalification, independent final review and G13
decommission.

No push was performed because GitHub Actions minutes are constrained.
