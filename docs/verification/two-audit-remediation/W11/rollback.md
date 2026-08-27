# W11 rollback

The runtime binding gate is read-only. Rollback is removing its release-gate
step and returning to the prior runtime checks; keep the evidence and release
pins. Do not alter Runtime images, task rows or Brain bindings as part of this
rollback.
