## 2024-05-22 - [Enhancing 404 Page Actions]
**Learning:** Users on error pages need clear, comforting navigation paths. Text-only buttons can feel colder/broken compared to icon-rich primary navigation. Adding icons (Home, Back) provides visual anchors that reduce cognitive load during a stress state (getting a 404).
**Action:** When designing error states or empty states, always couple action buttons with recognizable icons to signal functionality and maintain design system consistency.

## 2024-05-23 - [Micro-Feedback Consistency]
**Learning:** Redundant `title` attributes on icon-only buttons or complex interactive elements (like stretched links) provide a necessary fallback for mouse users who rely on tooltips, matching the experience provided to screen reader users via `aria-label`.
**Action:** Always pair `aria-label` with a matching `title` attribute for icon-only interactive elements to support "Micro-Guidance".
