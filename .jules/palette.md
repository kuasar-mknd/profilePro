
## 🎨 Interaction: Positive Validation Feedback (2025-02-18)
**Learning:** Users benefit from immediate positive reinforcement, not just error removal. Inline validation checkmarks provide "delight" and reduce anxiety.
**Action:** Use `data-visible` attributes for simple state toggling in CSS instead of complex class manipulation for visual feedback elements.

## 2024-07-18 - State-Predictive Labels
**Learning:** For toggle controls (like a theme switcher), the visible text label should describe the state the control will transition *to*, not its current state. This aligns the button's affordance with its action, making the UI more intuitive. For example, a theme switcher in light mode should display "Switch to Dark" (or an icon/label representing dark mode).
**Action:** When implementing toggle buttons, ensure all user-facing labels (aria-label, title, and visible text) are predictive of the resulting state.

## 2025-02-18 - A11y & Build Hygiene
**Learning:** Shared UI components (like ModeSwitch or HamburgerButton) that appear multiple times on a page must use class-based selectors for `aria-live` regions instead of IDs to avoid DOM ID collisions. Additionally, build-time tools like `astro check` can OOM if not properly configured to ignore build artifacts (like the `dist` folder), leading to deployment failures.
**Action:** Use classes for live regions in reusable components. Ensure `tsconfig.json` excludes `dist` and `node_modules` to maintain a stable build environment.
