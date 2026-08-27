# Fluent Interview glossary v1

Status: **active canonical vocabulary**
Owner: `fluent-interview` root orchestrator
Source: `CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md`

This file is a compact agent-facing glossary. It does not own content, learner
progress, tasks, or database rows; it prevents the three repositories from
using one word for different objects.

| Term | Meaning | Owner |
| --- | --- | --- |
| `Program` | Target profession; current value `Backend Engineer` | Fluent Lab |
| `Path` | Learner-facing recommended stack/discipline route | Fluent Lab |
| `TrackView` | A released learner view assembled from one or more reusable modules; it is not the Brain editorial `track` field | Fluent Lab |
| `LearningModule` | Versioned reusable set of capabilities, prerequisites, activities and visibility rules that can be composed into several TrackViews | Fluent Lab |
| `QuestionPlacement` | Release-scoped many-to-many relation from a QuestionCard to a capability/module/station, with an explicit role and provenance | Question Brain + Lab projection |
| `SharedDomain` | Cross-path content domain such as Runtime or Data/PostgreSQL | Brain taxonomy |
| `PlanArea` | Coverage/reporting bucket for Plan 2026; never Brain taxonomy | Root/Lab `CoverageManifest` |
| `Capability` | Small observable skill that can be proven | Question Brain registry |
| `Station` | Learner placement of a capability in a released Lab graph | Fluent Lab |
| `QuestionCardRevision` | Immutable localized question revision | Question Brain |
| `QuestionCapabilityBinding` | Reviewed question ↔ capability relation | Question Brain |
| `TaskFamily` | Language-neutral practice intent | Task Runtime |
| `TaskRevision` | Immutable runnable revision for one language/profile | Task Runtime |
| `Activity` | Learner proof unit such as recall, predict, code, debug, design, incident, explain or defend | Fluent Lab |
| `EvidenceMode` | The kind of observable evidence required by an Activity (`spoken`, `runtime`, `written`, `design`, `incident` or `project`) | Fluent Lab |
| `ContentReadiness` | Whether authored learning layers for the selected locale satisfy the policy for the card/activity | Question Brain, projected by Lab |
| `PlacementReadiness` | Whether reviewed capability/module/station placement and prerequisites are valid for a release | Fluent Lab |
| `RuntimeReadiness` | Whether an exact released TaskRevision/profile is executable under the current runtime release | Task Runtime |
| `LearnerReadiness` | The server-owned next action derived from content, placement, runtime and learner evidence; never a client boolean | Fluent Lab |
| `CapabilityDossier` | Lab projection of content, practice, evidence, and readiness | Fluent Lab |
| `LearningSession` | One human attempt at the full evidence loop | Fluent Lab |
| `Run` | One sandbox execution of one exact `TaskRevision` | Task Runtime |
| `EvidenceBundle` | Append-only facts produced by a learner session | Fluent Lab |
| `ColdRepeatAssignment` | Delayed changed-context repeat | Lab scheduler |
| `MasteryClaim` | Server-computed result after all required proofs | Fluent Lab evaluator |
| `CapabilityRegistryRelease` | Immutable Brain capability/alias snapshot | Question Brain |
| `TaskCatalogRelease` | Immutable Runtime family/revision snapshot | Task Runtime |
| `OperationalResource` | Shared trace, health, or Compose/AppHost resource with owner/lifecycle | Workspace contract |

## Non-negotiable distinctions

- A question count is not a capability count, station count, task count, or
  mastery count.
- `TaskBrief` is a learner projection of released Runtime data, never a second
  task source.
- `PlanArea` is a reporting view, not a new Brain taxonomy node.
- `Run` evidence cannot be replaced by a visit, reveal, screenshot, or LLM
  verdict.
- A missing practice revision is represented as `brief_only`, `recall_only`, or
  `deferred`; it is never hidden behind a fake lock or fallback catalogue.
- `Path` is reserved for the learner corridor. Use `TrackView` for the
  released UI projection and `track` only for Brain editorial metadata.
- `ready` without a dimension is forbidden in cross-service contracts. A
  response must say which of `content`, `placement`, `runtime`, or `learner`
  readiness it describes.
