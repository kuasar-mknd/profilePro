## 2024-05-22 - [Enhancing 404 Page Actions]
**Learning:** Users on error pages need clear, comforting navigation paths. Text-only buttons can feel colder/broken compared to icon-rich primary navigation. Adding icons (Home, Back) provides visual anchors that reduce cognitive load during a stress state (getting a 404).
**Action:** When designing error states or empty states, always couple action buttons with recognizable icons to signal functionality and maintain design system consistency.

## 2024-05-23 - [Accessible Character Counters]
**Learning:** Visual-only character counters (e.g., "0 / 5000") exclude screen reader users from knowing when they approach a limit. Updating a live region on every keystroke is too verbose.
**Action:** Implement a dual-feedback system: a visual counter that updates continuously, coupled with a separate `aria-live="polite"` region that only announces critical thresholds (e.g., Warning at 90%, Limit at 100%) to balance awareness with silence.
