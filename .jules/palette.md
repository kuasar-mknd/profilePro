
## 🎨 Interaction: Positive Validation Feedback (2025-02-18)
**Learning:** Users benefit from immediate positive reinforcement, not just error removal. Inline validation checkmarks provide "delight" and reduce anxiety.
**Action:** Use `data-visible` attributes for simple state toggling in CSS instead of complex class manipulation for visual feedback elements.

## 2024-07-18 - State-Predictive Labels
**Learning:** For toggle controls (like a theme switcher), the visible text label should describe the state the control will transition *to*, not its current state. This aligns the button's affordance with its action, making the UI more intuitive. For example, a theme switcher in light mode should display "Switch to Dark" (or an icon/label representing dark mode).
**Action:** When implementing toggle buttons, ensure all user-facing labels (aria-label, title, and visible text) are predictive of the resulting state.

## 2025-02-18 - Context-Aware Active States
**Learning:** Reusable navigation components (like tags in cards) can confuse users when they appear on the page they link to. Marking them as "Current Page" (`aria-current="page"`) provides critical context and prevents redundant clicks.
**Action:** Always check `Astro.url.pathname` against component `href` to apply active states, even for secondary navigation elements.
