# Fluent Interview workspace

This is the desktop-first workspace for the Fluent Interview platform. It
coordinates three independent repositories without merging their source or
ownership:

| Repository | Responsibility |
| --- | --- |
| `fluent-engineering-lab` | Nest learning API, curriculum projection, progress, evidence |
| `fluent-engineering-vue` | only learner/operator web UI (Vue 3 + Vite) |
| `fluent-question-brain` | canonical questions, locales, graph, search, releases |
| `fluent-task-runtime` | task revisions, sandboxes, hidden tests, execution traces |

## One command

Start the complete local development stack from this directory:

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm run dev
```

The root `pnpm` command is only a friendly entrypoint: it starts Question Brain
and Task Runtime first, waits for their readiness contracts, then starts the
Vue learner/operator shell. The repositories and their Compose boundaries
remain independent. Open the application at `http://localhost:47350/`.

Startup also applies the idempotent Question Brain curriculum-mapping migration
for existing PostgreSQL volumes and pins Task Runtime to the checked-in release
join in `fluent-task-runtime/releases/`. This prevents a stale volume or an
implicit runtime fallback from changing what the Lab can execute. When Question
Brain publishes a new release, generate and review the matching runtime
manifest, update `RUNTIME_RELEASE_FILE` in `scripts/up.sh`, and commit both
repositories together.

For the packaged local release:

```bash
pnpm dev:production
```

The packaged learner surface opens at `http://localhost:49300/onboarding`.

Useful variants:

```bash
pnpm dev:quick                 # reuse existing images
pnpm dev:production:quick      # packaged release, reuse existing images
pnpm status                    # Git, Compose, health, and observability report
pnpm down                      # stop services without deleting volumes
pnpm prune:workspace           # remove only known stale workspace Docker artefacts
pnpm ports                     # verify the workspace port registry has no duplicates
```

The underlying `scripts/*.sh` commands remain available for automation and
recovery. `pnpm dev` is the normal human-facing command.

## Как читать текущий release

Количество карточек и количество экранов — разные уровни одной модели:

| Слой | Сейчас | Что это означает |
| --- | ---: | --- |
| Program | 1 | `Backend Engineer`, контейнер всей учебной системы |
| Paths | 9 | Node.js + TypeScript, Java + Spring, .NET + C#, Go, Python, Frontend, System Design, Algorithms, Behavioral |
| Areas / stations | 15 / 81 | опубликованные учебные области и станции, а не количество карточек |
| Question Brain cards | 1,591 | канонические карточки вопросов, доступные через библиотеку |
| Topic groups | 135 | тематические группы Question Brain, не отдельные программы |
| Task families / revisions | 16 / 20 | семейства задач и исполняемые языковые revisions; SQL-реализация rate limiter живёт в отдельной PostgreSQL-семье |

Текущий release сверяет 1,591 из 1,591 карточек: `accepted=1,591`,
`proposed=0`, `unmapped=0`. Это означает, что каждая карточка имеет принятую
placement-связь в Question Brain. Это всё ещё не означает 1,591 экран или
1,591 runnable-задачу: Lab агрегирует карточки в 15 областей и 81 станцию, а
исполнение подключено только там, где есть TaskBrief и runtime revision.
Сейчас таких station-bound карточек 6, а runnable revisions — 20. Остальные
карточки доступны в библиотеке и графе как учебный контент; задача добавляется
отдельным release join, а не угадывается по словам `Track`/`Topic`.

Идентификаторы текущего согласованного среза: Question Brain
`question-release-d00a14931e607336`, curriculum graph
`2026.08.06-curriculum-graph.3`, Task Runtime
`runtime-task-release-2026-08-26-qb-d00a1493-g10`. В API inventory все проверки
reconciliation имеют значение `true`.

Карточка каждого пути теперь показывает два разных числа: `discoveryCount` —
точный результат серверного поискового профиля в общей базе (например, `Go`), и
`linked cards` — только принятые placement-связи со станциями Lab. Discovery не
открывает станцию автоматически и не маскируется под mapping.

В интерфейсе по умолчанию включён `Explore`: можно открыть любую опубликованную
область и посмотреть урок или workspace. Это не создаёт evidence, mastery или
pass — для этого остаётся отдельный guided-путь и детерминированный runtime.
Проекты сейчас являются read-only preview до выпуска их execution tier; это
намеренный gate, а не сломанная ссылка.

Fluent Lab и Task Runtime используют общий Jaeger Question Brain для
трассировок (`56686`; OTLP `54317/54318`). Grafana Lab
подключается к Jaeger как datasource; отдельного Tempo-сервиса и его volume в
Lab Compose больше нет. `pnpm prune:workspace` удаляет только известные старые
`fluent-engineering-lab_fel-*` volumes и остановленные контейнеры этого Compose
проекта; он не выполняет опасный глобальный `docker system prune`.

Последний контентный checkpoint (без неподтверждённого массового импорта):
[audit phases 4.2/4.5/4.6/5.3](fluent-question-brain/docs/audits/content-phases-4-2-4-5-4-6-5-3-checkpoint-2026-08-24.md).
Следующий безопасный шаг для новых источников — source-backed batch →
`qb-import --strict-taxonomy --dry-run` → editorial review → release evidence;
карточки без русской формулировки или проверенного ответа в production не
попадают.

Полный ordered frontier после этого checkpoint записан в
[`docs/CONTENT-EXPANSION-PLAN-2026-08-24.md`](docs/CONTENT-EXPANSION-PLAN-2026-08-24.md):
сначала explicit Question Brain crosswalk, затем TaskBrief/runtime revisions,
затем новая Lab projection. Там же зафиксировано, почему discovery-карточки
не считаются автоматически станциями и почему `Explore` не выдаёт mastery.

## Where Nx fits

The architecture is intentionally hybrid, as described in the workspace
decision report:

- `pnpm` at this directory is the polyrepo launcher. It coordinates processes
  and Compose projects; it does not duplicate service source code or database
  ownership.
- Nx is already the project/task graph for the TypeScript Fluent Lab
  workspace. Use `pnpm lab:graph` or `pnpm lab:affected` there.
- Question Brain and Task Runtime are Go repositories. They can be orchestrated
  by a runner, but Nx does not automatically share Go dependency graphs,
  compile-time types, or cross-repository changes. Their boundaries stay
  versioned HTTP/schema contracts and their own Go toolchains.

This gives one short command for development without pretending that different
languages and independent release units are one source tree. The previous
client and its Nx web libraries are retired; there is no second web
runtime to keep in sync.

## Service surfaces

| Service | API/readiness | Operator UI |
| --- | --- | --- |
| Question Brain | `127.0.0.1:48127` | Payload `localhost:48128/admin`; Jaeger `localhost:56686` |
| Task Runtime | `127.0.0.1:48227` | traces через общий Jaeger `localhost:56686` |
| Fluent Lab dev | Vue `localhost:47350`, API `localhost:47000` | learner + operator UI |
| Fluent Lab package | web `localhost:49300`, API `localhost:49301` | learner UI |
| Fluent Lab durable data | Postgres `localhost:49302`, Redis `localhost:49303` | package-owned volumes |

Each service keeps its own Compose project and durable volumes. Do not use
`docker compose down -v` during normal operation. The workspace does not share
database tables or ORM models; cross-service communication uses versioned
HTTP contracts and released projections. Host-facing binds are kept in the
dedicated high-port registry in `workspace.yaml`; container-internal ports stay
standard and are never exposed directly to the host.

The parent is an orchestrator, not a fourth Compose project. `scripts/status.sh`
shows the required services and any enabled Lab observability profile;
`scripts/down.sh` removes all three named projects plus enabled Lab profile
containers/networks without deleting their volumes. All local runtime, database and telemetry
binds are loopback-only. See the [Docker stack and resource audit](docs/audits/docker-stack-resource-audit-2026-08-23.md)
for provenance, cleanup and memory evidence.
