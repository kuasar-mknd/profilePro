## 2024-05-22 - [Enhancing 404 Page Actions]
**Learning:** Users on error pages need clear, comforting navigation paths. Text-only buttons can feel colder/broken compared to icon-rich primary navigation. Adding icons (Home, Back) provides visual anchors that reduce cognitive load during a stress state (getting a 404).
**Action:** When designing error states or empty states, always couple action buttons with recognizable icons to signal functionality and maintain design system consistency.

## 2026-01-03 - [Reveal Contextual Hints on Focus]
**Learning:** Icon-only buttons with hover-only tooltips exclude keyboard users from critical context (like shortcuts "Esc" or labels "Lune"). "Delightful" details like expanding labels should be accessible to all users, not just mouse users.
**Action:** Always mirror `group-hover` effects with `group-focus-visible` for contextual hints and labels to ensure keyboard parity.
