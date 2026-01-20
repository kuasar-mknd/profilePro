# Palette's Journal - UX & Accessibility Learnings

## 2025-02-23 - Pagination Layout Shifts
**Learning:** Removing pagination controls when unavailable (e.g., "Previous" on page 1) causes layout shifts and disorients users who expect consistent navigation placement.
**Action:** Always render pagination controls. Use disabled states (opacity, cursor, aria-disabled) for unavailable actions instead of removing them from the DOM.
