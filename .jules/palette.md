## 2025-02-19 - Semantic Switch & Event Cleanup
**Learning:** For binary settings like Dark Mode, `role="switch"` with `aria-checked` is semantically clearer than toggle buttons with predictive labels, as it explicitly announces the current state. Also, in Astro View Transitions, global event listeners (window/document) MUST be cleaned up using a module-level variable before re-initialization to prevent memory leaks and duplicate execution.
**Action:** Use `role="switch"` for settings toggles and implement strict cleanup patterns for global listeners in `astro:page-load` scripts.

## 🎨 Interaction: Positive Validation Feedback (2025-02-18)
**Learning:** Users benefit from immediate positive reinforcement, not just error removal. Inline validation checkmarks provide "delight" and reduce anxiety.
**Action:** Use `data-visible` attributes for simple state toggling in CSS instead of complex class manipulation for visual feedback elements.

## 2024-07-18 - State-Predictive Labels
**Learning:** For toggle controls (like a theme switcher), the visible text label should describe the state the control will transition *to*, not its current state. This aligns the button's affordance with its action, making the UI more intuitive. For example, a theme switcher in light mode should display "Switch to Dark" (or an icon/label representing dark mode).
**Action:** When implementing toggle buttons, ensure all user-facing labels (aria-label, title, and visible text) are predictive of the resulting state.
