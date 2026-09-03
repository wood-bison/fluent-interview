# Greenfield plan progress — 2026-09-03 — G10S-246 CLI defaults

Эта bounded-волна исправила только developer-tooling вокруг G10S-246. Старые
репозитории, сущности, Docker containers/volumes, caches и данные не удалялись;
push не выполнялся из-за лимита GitHub Actions.

## Что изменено

Target `/Users/sergeyzhechko/developer/fluent-interview-platform` получил
локальный commit `abad458` (`fix(g10s): make revalidation CLI use canonical
defaults`). Команда `pnpm architecture:gate-246-revalidation` теперь:

- запускается без аргументов на четырёх канонических G10S-246 входах;
- печатает JSON-результат и явно сообщает `inputMode=canonical-defaults`;
- принимает полный явный набор из четырёх входов и необязательного output path;
- отклоняет неполные override с Usage и не пишет файл по умолчанию;
- сохраняет fail-closed поведение при drift reviewed packet/current `main`.

Добавлены тесты для default/explicit path resolution и частичного override.
Это не меняет content, provenance, release pointers, serving rows или learner
state и не является owner acceptance либо promotion.

## Проверки и честная граница

- фазовая цепочка перед commit: `pnpm check` — **rc=0**;
  `pnpm boundary:check`, `pnpm toolchain:check`, `git diff --check` — **PASS**;
- focused `pnpm test:gate-246-revalidation` — **5/5 PASS**;
- после commit default `pnpm architecture:gate-246-revalidation` — ожидаемый
  **FAIL**: reviewed packet head `008703c…` не совпадает с текущим `main`
  `abad458…`;
- `pnpm architecture:gate-246` — `AWAITING_OWNER`, все machine checks PASS,
  promotion `BLOCKED_BY_OWNER`; это не production-ready claim;
- target `main` чистый и локально опережает `origin/main` на **557** коммитов;
  push намеренно пропущен.

G10S-246 остаётся закрыт только для прежнего reviewed snapshot. Для текущей
ветки следующий обязательный шаг — новая current-main revalidation с актуальным
packet/decision-set; до неё 1 597 PREP_ONLY записей в 80 пакетах остаются
заблокированными. Этот коммит не закрывает master-plan checkbox и не меняет
счётчики:

| Срез | Закрыто | Осталось | Всего |
| --- | ---: | ---: | ---: |
| Формальный master-plan | 664 | 470 | 1 134 |
| Исполнимые gates/checks | 664 | 278 | 942 |
| Неразрушающее закрытие продукта | 664 | 128 | 792 |

Execution — **70,49%**, non-destructive closure — **83,84%**. После
current-main revalidation порядок остаётся: один bounded `G11-P001`
human authoring/review → G11.2–G11.6 → G12.3/G12.2 → immutable RC/remote
attestation → G12.5 и independent sign-off. G13 cleanup по-прежнему требует
отдельной явной авторизации владельца.

Дата: 3 сентября 2026
