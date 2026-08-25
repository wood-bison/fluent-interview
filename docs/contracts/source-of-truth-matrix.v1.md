# Source-of-truth matrix v1

Status: **active**
Release: `m0-2026-08-25`
Owner: `fluent-interview` workspace contract

The matrix is intentionally small. Each row has one write authority and may
have read-only projections in the other repositories.

| Concern | Canonical authority | Allowed projection | Explicit non-owner |
| --- | --- | --- | --- |
| active canonical capabilities and aliases | Question Brain `CapabilityRegistryRelease` | Lab inventory/stations; Runtime capability keys | Lab, Runtime, root |
| question revisions/locales and reviewed bindings | Question Brain `QuestionRelease` + `QuestionCapabilityBindingRelease` | Lab dossier/question library; Runtime relation audit | Lab fallback files, Runtime prose |
| task families/revisions/availability | Task Runtime `TaskCatalogRelease` | Lab practice catalog/TaskBrief | Brain, Lab task copies |
| learner paths, stations, readiness, progress, evidence | Fluent Lab released projection | Browser/UI, reports | Brain, Runtime |
| 12 Plan areas and 24 Tier-1 modules | Root/Lab `CoverageManifest` mapping | Reports, counters, acceptance gates | Brain taxonomy, Runtime catalog |
| health, traces, collector, Compose/AppHost ownership | `workspace.yaml` operational contract | `pnpm status`, Studio diagnostics, dashboards | per-repo duplicate Jaeger/UI |

## Join keys

- `questionReleaseId` and immutable question revision/content hashes join Brain
  content to Runtime bindings.
- `capabilityRegistryReleaseId` and canonical capability keys join the reviewed
  graph to task assessments.
- `taskFamilyReleaseId`, task id, and revision join Lab practice to Runtime.
- `graphReleaseId`/manifest version join the learner map to Lab's current
  projection.
- A trace uses one W3C correlation context through Browser → Lab → Brain or
  Runtime → persistence; `56686` is the shared Trace Explorer, not a Runtime
  application UI.

## Counter policy

Every UI counter must name its owner and denominator: `total`, `released`,
`runnable`, `available`, or `mastered`. A Lab counter may not silently
substitute one of these values for another. The current baseline and known
exceptions are recorded in
`docs/verification/capability-closure/M0/baseline.json`.
