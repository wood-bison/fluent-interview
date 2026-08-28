# Fluent Interview Platform — greenfield Next.js execution plan

Дата: **28 августа 2026**
Статус: **G0–G4 PASS; G5 seed slice PASS_WITH_LIMITATIONS; G6 executable slice PASS_WITH_LIMITATIONS; G7 submit/evidence slice PASS_WITH_LIMITATIONS; G8 progress slice PASS_WITH_LIMITATIONS; G8 project/observability slices в очереди**
Владелец продукта: **Sergey**
Reference workspace: `/Users/sergeyzhechko/developer/fluent-interview`
Предлагаемый target workspace: `/Users/sergeyzhechko/developer/fluent-interview-platform`
Default branch: **`main`**
Рабочее имя remote: **`fluent-interview-platform`**; owner и URL фиксируются в G0 до создания remote.

Этот документ предназначен агенту-координатору. Он превращает архитектурный
аудит в последовательную, commit-gated программу. Агент не имеет права
пропускать пункты, ставить галочку без evidence или объявлять финальный release
готовым без независимой проверки владельца и следующего Codex-аудита.

Связанные документы:

- [`GREENFIELD-ARCHITECTURE-CHALLENGE-2026-08-28.md`](GREENFIELD-ARCHITECTURE-CHALLENGE-2026-08-28.md);
- [`reports/greenfield-architecture-challenge-2026-08-28.html`](reports/greenfield-architecture-challenge-2026-08-28.html);
- [`NEXT-MONOREPO-PRODUCT-REFACTORING-PLAN-2026-08-28.md`](NEXT-MONOREPO-PRODUCT-REFACTORING-PLAN-2026-08-28.md) — Option A, не исполнять W03–W08;
- [`CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md`](CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md);
- [`reports/production-curriculum-closure-audit-2026-08-27/agent-production-closure-plan.md`](reports/production-curriculum-closure-audit-2026-08-27/agent-production-closure-plan.md);
- [`CONTEXT.md`](../CONTEXT.md);
- [`WISHLIST.md`](WISHLIST.md).

---

## 0. Как агент обязан использовать этот план

### 0.1. Неподвижный порядок

- [ ] `P-001` Выполнять только `G0 → G1 → … → G12`.
- [ ] `P-002` Не начинать следующий gate, пока текущий не имеет `PASS`.
- [ ] `P-003` `PARTIAL`, `WAIVED`, `MOSTLY PASS` и «работает у меня» не разрешают переход.
- [ ] `P-004` Destructive/cutover действия разрешены только после отдельного preflight внутри соответствующего gate.
- [ ] `P-005` Один gate должен оставлять обе рабочие директории в документированном и восстанавливаемом состоянии.
- [ ] `P-006` Reference Product не используется как runtime fallback нового продукта.
- [ ] `P-007` Старый workspace остаётся запускаемым до независимого G12 review.
- [ ] `P-008` Все новые product commits создаются в target repo на `main`; long-lived feature branches не создаются.
- [ ] `P-009` Force push, history rewrite, `git reset --hard`, broad checkout и global Docker prune запрещены.
- [ ] `P-010` Любой неизвестный dirty файл считается пользовательским и сохраняется до явного provenance решения.

### 0.2. Режим работы с подагентами

- [ ] `P-011` Координатор может делегировать только bounded read-only research или непересекающиеся implementation packs.
- [ ] `P-012` У manifest, lockfile, migration chain и release ledger одновременно ровно один writer.
- [ ] `P-013` Подагент не закрывает gate и не коммитит общий manifest без coordinator review.
- [ ] `P-014` Каждый результат подагента содержит exact input SHA, изменённые пути, команды, результаты и ограничения.
- [ ] `P-015` Координатор повторно запускает проверки подагента, а не принимает его summary на веру.
- [ ] `P-016` Параллельные destructive/data migrations запрещены.

### 0.3. Формат evidence каждого gate

Каждый gate создаёт в target repo каталог:

```text
docs/verification/greenfield/Gxx/
├─ gate.json
├─ gate.md
├─ commands.ndjson
├─ inputs.json
├─ outputs.json
├─ diff-summary.md
├─ rollback.md
├─ known-limitations.md
└─ checksums.sha256
```

- [ ] `P-017` `gate.json` валидируется versioned JSON Schema.
- [ ] `P-018` `commands.ndjson` хранит command, cwd, startedAt, finishedAt, exitCode и output artifact path; secrets редактируются.
- [ ] `P-019` `inputs.json` фиксирует reference SHA/release IDs, target parent SHA и toolchain.
- [ ] `P-020` `outputs.json` фиксирует target SHA, release IDs, migrations, images и generated contracts.
- [ ] `P-021` `gate.md` содержит objective, exact counts, PASS/FAIL, deviations и reviewer.
- [ ] `P-022` `rollback.md` содержит проверенную команду/процедуру, а не фразу «откатить Git».
- [ ] `P-023` Большие Playwright traces, videos, screenshots и DB dumps не коммитятся; в Git остаются manifests/hashes/ссылки на scoped artifact storage.
- [ ] `P-024` Verification-команды не переписывают уже tracked evidence молча.
- [ ] `P-025` После генерации evidence `git diff --check` проходит.

Минимальный `gate.json`:

```json
{
  "schemaVersion": "greenfield-gate.v1",
  "gate": "G00",
  "status": "PASS",
  "referenceSha": "<sha>",
  "targetParentSha": "<sha-or-null>",
  "targetSha": "<sha>",
  "commands": 0,
  "checks": { "passed": 0, "failed": 0, "skipped": 0 },
  "artifacts": [],
  "limitations": [],
  "rollbackRehearsed": true,
  "reviewer": "agent-coordinator"
}
```

### 0.4. Commit и push discipline

- [ ] `P-026` Перед gate: `git status --short`, `git branch --show-current`, `git rev-parse HEAD` сохранены.
- [ ] `P-027` В commit попадают только файлы текущего gate.
- [ ] `P-028` Один commit не смешивает version upgrade, domain migration, UI rewrite и content expansion.
- [ ] `P-029` Commit message начинается с gate: `feat(g04): …`, `fix(g04): …`, `docs(g04): …`.
- [ ] `P-030` Gate допускает 1–3 заранее перечисленных atomic commits; итоговый gate commit содержит evidence.
- [ ] `P-031` После commit повторяются быстрые checks и проверяется clean tree.
- [ ] `P-032` Push разрешён только fast-forward в `origin/main`; force push запрещён.
- [ ] `P-033` После push агент проверяет `origin/main == HEAD`.
- [ ] `P-034` Если remote ещё не утверждён, локальные commits разрешены, но G1 остаётся `FAIL`, а не «готово».
- [ ] `P-035` Release tags создаются только после соответствующего gate и никогда не перемещаются.

### 0.5. Универсальный test ladder

Каждый gate запускает релевантное подмножество, а G12 — всё:

- [ ] `P-036` format/lint/typecheck;
- [ ] `P-037` unit tests;
- [ ] `P-038` schema/policy tests;
- [ ] `P-039` React component and accessibility tests;
- [ ] `P-040` contract/provider-consumer tests;
- [ ] `P-041` PostgreSQL migration/integration tests;
- [ ] `P-042` Runtime conformance and adversarial tests;
- [ ] `P-043` 8–15 golden browser journeys, не сотни дублирующих Playwright scripts;
- [ ] `P-044` visual matrices RU/EN × light/dark × required viewports;
- [ ] `P-045` performance budgets;
- [ ] `P-046` dependency/security/supply-chain checks;
- [ ] `P-047` fresh-clone and backup/restore drills;
- [ ] `P-048` telemetry outage, dependency outage and recovery tests.

### 0.6. Немедленные STOP-условия

- [ ] `P-049` Нельзя определить владельца dirty changes в Reference Product.
- [ ] `P-050` Backup или restore drill не проходит.
- [ ] `P-051` Target path или remote уже существует и не доказано, что это тот же проект.
- [ ] `P-052` Требуется удалить/перезаписать unknown user data.
- [ ] `P-053` Hidden tests/source/prompts/secrets попали в API, log, trace или artifact.
- [ ] `P-054` Следующий gate требует silent fallback к legacy runtime/API.
- [ ] `P-055` Data counts/hashes расходятся и причина не записана как reviewed migration.
- [ ] `P-056` Агент не может воспроизвести собственный PASS из clean clone.

STOP означает: сохранить evidence, поставить `FAIL`, сделать безопасный commit
только если он не маскирует проблему, и передать владельцу точный blocker.

---

## 1. Неподвижные архитектурные решения

- [ ] `A-001` Новый продукт создаётся в отдельном clean Git repo, без импорта старых histories.
- [ ] `A-002` Старые histories сохраняются tags, bundles, SHA manifests и Port Ledger.
- [ ] `A-003` Core deployables: Next web, Nest platform API, Go Task Runtime trust zone.
- [ ] `A-004` Question Catalog сначала является изолированным Nest module за `QuestionCatalogPort`, не отдельным deployable.
- [ ] `A-005` Runtime execution остаётся отдельной trust/release boundary.
- [ ] `A-006` Next использует App Router и настоящий Node/server deployment; static export не является product runtime.
- [ ] `A-007` Server Components — default; Client Components только для browser interaction.
- [ ] `A-008` Browser вызывает только Next/Nest product boundary, не Brain/Runtime/DB напрямую.
- [ ] `A-009` PostgreSQL — authority для curriculum, content revisions, attempts, progress, evidence, projects и outbox с явным ownership.
- [ ] `A-010` `Run` и `Submit` — разные commands и разная evidence strength.
- [ ] `A-011` Deterministic Verdict создаёт только Task Runtime по exact released revision.
- [ ] `A-012` Navigator/LLM advisory-only и не создаёт verdict/mastery/unlock/release.
- [ ] `A-013` Content provenance/license/review обязательны для любого external import.
- [ ] `A-014` Payload, Redis, Kafka, Alloy, profiling и отдельные telemetry backends optional until measured need + ADR.
- [ ] `A-015` Один root Compose project на checkout; нет `container_name` и глобальных volume names.
- [ ] `A-016` Один pnpm lockfile; вложенные `.git` и JS lockfiles запрещены.
- [ ] `A-017` Shared package создаётся со второго consumer или для стабильного cross-process contract.
- [ ] `A-018` Папки `shared`, `common`, `utils`, `types` без owner запрещены.
- [ ] `A-019` Design tokens framework-neutral; shadcn используется как source registry, а не runtime magic.
- [ ] `A-020` RU/EN, light/dark, keyboard/a11y — release contract, не polish later.
- [ ] `A-021` Stack Control, Technical Telemetry и Learning Evidence — разные authority plane.
- [ ] `A-022` Default persisted local telemetry — один `grafana/otel-lgtm` profile.
- [ ] `A-023` Promtail не переносится; он EOL.
- [ ] `A-024` Kotlin/JVM telemetry использует OTel Java agent/autoconfigure, не experimental native Kotlin SDK.
- [ ] `A-025` Product claim проходит пять уровней: operational → curriculum → executable practice → proven mastery → interview benchmarked.
- [ ] `A-026` Старый продукт удаляется/архивируется только отдельным owner decision после G12.

---

## 2. Итоговое определение `DONE`

Ниже нет «желательных» пунктов. Все обязательны либо имеют approved
`not_applicable` с owner/reviewer и отдельным решением.

- [ ] `D-001` Новый private/public remote выбран владельцем, `origin/main` содержит всю target историю.
- [ ] `D-002` Fresh clone на пустой директории поднимается `pnpm dev`.
- [ ] `D-003` `pnpm dev` запускает один scoped Compose stack и выводит один непротиворечивый status.
- [ ] `D-004` `pnpm down` сохраняет durable data и удаляет scoped orphan resources.
- [ ] `D-005` `doctor/status/clean/data backup/restore/incident capture` имеют typed JSON output.
- [ ] `D-006` Reference Product всё ещё запускается из frozen snapshot.
- [ ] `D-007` Нет production fallback calls/symlinks/nested Git на Reference Product.
- [ ] `D-008` Все reference learner routes классифицированы `ported|replaced|retired(reason)`; unresolved = 0.
- [ ] `D-009` Next route/behavior/data/visual/a11y parity подписана по route manifest.
- [ ] `D-010` RU/EN и light/dark проходят visual/state matrices.
- [ ] `D-011` Runtime/language selector показывает только реально released compatible revisions.
- [ ] `D-012` Run/Submit/hidden-suite/security contracts проходят adversarial matrix.
- [ ] `D-013` Browser/LLM не может подделать verdict, evidence или mastery.
- [ ] `D-014` Question corpus, revisions, placements, graph, provenance и release hashes reconciled.
- [ ] `D-015` External import проходит license/provenance/dedupe/review/publish/readback.
- [ ] `D-016` PathCompletionManifest содержит exact stable IDs и role matrix по каждому production path.
- [ ] `D-017` Node, Java, Go, .NET, Kotlin, Python, React/Next, Algorithms, System Design и Behavioral имеют честный release status.
- [ ] `D-018` Ни один preview path не называется production-ready.
- [ ] `D-019` Learning Evidence переживает restart и backup/restore.
- [ ] `D-020` Cold repeat, unseen transfer и interview benchmark нельзя обойти time travel/self-grade.
- [ ] `D-021` Navigator имеет versioned ContextRevision, citations, eval corpus и privacy/redaction.
- [ ] `D-022` Observability profile даёт связанный trace Next→Nest→Runtime и не блокирует core при outage.
- [ ] `D-023` `StackSession` сохраняет failed preflight/startup/shutdown history.
- [ ] `D-024` Project-scoped retention/disk budget проверен под нагрузкой.
- [ ] `D-025` CI проходит test pyramid, supply-chain и full multi-language nightly/release matrix.
- [ ] `D-026` Browser artifacts находятся в CI/artifact storage, не раздувают Git.
- [ ] `D-027` SBOM, provenance, pinned actions/images и dependency review проходят.
- [ ] `D-028` Backup→restore и target→reference rollback реально отрепетированы.
- [ ] `D-029` G0–G12 имеют PASS evidence и clean commits.
- [ ] `D-030` Agent выставил `AWAITING_INDEPENDENT_REVIEW`, а не `DONE`.
- [ ] `D-031` Независимый Codex-аудит повторил проверки и владелец подписал human visual/learning flows.
- [ ] `D-032` Только после D-031 release получает `DONE` и immutable tag.

---

# G0 — Reference Safety и decision lock

## Цель

Сохранить текущий работающий продукт, данные и provenance до первого target
файла. G0 выполняется в Reference workspace; после PASS reference становится
read-only oracle.

### G0.1. Preflight и dirty-state triage

- [x] `G0-001` Проверить exact reference root через `git rev-parse --show-toplevel`.
- [x] `G0-002` Записать текущую дату, macOS/Docker/Compose/Node/pnpm/Go/Java/.NET versions.
- [x] `G0-003` Снять `git status --short` root и каждого вложенного source repo.
- [x] `G0-004` Снять remotes, default branches, HEAD SHA, tags и commit counts всех repos.
- [x] `G0-005` Классифицировать каждый dirty/untracked path: `owner`, `audit-produced`, `generated`, `unknown`.
- [x] `G0-006` Не stage и не удалять `unknown`.
- [x] `G0-007` Создать вне repo binary patch tracked changes и manifest untracked files.
- [x] `G0-008` Посчитать SHA-256 backup artifacts.
- [x] `G0-009` Проверить, что target path `/Users/sergeyzhechko/developer/fluent-interview-platform` не существует.
- [x] `G0-010` Проверить, что proposed remote ещё не существует.
- [x] `G0-011` Зафиксировать выбранный GitHub owner и canonical remote URL; не угадывать между `wood-bison` и `szhechko`.
- [x] `G0-012` Проверить `gh auth status` для выбранного owner.

### G0.2. Immutable Git/file safety

- [x] `G0-013` Зафиксировать source repos: root, Lab, Vue, Brain, Runtime, Vault.
- [x] `G0-014` Поставить уникальный immutable pre-greenfield tag на каждый clean committed HEAD.
- [x] `G0-015` Создать `git bundle --all` каждого repo в отдельной backup directory.
- [x] `G0-016` Выполнить `git bundle verify` 6/6.
- [x] `G0-017` Создать tracked file + mode + size + SHA-256 manifest 6/6.
- [x] `G0-018` Сохранить выборочные `git log --follow` baselines для domain/UI/runtime/content файлов.
- [x] `G0-019` Сохранить release IDs, image digests, schema versions и content hashes.
- [x] `G0-020` Сохранить Port Ledger skeleton со всеми known capabilities.
- [x] `G0-021` Проверить, что bundle и manifests восстанавливаются в disposable directory.

### G0.3. Data/release recovery

- [x] `G0-022` Сделать logical backup Lab PostgreSQL.
- [x] `G0-023` Сделать logical backup Brain PostgreSQL.
- [x] `G0-024` Сохранить durable volumes inventory и labels.
- [x] `G0-025` Сохранить current content/curriculum/task release bundles и checksums.
- [x] `G0-026` Сохранить hidden-suite inventory без раскрытия содержимого.
- [x] `G0-027` Восстановить оба DB backups в явно названные disposable project-scoped volumes.
- [x] `G0-028` Проверить migration/schema/table/count/hash probes после restore.
- [x] `G0-029` Удалить только disposable restore resources и доказать отсутствие leakage.
- [x] `G0-030` Сохранить restore timing и known incompatibilities.

### G0.4. Runnable reference baseline

- [x] `G0-031` Запустить Reference Product только канонической командой.
- [x] `G0-032` Проверить главную, Program, Atlas, Practice, Questions, Projects, Progress, Journal, Settings, Studio.
- [x] `G0-033` Сохранить route manifest и HTTP statuses всех learner routes.
- [x] `G0-034` Сохранить API surface/openapi/schema hashes.
- [x] `G0-035` Сохранить exact question/revision/placement/graph counts.
- [x] `G0-036` Сохранить task family/revision/runtime-profile counts и compatibility matrix.
- [x] `G0-037` Выполнить golden Node Run и Submit; сохранить public/redacted evidence.
- [x] `G0-038` Проверить JS/TS/Go/Java/.NET/Python selectors по фактической availability.
- [x] `G0-039` Снять visual baselines RU/EN × light/dark на 1440×900, 1728×1117 и 2560×1440.
- [x] `G0-040` Снять narrow 390×844 baseline как non-regression, даже если desktop primary.
- [x] `G0-041` Проверить keyboard traversal, focus, reduced motion и main landmarks.
- [x] `G0-042` Сохранить 4/4 Prometheus targets, W16 checks и shared trace baseline.
- [x] `G0-043` Выполнить scoped shutdown/startup и доказать сохранение progress/content.

### Gate G0

- [x] `G0-044` 6/6 bundles PASS.
- [x] `G0-045` 6/6 file manifests PASS.
- [x] `G0-046` 2/2 DB restore drills PASS.
- [x] `G0-047` Reference route/API/runtime/visual baselines имеют checksums.
- [x] `G0-048` Unknown dirty files не потеряны и не включены в чужой commit.
- [x] `G0-049` Remote owner/URL однозначно записан.
- [x] `G0-050` Reference commit: `docs(g0): freeze greenfield reference baseline`.
- [x] `G0-051` Immutable reference tag создан и push подтверждён.
- [x] `G0-052` `gate.json.status = PASS`.

---

# G1 — Новый remote, toolchain и architectural skeleton

## Цель

Создать пустой source-monorepo с одной историей, точным toolchain и запрещёнными
edges до переноса product code.

### G1.1. Repo bootstrap

- [x] `G1-001` Создать target directory только после G0 PASS.
- [x] `G1-002` `git init -b main`; проверить, что `.git` ровно один.
- [x] `G1-003` Создать выбранный remote как private по умолчанию, если owner не указал public.
- [x] `G1-004` Добавить `origin`; проверить fetch/push dry connectivity.
- [x] `G1-005` Создать README с product purpose, local-only boundary и status.
- [x] `G1-006` Добавить `CONTEXT.md`, ADR directory, security policy и contribution rules.
- [x] `G1-007` Добавить `AGENTS.md` с safety, gates и domain language.
- [x] `G1-008` Добавить `.editorconfig`, `.gitattributes`, `.gitignore`, secret patterns.
- [x] `G1-009` Запретить nested `.git`, extra lockfiles и generated evidence в Git.

### G1.2. Exact toolchain

- [x] `G1-010` Сверить официальные releases на дату выполнения; не использовать плавающий `latest`.
- [x] `G1-011` Зафиксировать production Node LTS и отдельные learning runtime lanes.
- [x] `G1-012` Зафиксировать exact pnpm, Nx, Next, React, TypeScript, Nest, Go, Java/.NET/Kotlin toolchains.
- [x] `G1-013` Сохранить источник и дату каждого version decision в `toolchain.lock.json`.
- [x] `G1-014` Один risky major upgrade = отдельный commit/gate amendment.
- [x] `G1-015` Настроить Corepack/frozen lockfile.
- [x] `G1-016` Создать root `package.json`, `pnpm-workspace.yaml`, `nx.json`, `tsconfig.base.json`.
- [x] `G1-017` Создать Go workspace только для Go-owned projects, без TS dependency cycles.

### G1.3. Target tree и boundaries

- [x] `G1-018` Создать `apps/web`, `apps/api`, `services/task-runtime` placeholders.
- [x] `G1-019` Создать `packages/contracts`, `clients`, `domain`, `data`, `ui`, `observability`, `testkit`.
- [x] `G1-020` Создать `content`, `infra`, `tools`, `docs` roots.
- [x] `G1-021` Ввести Nx tags `scope`, `type`, `owner`, `runtime`, `stability`.
- [x] `G1-022` Запретить domain→domain direct imports; orchestration только application layer.
- [x] `G1-023` Запретить UI→DB/Runtime internals.
- [x] `G1-024` Запретить contracts package содержать business policy/content.
- [x] `G1-025` Добавить intentionally failing fixtures и доказать, что boundary tests их ловят.
- [x] `G1-026` Добавить CODEOWNERS по bounded context.

### G1.4. CI bootstrap

- [x] `G1-027` Создать PR workflow: install, format, lint, typecheck, unit, boundary, secret scan.
- [x] `G1-028` Pin Actions к full commit SHA и минимальным permissions.
- [x] `G1-029` Добавить dependency review и CodeQL для relevant languages.
- [x] `G1-030` Добавить lock/generated drift checks.
- [x] `G1-031` Cache не содержит secrets, DB, hidden tests или browser recordings.
- [x] `G1-032` Remote cache не вводить без measured team need; local/Nx cache достаточно.

### Gate G1

- [x] `G1-033` Fresh clone install проходит frozen.
- [x] `G1-034` Nx graph строится и не имеет forbidden cycles.
- [x] `G1-035` Policy negative fixtures PASS.
- [x] `G1-036` Один `.git`, один pnpm lockfile, zero nested sources.
- [x] `G1-037` CI на `main` зелёный.
- [x] `G1-038` Commits: `build(g1): bootstrap greenfield platform workspace`; `ci(g1): establish policy gates`.
- [x] `G1-039` `origin/main == HEAD`.
- [x] `G1-040` `gate.json.status = PASS`.

---

# G2 — One-command stack, StackSession и local observability

## Цель

Сделать local lifecycle продуктовой capability до переноса UI/domain.

### G2.1. One Compose project

- [x] `G2-001` Создать один root `compose.yaml`.
- [x] `G2-002` `FLUENT_STACK_ID` уникален для checkout/worktree/CI.
- [x] `G2-003` Удалить `container_name` и explicit global volume names.
- [x] `G2-004` Core: web, api, runtime-control, PostgreSQL; optional profiles: observability, ai, labs, debug.
- [x] `G2-005` Web — единственный обязательный host port.
- [x] `G2-006` Healthchecks + `service_healthy`; приложения имеют retry/backoff.
- [x] `G2-007` Containers non-root, read-only root, tmpfs scratch, dropped capabilities и limits.
- [x] `G2-008` Durable/projection/cache/worker resources имеют owner/stack/kind/TTL labels.
- [x] `G2-009` Никакой core application service не получает Docker socket.

### G2.2. Lifecycle CLI

- [x] `G2-010` `pnpm doctor --json` read-only проверяет toolchain/Docker/ports/env/resources.
- [x] `G2-011` `pnpm dev` выполняет doctor → build/up --wait --remove-orphans → summary → watch.
- [x] `G2-012` `pnpm status --json` показывает ровно один stack ID и expected/observed resources.
- [x] `G2-013` `pnpm down` не использует `-v` и сохраняет durable data.
- [x] `G2-014` `pnpm clean:ephemeral --dry-run` показывает exact allowlist.
- [x] `G2-015` `--apply` удаляет только previewed stack-labeled set.
- [x] `G2-016` `pnpm data:backup|restore|reset --confirm` versioned и scoped.
- [x] `G2-017` Никогда не вызывать global prune/builder prune.
- [x] `G2-018` Fresh clone cold target и warm restart target измеряются и записываются.

### G2.3. StackSession и incident history

- [x] `G2-019` Создать schema `StackSession.v1`.
- [x] `G2-020` Session начинается до Postgres/Collector preflight.
- [x] `G2-021` Сохранять source/release/toolchain/expected resources.
- [x] `G2-022` Сохранять observed health transitions, migration/cache/volume state.
- [x] `G2-023` Сохранять shutdown/failure/cleanup result.
- [x] `G2-024` Append-only state имеет 90-day/100 MiB policy.
- [x] `G2-025` `doctor` ловит orphan containers/volumes/networks, missing labels, expired workers и drift.
- [x] `G2-026` `pnpm incident:capture --session` создаёт redacted checksummed bundle.
- [x] `G2-027` Failed preflight и failed startup имеют отдельные tested scenarios.

### G2.4. Technical telemetry

- [x] `G2-028` Создать vendor-neutral observability contract и forbidden-field list.
- [x] `G2-029` Использовать semantic service roles, не `prometheus|loki|jaeger` как domain enum.
- [x] `G2-030` Добавить один `grafana/otel-lgtm` observability profile с pinned digest и `/data` volume.
- [x] `G2-031` Promtail, отдельные Jaeger/Prometheus/Loki/Grafana не добавлять.
- [x] `G2-032` Alloy отсутствует до отдельного measured log-collection ADR.
- [x] `G2-033` Trace/metric exporter outage не влияет на readiness/verdict.
- [x] `G2-034` Structured stdout JSON имеет trace/span IDs и bounded Docker logging.
- [x] `G2-035` Next/Nest/Go skeleton trace проходит через OTLP.
- [x] `G2-036` Raw source/answers/prompts/hidden tests/secrets отсутствуют в telemetry.
- [x] `G2-037` Retention/disk budget проверяется `doctor`, общий target 6–8 GiB.

### Gate G2

- [x] `G2-038` Fresh clone `pnpm dev` PASS.
- [x] `G2-039` `status` не показывает одновременно противоречащие dev/package realities.
- [x] `G2-040` Start/stop/restart/failure sessions persisted.
- [x] `G2-041` Orphan/cache/schema/image drift negative tests PASS.
- [x] `G2-042` Telemetry off/on/outage journeys PASS.
- [x] `G2-043` Zero Fluent resources остаются после disposable stack test; durable test data сохранены где ожидается.
- [x] `G2-044` Commit: `feat(g2): establish deterministic local control and telemetry planes`.
- [x] `G2-045` `gate.json.status = PASS`.

---

# G3 — Next foundation, design system и settings

## Цель

Построить production Next shell, не пустой mock и не механическую копию Vue.

### G3.1. Next architecture

- [x] `G3-001` Next App Router и Node runtime настроены exact versions.
- [x] `G3-002` Server Components default; Client boundary inventory reviewable.
- [x] `G3-003` Route groups разделяют learner, Studio и operator surfaces.
- [x] `G3-004` Session/auth boundary не полагается на browser-supplied authority.
- [x] `G3-005` Server actions используются только там, где ownership и retry semantics ясны.
- [x] `G3-006` I/O boundaries валидируются generated Zod decoders; domain internals не оборачиваются Zod повсеместно.
- [x] `G3-007` Error/loading/not-found/empty/offline/degraded states существуют до feature pages.
- [x] `G3-008` `instrumentation.ts` и `onRequestError` подключены без browser leakage.

### G3.2. Fluent design system

- [x] `G3-009` Перенести primitive/semantic/component/motion tokens через Port Ledger.
- [x] `G3-010` Создать packages `ui/tokens`, `ui/primitives`, `ui/learning`, `ui/icons`.
- [x] `G3-011` Tailwind theme генерируется из tokens, не дублирует значения вручную.
- [x] `G3-012` shadcn используется как audited source registry; copied code принадлежит repo.
- [x] `G3-013` Radix/headless primitives не форкаются без причины.
- [x] `G3-014` Variant API типизирован, component anatomy документирована.
- [x] `G3-015` Instrument Glass/Liquid Glass применяется иерархично, без blur-on-everything.
- [x] `G3-016` Contrast, forced-colors, reduced-motion и transparency fallback PASS.
- [x] `G3-017` Custom icons имеют единый grid/stroke/fill и accessible naming.
- [x] `G3-018` Storybook/state catalog покрывает interactive states и long RU/EN copy.

### G3.3. Shell/settings

- [x] `G3-019` Port header, collapsible navigation, profile/settings, search/command palette.
- [x] `G3-020` Port RU/EN и light/dark/system preferences server-safely.
- [x] `G3-021` Нет hydration flash или theme mismatch.
- [x] `G3-022` Profile menu/popover позиционируется у trigger, а не случайно в центре.
- [x] `G3-023` Focus management, escape, outside click и keyboard loop корректны.
- [x] `G3-024` Navigation fully collapsed освобождает layout, а не только уменьшает ширину.
- [x] `G3-025` Scroll ownership определён для shell и каждой workbench page; body-lock только у modal.
- [x] `G3-026` Control Center route показывает StackSession projection, не vendor iframe как authority.

### Gate G3

- [x] `G3-027` Story/unit/component/a11y checks PASS.
- [x] `G3-028` Visual matrix 1440×900, 1728×1117, 2560×1440, 390×844 × RU/EN × themes PASS.
- [x] `G3-029` Keyboard-only shell journey PASS.
- [x] `G3-030` No horizontal clipping/overlap/scroll trap in required viewports.
- [x] `G3-031` Visual deltas against reference classified and signed, не скрыты threshold.
- [x] `G3-032` Commits: `feat(g3): establish Next application shell`; `feat(g3): port Fluent design system`.
- [x] `G3-033` `gate.json.status = PASS`.

---

# G4 — Program, TrackView, route registry и Atlas

## Цель

Перенести навигационную модель и граф, сохранив смысл и доступность.

### G4.1. Curriculum domain

- [x] `G4-001` Зафиксировать `TrackView`, `LearningModule`, `Lesson`, `QuestionPlacement`, `Activity`, readiness dimensions.
- [x] `G4-002` Создать provider-owned curriculum contracts и generated clients.
- [x] `G4-003` Route registry строится только из released curriculum projection.
- [x] `G4-004` Browser не выводит readiness по labels/title/task filenames.
- [x] `G4-005` Generic modules переиспользуются placement, а не copy/paste.
- [x] `G4-006` Path-specific forbidden-set policy предотвращает JVM в Node native, Node event loop в Java native и т.п.
- [x] `G4-007` Versioned prerequisites DAG валидируется на cycles/orphans/unreachable nodes.

### G4.2. Learner surfaces

- [x] `G4-008` Port Program landing с честными path statuses и denominators.
- [x] `G4-009` Port TrackView modules/lessons/checkpoints/progress.
- [x] `G4-010` Port Atlas graph с zoom/pan/fit/reset/minimap по evidence необходимости.
- [x] `G4-011` Node hit areas, label collision, zoom text scale и connector routing tested.
- [x] `G4-012` Atlas имеет semantic list/tree fallback и keyboard navigation.
- [x] `G4-013` Selected/current/ready/locked/mastered states визуально и семантически различимы.
- [x] `G4-014` Graph selection синхронизирует detail panel и URL.
- [x] `G4-015` Empty/partial/degraded release states объясняют причину и next action.

### G4.3. Reference parity

- [x] `G4-016` Frozen route manifest полностью классифицирован.
- [x] `G4-017` Каждый reference route имеет target URL/redirect/retired rationale.
- [x] `G4-018` 43-route baseline или его frozen successor reconciled 100%.
- [x] `G4-019` Deep links и browser back/forward PASS.
- [x] `G4-020` Program/Track/Atlas data parity сравнивается по IDs, не по тексту screenshot.

### Gate G4

- [x] `G4-021` DAG/cycle/orphan/relevance policy tests PASS.
- [x] `G4-022` Route manifest unresolved = 0.
- [x] `G4-023` Atlas desktop/narrow visual and interaction journeys PASS.
- [x] `G4-024` Accessibility list fallback даёт все действия графа.
- [x] `G4-025` Commits: `feat(g4): complete route registry and Atlas navigation`; `feat(g4): add provider-owned curriculum contracts`.
- [x] `G4-026` `gate.json.status = PASS`.

---

# G5 — Question Catalog, Lesson и content release

## Цель

Перенести знания без переноса dual authority и CMS topology.

### G5.1. Canonical content model

- [x] `G5-001` Определить schemas QuestionCard, semantic revision, translation, provenance, placement и review.
- [x] `G5-002` Question Catalog реализовать как Nest module за `QuestionCatalogPort`.
- [x] `G5-003` Не копировать Brain service boundary автоматически.
- [x] `G5-004` PostgreSQL migrations имеют expand/contract и rollback/recovery plan.
- [x] `G5-005` RU/EN — revisions одного semantic card, не разные learner items.
- [x] `G5-006` Primary Question отделён от Supporting Prompt и raw Brain row.
- [x] `G5-007` Theory card не рекламирует Open Lab без assessed Activity.
- [x] `G5-008` Answer layers: concise, understanding, mechanism, traps, follow-ups, evidence, sources.
- [x] `G5-009` Citation/provenance/license обязательны для publish.
- [x] `G5-010` Graph edges typed, reviewed, versioned и не выводятся из embedding автоматически.

### G5.2. Import и deterministic release

- [x] `G5-011` Создать read-only legacy importer по frozen release IDs.
- [x] `G5-012` Import идемпотентен и пишет quarantine вместо silent fallback.
- [ ] `G5-013` Reconcile all reference cards/revisions/placements/edges: imported|merged|quarantined|retired(reason).
- [ ] `G5-014` Duplicate resolution сохраняет provenance и supersession chain.
- [x] `G5-015` Release bundle использует canonical JSON, stable sort, sharded JSONL.zst, checksums и attestation.
- [x] `G5-016` Двойная сборка одного release даёт одинаковые logical hashes.
- [x] `G5-017` Большие media/sealed artifacts идут через `ArtifactStorePort`; local adapter project-scoped, S3 adapter optional.
- [x] `G5-018` Developer checkout materializes ignored Markdown; он не становится second authority.

### G5.3. Learner Lesson UI

- [x] `G5-019` Lesson показывает route context, primary question, supporting prompts и assessed activities.
- [x] `G5-020` Long RU/EN headings, code, tables, citations и callouts не ломают layout.
- [x] `G5-021` Конспект, practice, evidence и related graph имеют ясные отдельные actions.
- [x] `G5-022` Reveal/hint события persisted как Assistance Events, не mastery.
- [x] `G5-023` Search/filter results сохраняют path placement context.
- [x] `G5-024` Direct question URL не теряет Lesson/Track navigation.

### Gate G5

- [ ] `G5-025` Frozen content counts/hashes reconciled 100%; unexplained delta = 0.
- [x] `G5-026` Migration rollback + restore PASS.
- [x] `G5-027` Release double-build determinism PASS.
- [x] `G5-028` No raw prompt/answer/hidden content in telemetry.
- [x] `G5-029` Question/Lesson/search/graph browser journeys PASS RU/EN/themes.
- [x] `G5-030` Commit: `feat(g5): port governed question catalog and lesson releases`.
- [ ] `G5-031` `gate.json.status = PASS` — seed release gate is `PASS_WITH_LIMITATIONS`; full corpus reconciliation is G11.

> G5 note: the greenfield repository has a fully verified five-card seed slice.
> `G5-013`, `G5-014`, `G5-025` and the final `G5-031` remain open until the
> complete Brain/Vault corpus is reconciled with explicit supersession and zero
> unexplained delta. See `fluent-interview-platform/docs/verification/greenfield/G5/`.

---

# G6 — Golden Node Run и safe execution boundary

## Цель

Доказать первый полный executable slice без mastery.

### G6.1. Runtime port

- [x] `G6-001` Port exact Runtime contracts, manifests, digest/resource/sanitization primitives через Port Ledger.
- [ ] `G6-002` Разделить control API, sandbox supervisor и disposable workers.
- [x] `G6-003` Web/Nest/runtime-control не имеют Docker socket.
- [ ] `G6-004` Если local sandbox supervisor использует Docker API, он isolated, allowlisted, authenticated и отдельно threat-modeled.
- [x] `G6-005` Supervisor разрешает только pinned image, fixed command, one approved file и project-scoped runtime labels.
- [ ] `G6-006` Worker: network none by default, non-root, read-only root, tmpfs, caps drop, seccomp, pids/cpu/memory/time limits.
- [ ] `G6-007` Attempt/revision/stack/TTL labels обязательны; reconciler удаляет expired workers.
- [x] `G6-008` Host paths, arbitrary images/commands/env/secrets отклоняются.
- [x] `G6-009` Cancellation/timeout/crash/cleanup имеют typed results.
- [x] `G6-010` Runtime status перечисляет exact supported profiles/releases.

### G6.2. Run contract

- [x] `G6-011` `Run` использует public/starter feedback и не создаёт mastery.
- [x] `G6-012` Request содержит exact TaskFamily/TaskRevision/runtime profile/source digest.
- [x] `G6-013` Idempotency и retry semantics versioned.
- [x] `G6-014` Output sanitized, bounded, ordered и корректно различает compile/runtime/timeout/refusal.
- [x] `G6-015` Run сохраняет PredictionEvidence до reveal.
- [x] `G6-016` Run event и Technical Telemetry связаны trace/attempt IDs, не user labels.

### G6.3. Practice workbench

- [ ] `G6-017` Port CodeMirror/editor, terminal/output и task instructions как reusable learning components.
- [ ] `G6-018` Editor заполняет доступную высоту, resize/scroll ownership tested.
- [x] `G6-019` Language/runtime selector показывает только compatible released options.
- [ ] `G6-020` Node golden task предлагает JS/TS только если обе revisions реально существуют.
- [ ] `G6-021` Run, reset, hints, errors, loading/cancel/retry имеют ясные states.
- [ ] `G6-022` xterm/large editor chunks lazy-loaded; initial route budget соблюдён.
- [ ] `G6-023` Keyboard, screen-reader labels, focus after run и terminal fallback PASS.

### Gate G6

- [ ] `G6-024` Golden Node path→lesson→question→task→Run проходит fresh clone.
- [ ] `G6-025` Canonical/starter/malformed/compile/runtime/timeout/cancel/security vectors PASS.
- [x] `G6-026` Seeded wrong solutions действительно падают.
- [x] `G6-027` Run не создаёт accepted/mastery/unlock.
- [ ] `G6-028` Worker cleanup leaves zero expired containers/resources.
- [ ] `G6-029` Shared trace Next→Nest→Runtime→worker PASS.
- [x] `G6-030` Commit: `feat(g6): deliver safe golden Node run slice`.
- [ ] `G6-031` `gate.json.status = PASS`.

---

# G7 — Submit, hidden suites, verdict и Evidence

## Цель

Добавить authoritative assessment и доказать non-disclosure.

### G7.1. Submit contract

- [x] `G7-001` `Submit` — отдельный endpoint/command/schema/operation.
- [ ] `G7-002` Hidden suite хранится вне learner-readable image/mount/source tree.
- [ ] `G7-003` Runtime получает sealed suite только в execution trust zone.
- [x] `G7-004` Verdict связывает task/revision/profile/image/suite/rubric/source digests.
- [x] `G7-005` Result types: pass, fail, error, timeout, refused; learner fail ≠ platform error.
- [x] `G7-006` Retry/idempotency/replay policy не создаёт duplicate Evidence.
- [ ] `G7-007` Hidden suite canary ищется во всех API/log/trace/stdout/stderr/artifacts.
- [ ] `G7-008` Browser tampering/self-grade/LLM text не меняют verdict.

### G7.2. Evidence chain

- [ ] `G7-009` Prediction, Run, Submit, Explanation, Defense, Reflection и Repeat имеют отдельные evidence kinds.
- [x] `G7-010` Evidence references immutable revisions и evaluator policy.
- [x] `G7-011` Accepted executable evidence создаётся только из pass verdict.
- [ ] `G7-012` Explanation/defense требуют rubric/evaluator и не наследуют pass автоматически.
- [ ] `G7-013` Progress projection rebuildable из canonical events/evidence.
- [x] `G7-014` Replay не раскрывает forbidden content.
- [ ] `G7-015` Backup/restore сохраняет chain и hashes.

### G7.3. Learner UX

- [x] `G7-016` Run и Submit визуально различимы по intent/effect.
- [x] `G7-017` До Submit UI не обещает mastery.
- [x] `G7-018` Public feedback объясняет next action без hidden-test hints.
- [ ] `G7-019` Evidence drawer/journal показывает источник verdict и exact revision.
- [x] `G7-020` Failure recovery не теряет source/prediction.

### Gate G7

- [ ] `G7-021` Hidden canary leakage = 0 по всем surfaces.
- [ ] `G7-022` Submit adversarial/concurrency/idempotency matrix PASS.
- [ ] `G7-023` Evidence rebuild + backup/restore PASS.
- [ ] `G7-024` Browser authority forgery tests PASS.
- [x] `G7-025` Commit: `feat(g7): add authoritative submit verdict and evidence chain`.
- [ ] `G7-026` `gate.json.status = PASS` (остаётся `PASS_WITH_LIMITATIONS`: отдельная evaluator trust zone и полноценная evidence/rebuild цепочка впереди).

---

# G8 — Progress, mastery, revision, projects и observability labs

## Цель

Сделать обучение долговременным и связать теорию с инженерной практикой.

### G8.1. Progress/mastery model

- [x] `G8-001` Progress, completion, mastery и interview readiness остаются разными claims.
- [x] `G8-002` Mastery policy требует нужные evidence facets и versioned rubric.
- [x] `G8-003` Cold repeat назначается server-side через реальное окно времени.
- [x] `G8-004` Time travel/browser clock не закрывает repeat.
- [ ] `G8-005` Unseen transfer использует новую variant/context, не тот же fixture.
- [x] `G8-006` Hint/AI dependence сохраняется как AssistanceEvent и влияет на claim policy прозрачно.
- [x] `G8-007` Revision planner использует prerequisites, decay и failed concepts.
- [x] `G8-008` Learning history переживает telemetry deletion/restart.

### G8.2. Projects

- [ ] `G8-009` Port project books/milestones/rubrics/evidence links.
- [ ] `G8-010` Project milestone считается Activity только при persisted assessed evidence.
- [ ] `G8-011` Backend projects включают concurrency, data, messaging, resilience, deployment и observability.
- [ ] `G8-012` Frontend project включает Next architecture, performance, a11y, security и design system.
- [ ] `G8-013` System design project требует trade-off defense и failure drill.
- [ ] `G8-014` Reference repo/project links versioned и не становятся hidden fallback.

### G8.3. Observability как учебная поверхность

- [ ] `G8-015` Deep lab поддерживает Predict→Run→Observe→Explain→Defend→Repeat.
- [ ] `G8-016` Trace/log/metric evidence scoped по attempt и redacted.
- [ ] `G8-017` Создать incident activities: event loop, DB lock, retry storm, cache stampede, queue replay, GC/memory.
- [ ] `G8-018` Создать Go/Kotlin/JVM/.NET diagnostic scenarios по мере runtime availability.
- [ ] `G8-019` Learner не получает доступ к operator secrets/global logs.
- [ ] `G8-020` Telemetry outage не отменяет deterministic assessment.

### Gate G8

> Progress slice evidence: `fluent-interview-platform/docs/verification/greenfield/G8/`
> at target `5ba0af1` (`PASS_WITH_LIMITATIONS`). Project evidence,
> observability activities, backup/restore and the final G8 gate remain open.

- [ ] `G8-021` Progress rebuild, cold-repeat timing, unseen transfer and hint-dependence tests PASS.
- [ ] `G8-022` Project milestone evidence cannot be self-declared.
- [ ] `G8-023` Observability lab trace/log/metric correlation PASS.
- [ ] `G8-024` Data backup/restore сохраняет progress/mastery/revision/projects.
- [ ] `G8-025` Commit: `feat(g8): deliver durable mastery progress and project evidence`.
- [ ] `G8-026` `gate.json.status = PASS`.

---

# G9 — Navigator/Tutor Orchestrator

## Цель

Перенести локального AI-помощника как contextual action engine, а не глобальный чат.

### G9.1. Provider/settings

- [ ] `G9-001` Settings поддерживает LM Studio/OpenAI-compatible local endpoint и model discovery.
- [ ] `G9-002` Connection test проверяет endpoint/model/capabilities без сохранения secret в logs.
- [ ] `G9-003` Active model/provider config versioned и имеет explicit unavailable state.
- [ ] `G9-004` AI optional: core learning работает без модели.
- [ ] `G9-005` Spinner/stream/cancel/timeout/retry states честные.

### G9.2. Context and actions

- [ ] `G9-006` Каждый turn получает immutable server-owned ContextRevision.
- [ ] `G9-007` Context references exact track/lesson/question/task/attempt/evidence/rubric revisions.
- [ ] `G9-008` Browser summary не является authority.
- [ ] `G9-009` Actions typed: Socratic hint, misconception check, trace explainer, route planner, spoken coach, authoring proposal.
- [ ] `G9-010` Hint ladder раскрывает минимально необходимое и фиксирует reveal level.
- [ ] `G9-011` Ответы имеют citations/provenance на разрешённые sources.
- [ ] `G9-012` Navigator никогда не вызывает submit/verdict/mastery/unlock/publish напрямую.
- [ ] `G9-013` Tool allowlist, budgets и timeouts versioned.

### G9.3. Privacy/evals/observability

- [ ] `G9-014` Prompts/outputs/source/answers не экспортируются в OTel.
- [ ] `G9-015` Telemetry содержит provider/model/prompt-template hash/context hash/latency/tokens/status.
- [ ] `G9-016` Conversation retention и deletion policy explicit.
- [ ] `G9-017` Eval corpus покрывает helpfulness, grounding, leakage, over-reveal, authority refusal и RU/EN.
- [ ] `G9-018` Regression eval запускается при model/prompt/tool change.
- [ ] `G9-019` AI failure не меняет learner evidence.

### Gate G9

- [ ] `G9-020` Settings→connect→select→contextual help journey PASS.
- [ ] `G9-021` Stale/forged context rejected.
- [ ] `G9-022` Authority escalation/leakage evals PASS.
- [ ] `G9-023` No-model/offline/timeout UX PASS.
- [ ] `G9-024` Commit: `feat(g9): port contextual advisory Navigator`.
- [ ] `G9-025` `gate.json.status = PASS`.

---

# G10 — Content Studio, governed import и release operations

## Цель

Закрыть author→review→publish→release→readback без обязательного Payload.

### G10.1. Studio workflow

- [ ] `G10-001` Protected Next Studio работает через Nest application commands.
- [ ] `G10-002` Roles: author, reviewer, publisher; single-user local mode всё равно сохраняет явные decisions.
- [ ] `G10-003` Draft/version/review comments/localization/provenance modeled.
- [ ] `G10-004` Publish создаёт immutable revision, но learner видит только released placement bundle.
- [ ] `G10-005` Two-person rule configurable для external/high-risk content.
- [ ] `G10-006` Readback проверяет exact released IDs/hashes.
- [ ] `G10-007` Payload adapter отсутствует, пока не доказаны multi-editor/scheduling/autosave needs.

### G10.2. External ingestion

- [ ] `G10-008` Source snapshot, rights/license, acquisition date и reviewer обязательны.
- [ ] `G10-009` Paid portals используются для product-pattern research, не bulk copying без разрешения.
- [ ] `G10-010` Candidate проходит exact/fuzzy/semantic dedupe, но auto-merge запрещён.
- [ ] `G10-011` Import сохраняет source wording hash и transformed-original distinction.
- [ ] `G10-012` Research brief создаёт оригинальный high-signal content, а не close paraphrase.
- [ ] `G10-013` TaskCandidate должен стать typed Activity/TaskFamily или rejected(reason).
- [ ] `G10-014` Quarantine не считается production coverage.
- [ ] `G10-015` Agent import batches имеют bounded size и reviewer samples.

### G10.3. Release operations

- [ ] `G10-016` Outbox обеспечивает reliable projection без Kafka по умолчанию.
- [ ] `G10-017` Search/index/release projections rebuildable.
- [ ] `G10-018` Backup/restore включает revisions, provenance, placements, outbox и artifacts manifest.
- [ ] `G10-019` Rollback release не удаляет authored history.
- [ ] `G10-020` Redis/Kafka подключаются только после benchmark/ADR.

### Gate G10

- [ ] `G10-021` Real author→review→publish→release→readback journey PASS.
- [ ] `G10-022` Unauthorized publish/forged provenance/quarantine leakage tests PASS.
- [ ] `G10-023` Release deterministic double-build PASS.
- [ ] `G10-024` Rebuild projections from authority PASS.
- [ ] `G10-025` Commit: `feat(g10): deliver governed authoring and release pipeline`.
- [ ] `G10-026` `gate.json.status = PASS`.

---

# G11 — Полное curriculum/practice/portfolio closure

## Цель

Перенести весь Brain/Vault knowledge и довести пути до versioned production SLA,
не подменяя качество количеством.

### G11.0. Coverage policy

- [ ] `G11-001` Для technical core capability использовать role SLA: diagnostic, mechanism-basic, mechanism-advanced, predict/trace, edge, debug, trade-off, apply/design, evidence, defense.
- [ ] `G11-002` Для algorithms использовать concept, baseline, easy, medium, hard, proof, complexity, edge-test.
- [ ] `G11-003` 70 карточек на атомарную тему запрещены; quota относится к module/path coverage.
- [ ] `G11-004` Hard gates: mandatory roles, depth, locale, provenance, placement, practice, no quarantine.
- [ ] `G11-005` Core capability score ≥0.90 после hard gates; filler ради count запрещён.
- [ ] `G11-006` Shared cards переиспользуются placements; unique canonical count и path placement count публикуются отдельно.
- [ ] `G11-007` Primary Questions и Supporting Prompts считаются отдельно.
- [ ] `G11-008` PathCompletionManifest содержит exact IDs, release, denominator и policy version.
- [ ] `G11-009` Изменение quota требует versioned decision/migration note.
- [ ] `G11-010` Python/Kotlin/любая новая lane остаётся preview до полного собственного manifest.

### G11.1. Production target matrix

| Path | Capabilities / core placements | Primary / support | Activities | Projects / checkpoints |
| --- | ---: | ---: | ---: | ---: |
| Node.js + NestJS | 32 / 320 | 224 / 96 | 70 | 6 / 7 |
| Java + Spring | 32 / 320 | 224 / 96 | 70 | 6 / 7 |
| Go | 28 / 280 | 196 / 84 | 70 | 6 / 6 |
| .NET + C# | 28 / 280 | 196 / 84 | 70 | 6 / 6 |
| Kotlin + JVM | 28 / 280 | 196 / 84 | 70 | 6 / 6 |
| Python backend | 28 / 280 | 196 / 84 | 70 | 6 / 6 |
| React + Next.js + Web | 36 / 360 | 252 / 108 | 50 | 6 / 7 |
| Algorithms overlay | 15 families / 120 | 75 / 45 | 60 | 4 / 6 |
| System Design overlay | 50 / 500 | 350 / 150 | 50 | 6 / 7 |
| Behavioral overlay | 12 / 120 | 84 / 36 | 24 spoken | 6 / 5 |

Это **target placements**, а не требование написать 2 860 уникальных похожих
QuestionCards. Shared generic cards могут иметь reviewed placements в нескольких
paths; denominators и stable IDs обязаны объяснять переиспользование.

- [ ] `G11-011` Выпустить versioned policy, подтверждающий/корректирующий таблицу после exact G0/G5 inventory.
- [ ] `G11-012` Любая корректировка сохраняет минимум role/depth/practice SLA и owner rationale.

### G11.2. Corpus reconciliation

- [ ] `G11-013` Все Brain/Vault records классифицированы по canonical ID, capability, role, locale, provenance и disposition.
- [ ] `G11-014` Unmapped/unreviewed/quarantined counts публикуются, не исчезают.
- [ ] `G11-015` Generic content помещается в shared modules и получает path-specific prerequisites.
- [ ] `G11-016` Language-native content проходит forbidden-set tests.
- [ ] `G11-017` Missing-role ledger генерируется по stable IDs.
- [ ] `G11-018` Research/authoring packs закрывают gaps официальными sources и original explanations.
- [ ] `G11-019` Expert sample review по capability cluster обязателен.
- [ ] `G11-020` No production release по total count без role matrix.

### G11.3. Executable practice portfolio

- [ ] `G11-021` Big-Tech target: 168 TaskFamily и 456 runnable revisions подтверждён или versioned-adjusted после exact inventory.
- [ ] `G11-022` Shared algorithms/backend/SQL/infra families имеют compatible revisions, не копии family.
- [ ] `G11-023` Backend path: 12 algorithms + 12 shared backend + 16 native + 16 data + 8 infra + 6 project = 70 Activities.
- [ ] `G11-024` React/Next path: 12 algorithms + 20 React/Next/browser + 8 Web/API/security + 4 performance/a11y + 6 project = 50.
- [ ] `G11-025` System Design: 32 defense cases + 12 infra labs + 6 projects = 50.
- [ ] `G11-026` Critical capability имеет ≥2 independent scenarios; остальные core — ≥1 assessed Activity.
- [ ] `G11-027` Seeded wrong solutions проверяют tests, а не только happy path.
- [ ] `G11-028` Package-mode drills проходят по всем released runtimes.

### G11.4. Path-specific closure packs

- [ ] `G11-N01` Node: event loop/libuv/V8/streams/workers/ALS/Abort/timers/Buffer/GC/HTTP/process/diagnostics.
- [ ] `G11-N02` Nest: DI scopes/lifecycle/middleware/guards/pipes/interceptors/filters/validation/auth/transactions/testing/observability.
- [ ] `G11-N03` JS/TS runtime selector and 32 Lessons/70 Activities browser journey PASS.
- [ ] `G11-J01` Java: type system/generics/collections/errors/streams/I/O/JMM/locks/virtual threads/GC/classloading/diagnostics.
- [ ] `G11-J02` Spring: DI/proxies/transactions/MVC/validation/data/security/testing/observability.
- [ ] `G11-J03` Exact JVM runtime revisions and 32 Lessons/70 Activities journey PASS.
- [ ] `G11-G01` Go: types/interfaces/errors/slices/maps/goroutines/channels/context/race/sync/HTTP/pprof/escape/tooling.
- [ ] `G11-G02` Race/leak seeded scenarios fail correctly.
- [ ] `G11-G03` Exact Go revisions and 28 Lessons/70 Activities journey PASS.
- [ ] `G11-D01` .NET: C#/LINQ/CLR/memory/TAP/cancellation/Channels/ASP.NET/DI/EF/HttpClientFactory/Activity/diagnostics.
- [ ] `G11-D02` Cancellation/concurrency/disposal seeded scenarios fail correctly.
- [ ] `G11-D03` Exact .NET revisions and 28 Lessons/70 Activities journey PASS.
- [ ] `G11-K01` Kotlin: nullability/types/coroutines/Flow/channels/structured concurrency/collections/errors/JVM interop/testing.
- [ ] `G11-K02` Ktor/Spring Kotlin lane выбирается явно; framework-native cards не смешиваются.
- [ ] `G11-K03` Kotlin uses exact JVM/Kotlin runtime and Java-agent telemetry; 28 Lessons/70 Activities PASS.
- [ ] `G11-P01` Python: data model/types/asyncio/concurrency/memory/packaging/testing/FastAPI or selected backend framework/diagnostics.
- [ ] `G11-P02` GIL/async/process scenarios are Python-specific, not Node-derived.
- [ ] `G11-P03` Exact Python revisions and 28 Lessons/70 Activities PASS.
- [ ] `G11-F01` React/Next: browser/JS/TS/React rendering/state/effects/concurrency/RSC/caching/routing/forms/security/performance/a11y/testing/design system.
- [ ] `G11-F02` Vue/Angular historical content becomes Web shared, contrast, library-only or retired(reason); it does not masquerade as Next native.
- [ ] `G11-F03` 36 Lessons/50 Activities and real Next project journey PASS.
- [ ] `G11-A01` Algorithms cover 15 families, proof/complexity/edge roles and 60 runnable problems across released languages.
- [ ] `G11-S01` System Design covers 50 capabilities with design defense, capacity, consistency, reliability, security, data, messaging, operations and incident drills.
- [ ] `G11-B01` Behavioral covers project evidence, STAR/CAR, conflict, leadership, failure, ambiguity, impact and English spoken probes.

### G11.5. Learning quality and interview benchmark

- [ ] `G11-029` Lessons support worked example → faded steps → independent problem → self-explanation → interleaving → repeat.
- [ ] `G11-030` Retention measured at 7 and 30 days.
- [ ] `G11-031` Unseen variant success and hint dependence recorded.
- [ ] `G11-032` Timed coding rubric covers clarification, design, tests, edge cases, complexity and explanation.
- [ ] `G11-033` System-design rubric covers requirements, estimates, model, APIs, data, failure, trade-offs and operations.
- [ ] `G11-034` Incident rubric covers detection, hypothesis, evidence, mitigation, recovery and prevention.
- [ ] `G11-035` English defense rubric and recorded/mock workflow exist.
- [ ] `G11-036` Product does not claim interview readiness until human/external mock evidence exists.

### Gate G11

- [ ] `G11-037` Every production path manifest reaches approved targets with exact IDs.
- [ ] `G11-038` Every preview path is labeled preview with exact gaps.
- [ ] `G11-039` Unresolved corpus records = 0; quarantine remains explicit.
- [ ] `G11-040` Multi-language Runtime conformance PASS.
- [ ] `G11-041` Path relevance/forbidden-set matrix PASS.
- [ ] `G11-042` Full learner route→question→activity→evidence journey PASS per path.
- [ ] `G11-043` Commits are path/release scoped; no mega content dump without manifests/reviews.
- [ ] `G11-044` Final commit: `feat(g11): publish production curriculum and practice portfolio`.
- [ ] `G11-045` `gate.json.status = PASS`.

---

# G12 — Cutover rehearsal, release candidate и independent handoff

## Цель

Доказать новый продукт целиком, не удалить reference и передать независимому
ревьюеру проверяемый RC.

### G12.1. Full clean-room verification

- [ ] `G12-001` Создать brand-new clone из `origin/main` в disposable explicit path.
- [ ] `G12-002` Проверить exact toolchain/bootstrap instructions.
- [ ] `G12-003` Запустить только `pnpm dev`.
- [ ] `G12-004` Проверить `doctor/status` до/во время/после startup.
- [ ] `G12-005` Прокликать все routes/links/buttons/menus/dialogs/settings/deep links.
- [ ] `G12-006` Проверить every route RU/EN, light/dark/system, keyboard, required viewports.
- [ ] `G12-007` Проверить all API endpoints against generated contract.
- [ ] `G12-008` Проверить question/content/placement/release counts/hashes.
- [ ] `G12-009` Проверить Run/Submit/Evidence/Progress/Revision/Projects/Navigator/Studio.
- [ ] `G12-010` Проверить all released language/runtime drills.
- [ ] `G12-011` Проверить AI absent/offline/connected/stream/cancel/timeout states.
- [ ] `G12-012` Проверить observability off/on/outage и incident bundle.
- [ ] `G12-013` Проверить stop/restart/backup/restore/data persistence.
- [ ] `G12-014` Проверить clean shutdown и zero orphan resources.

### G12.2. Quality/security/supply chain

- [ ] `G12-015` Full format/lint/type/unit/component/contract/integration/browser suite PASS.
- [ ] `G12-016` Runtime adversarial/conformance matrix PASS.
- [ ] `G12-017` Hidden canary leak scan PASS.
- [ ] `G12-018` Auth/session/CSRF/XSS/SSRF/path traversal/command injection/secrets checks PASS.
- [ ] `G12-019` Dependency audit/CodeQL/SBOM/provenance/signature checks PASS.
- [ ] `G12-020` Performance budgets PASS per route; editor/xterm lazy loading confirmed.
- [ ] `G12-021` Accessibility WCAG checks plus keyboard/screen-reader human smoke PASS.
- [ ] `G12-022` Visual diff has zero unexplained P0/P1; intentional deltas documented.
- [ ] `G12-023` Telemetry cardinality/privacy/retention/load/disk-pressure tests PASS.
- [ ] `G12-024` CI required checks green on exact RC SHA.

### G12.3. Reconciliation and rollback

- [ ] `G12-025` Port Ledger entries all `ported|adapted|dropped(reason)`; planned/unresolved = 0.
- [ ] `G12-026` Route reconciliation unresolved = 0.
- [ ] `G12-027` Data/content/task/project/progress reconciliation unexplained delta = 0.
- [ ] `G12-028` Target backup restored in disposable stack and reverified.
- [ ] `G12-029` Target startup failure followed by Reference Product restart rehearsed.
- [ ] `G12-030` Reference Product needs no target service/data to run.
- [ ] `G12-031` Target needs no reference service/path/symlink to run.
- [ ] `G12-032` No legacy repo is deleted/archived by this gate.

### G12.4. Handoff package

- [ ] `G12-033` Создать RC manifest: repo URL, branch, HEAD SHA, image digests, schema/content/task releases.
- [ ] `G12-034` Создать final gate index G0–G12 with hashes and links.
- [ ] `G12-035` Список known limitations пуст либо каждое ограничение блокирует production claim.
- [ ] `G12-036` Создать reviewer runbook с одной командой и expected outputs.
- [ ] `G12-037` Создать owner visual/learning sign-off checklist.

### Gate G12

- [ ] `G12-038` Commit: `release(g12): prepare Fluent Interview Platform release candidate`.
- [ ] `G12-039` Push `main`; verify `origin/main == HEAD`.
- [ ] `G12-040` Создать immutable **RC tag**, не final production tag.
- [ ] `G12-041` `gate.json.status = AWAITING_INDEPENDENT_REVIEW`.
- [ ] `G12-042` Передать владельцу/Codex exact repo path, remote, SHA, tag, start command и evidence index.

### Что агенту запрещено писать после G12

Агент **не пишет** «всё готово», «production complete» или `DONE`. Допустимый
финальный текст:

> G0–G11 имеют PASS. G12 release candidate собран на `<sha>`, clean-room suite
> прошёл `<passed>/<total>`, unresolved limitations `<n>`. Статус:
> `AWAITING_INDEPENDENT_REVIEW`. Reference Product не удалён.

---

## 3. Независимая финальная проверка, которую выполнит Codex после агента

Этот раздел не закрывает implementing agent.

- [ ] `R-001` Сверить `origin/main`, RC tag и clean tree.
- [ ] `R-002` Проверить G0–G12 schemas, hashes, commands и отсутствие fabricated evidence.
- [ ] `R-003` Повторить fresh clone + `pnpm dev` без agent-local caches.
- [ ] `R-004` Повторить full route/link crawl и browser console/network audit.
- [ ] `R-005` Повторить RU/EN × light/dark × desktop/narrow visual review.
- [ ] `R-006` Повторить Run/Submit/hidden-canary/runtime-language matrix.
- [ ] `R-007` Повторить content/path/task/progress reconciliation.
- [ ] `R-008` Повторить backup/restore/rollback/orphan/cache/session tests.
- [ ] `R-009` Повторить observability/incident/privacy/cardinality tests.
- [ ] `R-010` Выполнить adversarial code/security review target diff/history.
- [ ] `R-011` Провести human learning session: answer, code, explanation, defense, reflection.
- [ ] `R-012` Провести реальный cold repeat через 48–72 часа без time travel.
- [ ] `R-013` Провести timed coding, system design, incident response и English defense mock.
- [ ] `R-014` Зафиксировать findings как P0–P3; P0/P1 должны быть исправлены и перепроверены.
- [ ] `R-015` Только после PASS создать final production tag и owner sign-off.
- [ ] `R-016` Решение об archive/delete старых repos принимается отдельным запросом владельца.

---

## 4. Короткий prompt для implementing agent

```text
Выполни документ
/Users/sergeyzhechko/developer/fluent-interview/docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md
строго по порядку G0→G12. Не пропускай пункты и не ставь PASS без machine-readable
evidence. Каждый gate закрывай atomic commit(s), clean-tree проверкой и fast-forward
push в main после PASS. Reference Product не удаляй, не используй как runtime
fallback и не перезаписывай unknown dirty files. При STOP-условии фиксируй FAIL и
точный blocker. После G12 не объявляй DONE: передай RC SHA/tag/evidence со статусом
AWAITING_INDEPENDENT_REVIEW для отдельной проверки Codex и владельца.
```
