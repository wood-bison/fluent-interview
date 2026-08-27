# W03 rollback

W03 changes are limited to workflow definitions, root verification scripts,
package aliases, a typed test fixture and generated evidence. No Question
Brain, Runtime or learner data was mutated.

To roll back safely, restore only the W03-owned workflow/script/package/evidence
files from the reviewed diff. Do not reset a child repository or delete Docker
volumes. The aggregate gate can be rerun immediately after a selective revert.
