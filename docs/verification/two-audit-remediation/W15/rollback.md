# W15 rollback

Performance checks are read-only unless an operator explicitly passes
`--build`, which only regenerates the ignored Vue `dist` artifact. Revert a
consumer or build-config change only after the owner check; never delete
runtime images, evidence, lockfiles or Docker volumes to satisfy a budget.
