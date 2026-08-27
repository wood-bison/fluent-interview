# W17 rollback

1. Remove the root `validation:matrix`/`verify:routes` scripts and the
   `release-verify` integration if the gate is reverted.
2. Delete only the generated W17 evidence artifacts; the gate performs no
   writes to learner data, Brain, Runtime or Docker.
3. Do not stop, prune, reset or recreate any service as part of rollback.
