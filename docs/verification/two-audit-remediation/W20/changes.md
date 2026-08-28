# W20 — full release verification and E2E contract repair

Дата: 2026-08-28

## Что изменено

- В `fluent-engineering-vue` обновлены golden/smoke assertions после локализации
  execution-mode badge. UI уже честно показывает `Theory / puzzle` (EN) и
  `Теория / puzzle` (RU); тесты больше не требуют сырой enum-строки `theory`.
- Workspace pin переведён на Vue `667f462d0e905a4fd525d672e2ed7d4ae2b913f5`.
- Local production package безопасно обновлён через новый full-local backup;
  learner data сохранены.

## Почему это важно

Это не косметическое ослабление тестов: assertion теперь проверяет публичный
контракт интерфейса, включая локализацию, и одновременно сохраняет проверку
того, что фильтр действительно отдаёт theory projection.

## Наблюдение

В первом полном прогоне старые assertions дали 4 ложных падения (raw enum и
русская локаль). После исправления повторный прогон дал `92 passed` на
MacBook Pro и Studio Display профилях.
