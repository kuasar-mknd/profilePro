## 🎨 Interaction: Positive Validation Feedback (2025-02-18)

**Learning:** Users benefit from immediate positive reinforcement, not just error removal. Inline validation checkmarks provide "delight" and reduce anxiety.
**Action:** Use `data-visible` attributes for simple state toggling in CSS instead of complex class manipulation for visual feedback elements.

## 2024-07-18 - State-Predictive Labels

**Learning:** For toggle controls (like a theme switcher), the visible text label should describe the state the control will transition _to_, not its current state. This aligns the button's affordance with its action, making the UI more intuitive. For example, a theme switcher in light mode should display "Switch to Dark" (or an icon/label representing dark mode).
**Action:** When implementing toggle buttons, ensure all user-facing labels (aria-label, title, and visible text) are predictive of the resulting state.

## 2025-10-24 - Accessible Skip-to-Content Links

**Learning:** Using `sr-only` classes that abruptly toggle visibility on focus can cause jarring layout shifts or visual pops for keyboard users.
**Action:** Use CSS transforms (like `absolute -translate-y-[250%] focus-visible:translate-y-0 transition-transform`) to slide skip links smoothly into view when focused, providing a much smoother and intentional UX for keyboard navigation.
