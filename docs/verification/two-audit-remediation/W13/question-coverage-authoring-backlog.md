# Question coverage authoring backlog

Status: **OPEN**; productionReady: **false**
Question release: `question-release-d00a14931e607336`
Capability binding release: `question-capability-release-185232db4689818b`

Это answer-free очередь редакторской работы. Она не создаёт capability, role, prompt или ответ и не меняет опубликованный Question Brain release.

- Open items: **1513**; unique Brain questions: **1513**; repeated across paths: **0**.
- Bounded waves: **16**; batch size: **100**; auto-binding: **нет**; filler: **запрещён**.

## По путям

| Path | Capability review | Question-role review | Open items |
| --- | ---: | ---: | ---: |
| Node.js + TypeScript | 223 | 0 | 223 |
| Java + Spring | 191 | 0 | 191 |
| Go | 130 | 0 | 130 |
| .NET + C# | 74 | 0 | 74 |
| Frontend + Vue | 161 | 0 | 161 |
| Algorithms overlay | 52 | 0 | 52 |
| System Design overlay | 562 | 0 | 562 |
| Behavioral overlay | 103 | 0 | 103 |
| Python preview | 17 | 0 | 17 |

## Действия

- `review-capability-binding`: **1513**

## Правило закрытия

Каждый item закрывается только после editorial evidence, явного capability/role или disposition, нового immutable Brain release и повторной Lab projection. Один title match не является binding.

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm coverage:backlog
pnpm coverage:backlog:check
```

Stable content digest: `a06ff3b1787f7b9866b6abf6975a88109c1c67139278be9e99507d2579caeaf7`
