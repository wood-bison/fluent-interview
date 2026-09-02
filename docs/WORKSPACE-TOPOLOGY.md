# Fluent Interview workspace topology

Baseline проверен 26 августа; remediation-состояние обновлено 27 августа
2026 года. Канонический корень всех активных частей
продукта:

```text
/Users/sergeyzhechko/developer/fluent-interview/
```

## Активные репозитории

Каждый каталог ниже — самостоятельный Git-root со своей историей, remote и
release-политикой. Корневой репозиторий `fluent-interview` только координирует
запуск, контракты, документацию и проверку топологии.

| Каталог | Роль | Git/remote |
| --- | --- | --- |
| `fluent-engineering-lab/` | NestJS API, curriculum projection, progress/evidence | `ai-fluent-engineering-lab.git` |
| `fluent-engineering-vue/` | единственный learner/operator UI на Vue + Vite | **origin не настроен (P0 open)** |
| `fluent-question-brain/` | canonical questions, graph, releases, search | `fluent-question-brain.git` |
| `fluent-task-runtime/` | task revisions, sandboxes, hidden tests, traces | `fluent-task-runtime.git` |
| `fluent-question-vault/` | versioned mirror Obsidian-карточек для истории | `szhechko/fluent-question-vault.git` |

`fluent-question-vault` не является вторым Question Brain и не подключается к
learner API. Источник редактирования — Obsidian; зеркало обновляется через
контентный workflow Lab. Это важное разделение, чтобы случайно не создать
второй каталог вопросов.

## Объявленная greenfield-цель миграции

`/Users/sergeyzhechko/developer/fluent-interview-platform/` — отдельный Git-root
для greenfield-перехода на Next.js, описанный в активном мастер-плане. Это не
шестой runtime-репозиторий и не дополнительный Compose-проект: до закрытия
`G10S-246` он остаётся подготовительной target-поверхностью и не становится
источником learner serving. Его ветка — локальный `main`; релизные claims,
содержащиеся в нём, действуют только после явного owner acceptance и
requalification.

`pnpm layout:check` разрешает только этот один внешний sibling по точному имени
и проверяет у него `.git`, `AGENTS.md` и `package.json`. Любой другой
`fluent-*` каталог под `developer/` по-прежнему считается неразобранным
мусором и останавливает проверку. Если greenfield-цель будет принята в
production-топологию, этот раздел и allowlist должны быть пересмотрены одним
сцепленным ADR/plan-изменением, а не молча превращены в шестой runtime-root.

После аудита review-ветка `codex/content-ozon-go-first10-2026-08-24` была
fast-forward перенесена в локальный `main` без переписывания истории. Локальный
`main` содержит три контентных коммита сверх `origin/main`; удалённый
`origin/main` ещё не обновлён. Все четыре локальные review-ветки были удалены
после проверки `git branch --merged main`: их коммиты полностью достижимы из
`main`. Удалённый `origin/codex/content-ozon-go-first10-2026-08-24` сохранён
до отдельной авторизации на удалённое удаление.

## Что было исправлено

- `/Users/sergeyzhechko/developer/fluent-question-vault` перенесён в
  `fluent-interview/fluent-question-vault` без изменения `.git`, истории,
  веток или `origin`.
- `/Users/sergeyzhechko/developer/fluent-engineering-lab` оказался только
  старым `.nx/workspace-data/d/daemon.log`, без исходников и Git. Он перемещён
  обратимо в `/Users/sergeyzhechko/.Trash/fluent-engineering-lab-nx-2026-08-26`.
- В `workspace.yaml`, `README.md`, `AGENTS.md` и `scripts/status.sh` отражена
  новая пятирепозиторная топология.
- `pnpm layout:check` проверяет наличие пяти Git-root внутри workspace,
  валидирует объявленный внешний greenfield-target и блокирует все остальные
  неразобранные соседние `fluent-*` каталоги на уровне
  `/Users/sergeyzhechko/developer`.

После baseline в Lab/umbrella/Vue/Brain/Runtime есть ожидаемые незакоммиченные
remediation-изменения. `layout:check` намеренно не считает dirty state ошибкой:
он проверяет топологию, а публикация каждого child revision остаётся отдельным
release шагом. До появления remote для Vue и чистых деревьев всех пяти roots workspace
не является clean-clone/release-ready.

## Исторические sandbox-проекты

Следующие каталоги намеренно не входят в активный workspace и не были
перемещены: это отдельные исторические приложения с собственными remote и
инструкциями, а не рабочие части текущего продукта.

- `developer/sandbox/fluent-engineering-lab` — ранний Nest/coach-прототип;
- `developer/sandbox/fluent-interview-studio` — замороженный SwiftUI SRS-player;
- `developer/sandbox/fluent-prompt-studio` — отдельный native prompt workbench.

Если любой из них снова станет частью production-платформы, его нужно сначала
принять в этот манифест с решением о границе и переносом без потери Git-истории;
до этого он остаётся историческим sandbox, а не «левой» активной копией.

## Проверка

Из корня workspace:

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm layout:check
pnpm verify:git:dev
pnpm status
```

Для полного read-only прогона learner-поверхности используй
`pnpm release:verify:dev`. Он сохраняет машинный результат через
`--out=docs/verification/release-verify-dev-YYYY-MM-DD.json`. Строгий
`pnpm release:verify` требует remote-backed SHA pins и чистые деревья всех
пяти репозиториев; пока Vue остаётся `local-only`, это ожидаемый fail-closed
результат, а не повод ослаблять проверку.
