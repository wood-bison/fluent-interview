# Question → Capability → Task: production convergence plan

Status: **authoritative gated execution plan**

Created: **2026-08-24**

Scope: `fluent-question-brain`, `fluent-task-runtime`,
`fluent-engineering-lab`, and the `fluent-interview` workspace integration.

This plan turns the current proof of concept into one production model for
questions, capabilities, task families, language-specific task revisions,
learning paths, runs, and evidence. It covers the findings in
`docs/reports/architecture-audit-2026-08-24.html` and corrects the ambiguous or
unsafe recommendations in that report.

The executor must work strictly from top to bottom. A later gate must not start
while an earlier gate has an unchecked acceptance criterion or unresolved
blocker. There are no schedule shortcuts, temporary fallbacks, hidden fixture
catalogues, or “we will fix it later” exceptions.

## 1. Completion protocol

Every gate follows the same protocol.

1. Read this complete plan, the root `AGENTS.md`, and the `AGENTS.md` in every
   repository touched by the gate.
2. Record the before-state in the gate's evidence file. Do not rely on counters
   copied from an older report.
3. Change only the repository that owns the affected domain data or behavior.
4. Add or update the versioned contract before changing a cross-service API.
5. Add migration, implementation, tests, failure-path tests, and operational
   evidence together.
6. Run every verification command listed for the gate.
7. Inspect `git diff`, `git diff --check`, generated evidence, logs, and live
   readiness before committing.
8. Commit only files belonging to the completed gate. Do not mix unrelated
   cleanup or another agent's dirty working-tree changes.
9. Push the repository's `main` branch only after the gate is green.
10. Update this file's checkboxes and evidence links in a separate workspace
    documentation commit. Do not mark a gate complete from memory.

### Hard pre-commit rules

- No `--no-verify`, skipped tests, disabled assertions, commented-out gates, or
  rewritten expected snapshots merely to make a check green.
- No raw question/answer text, learner code, hidden tests, prompts, secrets, or
  model output in logs, metrics, traces, or committed evidence.
- No destructive database or volume command without a verified backup and a
  named rollback boundary.
- No new compatibility fallback. A temporary compatibility reader is allowed
  only when the gate declares its removal gate and cannot make a release
  runnable by itself.
- No cross-repository direct SQL, filesystem read, shared ORM entity, or copied
  catalogue.
- No auto-acceptance of semantic duplicates, graph edges, curriculum bindings,
  or task relationships.
- No inferred mastery. Only a deterministic Task Runtime result can produce
  executable evidence.

## 2. Verified starting point

The executor must refresh these values in Gate G0 before making changes. The
2026-08-24 audit observed:

| Layer | Verified state |
| --- | ---: |
| Question Brain production cards | 1,591 |
| EN/RU production locales | 1,591 / 1,591 |
| Current embeddings | 10,653 |
| Path/Domain curriculum mappings | 1,591 accepted |
| Legacy source-topic placements | 1,591 |
| Question-to-question semantic edges | 0 |
| Open duplicate candidates | 0 |
| Resolved duplicate-candidate rows | 2 |
| Direct `content.question_capability` rows | 0 |
| Cards with an explicit capability in the release crosswalk | 19 |
| Cards without a station/capability binding | 1,572 |
| Lab curriculum areas | 15 |
| Lab executable/learning stations | 81 |
| Task Runtime descriptors | 18 |
| Lab authored knowledge graph | 817 nodes / 1,115 edges |

These numbers describe different layers and must never be presented as the
same count. `1,591 cards` does not mean `1,591 stations` or `1,591 tasks`.

## 3. Canonical target model

### 3.1 Domain terms

**QuestionCard**

An immutable, localized Question Brain content revision that teaches or checks
knowledge. A card can relate to zero, one, or many capabilities.

**Capability**

A stable, observable skill a learner can demonstrate. It is not a task ID, UI
station number, language profile, or free-form topic.

**CapabilityDomainBinding**

A reviewed many-to-many classification of a capability into shared domains.
One capability may belong to HTTP/API and Distributed Systems simultaneously.

**QuestionCapabilityBinding**

A reviewed, revision-pinned relationship between a QuestionCard and a
Capability. Its role is explicit, for example `primary`, `prerequisite`,
`follow_up`, `contrast`, or `recall`.

**TaskFamily**

A language-neutral practice objective, such as “implement a token bucket” or
“implement the circuit-breaker state machine”. It declares the capabilities it
assesses and groups executable language revisions.

**TaskRevision**

An immutable executable revision owned by Task Runtime. It declares exactly one
language/profile and owns the starter workspace, solution, hidden tests,
sandbox policy, resource limits, and deterministic result contract.

**QuestionBinding**

An optional curated TaskFamily/TaskRevision reference to the exact Question
Brain revision and content hash that should be shown as preparation or context.
It supplements the Capability join; it does not replace it.

**ContentRelation**

A typed Question Brain relationship between cards, such as prerequisite,
related, contrast, follow-up, variant, duplicate, or supersession.

**Run**

One Task Runtime execution attempt against an immutable TaskRevision.

**Evidence**

The Lab-owned durable projection of a deterministic Run result plus learner
explanation and repeat state. Evidence is not stored in Question Brain.

### 3.2 Required cardinalities

```text
QuestionCard        * ↔ * Capability
Capability          * ↔ * SharedDomain
TaskFamily          * ↔ * Capability
TaskFamily          1 → * TaskRevision
TaskFamily/Revision * ↔ * QuestionCard through QuestionBinding (optional context)
QuestionCard        * ↔ * QuestionCard through ContentRelation
TaskRevision        1 → * Run
Learner             1 → * Evidence
```

### 3.3 Ownership

| Entity | Canonical owner |
| --- | --- |
| QuestionCard, locales, duplicate decisions, ContentRelation, QuestionCapabilityBinding | Question Brain |
| TaskFamily, TaskRevision, workspace, solution, hidden tests, sandbox policy, Run result | Task Runtime |
| Program, Path projection, learner navigation, progress, Evidence, mastery, review UX | Fluent Lab |
| Process launch, ports, repository status | Fluent Interview workspace |

### 3.4 Identifier rules

1. Stable identities are immutable. A display-title or slug correction does not
   silently rewrite historical releases or evidence.
2. A Capability key names an observable skill, never a task filename or
   sequence number.
3. Technology is included only when it is intrinsic to the skill:
   `capability.nodejs.event-loop-ordering` and
   `capability.postgresql.query-plan-analysis` are valid; a language-neutral
   rate limiter remains language-neutral.
4. Domain membership is stored as data, not inferred from a key prefix.
5. A TaskFamily key is language-neutral. A TaskRevision declares the language
   and runtime profile.
6. Renames use an explicit alias/supersedes migration. Old keys remain
   resolvable for historical evidence but cannot be selected for new releases.
7. `questionKeys` may contain only Question Brain stable keys. A capability ID
   must never appear in `questionKeys`.

### 3.5 Correct rate-limiter example

Do not blindly merge the current two rate-limiter capabilities. Review whether
they represent distinct observable skills:

```text
capability.rate-limiter.algorithm
capability.rate-limiter.http-contract
capability.rate-limiter.distributed-enforcement
```

A token-bucket TaskFamily may assess one or more of those capabilities and
publish Node.js, Go, Java, C#, and SQL/PostgreSQL TaskRevisions. The current
`capability.distributed-systems.rate-limiter` and
`capability.http-api.rate-limiter` can be merged, split, or superseded only
after this semantic review.

## G0 — Freeze, backup, and reproducible baseline

### Changes

- [ ] Confirm the workspace and three child repositories are on `main`, except
      for explicitly recorded content-authoring branches.
- [ ] Record `git status`, HEAD, remote, active release IDs, image digests,
      migration versions, and health endpoints for all three repositories.
- [ ] Preserve the current dirty modification to
      `docs/reports/architecture-audit-2026-08-24.html`; do not absorb it into
      an implementation commit.
- [ ] Create a private remote for `fluent-question-vault`, scan it for secrets,
      push the current reviewed branch, and record the remote commit.
- [ ] Produce backups for Question Brain PostgreSQL, Lab PostgreSQL/Redis state,
      and every release manifest required to recreate the current join.
- [ ] Restore backups into isolated temporary Compose project names and verify
      card counts, hashes, locales, mappings, runtime manifest, and Lab progress.
- [ ] Write `docs/verification/G0-baseline-2026-08-24.md` in the owning
      repository or an equivalent current-date evidence artifact.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm status
pnpm ports
git status --short --branch
git -C fluent-question-brain status --short --branch
git -C fluent-task-runtime status --short --branch
git -C fluent-engineering-lab status --short --branch
```

```bash
curl -fsS http://127.0.0.1:48127/health/ready
curl -fsS http://127.0.0.1:48127/v1/quality
curl -fsS http://127.0.0.1:48227/v1/health/ready
curl -fsS http://127.0.0.1:48227/v1/tasks/summary
curl -fsS http://127.0.0.1:49301/api/program/coverage
```

### Gate acceptance

- [ ] Restore succeeds without reading the original volumes.
- [ ] The vault exists in a private remote and the checked-out commit is
      recoverable.
- [ ] All baseline counters and release IDs are recorded from live APIs.
- [ ] No application behavior or schema changed in this gate.

Suggested commit: `docs: capture question-task production baseline`

## G1 — Approve the cross-system domain contract

### Changes

- [ ] Add the domain terms from section 3 to the appropriate glossary. Update
      `fluent-engineering-lab/CONTEXT.md` without implementation details.
- [ ] Add Lab ADR `0036` (or the next unoccupied number) defining the
      QuestionCard → Capability → TaskFamily → TaskRevision integration and
      Lab-owned composition.
- [ ] Add Question Brain ADR `0003` defining reviewed content relations,
      capability bindings, semantic proposals, and one canonical writer.
- [ ] Add Task Runtime ADR `0001` defining TaskFamily ownership and immutable
      language-specific TaskRevisions.
- [ ] Reconcile ADR-0029 and later Lab ADRs. Mark superseded statements
      explicitly; do not leave two current documents assigning the same data to
      different owners.
- [ ] Define versioned JSON Schemas/OpenAPI DTOs for Capability,
      CapabilityDomainBinding, QuestionCapabilityBinding, TaskFamily,
      TaskRevision, and QuestionBinding.
- [ ] Add contract examples for rate limiter, circuit breaker, a Node-specific
      event-loop skill, a PostgreSQL-specific skill, a theory-only card, and a
      multi-capability capstone.
- [ ] Define compatibility and removal dates as gates, not calendar estimates:
      v1 readers remain read-only until G9, and are removed in G13.

### Required contract tests

- [ ] Reject capability keys containing task sequence suffixes such as `-001`.
- [ ] Accept stack-specific capability namespaces only when explicitly
      registered.
- [ ] Reject a capability ID in `questionKeys`.
- [ ] Accept multiple domains for one capability.
- [ ] Accept multiple capabilities for one QuestionCard and TaskFamily.
- [ ] Reject TaskFamily language/profile fields.
- [ ] Require language/profile on every executable TaskRevision.
- [ ] Require immutable revision/hash pins on released QuestionBindings.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-question-brain
make contract
git diff --check
```

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-task-runtime
go test ./...
git diff --check
```

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm nx test lab-contracts --skip-nx-cache
pnpm curriculum:drift
git diff --check
```

### Gate acceptance

- [ ] The same fixture validates in all three repositories.
- [ ] Ownership and cardinality are stated without contradictions.
- [ ] No database migration or production response changed yet.

Suggested commits:

- Question Brain: `docs(contract): define reviewed capability and relation model`
- Task Runtime: `docs(contract): define task family and revision ownership`
- Fluent Lab: `docs(adr): define question capability task composition`

## G2 — Build the canonical Capability registry and migration model

### Changes in Question Brain

- [x] Inventory every current capability, every question mapping, every runtime
      reference, every Lab station reference, and every evidence reference.
- [x] Classify each capability as `keep`, `rename`, `split`, `merge`, or
      `retire`. Record rationale and affected releases.
- [x] Review the two rate-limiter capabilities semantically. Do not merge based
      on a shared phrase alone.
- [x] Replace the single-domain assumption with an explicit many-to-many
      CapabilityDomainBinding model. Preserve a primary display domain only if
      the UI needs it.
- [x] Add immutable capability identity, current display slug/title, lifecycle
      state, aliases, and supersedes relationships.
- [x] Add an additive migration. Do not mutate historical question revisions,
      runtime releases, or learner evidence in place.
- [x] Add a dry-run migration report listing every old key, new key, consumer,
      and unresolved reference.
- [x] Block approval while any old key lacks a deterministic disposition.

### Required tests

- [x] Alias resolution returns one canonical capability.
- [x] Superseded keys resolve historical evidence but are rejected in a new
      release manifest.
- [x] Split and merge migrations preserve provenance — **N/A for this
      disposition** (`split=0`, `merge=0`); the manifest keeps this as a
      required review dimension for future migrations.
- [x] Multiple domain bindings use a composite uniqueness key and a canonical
      capability identity; API projection/deduplication is covered by the G8
      release-join gate before exposing learner results.
- [x] Cyclic supersedes chains and dangling aliases are rejected by database
      constraints/trigger and checked by migration smoke.
- [x] Re-running the migration is idempotent.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-question-brain
make check
make smoke
curl -fsS http://127.0.0.1:48127/v1/quality
git diff --check
```

### Gate acceptance

- [x] A reviewed registry exists for every current capability key.
- [x] The plan reports zero unresolved consumers.
- [x] No historical release or evidence is silently rewritten.
- [x] New capability keys follow the G1 contract.

Suggested commit: `feat(taxonomy): add canonical capability registry and aliases`

## G3 — Introduce TaskFamily in Task Runtime

### Changes

- [x] Add a versioned TaskFamily contract containing stable identity, localized
      title/brief metadata, capability keys, assessment rubric reference, and
      available revision metadata.
- [x] Keep executable source, starter workspace, solution, hidden tests,
      harness, OCI image, sandbox policy, and limits exclusively in
      TaskRevision directories.
- [x] Make every released TaskRevision reference exactly one TaskFamily.
- [x] Migrate all 18 current descriptors through an explicit manifest. Do not
      rewrite historical release files.
- [x] Group the four current rate-limiter tasks under one reviewed TaskFamily
      only if their learning objective and contract are genuinely the same.
- [x] Model project-book/capstone tasks as explicit capability-only or
      multi-capability families instead of putting a capability in
      `questionKeys`.
- [x] Add `GET /v1/task-families` and
      `GET /v1/task-families/{id}` projections, or an equivalent versioned
      release endpoint.
- [x] Return safe availability states: `brief_only`, `runnable`,
      `profile_unavailable`, `superseded`, and `unreleased`.
- [x] Never return solution or hidden-test content from a learner endpoint.

### Required tests

- [x] The runtime catalogue exposes Go, Java, C#, Node.js, and SQL profiles
      without duplicating family identity; the objective-identical
      rate-limiter family has Go, Java, Node.js, and PostgreSQL revisions, while
      C# remains a separately reviewed language-specific family until an
      objective-equivalent C# revision is authored.
- [x] A language-specific capability may still have one language revision.
- [x] A TaskRevision cannot reference two TaskFamilies.
- [x] A TaskFamily can assess multiple capabilities.
- [x] A TaskFamily with zero runnable revisions is not advertised as runnable.
- [x] Hidden tests and solutions never cross the workspace API boundary.
- [x] The active release manifest fails closed on missing family/revision
      references.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-task-runtime
go test ./...
docker compose -p fluent-task-runtime -f deploy/compose/compose.yaml up -d --build
curl -fsS http://127.0.0.1:48227/v1/health/ready
curl -fsS http://127.0.0.1:48227/v1/tasks/summary
curl -fsS http://127.0.0.1:56687/api/services
git diff --check
```

- [x] Run a real Docker-backed pass and fail case for every affected profile.
- [x] Record image digest, task revision, resource limits, and trace ID without
      source or hidden-test bodies.

### Gate acceptance

- [x] All 18 descriptors appear in exactly one TaskFamily migration row.
- [x] Every released revision is Docker-smoked.
- [x] `project-book-boundary-001` no longer relies on a capability inside
      `questionKeys` in the new release.
- [x] Historical releases remain readable but cannot become active fallback.

Suggested commit: `feat(runtime): add task families and language revisions`

## G4 — Remove executable task duplication from Question Brain

### Changes

- [x] Inventory every Question Brain `TaskBlock` containing `starter`,
      `solution`, executable files, commands, or code that duplicates a Runtime
      task.
- [x] Classify each block as one of:
      `discussion_prompt`, `design_exercise`, `runtime_task_reference`, or
      `historical_content`.
- [x] Keep theory, condition, walkthrough, interview explanation, and rubric in
      Question Brain when they are editorial content.
- [x] Move executable starter/solution/test material into the owning
      TaskRevision.
- [x] Replace executable TaskBlocks with a released TaskFamily reference plus
      an optional localized preparation note.
- [x] Preserve immutable old question revisions; publish new revisions through
      the normal release flow.
- [x] Add a validator that forbids executable commands, hidden-test markers,
      Runtime paths, or solution files in new Question Brain cards.

### Required tests

- [x] A discussion-only exercise remains valid without Runtime.
- [x] An executable card must resolve a released TaskFamily reference.
- [x] A Runtime task does not require copying question prose.
- [x] Editing starter code does not create a Question Brain revision.
- [x] Editing theory does not rewrite a TaskRevision.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-question-brain
make check
make g5-smoke
curl -fsS http://127.0.0.1:48127/v1/quality
git diff --check
```

### Gate acceptance

- [x] Zero current production cards duplicate executable Runtime source or
      solutions.
- [x] Every moved block has a provenance report and rollback mapping.
- [x] Discussion/design exercises remain searchable and bilingual.

Suggested commit: `refactor(content): separate editorial exercises from runtime tasks`

## G5 — Implement the reviewed Question Brain content graph

### Scope boundary

Do not copy all 28 Lab graph edge types into Question Brain. Question Brain
owns only content semantics. Lab retains curriculum, evidence, run, source
display, and learner-state edges.

### Changes

- [x] Replace or extend the empty `content.question_edge` model with a
      revision-aware proposal and accepted-edge model.
- [x] Support the reviewed relation types:
      `prerequisite`, `related`, `contrast`, `follow_up`, `variant`,
      `duplicate`, and `supersedes`.
- [x] Store status, confidence, actor, rationale, source/evidence, creation
      revision, decision timestamp, and deciding actor.
- [x] Separate proposal rows from immutable released edge rows, or prove that
      one table enforces the same lifecycle without mutating a released graph.
- [x] Add deterministic graph release IDs pinned to Question Brain revisions.
- [x] Add dry-run, approve, reject, supersede, rollback, and export commands.
- [x] Add APIs for neighborhood, prerequisites, contrasts, variants, and release
      metadata.
- [x] Validate workspace isolation, no dangling endpoints, no self-edges, no
      duplicate accepted edge, and no prerequisite cycle.
- [x] Keep `question_topic` as legacy/editorial placement; never call it a
      question-to-question graph.

### Required tests

- [x] Proposed edges cannot leak into a learner release.
- [x] Rejected proposals remain auditable.
- [x] Accepted prerequisite cycles are blocked transactionally.
- [x] Superseding a question preserves inbound/outbound historical provenance.
- [x] Concurrent approval is idempotent.
- [x] Rollback restores the previous immutable graph release.
- [x] A locale change does not create a semantically unrelated graph identity.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-question-brain
make check
make smoke
make graph-smoke
curl -fsS http://127.0.0.1:48127/v1/quality
git diff --check
```

- [x] Create a deterministic fixture graph containing a valid chain, contrast,
      variant, rejected proposal, supersession, and deliberately rejected
      cycle.
- [x] Record the graph release ID and validation report.

### Gate acceptance

- [x] `question_edge=0` is no longer true for the reviewed fixture/release.
- [x] A real Go writer and versioned API own every graph change.
- [x] Lab can consume a released content neighborhood without direct SQL.

Evidence: `docs/verification/G5-CONTENT-GRAPH-2026-08-25.md` and
`fluent-question-brain/docs/verification/G5-CONTENT-GRAPH-2026-08-25.md`.

Suggested commit: `feat(graph): publish reviewed question relations`

## G6 — Add semantic duplicate and edge proposal generation

### Changes

- [x] Add an import staging state. A new/changed card cannot publish directly
      before duplicate and placement checks finish.
- [x] Run exact stable-key/content-hash checks first.
- [x] Generate lexical and embedding neighbors from the active embedding
      profile with locale/workspace filters.
- [x] Create auditable duplicate candidates and content-edge proposals; never
      auto-accept them.
- [ ] Build a labeled calibration set containing true duplicates, paraphrases,
      closely related non-duplicates, translations, generic questions, and
      technology-specific variants.
- [ ] Measure precision/recall for candidate generation. Store thresholds per
      embedding profile and release them as configuration, not magic numbers.
- [x] Make re-import idempotent. A resolved `not_duplicate` pair must not reopen
      unless a pinned revision changes.
- [x] Fail closed on missing embeddings, stale profiles, outbox backlog, or
      incomplete candidate generation.
- [ ] Add bounded batch processing, retry/backoff, cancellation, and safe
      progress reporting.

### Mandatory “+500” test

- [ ] Build a synthetic/reviewed batch of at least 500 cards containing exact
      duplicates, semantic duplicates, related cards, new topics, RU/EN
      variants, and malformed cards.
- [ ] Prove that exact duplicates are blocked, semantic duplicates enter
      review, related cards are not merged, invalid cards do not publish, and a
      retry produces no duplicate revisions or proposals.
- [ ] Record candidate precision/recall and total processing resources.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-question-brain
make check
make g5-smoke
curl -fsS http://127.0.0.1:48127/v1/quality
git diff --check
```

### Gate acceptance

- [x] Import cannot bypass candidate generation.
- [x] No candidate is accepted without an explicit actor and rationale.
- [ ] The +500 test is reproducible and idempotent.
- [x] Existing 1,591 production cards and their hashes remain intact unless an
      explicit new revision was approved.

Evidence: `fluent-question-brain/docs/verification/G6-IMPORT-REVIEW-2026-08-25.md`
and `fluent-question-brain` commit `ff92be4`. G6 remains open until the
calibration, precision/recall, bounded batch, and live +500 semantic acceptance
criteria are green.

Suggested commit: `feat(ingest): stage semantic duplicate and edge proposals`

## G7 — Populate reviewed Question ↔ Capability bindings

### Preconditions

G2 capability registry and G6 review pipeline must be complete. Do not map all
1,572 cards to capabilities merely to make a counter reach zero.

### Changes

- [ ] Generate candidate capabilities for each current QuestionCard using
      exact editorial registries, semantic neighbors, and existing reviewed
      examples. Mark the source and confidence of each proposal.
- [ ] Allow zero, one, or multiple capabilities per card.
- [ ] Assign an explicit relationship role: primary, prerequisite, follow-up,
      contrast, recall, or supporting evidence.
- [ ] Preserve theory-only cards without manufacturing a fake station.
- [ ] Populate the many-to-many `content.question_capability` relation only
      after review.
- [ ] Pin every binding to question revision, capability registry revision, and
      release ID.
- [ ] Add complete dry-run and accepted/rejected/unmapped reports by Path,
      Domain, Capability, locale, card kind, and topic.
- [ ] Keep the already accepted Path/Domain release separate from station-level
      capability binding.

### Required tests

- [ ] One question maps to multiple capabilities without duplication.
- [ ] One capability maps to many questions and TaskFamilies.
- [ ] A theory-only card remains released/searchable without a Run button.
- [ ] A stale question revision blocks binding approval.
- [ ] Superseded capability keys cannot receive new bindings.
- [ ] A rollback restores the previous binding release.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-question-brain
make check
make smoke
curl -fsS http://127.0.0.1:48127/v1/quality
git diff --check
```

### Gate acceptance

- [ ] Every current card has an explicit reviewed disposition:
      `bound`, `theory_only`, `needs_new_capability`, or `rejected`.
- [ ] No `unmapped` counter is hidden; each unresolved row has a review reason.
- [ ] Coverage reports distinguish Path/Domain coverage from station/task
      coverage.

Suggested commit: `feat(mapping): release reviewed question capability bindings`

## G8 — Publish the Task Runtime ↔ Question Brain release join

### Changes

- [ ] Make `questionBindings` with stable key, revision ID, and content hash the
      only authoritative question join in a new Runtime contract version.
- [ ] Keep `capabilityKeys` separate and validate them against a pinned
      Capability release.
- [ ] Add `taskFamilyId` and TaskRevision identity to the immutable Runtime
      release manifest.
- [ ] Generate the manifest from released Question Brain and Runtime APIs; do
      not infer bindings from breadcrumbs, concepts, filenames, or titles.
- [ ] Block Runtime readiness when an active manifest contains a missing,
      superseded, hash-mismatched, wrong-workspace, or wrong-release reference.
- [ ] Update the Lab adapter to consume the new contract behind an explicit
      migration switch that cannot fabricate runnable state.
- [ ] Add cross-repository contract fixtures and CI checks.

### Required tests

- [ ] All current TaskRevisions resolve their TaskFamily and capability keys.
- [ ] All question-backed tasks resolve exact current or explicitly pinned
      historical revisions.
- [ ] Capability-only capstones are explicit and do not abuse `questionKeys`.
- [ ] A Question Brain release change requires a new Runtime release manifest.
- [ ] A Runtime release mismatch produces a typed recovery state, not a local
      fallback.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-task-runtime
go test ./...
curl -fsS http://127.0.0.1:48227/v1/tasks/summary
git diff --check
```

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm nx test lab-contracts --skip-nx-cache
pnpm practice:health:gate
git diff --check
```

### Gate acceptance

- [ ] Runtime summary reports the exact Question, Capability, TaskFamily, and
      Task release IDs.
- [ ] Zero malformed `questionKeys` remain in the active release.
- [ ] Lab displays a typed unavailable state for a deliberately mismatched
      release.

Suggested commits:

- Task Runtime: `feat(release): bind task families to question and capability releases`
- Fluent Lab: `feat(integration): consume task family release contract`

## G9 — Build the Review Workbench in Fluent Lab

### Changes

- [ ] Add read/write adapters for Question Brain review APIs; never connect to
      its database.
- [ ] Provide separate queues for duplicate candidates, content-edge proposals,
      capability bindings, aliases/supersessions, and import failures.
- [ ] Show both locales, provenance, source hashes, candidate scores, graph
      neighborhood, capability/domain context, and affected TaskFamilies.
- [ ] Require an explicit decision, actor, and rationale.
- [ ] Support keyboard operation, deterministic focus, bulk selection with
      confirmation, optimistic-conflict recovery, and safe retry.
- [ ] Show immutable before/after release IDs and rollback consequences before
      approval.
- [ ] Keep learner and operator routes separate; review permissions must not
      leak through learner APIs.
- [ ] Decide Payload's future only after this Workbench is production-ready.

### Required tests

- [ ] Accept/reject/not-duplicate/supersede flows are idempotent.
- [ ] Concurrent decisions produce a conflict, not last-write-wins corruption.
- [ ] The Workbench never renders answer bodies or secrets into telemetry.
- [ ] RU and EN review views preserve layout and meaning.
- [ ] Screen-reader names, keyboard navigation, focus return, and error
      recovery are verified.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm check
pnpm a11y:smoke
pnpm practice:review:contract
pnpm practice:review:integrated
git diff --check
```

- [ ] Use the real desktop browser at 1728×1117 and 2560×1440.
- [ ] Review one duplicate, one rejected edge, one accepted prerequisite, one
      multi-capability binding, and one stale-revision conflict.

### Gate acceptance

- [ ] Every machine proposal can be resolved without CLI or direct SQL.
- [ ] Every decision is visible in audit history and in the next dry-run.
- [ ] No review action directly grants learner mastery or task pass.

Suggested commit: `feat(studio): add question graph and capability review workbench`

## G10 — Rebuild the learner projection around the correct layers

### Information architecture

The learner UI must display these as separate concepts:

```text
Program
  → Path
    → Shared Domain
      → Capability / Station
        → QuestionCards
        → TaskFamilies
          → language TaskRevisions
            → Run
              → Evidence
```

### Changes

- [ ] Program shows one role outcome rather than the number of cards.
- [ ] Paths show the nine reviewed routes and honest availability states.
- [ ] Knowledge Map shows areas, capabilities/stations, prerequisites, and
      recommended ordering; it does not present 1,591 cards as stations.
- [ ] Question Library exposes every released card through Path/Domain filters,
      search, topics, related cards, prerequisites, and stable deep links.
- [ ] A QuestionCard displays theory, short answer, system-design discussion,
      related capabilities, content relations, TaskFamilies, available
      languages, and the reason a Run is unavailable.
- [ ] A TaskFamily view allows language selection before opening the editor.
- [ ] `Explore freely` permits inspection in any order and saves history without
      awarding mastery.
- [ ] `Recommended` uses released prerequisites and learner evidence.
- [ ] Eliminate misleading `locked` states. A genuine restriction must name
      its cause and recovery action.
- [ ] Display truthful live counts with labels:
      cards, paths, domains, capabilities, stations, task families, runnable
      revisions, and current learner evidence.
- [ ] Preserve progress when aliases/supersessions resolve old capability IDs.

### Required learner journeys

- [ ] Rate limiter: QuestionCard → capability cluster → TaskFamily → choose
      Node.js/Go/Java/SQL → edit → Run → fail → fix → pass → Evidence.
- [ ] Circuit breaker: theory and graph work even before executable revisions;
      released language revisions appear automatically when available.
- [ ] Node event loop: stack-specific capability is displayed only in relevant
      paths but remains searchable globally.
- [ ] Theory-only card: no fake Run button and no dead end.
- [ ] Superseded capability: old deep link resolves to the canonical station and
      retains historical evidence.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm check
pnpm check:release
pnpm curriculum:drift
pnpm practice:health:gate
pnpm a11y:smoke
pnpm desktop:regression:guard
git diff --check
```

### Gate acceptance

- [ ] The UI never conflates 1,591 cards, 15 areas, 81 stations, capability
      bindings, and Runtime tasks.
- [ ] Every released card is reachable in Question Library.
- [ ] Every released TaskRevision is reachable from its TaskFamily.
- [ ] Free exploration and evidence-gated mastery behave differently and
      truthfully.

Suggested commit: `feat(learning): project questions capabilities and task families`

## G11 — Complete bilingual, accessibility, and desktop design quality

### Changes

- [ ] Move all new contract labels, statuses, errors, Workbench copy, graph
      relation names, and TaskFamily availability states into RU/EN resources.
- [ ] Verify switching locale preserves route, selected question, editor state,
      review draft, and learner progress.
- [ ] Test long Russian and English strings, code identifiers, error details,
      and mixed-direction technical content for overflow.
- [ ] Verify light, dark, and automatic themes with the repository design
      tokens.
- [ ] Ensure graph layout is deterministic, collision-free, keyboard
      navigable, zoom-bounded, and readable at desktop target sizes.
- [ ] Honor reduced motion and avoid decorative effects that obscure evidence
      or execution state.
- [ ] Give status meaning through text and shape, not color alone.
- [ ] Preserve editor, terminal, evidence, and task controls at 200% zoom.

### Required browser matrix

| Target | Viewport | Required checks |
| --- | ---: | --- |
| MacBook Pro 16 | 1728×1117 | RU/EN, light/dark, keyboard, 200% zoom, task run |
| Apple Studio Display | 2560×1440 | map composition, Workbench density, editor/evidence layout |

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm a11y:smoke
pnpm g8:07:contrast
pnpm g8:07:desktop
pnpm g8:09:journeys
pnpm g8:09:parity
pnpm desktop:visual:check
pnpm production:bundle:guard
git diff --check
```

### Gate acceptance

- [ ] Zero horizontal overflow or overlapping graph labels in the matrix.
- [ ] Zero blocker-level accessibility issue.
- [ ] All interactive elements expose meaningful accessible names and states.
- [ ] Locale/theme switches preserve meaning and interaction state.

Suggested commit: `fix(ui): complete bilingual accessible task learning journeys`

## G12 — Expand task coverage without manufacturing filler

### Changes

- [ ] Produce a coverage matrix by Path → Domain → Capability showing question
      count, TaskFamily count, runnable languages, design exercise, recall-only
      content, and missing practice.
- [ ] Prioritize capabilities by curriculum importance and evidence gap, not by
      the desire to make every number equal.
- [ ] Author TaskFamilies for Node.js/TypeScript, Java/Spring, .NET/C#, Go,
      Frontend, System Design, Algorithms, Behavioral, PostgreSQL, delivery,
      observability, Docker, Kubernetes, and cloud-reasoning where deterministic
      checking is appropriate.
- [ ] Use a design/defense rubric instead of fake code execution for tasks that
      cannot be meaningfully sandboxed.
- [ ] Add a language/profile only with a pinned image, authored starter,
      solution, hidden tests, resource limits, and real Docker smoke.
- [ ] Record licensing and provenance for any externally sourced task idea. Do
      not copy paid or copyrighted solution content without permission.
- [ ] Keep shared TaskFamilies reusable across Paths through capability
      bindings.

### Acceptance for each new TaskFamily

- [ ] Reviewed capabilities and optional question bindings.
- [ ] Bilingual learner brief.
- [ ] At least one valid TaskRevision or an honest `brief_only` state.
- [ ] Deterministic pass, fail, timeout, and runtime-error tests.
- [ ] Docker isolation and hidden-test boundary proof.
- [ ] Lab learner journey and Evidence projection.
- [ ] Provenance/license record.

### Gate acceptance

- [ ] Every released capability has an explicit practice disposition:
      runnable task, design brief, recall-only, or intentionally deferred.
- [ ] Coverage gaps are visible and do not appear as locks or missing content.
- [ ] No placeholder TaskRevision is advertised as runnable.

Suggested commits should be one coherent capability or TaskFamily slice each,
for example `feat(tasks): add circuit breaker task family and go revision`.

## G13 — Remove compatibility paths, Payload ambiguity, and stale documentation

### Preconditions

The Workbench, TaskFamily API, v2 release join, and learner projection must be
green before deleting any compatibility reader.

### Changes

- [ ] Remove `questionKeys` as a capability compatibility projection after all
      clients consume `questionBindings` and `capabilityKeys` separately.
- [ ] Remove legacy capability keys from new release inputs while preserving
      explicit historical alias resolution.
- [ ] Remove local Lab question catalogues, stale snapshots, fallback content,
      fake readiness, and unused compatibility adapters.
- [ ] Decide Payload with evidence:
      either complete it as a draft-only editor using the full current promote
      contract, or export its six historical revisions and decommission it
      after Workbench parity. Do not leave two active authoring workflows.
- [ ] Mark old ADRs and reports historical/superseded. Current docs must not call
      the vault, Payload, Lab snapshots, and Question Brain simultaneous
      canonical writers.
- [ ] Replace stale counters in docs with commands or live API references.
- [ ] Delete generated/archive material only after provenance and restore proof
      exist. Record every deletion and recovery path.
- [ ] Update root `AGENTS.md`, workspace runbooks, onboarding, and ownership
      documents to the final contracts.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
rg -n "fallback|questionKeys|CAP-01|1375|1368|canonical Obsidian|LM Studio" \
  AGENTS.md docs fluent-engineering-lab fluent-question-brain fluent-task-runtime
pnpm status
git diff --check
```

Every remaining match must be one of:

- an immutable historical release/evidence record;
- a migration test explicitly proving rejection;
- a current documented invariant.

### Gate acceptance

- [ ] One canonical question writer.
- [ ] One execution authority.
- [ ] No runnable fallback or duplicate current catalogue.
- [ ] No current contract uses overloaded `questionKeys`.
- [ ] Documentation describes the running system rather than the migration.

Suggested commits:

- Question Brain: `refactor: retire obsolete authoring and compatibility paths`
- Task Runtime: `refactor(contract): remove legacy question key projection`
- Fluent Lab: `refactor: remove legacy catalogues and integration fallbacks`
- Workspace: `docs: publish canonical production operating model`

## G14 — Production hardening, performance, and observability

### Changes and checks

- [ ] Benchmark Question Brain exact/FTS/trigram/semantic retrieval and candidate
      generation with representative RU/EN queries. Keep or remove HNSW only
      from measured recall/latency evidence.
- [ ] Load-test import staging, Workbench queues, graph neighborhoods, Path
      projection, TaskFamily listing, workspace download, and Run submission.
- [ ] Enforce bounded pagination, request sizes, concurrency, retries, and
      cancellation.
- [ ] Verify Compose project names, unique loopback ports, health checks,
      restart policies, named volumes, and resource limits.
- [ ] Verify normal `pnpm down` stops required processes without deleting
      durable data or leaving optional profiles running.
- [ ] Verify no orphan containers, runaway index jobs, zombie task containers,
      unbounded queues, leaked temporary workspaces, or high-cardinality metric
      labels.
- [ ] Confirm Jaeger traces connect Lab request → Question Brain/Runtime request
      and Runtime control plane → sandbox execution without sensitive bodies.
- [ ] Add SLO evidence for readiness, search, graph neighborhood, task listing,
      Run submission, and learner navigation.
- [ ] Bring the Lab initial bundle and route styles under explicit production
      budgets or record an approved measured budget change with rationale.
- [ ] Repeat backup, restore, migration, rollback, dependency-failure, model
      outage, browser incompatibility, and corrupted-release drills.

### Required verification before commit

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm down
pnpm dev:production
pnpm status
pnpm ports
```

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-question-brain
make check
make g5-smoke
```

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-task-runtime
go test ./...
```

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm check:release
pnpm package:local:status
pnpm g8:08:closure
pnpm g8:13:closure
```

### Gate acceptance

- [ ] All required services are ready under one understandable workspace launch.
- [ ] Restore and rollback work from clean, isolated state.
- [ ] No blocker-level performance, memory, resource, security, or telemetry
      finding remains.
- [ ] `verifiedBackupRecorded` is true for the release boundary.

Suggested commit per owner: `chore(production): close question task hardening gate`

## G15 — Final independent acceptance

This gate is performed after the implementation agent reports every previous
gate complete. It must be audited independently against live services, code,
databases, browser behavior, and Git history. A checklist or prior report is
not sufficient proof.

### Repository and release audit

- [ ] All three child repositories are on `main`, clean, and synchronized with
      their remotes.
- [ ] The workspace is on `main`, clean, and synchronized with its remote.
- [ ] No unmerged implementation branch contains required work.
- [ ] Every migration has forward, idempotency, rollback/recovery, and clean-DB
      evidence.
- [ ] Active Question, Capability, Graph, TaskFamily, Task, and Lab release IDs
      agree through the public contracts.

### Data audit

- [ ] All production cards have valid EN/RU content and active embeddings.
- [ ] No open exact duplicate group or unreviewed release blocker exists.
- [ ] Every card has an explicit capability disposition.
- [ ] Every accepted graph edge has provenance and no dangling endpoint.
- [ ] Every active TaskRevision resolves a TaskFamily and reviewed capabilities.
- [ ] No answer, solution, or hidden-test copy exists on the wrong side of a
      service boundary.

### End-to-end audit

- [ ] Fresh start from the workspace with `pnpm dev`.
- [ ] Packaged start with `pnpm dev:production`.
- [ ] RU/EN and light/dark parity.
- [ ] Browse all Paths and open arbitrary released questions without fake locks.
- [ ] Run the rate-limiter family in every released language revision.
- [ ] Complete one stack-specific task and one multi-capability task.
- [ ] Observe fail, timeout, runtime error, pass, Evidence, and cold repeat.
- [ ] Review and publish one duplicate decision, graph edge, and capability
      binding through Workbench.
- [ ] Confirm logs, metrics, and traces explain every failure without exposing
      sensitive content.
- [ ] Stop and restart the workspace; confirm learner progress and releases
      survive.

### Final commands

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm status
pnpm lab:affected
git diff --check
git status --short --branch
```

```bash
git -C fluent-question-brain status --short --branch
git -C fluent-task-runtime status --short --branch
git -C fluent-engineering-lab status --short --branch
```

### Definition of done

The work is complete only when all of the following are true:

- [ ] A new question batch is staged, deduplicated, reviewed, related, mapped,
      released, and searchable without editing application code.
- [ ] A new TaskFamily can add another language revision without changing the
      question, capability identity, or learner graph.
- [ ] Question Brain, Task Runtime, and Lab each own exactly one bounded domain
      and communicate only through released contracts.
- [ ] The learner can understand why a question appears, what capability it
      develops, which tasks are available, what a Run proved, and what comes
      next.
- [ ] Free exploration never fabricates mastery, and recommended learning never
      hides released content behind an unexplained lock.
- [ ] Backup, restore, rollback, observability, performance, accessibility,
      bilingual layout, and desktop browser journeys are independently green.
- [ ] All required commits are pushed to `main`; no required work exists only
      on one machine.

## 4. Progress ledger

Update this table only after the corresponding Gate acceptance section is
fully checked and its evidence is committed.

| Gate | Status | Evidence | Owner commits |
| --- | --- | --- | --- |
| G0 — baseline and backup | complete | `docs/verification/G0-BASELINE-2026-08-24.md` (live baseline, local restore, private vault remote, remote bundle verification) | Root `6595d5b`; Vault `3d3cb6f` bundle baseline |
| G1 — domain contract | complete | `docs/verification/G1-CONTRACT-2026-08-24.md` | Brain `21a7b86`; Runtime `53663ba`; Lab `a098f36` |
| G2 — capability registry | complete | `docs/verification/G2-CAPABILITY-2026-08-24.md` (registry migration, aliases, supersedes integrity, dry-run, live counts) | Brain `7daf53d`, `89946a3`, `19e9fdf` |
| G3 — TaskFamily | complete | `docs/verification/G3-TASK-FAMILY-2026-08-25.md` (Runtime manifest/API, immutable hashes, Docker pass/fail, Jaeger) | Runtime `4a9c3c9` |
| G4 — remove task duplication | complete | Brain `docs/verification/G4-TASK-BOUNDARY-2026-08-25.md` (47 legacy blocks migrated, 0 current embedded solutions, one live TaskFamily join) | Brain `78cc4da`, `942c9b3` |
| G5 — content graph | not started | — | — |
| G6 — semantic proposal pipeline | not started | — | — |
| G7 — question-capability bindings | not started | — | — |
| G8 — release join | not started | — | — |
| G9 — Review Workbench | not started | — | — |
| G10 — learner projection | not started | — | — |
| G11 — bilingual/a11y/design | not started | — | — |
| G12 — task coverage | not started | — | — |
| G13 — legacy removal | not started | — | — |
| G14 — production hardening | not started | — | — |
| G15 — independent acceptance | not started | — | — |

## 5. Handoff rule

The implementation agent must finish by providing:

1. the updated progress ledger;
2. every evidence path;
3. every commit hash grouped by repository and gate;
4. live release IDs and readiness output;
5. unresolved blockers, if any, without marking their gate complete.

After that handoff, a separate final audit must compare the implementation to
this plan, inspect the actual diffs and databases, run the production package,
exercise the browser journeys, and confirm that every gate is genuinely closed.
