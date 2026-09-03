# Greenfield plan progress — 2026-09-03 — readiness write policy

Снимок выполнен после четырёх локальных commits target-проекта
`/Users/sergeyzhechko/developer/fluent-interview-platform`:

- `a6df0d7 fix(check): keep readiness verification read-only`;
- `c70baf5 chore(evidence): sync historical index after readiness fix`;
- `b1a5fc4 test(readiness): guard full working tree writes`.
- `289f1e3 test(readiness): report per-command write violations`.

Push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes, caches и данные не удалялись.

## Что исправлено

До этой фазы `pnpm test` запускал readiness-генераторы с путями к tracked
отчётам. Команда могла завершиться зелёной, но изменить десять JSON-файлов
evidence; следующий `pnpm check` тогда видел устаревший
`evidence-index.v1.json` и падал на drift. Это был дефект воспроизводимости
проверок, а не сигнал о новом product content.

Теперь:

- `pnpm test` экспортирует `READINESS_WRITE=0`;
- все десять readiness-генераторов и R14 пропускают запись отчёта в этом
  режиме, сохраняя вычисление и проверки read-only;
- добавлен `tools/dev/test/readiness-write-policy.test.mjs`: он запускает все
  десять команд с `READINESS_WRITE=0` и сравнивает SHA-256 tracked reports до и
  после запуска;
- regression-тест дополнительно снимает SHA-256 всего `git ls-files` и точный
  `git status --porcelain=v1 -z`, поэтому переписывание любого tracked-файла,
  удаление tracked-файла или создание побочного working-tree артефакта будет
  обнаружено;
- после каждой из десяти команд тест сравнивает porcelain-status с исходным и
  сообщает имя конкретной команды, если она оставила изменения;
- явная пересборка evidence по-прежнему возможна отдельной командой
  `g10s-evidence-schema --write-index`, а index после неё синхронизирован
  отдельным commit `c70baf5`.

Таким образом, проверочный pipeline больше не имеет скрытого побочного
изменения tracked evidence, а write-path остаётся явным и обозримым.

## Проверки

- `pnpm test:readiness-write-policy` — **1/1 PASS**;
- полный target `pnpm check` — **rc=0**, lint/typecheck/build и content,
  runtime, security, architecture gates зелёные;
- `pnpm architecture:gate-228` — **4/4 PASS**;
- `pnpm test:gate-228` — **3/3 PASS**;
- `pnpm architecture:g11-mass-import-boundary` — **PASS**;
- `pnpm architecture:evidence-schema` — **726/726 historical records PASS**;
- `pnpm architecture:evidence-inputs` — **8/8 PASS**;
- `pnpm boundary:check`, `pnpm toolchain:check`, `pnpm git diff --check` —
  **PASS**;
- target clean после commits `a6df0d7`, `c70baf5`, `b1a5fc4` и `289f1e3`;
  полный `pnpm check` на чистом `b1a5fc4` завершился `rc=0`, а post-commit
  read-only suite на `289f1e3` — **1/1 PASS**; G10S-226
  подтвердил `target.clean=true`.

## Что это не закрывает

Счётчики master-plan намеренно не изменены: это hardening машинной
воспроизводимости, а не authoring или production promotion. По-прежнему
остаются G11 breadth/content (1 597 unresolved records), 12 owner dispositions
G12.3, G12.2 remote attestation после сброса Actions quota, G12.5 human
requalification и independent review/sign-off. G13 decommission старых
репозиториев, сущностей, Docker containers/volumes, caches и данных запрещён
без новой явной авторизации владельца.

## Следующий порядок

1. Закрывать G11.2 classification/authoring/review bounded batches, затем
   G11.3–G11.6 path and learning breadth.
2. Получить 12 owner dispositions, связать их с 71 state evidence и пересобрать
   G12.3 manifest на свежем target SHA.
3. После сброса quota создать согласованный immutable RC и durable remote
   attestation для G12.2.
4. Выполнить G12.5 human requalification, independent review и production
   sign-off.
5. G13 cleanup/decommission не начинать без новой явной авторизации владельца.

## Счётчики

Последний подтверждённый snapshot сохраняет следующие значения:

| Срез | Закрыто | Осталось | Всего |
| --- | ---: | ---: | ---: |
| Формальный master-plan | 664 | 470 | 1 134 |
| Исполнимые gates/checks | 664 | 278 | 942 |
| Неразрушающее закрытие продукта | 664 | 128 | 792 |
| ↳ текущий product closure | 664 | 73 | 737 |
| ↳ requalification + independent review | 0 | 55 | 55 |
| G13 decommission (отложен владельцем) | 0 | 150 | 150 |

Эта фаза не уменьшила `470`: она сделала следующий прогон плана
детерминированным и fail-safe.

Дата: 3 сентября 2026
