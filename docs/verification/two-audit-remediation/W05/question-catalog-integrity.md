# Question catalogue integrity audit (W05)

Снимок: 2026-08-27T09:26:12.073Z
Статус: **PASS**

Read-only gate для опубликованной Question Brain learner projection. Дубликаты не сливаются автоматически: они попадают в editorial review queue с точным normalized prompt и стабильными ID.

## Сводка

- EN/RU: **1591/1591** карточек; ID только в EN: **0**, только в RU: **0**.
- Дубликаты normalized prompt: **2** обнаружено, **0** открыто; topic alias-группы: **3**.
- Структурных проблем: **0**; блокирующих: **0**.
- Digest: `6cc1df1d3049e591cae0b32ca723e10f1db64f369c232640db56da22f04e4c09`

## Checks

| Check | Status | Detail |
| --- | --- | --- |
| contractEn | pass | — |
| contractRu | pass | — |
| stableIdUniquenessEn | pass | — |
| stableIdUniquenessRu | pass | — |
| localeIdParity | pass | only_en=0 only_ru=0 |
| publishedEnums | pass | — |
| normalizedPromptUniqueness | pass | open_duplicate_groups=0; observed=2 |
| canonicalTopicAliases | review | alias_groups=3 |

## Editorial duplicate queue

Пусто: открытые normalized prompt collisions не найдены.

### Resolved duplicate decisions

- **question.c010, question.q195** — resolved:not_duplicate\n- **question.c004, question.q016** — resolved:keep_separate

## Topic aliases

- `distributed systems resilience`: “Distributed Systems & Resilience”, “Distributed Systems / Resilience” (22 cards)
- `go channels select`: “Go / Channels & Select”, “Go / Channels & select” (13 cards)
- `go sync patterns`: “Go / Sync & Patterns”, “Go / Sync Patterns” (12 cards)

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
API_URL=http://127.0.0.1:47000 pnpm question:catalog:integrity
API_URL=http://127.0.0.1:47000 pnpm question:catalog:integrity:check
```

