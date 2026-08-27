# W12 findings

## Fixed

- `GET /api/learner/route-context` now returns a versioned, answer-free
  projection. The program, map, practice entry, question practice, lesson,
  controlled lab, exact Runtime lab, journal alias, and recovery routes all
  have deterministic family/phase/action results.
- `/practice` no longer inherits the current lab phase. A fresh practice entry
  is `overview` and offers only program/progress navigation.
- `revision` without its declared `taskFamily`, and a mismatched family/revision
  pair, are rejected into recovery rather than falling back to a different
  revision.
- Workspace and Run use the same exact identity; the Runtime adapter refuses a
  family or revision mismatch before execution.
- An external `returnTo` is dropped and flagged as rejected. No answer,
  solution, source id, or persistence id appears in the public projection.
- A released TaskFamily selection route is a first-class overview surface; it
  never advertises `run` before the learner chooses a language revision.
- Repeat-due state is covered by a contract test: the server adds `repeat`
  only when the mastery ladder has the required attempted + explained facts.
- The route gate's stable row digest is the snapshot boundary, and service/
  HTTP/Vue end-to-end suites preserve the legacy alias compatibility contract.
- Legacy Program/Map aliases now redirect to the canonical Vue routes while
  preserving query/hash state. A static guard rejects hard-coded Event Loop
  destinations in QuestionDetail/Lesson and the desktop browser suite covers
  the redirect behavior.

## Remaining debt

- The remaining hand-authored literals are route component definitions (for
  example the dedicated six-challenge Event Loop adapter), not learner CTA
  fallbacks. The canonical-route inventory/guard is complete; W12-025 (full
  Program projection release) remains open.
- Full route contract snapshots/backward-compatibility fixtures and the
  complete Program projection remain open.
- The aggregate development gate is green, but dirty source trees and the
  missing executable package provenance keep production promotion blocked.
