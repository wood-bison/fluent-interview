# G4 verification — TaskBrief boundary and Runtime ownership

Status: **complete**
Owner commits: Question Brain `78cc4da`, `942c9b3`

Question Brain now keeps the learner-facing brief and a stable TaskFamily join;
Task Runtime owns executable source, starter workspaces, solutions, hidden
tests, harnesses, images, limits, and sandbox policy. The additive
`question-brain.task-brief.v1` contract is validated by strict import/release
flags. Historical revisions are never rewritten.

The live production migration created new current revisions for all 47 legacy
TaskBlock cards, removed Runtime-owned solutions and Solution sections from the
learner projection, copied locales/mappings/placements, and recorded audit plus
outbox events. Old revisions remain available for rollback and provenance.

The conceptual rate-limiter card now demonstrates the complete join:

```text
QuestionCard question.q315
  → TaskBrief v1 (runtime_task_reference)
  → task-family.rate-limiter
  → Go / Java / Node.js / PostgreSQL TaskRevisions
```

Live API evidence (`http://127.0.0.1:48127`, release
`question-release-d00a14931e607336`, 1591 production cards):

| Counter | Value |
| --- | ---: |
| `task_blocks` | 48 |
| `embedded_solutions` | 0 |
| `task_family_references` | 1 |
| `task_boundary_violations` | 0 |
| `outbox_pending` | 0 |
| `locales_without_embedding` | 0 |

`/v1/questions/question.q315?locale=en` returns the condition, starter
signature, walkthrough, difficulty, and `task-family.rate-limiter`; no solution
or hidden-test body is returned. `make check` and the full Brain Compose smoke
passed after rebuilding API/indexer/CMS images.

Rollback is the immutable pointer operation: restore the previous
`question.current_revision_id` from the audit event or publish another
revision. The migration scripts are versioned in Question Brain:

- `scripts/migrate_task_blocks_to_taskbrief_v1.sql`
- `scripts/link_rate_limiter_taskbrief.sql`
