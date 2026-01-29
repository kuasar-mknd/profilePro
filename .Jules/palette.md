## 2025-01-15 - Duplicate IDs in Reusable Components
**Learning:** Reusable components (like ModeSwitch) that use hardcoded IDs (e.g., for `aria-controls` or `aria-live` regions) cause invalid HTML and accessibility issues when instantiated multiple times (e.g., Desktop vs Mobile header).
**Action:** Always use class selectors (e.g., `.live-region`) and `document.querySelectorAll` inside component scripts to handle multiple instances gracefully.
