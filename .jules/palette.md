
## 🎨 Interaction: Positive Validation Feedback (2025-02-18)
**Learning:** Users benefit from immediate positive reinforcement, not just error removal. Inline validation checkmarks provide "delight" and reduce anxiety.
**Action:** Use `data-visible` attributes for simple state toggling in CSS instead of complex class manipulation for visual feedback elements.

## 2024-07-18 - State-Predictive Labels
**Learning:** For toggle controls (like a theme switcher), the visible text label should describe the state the control will transition *to*, not its current state. This aligns the button's affordance with its action, making the UI more intuitive. For example, a theme switcher in light mode should display "Switch to Dark" (or an icon/label representing dark mode).
**Action:** When implementing toggle buttons, ensure all user-facing labels (aria-label, title, and visible text) are predictive of the resulting state.

## 2024-07-19 - Accessible Labels for Visual Controls
**Learning:** To comply with WCAG 2.5.3 (Label in Name), the `aria-label` for an interactive control must include any visible text that is part of that control (e.g., text that appears on hover). This is critical for users of speech recognition software, as they will often speak the visible text to interact with the button. The best practice is to prepend the visible text to the main action description (e.g., "Visible Text: Action Label").
**Action:** For any interactive element that has both a non-visible `aria-label` and a visible text label (on hover or otherwise), always ensure the `aria-label` and `title` attributes are formatted as `"{Visible Text}: {Action Description}"`.
