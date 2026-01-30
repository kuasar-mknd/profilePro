
## 🎨 Interaction: Positive Validation Feedback (2025-02-18)
**Learning:** Users benefit from immediate positive reinforcement, not just error removal. Inline validation checkmarks provide "delight" and reduce anxiety.
**Action:** Use `data-visible` attributes for simple state toggling in CSS instead of complex class manipulation for visual feedback elements.

## 2024-07-18 - State-Predictive Labels
**Learning:** For toggle controls (like a theme switcher), the visible text label should describe the state the control will transition *to*, not its current state. This aligns the button's affordance with its action, making the UI more intuitive. For example, a theme switcher in light mode should display "Switch to Dark" (or an icon/label representing dark mode).
**Action:** When implementing toggle buttons, ensure all user-facing labels (aria-label, title, and visible text) are predictive of the resulting state.

## 2026-01-26 - Region Landmarks
**Learning:** Explicitly associating `<section>` elements with their headings using `aria-labelledby` creates robust navigational landmarks for screen readers, allowing users to jump between content blocks by name (e.g., "Jump to Services") rather than generic "Region".
**Action:** When implementing distinct content sections (Hero, Features, Posts), assign an ID to the heading and link it to the container via `aria-labelledby`.

## 2026-01-26 - Mobile Menu Semantics
**Learning:** A full-screen mobile menu overlay acts as a modal dialog, not just a navigation block. Using `<div role="dialog" aria-modal="true">` is more semantically accurate than nesting a `<nav>` inside a parent `<nav>`, which can confuse the accessibility tree.
**Action:** Implement full-screen mobile menus as dialogs containing navigation, rather than nested navigation containers.
