# Curriculum content expansion — отдельный план

Этот документ отделяет многомесячное наполнение учебного корпуса от закрытия
платформы. Он не объявляет ни одну запись reviewed/released и не меняет
master-plan автоматически. Каноническая последовательность и gate остаются в
[`GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`](GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md).

## Почему это отдельная очередь

В master-plan оставшиеся `G11` пункты включают не только код, но и смысловую
работу: 1 597 PREP_ONLY records, переводы, provenance, dedupe, placements,
rubrics и human/expert review. Их нельзя закрыть подсчётом карточек или
автоматическим импортом. Платформа при этом уже имеет работающие shell,
runtime, release/import seam и learner маршруты. Поэтому platform release и
curriculum breadth идут параллельно, с разными критериями готовности.

## Что считается готовым в этой очереди

Каждый bounded batch обязан иметь:

- allowlist source records и canonical IDs;
- disposition `reviewed|quarantined|duplicate|rejected` с provenance;
- RU/EN answer layers и preferred prompt;
- typed capability/path placement без чужого language context;
- TaskFamily/TaskRevision/runtime binding, если это executable activity;
- human review для семантики и качества, а не только schema validation;
- release bundle, readback, reconciliation и rollback evidence;
- atomic commit и обновлённые counts/hashes.

## Приоритеты

### C0 — Node.js/NestJS canary

- [ ] C0-01: довести Event Loop до полного шестиэтапного scenario pack;
- [ ] C0-02: добавить Node/libuv/V8/streams/workers/ALS/Abort/timers/Buffer/
  GC/HTTP/process/diagnostics coverage;
- [ ] C0-03: добавить Nest DI scopes/lifecycle/middleware/guards/pipes/
  interceptors/filters/validation/auth/transactions/testing/observability;
- [ ] C0-04: связать каждый вопрос с lesson/activity и проверить полный
  `route → question → lesson → task → runtime → evidence → review` journey;
- [ ] C0-05: закрыть package-mode candidates на `node-26-commonjs` и следующий
  реально released profile только после exact evaluator evidence.

### C1 — Shared foundations

- [ ] C1-01: algorithms, HTTP, SQL, distributed-systems и observability
  families с явными generic/shared placements;
- [ ] C1-02: не допускать копии одной family для разных языков;
- [ ] C1-03: доказать, что generic material не попадает в native path без
  prerequisite и relevance rationale;
- [ ] C1-04: пересобрать missing-role и coverage ledgers после каждого batch.

### C2 — Language packs

- [ ] C2-01: Java/Kotlin/JVM + Spring/Ktor;
- [ ] C2-02: Go с race/leak/pprof scenarios;
- [ ] C2-03: .NET/C# с cancellation/disposal/concurrency scenarios;
- [ ] C2-04: Python с asyncio/GIL/process/memory scenarios;
- [ ] C2-05: React/Next.js browser/rendering/RSC/security/performance/a11y;
- [ ] C2-06: для каждого pack exact runtime, 28–36 lessons, target activity
  count и один независимый learner journey.

### C3 — Overlays и interview benchmark

- [ ] C3-01: Algorithms — 15 capability families и 60 runnable problems;
- [ ] C3-02: System Design — 50 defense/incident capabilities;
- [ ] C3-03: Behavioral — project evidence, STAR/CAR, ambiguity, leadership и
  English defense;
- [ ] C3-04: worked example → faded steps → independent problem →
  self-explanation → interleaving → repeat;
- [ ] C3-05: retention at 7/30 days, unseen variants и hint dependence;
- [ ] C3-06: timed coding/system-design/incident rubrics;
- [ ] C3-07: не заявлять interview readiness без human/external mock evidence.

## Гейт каждого batch

```text
inventory → canonical disposition → translation/answer review → placement
→ TaskFamily/Revision binding → focused tests → release bundle/readback
→ reconciliation → browser canary → atomic commit
```

Запрещено:

- писать напрямую в serving catalog;
- считать PREP_ONLY reviewed/released;
- смешивать Node/Java/Go/.NET/Python/Next material;
- скрывать unresolved records за aggregate count;
- добавлять filler только ради численного target.

## Связь с platform closure

До этой очереди или параллельно ей платформа закрывает G10S-246 owner
acceptance, G12.5 requalification и независимую техническую проверку. G11
content gate остаётся открытым до выполнения этого плана. Поэтому «platform
ready» не означает «все 1 597 записей вычитаны», а curriculum completion не
должен блокировать проверку уже работающего Node.js vertical slice.

