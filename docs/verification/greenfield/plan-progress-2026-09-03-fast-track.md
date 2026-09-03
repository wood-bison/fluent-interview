# G11 fast-track execution decision

Дата: 3 сентября 2026

## Почему меняется процесс

Повторный полный test/evidence ladder для каждого небольшого checkbox тратил
больше времени, чем разработка learner functionality. Формальный остаток `463`
также смешивал реальные продуктовые задачи, постоянные правила, финальную
requalification и запрещённое decommission.

## Новый рабочий denominator

- Product closure: `66`.
- Requalification + independent review после продукта: `55`.
- Decommission, требующий отдельной авторизации: `150` — сейчас исключён.
- Standing policy: `192` — применяется постоянно и не исполняется как backlog.

## Новый цикл

`реализация крупной волны → live app + browser walkthrough → один обязательный
pre-commit ladder → один commit → progress update`.

Новые synthetic test/evidence harnesses не создаются ради отдельного checkbox.
Полный ladder остаётся только один раз на границе фазы, потому что target
`AGENTS.md` требует его перед commit. Следующая волна начинается с `G11-029`.
