# Fluent Interview: production integrity and UX remediation plan

Status: **historical audit; superseded remediation queue**

> This document preserves the live 2026-08-25 audit findings. It is not an
> active execution queue. The root
> [`CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md`](CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md)
> is the only active plan; findings here are evidence until explicitly
> accepted into a current gate.
Created: **2026-08-25**
Scope: `fluent-engineering-lab`, `fluent-question-brain`,
`fluent-task-runtime`, and the `fluent-interview` workspace.

This plan is the handoff for the next implementation agent. It is based on a
live desktop Browser walkthrough, source inspection, API reconciliation,
Compose readiness checks, the project test suites, and an Impeccable design
audit. It does not replace
`QUESTION-CAPABILITY-TASK-PRODUCTION-PLAN-2026-08-24.md`; it closes the
integration and product-quality defects that remain visible after gates G0-G5
of that plan.

The executor must work from G0 to G10 in order. A later gate must not start
until every acceptance checkbox of the current gate is proven by a committed
evidence file. “Looks better”, a green unit test, or a healthy container is not
enough on its own.

## 1. Product verdict

The three-service architecture is correct and operational, but the learner
product is **not yet production-coherent**. Question Brain publishes 1,591
localized cards and Task Runtime publishes 18 task revisions, while Lab still
presents parts of the system as a legacy 15-area Node-first sequence. Several
screen labels compare unlike entities, path cards are mostly search shortcuts,
and one confirmed ID-normalization defect hides four valid rate-limiter task
revisions from the learner.

### Impeccable score

| Dimension | Score | Evidence |
| --- | ---: | --- |
| Accessibility | 2/4 | Main learner routes have one `main`, but Studio Content/Graph have two nested `main` landmarks; one unnamed checkbox exists in the lab; many links/controls render below 32 px high. |
| Performance | 2/4 | Production build passes, but initial bundle is 549.49 kB against a 520 kB budget and `lab.route.scss` is 62.23 kB against 44 kB; question detail interaction was fragile; the 135-topic catalogue is visually and computationally heavy. |
| Responsive desktop | 3/4 | No horizontal overflow at 1,920 px in the audited routes; desktop composition is stable. MacBook Pro 16-inch and Studio Display acceptance still need explicit screenshot baselines. Mobile is out of scope. |
| Theming and i18n | 2/4 | Auto/Light/Dark and RU/EN controls work and preserve the route, but Russian surfaces contain substantial English copy and English mode can retain Russian learner-state copy. |
| Product integrity | 1/4 | Counters use inconsistent nouns, path cards do not open real path projections, the recommended sequence has cross-language prerequisites, and valid TaskBrief revisions disappear in UI. |
| **Total** | **10/20** | **Healthy services, incomplete product composition.** |

### Positive findings to preserve

- All three Compose stacks are healthy and use distinct loopback-only ports.
- Question Brain and Task Runtime release IDs are joined and readiness is green.
- Question Brain reports 1,591 published cards, 1,591 EN, 1,591 RU, and zero
  unmapped curriculum cards.
- The rate-limiter Runtime family already has valid Go, Java, Node, and
  PostgreSQL revisions.
- The Node rate-limiter workspace runs and previously recorded evidence remains
  inspectable.
- Learner routes show no horizontal overflow at the audited desktop width.
- Theme switching and locale switching preserve the current route.
- Lab `pnpm check`, Brain Go tests, and Runtime Go tests pass.

## 2. Verified baseline

Refresh these facts in G0; do not copy them blindly into later evidence.

| Fact | Live value on 2026-08-25 |
| --- | ---: |
| Program | 1 — Backend Engineer · Node.js primary |
| Published paths | 9 |
| Lab curriculum areas | 15 |
| Lab stations | 81 |
| Question Brain cards | 1,591 |
| Question Brain topic groups | 135 |
| Cards with accepted Path/Domain mapping | 1,591 |
| Cards with explicit executable-station crosswalk | 6 |
| Runtime task revisions | 18 |
| Runtime revisions with exact valid question pins | 17 |
| Capability-only Runtime revisions | 1 (`project-book-boundary-001`) |
| Rate-limiter revisions pinned to `question.q315` | 4 |
| Project books | 5 preview, 0 published |

These are different nouns. Never present `81 stations`, `66 runnable stations`,
`18 task revisions`, `6 station-bound cards`, or `1,591 cards` as if they were
the same count.

### Confirmed P0/P1 defects

1. **P0 — valid TaskBrief revisions disappear in the UI.**
   `/api/runtime/relations` returns four valid `question.q315` bindings. The
   library stores the selected ID as `question.q315`, then constructs
   `question.${selectedId}`, producing `question.question.q315`; the screen
   reports “0 revisions”.
2. **P0 — path catalogue is not a path experience.** Node opens
   `/learning-map`; the other eight paths open a generic question search such
   as `?search=Java`. There is no path-scoped projection, path overview, or
   path-scoped progress.
3. **P0 — the recommended graph still encodes a legacy language chain.** The
   visible/accessible sequence makes .NET depend on Node, Go depend on .NET,
   and Java depend on Go. Independent stack paths must not be prerequisites of
   one another.
4. **P1 — metric semantics are contradictory.** Examples include “81 routes”
   where the product has 9 paths, “66 executable stations” alongside 18 Runtime
   revisions, and path cards where “linked” can exceed “found”.
5. **P1 — project defense performs a missing request.** Browser console records
   `GET /api/project-books/content-delivery-platform/defense/export → 404`.
6. **P1 — project release language contradicts state.** A preview book with no
   published Runtime binding offers an “Open published defense workspace”.
7. **P1 — localization is incomplete.** Progress, labs, project defense,
   Studio, and dynamic learner-state messages mix RU/EN. The RU project defense
   is almost entirely English.
8. **P1 — Studio landmark structure is invalid.** `/studio/content` and
   `/studio/graph` render two `main` landmarks because routed surfaces contain
   `<main>` inside the shell's main content.
9. **P1 — question selection is not reliably deep-linkable.** Selecting a
   result does not consistently write the selected card to the URL, so refresh,
   Back/Forward, and sharing are ambiguous.
10. **P2 — taxonomy is noisy.** Examples include `Go / Channels & select` vs
    `Go / Channels & Select`, `Go / Sync & Patterns` vs `Go / Sync Patterns`,
    and `Distributed Systems & Resilience` vs
    `Distributed Systems / Resilience`. The learner sees a wall of 135 groups.
11. **P2 — content quality is not fully protected by current quality counters.**
    Examples observed in the Java search include “Solve the additional Java
    tasks” and “Write the SQL queries required by the task” classified under
    Java Core Language.
12. **P2 — design-system drift is broad.** Impeccable's degraded regex scan
    reported 244 findings: 121 radius, 88 font-size, 31 color, three side-tab,
    and one accent-border finding. The detector itself was degraded because
    parser modules and Puppeteer were unavailable; its counts are directional,
    not a complete visual verdict.

## 3. Non-negotiable execution rules

1. Read root and repository `AGENTS.md` files before every gate.
2. Do not add a fallback catalogue, copied JSON, direct cross-repository SQL,
   fuzzy station matching, or UI-only fake count.
3. Question Brain owns cards, taxonomy, locales, capability bindings, and card
   relations. Task Runtime owns task families, revisions, sandboxes, tests, and
   runs. Lab owns paths, learner composition, progress, and evidence.
4. Stable keys are normalized exactly once at an API boundary. Never add or
   strip `question.` in a component template or computed signal.
5. A path is a first-class route and projection, not a full-text search query.
6. Explore mode permits opening any published path/station/card. Readiness and
   recommendation remain visible but cannot masquerade as access control.
7. No gate is complete without unit/contract tests, Browser evidence at both
   target desktop sizes, zero unexpected console errors, and a pushed `main`.
8. Preserve unrelated user/agent changes. Inspect `git status` before and after
   every commit.

## G0 — Freeze the reproducible baseline

### Work

- [ ] Record HEAD, branch, remote, dirty files, image IDs, migration versions,
      release IDs, health, and live counts for all three repositories.
- [ ] Save the API payloads used for the metric glossary, q315 join, path
      catalogue, and project catalogue under
      `docs/verification/product-audit-g0-2026-08-25/`.
- [ ] Record Browser screenshots at 1,728×1,117 and 2,560×1,440 for Program,
      Learning Map, q315 detail, rate-limiter task, Progress, Projects, and
      Studio.
- [ ] Make the design audit harness deterministic. Either install its parser
      dependencies in an isolated tooling package or document a reproducible
      Browser/Playwright replacement. Do not add Puppeteer to the production
      bundle.

### Verification

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm status
pnpm ports
git status --short --branch
git -C fluent-engineering-lab status --short --branch
git -C fluent-question-brain status --short --branch
git -C fluent-task-runtime status --short --branch
curl -fsS http://127.0.0.1:48127/v1/quality | jq .
curl -fsS http://127.0.0.1:48227/v1/health/ready | jq .
curl -fsS http://localhost:49300/api/program/map | jq .
curl -fsS http://localhost:49300/api/runtime/relations | jq .
```

### Gate acceptance

- [ ] Evidence can reproduce every baseline number in section 2.
- [ ] No application behavior changed.
- [ ] All four repositories are still clean after the evidence commit.

Suggested commit: `docs: capture product integrity audit baseline`

## G1 — Fix stable question identity and the TaskBrief join

Owner: **Lab**, with contract fixtures from Brain and Runtime.

### Work

- [ ] Introduce one tested `normalizeQuestionStableKey()` at the Lab API/client
      boundary. It must accept `q315` and `question.q315` and return exactly
      `question.q315`; reject empty or malformed identifiers.
- [ ] Remove component-level string construction from
      `question-library.component.ts`.
- [ ] Join by stable key + revision ID + content hash + pinned Question Brain
      release. A matching stable key with a mismatched revision/hash must show a
      precise non-runnable state, not silently disappear.
- [ ] Show the TaskFamily once and its four language revisions beneath it. Do
      not render four duplicated families.
- [ ] Add deep links for card and family selection:
      `?question=question.q315` and
      `/practice/task-family/task-family.rate-limiter`.
- [ ] Make Back, Forward, refresh, and copied URL restore the same selected
      card and language choice.
- [ ] Decide and document the semantic split between
      `capability.distributed-systems.rate-limiter` and
      `capability.http-api.rate-limiter`. They may remain distinct, but the UI
      must explain which capability each task revision assesses.

### Required tests

- [ ] Unit: bare and prefixed IDs normalize identically; double prefixes are
      impossible.
- [ ] Contract: q315 produces exactly one family and four valid revisions.
- [ ] Failure: stale revision, stale hash, wrong question release, capability-
      only task, Runtime offline.
- [ ] Browser: open q315 from search, click “Show executable revisions”, switch
      Go/Java/Node/Postgres, refresh, Back, Forward, and open each workspace.

### Gate acceptance

- [ ] q315 no longer displays “0 revisions”.
- [ ] `question.c024` and `question.q444` resolve the same family without a
      duplicate family card or invented station.
- [ ] Hidden tests and solutions never enter Browser network payloads.
- [ ] Console and network contain zero unexpected errors.

Suggested commit: `fix(lab): compose question task relations by stable identity`

## G2 — Establish one metric glossary and server-owned counters

Owner: **Lab contracts/API**.

### Work

- [ ] Add a versioned `product-inventory.v1` contract defining Program, Path,
      Area, Station, QuestionCard, Capability, TaskFamily, TaskRevision,
      runnable station, station-bound card, and evidence count.
- [ ] Make `/api/program/map`, `/api/program/coverage`, `/api/progress`,
      `/api/questions/summary`, and `/api/runtime/relations` use the same nouns
      and release timestamps.
- [ ] Replace “81 routes” with “81 stations”; paths must always report 9.
- [ ] Explain 66 runnable stations vs 18 Runtime task revisions, or correct the
      compiler if 66 is not reproducible from released data.
- [ ] Replace ambiguous `found`/`linked` copy with precise labels such as
      `cards in path`, `cards discoverable by text search`, and
      `cards with explicit station binding`.
- [ ] Display release IDs and snapshot timestamps only in an expandable
      diagnostics drawer, not as default learner noise.

### Gate acceptance

- [ ] Every displayed number has an API field, noun, release ID, and automated
      reconciliation test.
- [ ] Program, Map, Progress, Practice, and Studio agree after one reload.
- [ ] No UI performs its own count over a differently filtered dataset.

Suggested commit: `feat(lab): publish canonical product inventory semantics`

## G3 — Replace search shortcuts with real path projections

Owner: **Lab**, consuming reviewed Brain taxonomy.

### Target route model

```text
/program
/paths
/paths/nodejs-typescript
/paths/java-spring
/paths/dotnet-csharp
/paths/go
/paths/frontend
/paths/system-design
/paths/algorithms
/paths/behavioral
/paths/python
```

### Work

- [ ] Add a versioned path projection containing path metadata, shared domains,
      ordered capabilities/stations, accepted card placements, task coverage,
      progress, and readiness.
- [ ] Change all nine path-card `entryRoute` values to their path routes.
- [ ] Remove the generic `?search=Java`/`.NET`/`Go` behavior from path entry.
      Search remains a separate discovery tool inside a path.
- [ ] Make Node.js + TypeScript one path, not the implicit definition of the
      whole program.
- [ ] Preserve seven shared domains across paths: Runtime, HTTP/API,
      Data/PostgreSQL, Distributed Systems, OS/Networking, Testing, and
      Delivery/Observability.
- [ ] Each path page must answer: what it teaches, why this order, what is
      optional, card/station/task coverage, current progress, and the next
      recommended action.
- [ ] Explore mode opens every published path, station, and card in any order.
      Recommendation is advice, never a lock.

### Gate acceptance

- [ ] All nine path cards open distinct, shareable path pages.
- [ ] Every card shown on a path is selected by accepted taxonomy/placement,
      not fuzzy text search.
- [ ] A card may appear in several paths without being copied.
- [ ] Empty capability/task sections state an honest content gap.

Suggested commit: `feat(lab): add release-backed learner path projections`

## G4 — Remove the legacy cross-language prerequisite chain

Owner: **Lab curriculum**.

### Work

- [ ] Model prerequisite edges inside a path and for shared foundations only.
- [ ] Delete .NET → Go → Java sequencing unless a reviewed capability edge
      proves a real prerequisite.
- [ ] Separate `recommendedBefore` from hard `requires` in API, visuals,
      accessible names, and readiness logic.
- [ ] Ensure selecting Java does not change the learner's current domain to
      Node or require Node evidence.
- [ ] Reconcile current domain, unfinished activity, and next recommendation;
      they may differ, but the UI must label each explicitly.

### Gate acceptance

- [ ] A new learner can open Java, .NET, Go, Frontend, Algorithms, Behavioral,
      System Design, Python, or Node without completing another language path.
- [ ] Progress and evidence remain isolated by capability and are never erased
      when switching paths.
- [ ] Accessibility labels contain no false “locked by previous language” text.

Suggested commit: `refactor(lab): make stack paths independent and explorable`

## G5 — Canonicalize taxonomy and quarantine weak content

Owner: **Question Brain**.

### Work

- [ ] Add canonical topic IDs and aliases; case, ampersand, slash, and wording
      variants must resolve to one canonical topic without rewriting history.
- [ ] Review the observed duplicate topic pairs and the Angular fragmentation.
- [ ] Add quality rules for task-dependent prompts, wrong-language topics,
      generic prompts, and task text that lacks a self-contained condition.
- [ ] Quarantine or rewrite the observed Java examples before the next release.
- [ ] Do not auto-merge semantic capabilities. Topic spelling normalization and
      capability semantics are separate review queues.
- [ ] Publish a new immutable release, then refresh embeddings and mapping
      artifacts against that exact release.

### Gate acceptance

- [ ] No duplicate canonical topic labels appear in learner UI.
- [ ] `Write the SQL queries required by the task` cannot be published as Java
      Core Language without an explicit reviewed multi-topic relationship.
- [ ] Search recall does not regress for event loop, idempotency, rate limiter,
      Java, .NET, Go, Frontend, algorithms, and behavioral queries.
- [ ] Lab consumes the new release without a copied catalogue or fallback.

Suggested commit: `feat(brain): canonicalize topics and gate weak prompts`

## G6 — Complete RU/EN parity and update Ollama terminology

Owners: **Brain content + Lab UI**.

### Work

- [ ] Inventory every visible string, server-supplied message, task brief,
      evidence state, project page, Studio surface, and error/recovery state.
- [ ] Translate learner-facing copy manually; do not call an LLM at runtime.
- [ ] Keep technical identifiers and code unchanged, but localize their labels
      and explanations.
- [ ] Ensure dynamic persisted learner messages render in the selected locale;
      do not persist already-localized prose as the canonical state.
- [ ] Replace stale LM Studio defaults in PRODUCT/onboarding/recovery copy with
      Ollama as the primary runtime. LM Studio may be listed only as an optional
      compatible provider if it is actually supported.
- [ ] Add pseudo-localization/long-string layout tests so neither RU nor EN
      breaks the shell.

### Gate acceptance

- [ ] RU and EN passes on every route contain no accidental mixed prose.
- [ ] `<html lang>` changes correctly; route, selection, and progress remain.
- [ ] Task and project pages meet the same locale standard as navigation.
- [ ] No translation changes stable IDs, code, commands, or evidence hashes.

Suggested commits: `feat(brain): complete reviewed learner locales` and
`fix(lab): enforce locale parity across learner surfaces`

## G7 — Correct Projects publication and defense behavior

Owner: **Lab**.

### Work

- [ ] Define separate, explicit states for book preview, published book,
      defense preview, published defense, and Runtime binding.
- [ ] Remove or implement the missing defense export endpoint. A page must not
      issue a request for an unavailable feature.
- [ ] Replace “published defense workspace” when the book is preview-only with
      truthful state-specific copy.
- [ ] Disable execution only when no released Runtime binding exists; reading
      previews remains available.
- [ ] Add contract and Browser tests for all combinations of publication and
      Runtime availability.

### Gate acceptance

- [ ] Project catalogue, reader, defense, and API report the same state.
- [ ] No project route emits a 404 or failed network request.
- [ ] RU and EN project experiences are complete.

Suggested commit: `fix(lab): align project book and defense release semantics`

## G8 — Repair accessibility and simplify Studio shell

Owner: **Lab web**.

### Work

- [ ] Replace nested Studio `<main>` elements with `section`/`article`; exactly
      one main landmark must exist per route.
- [ ] Give the lab checkbox a programmatic name and verify every input/control.
- [ ] Raise primary interactive targets to at least 44×44 CSS px. Dense text
      links may be smaller only when spacing prevents adjacent-target errors.
- [ ] Fix concatenated accessible names such as icon + label + subtitle and
      `One queue.One next step.`.
- [ ] Remove duplicated global/local theme and locale controls from Studio or
      clearly scope one set as preview controls.
- [ ] Verify keyboard navigation, visible focus, Escape behavior, skip link,
      zoom 200%, reduced motion, and screen-reader landmark order.

### Verification

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm a11y:smoke
pnpm check
```

### Gate acceptance

- [ ] One main, one H1, no duplicate IDs, no unnamed controls on every route.
- [ ] Full critical journeys work keyboard-only.
- [ ] No focus is hidden behind shell overlays or lost after route changes.

Suggested commit: `fix(lab): restore learner and studio accessibility semantics`

## G9 — Distill the interface and enforce the design system

Owner: **Lab web**. Use Impeccable in repeated audit → change → Browser review
cycles.

### Work

- [ ] Make the first viewport answer only: where am I, what can I choose, what
      is next, and what proof do I have. Move release IDs and crosswalk prose to
      diagnostics/details.
- [ ] Replace the 135-topic wall with search, canonical domain grouping,
      progressive disclosure, and a compact result count.
- [ ] Preserve the warm Cameo/WWDC direction, but reduce competing cards,
      outlines, tiny monospace metadata, and repeated explanatory paragraphs.
- [ ] Replace raw radii, font sizes, and colors with approved tokens. Review the
      four warning-level accent-border findings manually.
- [ ] Keep task workspace density purposeful: task, editor, run/evidence. Move
      secondary theory navigation into a collapsible rail/drawer.
- [ ] Explain opaque activity metadata such as `020.060 attempted 1 activity`
      with human labels or remove it from learner view.
- [ ] Preserve no-overflow behavior at MacBook Pro and Studio Display sizes.

### Gate acceptance

- [ ] Impeccable audit reaches at least 16/20 with no Product Integrity score
      below 3.
- [ ] Production screenshots are approved for Light, Dark, RU, and EN at
      1,728×1,117 and 2,560×1,440.
- [ ] No new raw color/radius/type values are introduced outside the token
      layer without a documented exception.

Suggested commit: `refactor(lab): distill learner navigation and visual hierarchy`

## G10 — Performance, observability, and final Browser release gate

Owners: **all repositories + workspace**.

### Work

- [ ] Bring the initial bundle and `lab.route.scss` under their existing
      budgets; do not raise budgets to hide regressions.
- [ ] Lazy-load terminal/editor/task-only code and avoid rendering all topic
      groups/nodes before disclosure.
- [ ] Eliminate request races/aborts that create user-visible loading churn.
- [ ] Add journey spans for path open, question open, task-family join,
      workspace load, run, evidence write, and locale/theme switch. Keep all
      content, code, prompts, and hidden tests redacted.
- [ ] Verify log rotation, container resource limits, idle behavior, and clean
      `pnpm down` shutdown without orphan containers or workspaces.

### Mandatory automated verification

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm check
pnpm production:check

cd /Users/sergeyzhechko/developer/fluent-interview/fluent-question-brain
make contract
docker run --rm -v "$PWD":/src -w /src golang:1.24-bookworm go test ./...

cd /Users/sergeyzhechko/developer/fluent-interview/fluent-task-runtime
docker run --rm -v "$PWD":/src -w /src golang:1.24-bookworm go test ./...

cd /Users/sergeyzhechko/developer/fluent-interview
pnpm dev:production
pnpm status
```

### Mandatory Browser acceptance matrix

- [ ] Clean profile completes onboarding once; returning profile preserves
      state.
- [ ] All nine path pages open directly and from the catalogue.
- [ ] Explore mode opens every published path/station/card without locks.
- [ ] Recommended mode offers an order without forbidding exploration.
- [ ] q315 shows one rate-limiter family and Go/Java/Node/Postgres revisions.
- [ ] Every revision opens the correct workspace and can run its public checks.
- [ ] Successful run creates Lab evidence and remains after reload/restart.
- [ ] Question selection, family selection, and locale survive refresh and
      Back/Forward.
- [ ] Program, Map, Practice, Progress, and Studio counters reconcile.
- [ ] Projects preview and defense expose truthful release states.
- [ ] RU/EN and Auto/Light/Dark work on every critical route.
- [ ] Exactly one main landmark and no unnamed controls exist on every route.
- [ ] No horizontal overflow at 1,728×1,117 or 2,560×1,440.
- [ ] Console has zero unexpected warnings/errors and network has zero 4xx/5xx.
- [ ] Jaeger/Tempo/Grafana show redacted journey traces with shared correlation
      IDs across Lab, Brain, and Runtime.
- [ ] After `pnpm down`, no Fluent containers, orphan task sandboxes, or stale
      work directories remain; persistent learner/database volumes remain.

### Final evidence and closure

Create `docs/verification/PRODUCT-INTEGRITY-UX-CLOSURE-2026-08-25.md` containing:

1. repository HEADs and pushed `main` commits;
2. exact release IDs and inventory counters;
3. automated command outputs;
4. Browser matrix results and screenshot paths;
5. console/network export;
6. accessibility landmark/control audit;
7. bundle and route-style sizes;
8. trace IDs for question → task → run → evidence;
9. known limitations, which must be non-blocking and explicit.

The task is complete only when an independent verifier can reproduce every
acceptance result from that file. Do not mark completion because all commits
were pushed.

Suggested final commits:

- child repositories: one scoped commit per completed gate, pushed to `main`;
- workspace: `docs: close product integrity and UX remediation`.

## 4. Verifier checklist for the returning auditor

When the implementation agent says the work is done, the returning auditor
must not trust checkbox edits. Repeat these checks independently:

1. Compare all four `main` HEADs with origin and inspect every gate diff.
2. Run the mandatory automated verification from G10.
3. Start from `pnpm dev:production`; do not reuse an old process.
4. Use the in-app Browser with a clean profile and a returning profile.
5. Repeat the full Browser matrix in RU/EN and Light/Dark.
6. Query q315 directly in Brain, Runtime relations, and Lab learner UI; compare
   stable key, revision, hash, release, family, and language revisions.
7. Verify all nine path projections against accepted Brain placement data.
8. Confirm no fallback catalogue, copied source data, fuzzy station mapping, or
   direct cross-service database read was added.
9. Inspect traces/logs for redaction and resource cleanup after shutdown.
10. Close the task only if all evidence is current, reproducible, and green.
