# W02 rollback

W02 changed only documentation and contract-test intent. No database, release,
Compose volume or learner state was changed. Before commit, rollback is limited
to restoring the root glossary/CONTEXT and the three additive ADR/index edits;
do not reset any child repository's unrelated remediation work.
