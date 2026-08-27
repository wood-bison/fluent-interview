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

После аудита review-ветка `codex/content-ozon-go-first10-2026-08-24` была
fast-forward перенесена в локальный `main` без переписывания истории. Локальный
`main` сейчас содержит три контентных коммита сверх `origin/main`; удалённый
`origin/main` ещё не обновлён. Ветка review сохранена до отдельного решения об
удалении, чтобы не уничтожать историю без подтверждения.

## Что было исправлено

- `/Users/sergeyzhechko/developer/fluent-question-vault` перенесён в
  `fluent-interview/fluent-question-vault` без изменения `.git`, истории,
  веток или `origin`.
- `/Users/sergeyzhechko/developer/fluent-engineering-lab` оказался только
  старым `.nx/workspace-data/d/daemon.log`, без исходников и Git. Он перемещён
  обратимо в `/Users/sergeyzhechko/.Trash/fluent-engineering-lab-nx-2026-08-26`.
- В `workspace.yaml`, `README.md`, `AGENTS.md` и `scripts/status.sh` отражена
  новая пятирепозиторная топология.
- `pnpm layout:check` проверяет наличие пяти Git-root внутри workspace и
  отсутствие неразобранных соседних `fluent-*` каталогов на уровне
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
