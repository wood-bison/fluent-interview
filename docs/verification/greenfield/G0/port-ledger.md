# G0 Port Ledger skeleton

This ledger is the source map for the greenfield rewrite. Every capability must
be resolved in G4–G11 as `ported`, `adapted`, or `dropped(reason)`; an
unresolved row blocks G12.

| Capability | Reference authority | Target owner | Initial disposition | Evidence required |
| --- | --- | --- | --- | --- |
| Program / learner path | Fluent Lab + Vue projection | `apps/web` + `apps/api` | ported | route manifest, projection contract, visual states |
| Atlas / dependency graph | Brain graph release + Vue Atlas | `apps/web`, `packages/domain` | adapted | graph release/hash, relevance matrix, visual/a11y |
| Question catalog / revisions | Question Brain | `apps/api` QuestionCatalog module | ported | release manifest, provenance, dedupe and readback |
| Question history mirror | Question Vault | `content` import boundary | adapted | source snapshot and license/provenance record |
| Task families / revisions | Task Runtime | `services/task-runtime` | ported | immutable release and compatibility matrix |
| Run | Task Runtime | `apps/api` command boundary | ported | run contract, trace, public evidence |
| Submit / hidden suite | Task Runtime | `apps/api` command boundary | ported | authoritative verdict, canary leak scan |
| Attempts / progress / mastery | Fluent Lab | PostgreSQL target schema | adapted | migration, restart, restore and no-time-travel tests |
| Projects / checkpoints | Fluent Lab + Vue | `apps/web` + `apps/api` | adapted | project manifest and human learning flow |
| Navigator / local LLM | Fluent Lab | `apps/api` advisory module | adapted | context revision, redaction, eval and outage tests |
| Studio / import / release | Question Brain CMS + Lab Studio | `apps/web` + `apps/api` | adapted | review queue, release hash and rollback |
| Stack control | Umbrella scripts + Compose | `tools/stack`, `infra/compose` | replaced | StackSession, doctor/status and orphan tests |
| Technical telemetry | Jaeger/Prometheus/Loki/Grafana | `packages/observability` | replaced | vendor-neutral contract, OTLP trace and disk budget |
| Learning Evidence | Lab persistence | `apps/api` + PostgreSQL | ported | evidence chain and benchmark gates |

## Reference-only rules

- Reference Product remains runnable and immutable through G12.
- No target import may read a reference database, sibling source path, or
  legacy API at runtime.
- No hidden tests, private answers, submitted source, or secrets enter this
  ledger or any public artifact.
