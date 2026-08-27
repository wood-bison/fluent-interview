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

## Control Center

**Control Center** is the product label for the live Aspire resource dashboard.

## Trace Explorer

**Trace Explorer** is the product label for the central Jaeger trace interface.

## Metrics & Logs

**Metrics & Logs** is the product label for persistent Grafana dashboards and
alerts backed by Prometheus and Loki.

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
