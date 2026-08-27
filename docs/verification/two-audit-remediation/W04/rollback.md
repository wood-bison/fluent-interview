# W04 rollback

The wave rebuilt only owned Brain and Runtime service images and recreated
their containers through their scoped Compose projects. No named volume was
removed and no unrelated container, image or builder was touched.

If a reviewed tree must be reverted before commit, restore only the listed
Dockerfiles, launcher/check script, package scripts and evidence files from
the working-tree diff. Runtime data remains in the existing named volumes.
An exact image rollback is intentionally still open until a promoted package
contains a signed/recorded digest set and last-known-good boundary.

The mode guard is recoverable state under `.workspace/mode-lock`; normal
`pnpm down` releases it after the launcher and packaged process are stopped.
If a launcher crashed, only a lock whose recorded owner is gone and whose
learner endpoints are both offline may be reaped by the guard itself.
