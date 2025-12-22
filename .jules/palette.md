## 2024-07-25 - Icon-Only Button UX

**Learning:** For icon-only buttons, providing a `title` attribute in addition to a dynamic `aria-label` offers a better user experience. The `aria-label` serves screen readers, while the `title` attribute provides a native browser tooltip on hover for sighted mouse users, clarifying the button's function without needing a visible label.

**Action:** When implementing icon-only buttons, ensure both `aria-label` and `title` attributes are present and dynamically updated to reflect the button's current state (e.g., "Open menu" vs. "Close menu"). This pattern was successfully applied to the `HamburgerButton.astro` component.
