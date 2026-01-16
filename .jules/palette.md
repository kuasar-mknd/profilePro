
## 🎨 Interaction: Positive Validation Feedback (2025-02-18)
**Learning:** Users benefit from immediate positive reinforcement, not just error removal. Inline validation checkmarks provide "delight" and reduce anxiety.
**Action:** Use `data-visible` attributes for simple state toggling in CSS instead of complex class manipulation for visual feedback elements.

## 2024-07-18 - State-Predictive Labels
**Learning:** For toggle controls (like a theme switcher), the visible text label should describe the state the control will transition *to*, not its current state. This aligns the button's affordance with its action, making the UI more intuitive. For example, a theme switcher in light mode should display "Switch to Dark" (or an icon/label representing dark mode).
**Action:** When implementing toggle buttons, ensure all user-facing labels (aria-label, title, and visible text) are predictive of the resulting state.

## 2024-10-27 - Synchronized Accessibility State
**Learning:** When interactive components (like `ModeSwitch`) are rendered multiple times for responsive layouts (desktop/mobile), using IDs for `aria-live` regions causes duplicate ID violations and state desynchronization. One instance might update while the other remains stale, confusing screen reader users.
**Action:** Use class selectors (e.g., `.live-status`) for status regions and update all instances via `document.querySelectorAll()` to ensure every representation of the component reflects the current application state.
