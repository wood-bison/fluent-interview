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
| `SharedDomain` | Cross-path content domain such as Runtime or Data/PostgreSQL | Brain taxonomy |
| `PlanArea` | Coverage/reporting bucket for Plan 2026; never Brain taxonomy | Root/Lab `CoverageManifest` |
| `Capability` | Small observable skill that can be proven | Question Brain registry |
| `Station` | Learner placement of a capability in a released Lab graph | Fluent Lab |
| `QuestionCardRevision` | Immutable localized question revision | Question Brain |
| `QuestionCapabilityBinding` | Reviewed question ↔ capability relation | Question Brain |
| `TaskFamily` | Language-neutral practice intent | Task Runtime |
| `TaskRevision` | Immutable runnable revision for one language/profile | Task Runtime |
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
