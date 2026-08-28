# W18 changes — compact shell and question-catalog UX

## Implemented

- The shell now derives a reactive `railIsCollapsed` state from both the
  persisted preference and the 780px compact breakpoint. Hidden mobile labels,
  the contextual rail card, and the toggle's `aria-expanded` value therefore
  agree instead of rendering a clipped card with contradictory semantics.
- Compact navigation controls meet the 44px touch target and the topbar keeps
  the current route title visible after hiding the redundant desktop
  breadcrumb prefix.
- The Question Library keeps the full advanced server filter set expanded on
  desktop but starts it closed below 680px. The disclosure remains explicit and
  keyboard accessible.
- Search input is debounced by 240ms. A short typing burst now produces one
  released Question Brain request instead of one request per character, while
  the inline status announces an in-flight refresh next to the field.
- Learner-facing question metadata and state badges are localized for RU/EN;
  raw labels such as `Topic`, `Level`, `Runtime`, `Due`, `Weak` and
  `learning-ready` are no longer hard-coded in the Russian surface.
- The question-grid landmark has a localized accessible name and the duplicate
  pagination label was removed.

## Boundaries preserved

- No Question Brain, Lab, Runtime, learner progress, or graph data was changed.
- The package was promoted only after a fresh redacted backup and restore
  preflight. The Vue release is still local-only because no verified remote
  repository exists; no push or destructive cleanup was performed.
