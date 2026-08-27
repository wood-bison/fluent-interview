# W16 rollback

1. Remove the root `observability` scripts and the `release-verify` static
   step if the gate must be reverted; no runtime data is mutated by the gate.
2. Revert the AI telemetry additions together with the matching call-site and
   unit-test changes; the persisted AI conversation/run schema is unchanged.
3. If first-run timing is rolled back, remove the optional
   `x-fel-session-started-at` header propagation and the bounded in-memory
   marker registry together; learner run contracts and persisted attempts stay
   unchanged.
4. Keep the `hiddenTests` forbidden-field entry even if the extra gate is
   reverted; it is a monotonic privacy tightening.
5. Do not stop or prune Docker services as part of rollback. If an optional
   collector profile was started manually, use the documented normal `pnpm
   down` lifecycle and preserve named volumes.
