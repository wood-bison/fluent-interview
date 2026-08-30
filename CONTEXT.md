# Fluent Interview workspace glossary

## Product family

**Fluent Interview** is the family of products and services coordinated by this
workspace.

## Fluent Lab

**Fluent Lab** is the learner-facing product. It owns learning paths, learner
navigation, progress, attempts, evidence, and advisory AI experiences.

## Question Brain

**Question Brain** is the source of truth for questions, localized revisions,
taxonomy, graph relationships, search, embeddings, and content releases.

## Task Runtime

**Task Runtime** is the source of truth for executable task families and
revisions, sandbox runs, hidden-test verdicts, and run result envelopes.

## Product readiness

**Product readiness** states whether a named learner flow can currently accept
and complete its required work.

**Learning Product Maturity** is the ordered strength of the product claim:
operational, curriculum-published, practice-executable, mastery-proven, and
interview-benchmarked. _Avoid_: treating container health or content volume as
proof of interview readiness.

**Interview Readiness** is a learner-level claim supported by retained skill,
unseen transfer, timed coding, system design, incident response, spoken defense,
and external human evaluation. It is not a product health state or completion
badge.

## Resource health

**Resource health** states whether one process, container, or dependency is
alive or ready to serve its own contract. Resource health is an input to, but
is not synonymous with, product readiness.

## Client capability

**Client capability** describes what the current browser can perform. It never
changes backend resource health.

## Optional capability

An **optional capability** enhances the product without blocking its core
learning flows. The local AI companion is an optional capability.

## Operational and learning evidence

**Stack Session** is one bounded lifecycle of a Fluent Interview stack, from
preflight through startup and health transitions to shutdown or failure. It
remains identifiable even when telemetry or product databases never start.

**Technical Telemetry** is redacted diagnostic evidence about the behavior and
performance of running product resources. It may explain an incident but never
creates learner progress, mastery, or unlocks. _Avoid_: Learning Evidence.

**Learning Evidence** is durable product evidence that a learner performed,
explained, defended, or later repeated assessed work against exact revisions.
It may support a mastery claim but is never inferred from infrastructure
metrics, traces, or logs. _Avoid_: telemetry, analytics event.

## Control Center

**Control Center** is the operator-facing Fluent surface for expected and
observed stack resources, Stack Sessions, health transitions, cleanup state,
and incident handoff. _Avoid_: Aspire dashboard, Grafana.

## Trace Explorer

**Trace Explorer** is the product label for the distributed-trace diagnostic
surface, independent of its storage vendor. _Avoid_: Jaeger UI, Tempo UI.

## Metrics & Logs

**Metrics & Logs** is the product label for the bounded technical-signal surface,
independent of its dashboard and storage implementation. _Avoid_: Grafana.

## Durable volume

A **durable volume** is named, owned, allowlisted data that survives normal
start, stop, restart, and scoped cleanup.

## Ephemeral resource

An **ephemeral resource** is rebuildable runtime or build state with explicit
ownership, lifecycle, and expiry metadata.

## Curriculum composition

**TrackView** is the released learner projection for a corridor such as
Node.js, Go, Java, .NET, Python, or Vue. It is assembled from reusable
**LearningModules**; it must not be confused with Question Brain's editorial
`track` metadata or with a runtime language profile.

A **QuestionPlacement** is a reviewed, release-scoped many-to-many relation
between a QuestionCard and a capability/module/station. Placement carries a
role (`primary`, `follow-up`, `contrast`, or `recall`) and provenance. The
browser never derives placement from labels or task filenames.

A **Lesson** is an ordered learner-facing unit inside a LearningModule. It
groups one or more closely related capabilities into a coherent explanation,
primary interview question, supporting prompts, and assessed activities. A
Lesson is not a QuestionCard and must not be counted from raw Brain rows.

A **Primary Question** is a QuestionPlacement with role `primary` that appears
as a self-contained learner-visible interview question. A **Supporting Prompt**
is a placement with role `follow-up`, `contrast`, `recall`, `edge`, or
`defense`; it is revealed inside the Lesson and does not inflate the visible
path length.

A **TaskCandidate** is task-like material discovered in Question Brain or an
approved external source before evidence mode and runtime ownership are
resolved. It must become a TaskFamily/TaskRevision, a typed non-code Activity,
or an explicitly rejected candidate; it is never advertised as runnable by
virtue of containing code-like prose.

An **Activity** is the learner's proof unit (`recall`, `predict`, `code`,
`debug`, `design`, `incident`, `explain`, or `defend`). Its **EvidenceMode**
declares what proof is required. A theory card can therefore be complete for
reading while having no runnable Activity.

Readiness has four deliberately separate dimensions:

- **ContentReadiness** — authored layers for the selected locale;
- **PlacementReadiness** — reviewed curriculum placement and prerequisites;
- **RuntimeReadiness** — exact released executable revision/profile;
- **LearnerReadiness** — the next action after combining the first three with
  learner evidence.

An unqualified `ready` field is not a valid cross-service claim.

## Source and product surfaces

A **Source Monorepo** is the single canonical Git history for the Fluent
Interview product family. It changes source coordination, but does not merge
bounded contexts, data ownership, or authority.

The **Learner Web** is the learner-facing web surface. It presents released
curriculum, practice, progress, evidence, and advisory assistance. It owns no
canonical content, execution verdict, or mastery decision.

The **Content Studio** is the editorial surface for drafts, review, provenance,
localization, and publication proposals. A Studio publish action does not
itself make a draft canonical; Question Brain accepts and releases canonical
content.

## Assessment and assistance

An **Assessment Policy** declares, for one Activity kind, which authority may
evaluate it, which evidence is required, whether that evidence may unlock
progress, and which versioned rubric or evaluator applies.

A **Deterministic Verdict** is the authoritative result of a pinned executable
revision and assessment suite. It is produced by Task Runtime, not by a
browser, learner self-grade, or language model.

**Advisory Guidance** helps a learner understand a task, inspect evidence,
form a hypothesis, or choose an allowed next step. It may create an Assistance
Event, but never a Deterministic Verdict, Mastery Claim, release, or unlock.

A **Context Revision** is the server-owned, immutable context used for one
advisory turn. It references exact curriculum, content, task, attempt, evidence,
and rubric revisions instead of trusting browser-supplied summaries.

## Content governance

**Content Provenance** records where candidate material came from, under which
rights it may be used, which snapshot was reviewed, and which editorial
decision allowed it into a release.

A **Curriculum Placement Release** is an immutable mapping from accepted
capability bindings to learner-visible lessons, stations, roles, order, and
visibility. It is distinct from Question Brain's semantic graph release.

## Greenfield migration language

A **Reference Product** is an immutable, runnable snapshot of the previous
Fluent Interview system used to compare behavior, data, visuals, and contracts.
It is never a write target, runtime dependency, or production authority for the
new product.

A **Capability Port** recreates one coherent learner or authoring capability in
the new platform. It carries exact source provenance, explicit disposition
(`rewrite`, `adapt`, `copy`, or `drop`), parity evidence, deliberate differences,
and a rollback boundary. A Capability Port is not a repository copy.

A **Port Ledger** is the reviewable inventory of Capability Ports. It connects
an immutable source repository and revision to the new target paths and proofs,
so a clean Git history does not erase architectural provenance.

A **Content Release Bundle** is an immutable, deterministic projection of
reviewed content revisions, placements, assets, provenance, checksums, and
attestation. It is a deployment/export artifact, not an authoring source.
