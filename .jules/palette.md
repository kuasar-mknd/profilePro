
## 🎨 Interaction: Positive Validation Feedback (2025-02-18)
**Learning:** Users benefit from immediate positive reinforcement, not just error removal. Inline validation checkmarks provide "delight" and reduce anxiety.
**Action:** Use `data-visible` attributes for simple state toggling in CSS instead of complex class manipulation for visual feedback elements.

## 2024-07-18 - State-Predictive Labels
**Learning:** For toggle controls (like a theme switcher), the visible text label should describe the state the control will transition *to*, not its current state. This aligns the button's affordance with its action, making the UI more intuitive. For example, a theme switcher in light mode should display "Switch to Dark" (or an icon/label representing dark mode).
**Action:** When implementing toggle buttons, ensure all user-facing labels (aria-label, title, and visible text) are predictive of the resulting state.

## 2024-05-22 - External Link Consistency
**Learning:** Screen reader users benefit from consistent announcements for external links. Standardizing the suffix " (ouvre un nouvel onglet)" across all components prevents confusion and reduces maintenance.
**Action:** Use a shared constant or identical string for all `aria-label` suffixes on `target="_blank"` links.

## 2024-05-22 - Card Link Labels
**Learning:** When a card is wrapped in a single link, the accessible name must describe the *destination* and *content* concisely, overriding the verbose inner text.
**Action:** Use `aria-label` on card links to provide a structured summary (e.g., "See project: Title. Intro.") instead of relying on the computed text content which might include decorative elements or be disjointed.
