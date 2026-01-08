## 2024-05-22 - [Enhancing 404 Page Actions]
**Learning:** Users on error pages need clear, comforting navigation paths. Text-only buttons can feel colder/broken compared to icon-rich primary navigation. Adding icons (Home, Back) provides visual anchors that reduce cognitive load during a stress state (getting a 404).
**Action:** When designing error states or empty states, always couple action buttons with recognizable icons to signal functionality and maintain design system consistency.

## 2024-05-22 - [SecureLinks Accessibility Pattern]
**Learning:** When automating `target="_blank"` security in a global script, relying on `title` updates is insufficient for accessibility.
**Action:** The robust pattern is to check for an existing `aria-label` and append the warning there. If no `aria-label` exists, inject a `<span class="sr-only"> (warning)</span>` inside the anchor tag. This preserves the browser's native accessible name calculation (text content + alt text) while ensuring the warning is part of the name.

## 2024-05-23 - [Accessible Character Counters]
**Learning:** Visual-only character counters (e.g., "0 / 5000") exclude screen reader users. Updating a live region on every keystroke is too verbose.
**Action:** Implement a dual-feedback system: a visual counter for all users, coupled with a separate `aria-live="polite"` region that only announces at critical thresholds (e.g., >90% usage, 100% limit) or using a modulo (e.g., every 50 characters) to balance awareness with silence.
