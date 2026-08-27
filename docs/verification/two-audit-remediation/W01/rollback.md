# W01 rollback

The wave changed only the umbrella manifest/documentation and did not mutate
database data, Compose volumes or sibling repositories. To roll back the
manifest/documentation edits, restore the affected files from their Git diff
after review; do not reset child repositories or delete the historical sandbox
roots. No destructive rollback command was run.
