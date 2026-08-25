# Capability mastery bundle v1

This additive cross-repository contract describes one production learning
unit. It does not replace the existing Question → Capability → Task identity
contract or `completion.v1`; it prevents the learner UI from deriving mastery
from a visit, a reveal, or an E2E run.

The golden fixture is a rate-limiter capability. It binds one published
Question Brain card to one released TaskFamily with language-specific
revisions, then describes a learner session that is `attempted`, not mastered.

## Six versioned records

| Record | Owner | Question answered |
| --- | --- | --- |
| `capability-dossier.v1` | Question Brain + Runtime join | Which active capability, primary card and released task family are joined? |
| `capability-assessment-plan.v1` | Lab policy | Which recall, prediction, run, explanation and delayed-repeat gates are required? |
| `learning-session.v1` | Lab | Which learner/profile selected which immutable card and task revision? |
| `capability-evidence.v2` | Lab + Runtime | What server-owned evidence was observed, with which provenance? |
| `capability-mastery.v2` | Lab projection | What gate is next? It never upgrades from a browser/LLM signal. |
| `session-reflection.v1` | Lab | What the learner recorded for the next review, without changing a verdict? |

## Five independent dimensions

Every session carries all five values. They are not one overloaded `locked`
boolean:

```text
access             open
contentReadiness   ready | partial | quarantined
activityKind       recall_only | brief_only | runnable | deferred
releaseReadiness   released | pending | incompatible
learnerState       unseen | attempted | explained | repeat_due | mastered
```

`runnable=true` is valid only for a released family/revision with a compatible
profile. A primary card must be published and contain both `en` and `ru`. The
registry identity must be active. A stale card or task hash, missing assessment
plan, inactive capability, non-human mastery provenance, wrong profile, or
contradictory release/runnable pair is rejected with a typed error.

## Golden fixture

`capability-mastery-bundle.v1.fixture.json` is the canonical shape. Copies in
each child repository are digest-checked by the workspace contract; they are
not independent content stores. The fixture is an attempted human session,
not evidence that Sergey has mastered rate limiting.

## Verification

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
./scripts/workspace-contract.sh check

cd fluent-engineering-lab
pnpm nx test lab-contracts --runInBand --testPathPatterns='capability-mastery-bundle'
cd ../fluent-question-brain && make check
cd ../fluent-task-runtime
docker run --rm -v "$PWD:/src" -w /src golang:1.24-bookworm go test ./contracts
```

Unsupported versions fail closed. Existing `completion.v1` remains a historical
completion/evidence reader; it cannot create a `capability-mastery.v2` record.
