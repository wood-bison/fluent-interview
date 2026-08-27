# Question coverage authoring backlog

Status: **OPEN**; productionReady: **false**
Question release: `question-release-d00a14931e607336`
Capability binding release: `question-capability-release-52e0e40e9fb286c1`

Это answer-free очередь редакторской работы. Она не создаёт capability, role, prompt или ответ и не меняет опубликованный Question Brain release.

- Open items: **1535**; unique Brain questions: **1535**; repeated across paths: **0**.
- Bounded waves: **16**; batch size: **100**; auto-binding: **нет**; filler: **запрещён**.

## По путям

| Path | Capability review | Question-role review | Open items |
| --- | ---: | ---: | ---: |
| Node.js + TypeScript | 245 | 0 | 245 |
| Java + Spring | 191 | 0 | 191 |
| Go | 130 | 0 | 130 |
| .NET + C# | 74 | 0 | 74 |
| Frontend + Vue | 161 | 0 | 161 |
| Algorithms overlay | 52 | 0 | 52 |
| System Design overlay | 562 | 0 | 562 |
| Behavioral overlay | 103 | 0 | 103 |
| Python preview | 17 | 0 | 17 |

## Действия

- `review-capability-binding`: **1535**

## Правило закрытия

Каждый item закрывается только после editorial evidence, явного capability/role или disposition, нового immutable Brain release и повторной Lab projection. Один title match не является binding.

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm coverage:backlog
pnpm coverage:backlog:check
```

Stable content digest: `baeef1ccf516c5dc685b4c96c95cc2a6b00e54aabe667845d4a15ae6ac626a95`
