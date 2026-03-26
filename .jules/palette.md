## 2024-03-24 - Haptic Feedback Accessibility
**Learning:** Adding subtle haptic feedback (like `navigator.vibrate`) can improve tactile interactions, but not respecting a user's system preferences like `prefers-reduced-motion` can negatively impact those with sensory sensitivities.
**Action:** Always check `!window.matchMedia("(prefers-reduced-motion: reduce)").matches` alongside `navigator.vibrate` to ensure users opting out of motion/feedback aren't forced to experience it.
## 2024-03-25 - Haptic Feedback Accessibility II
**Learning:** Checking `!window.matchMedia("(prefers-reduced-motion: reduce)").matches` is crucial whenever providing haptic feedback. Failing to do so triggers vibration for users who specifically requested reduced motion in their OS, violating their accessibility preferences and potentially causing discomfort or distress for sensory-sensitive users.
**Action:** Consistently combine `navigator.vibrate` checks with `!window.matchMedia("(prefers-reduced-motion: reduce)").matches` to ensure haptic feedback is accessible. Used a cached query where possible in event listeners.

## 2026-03-26 - Keyboard Shortcut Hints on Mobile
**Learning:** Displaying keyboard shortcuts (like `(Shift+T)`) in tooltips or expanding labels adds unnecessary visual noise on mobile devices where physical keyboards are typically unavailable.
**Action:** When adding discoverable keyboard shortcuts via `<kbd>` tags within interactive labels, ensure they are hidden on smaller viewports using utility classes like `hidden sm:inline`.
