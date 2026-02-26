
## 🎨 Interaction: Positive Validation Feedback (2025-02-18)
**Learning:** Users benefit from immediate positive reinforcement, not just error removal. Inline validation checkmarks provide "delight" and reduce anxiety.
**Action:** Use `data-visible` attributes for simple state toggling in CSS instead of complex class manipulation for visual feedback elements.

## 2024-07-18 - State-Predictive Labels
**Learning:** For toggle controls (like a theme switcher), the visible text label should describe the state the control will transition *to*, not its current state. This aligns the button's affordance with its action, making the UI more intuitive. For example, a theme switcher in light mode should display "Switch to Dark" (or an icon/label representing dark mode).
**Action:** When implementing toggle buttons, ensure all user-facing labels (aria-label, title, and visible text) are predictive of the resulting state.

## 2025-02-26 - Build-Critical Dependencies on Render
**Learning:** Render prunes `devDependencies` when `NODE_ENV=production` is set. Any package imported in `astro.config.mjs` or used in post-build scripts (like `generate-csp.mjs`) must be in `dependencies` even if they seem like dev tools.
**Action:** Move `sharp`, `cheerio`, `astro-compress`, `rollup-plugin-visualizer`, and `@iconify-json/mdi` to `dependencies` to ensure build stability on Render.
