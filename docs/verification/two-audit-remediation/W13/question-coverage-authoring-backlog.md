# Question coverage authoring backlog

Status: **OPEN**; productionReady: **false**
Question release: `question-release-d00a14931e607336`
Capability binding release: `question-capability-release-6aed990a298ef65b`

Это answer-free очередь редакторской работы. Она не создаёт capability, role, prompt или ответ и не меняет опубликованный Question Brain release.

- Open items: **1479**; unique Brain questions: **1479**; repeated across paths: **0**.
- Bounded waves: **15**; batch size: **100**; auto-binding: **нет**; filler: **запрещён**.

## По путям

| Path | Capability review | Question-role review | Open items |
| --- | ---: | ---: | ---: |
| Node.js + TypeScript | 203 | 0 | 203 |
| Java + Spring | 191 | 0 | 191 |
| Go | 130 | 0 | 130 |
| .NET + C# | 60 | 0 | 60 |
| Frontend + Vue | 161 | 0 | 161 |
| Algorithms overlay | 52 | 0 | 52 |
| System Design overlay | 562 | 0 | 562 |
| Behavioral overlay | 103 | 0 | 103 |
| Python preview | 17 | 0 | 17 |

## Действия

- `review-capability-binding`: **1479**

## Правило закрытия

Каждый item закрывается только после editorial evidence, явного capability/role или disposition, нового immutable Brain release и повторной Lab projection. Один title match не является binding.

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm coverage:backlog
pnpm coverage:backlog:check
```

Stable content digest: `7254dd72163d99fcd3bab00b7788a4d9433e5b70317719b318011bd65e8b7f0c`
