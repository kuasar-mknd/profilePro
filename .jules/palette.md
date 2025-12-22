## 2024-07-25 - Icon-Only Button UX

**Learning:** For icon-only buttons, providing a `title` attribute in addition to a dynamic `aria-label` offers a better user experience. The `aria-label` serves screen readers, while the `title` attribute provides a native browser tooltip on hover for sighted mouse users, clarifying the button's function without needing a visible label.

**Action:** When implementing icon-only buttons, ensure both `aria-label` and `title` attributes are present and dynamically updated to reflect the button's current state (e.g., "Open menu" vs. "Close menu"). This pattern was successfully applied to the `HamburgerButton.astro` component.

## 2025-02-18 - Descriptive Filter Labels

**Learning:** When using links to filter content (e.g., list of tags), simple labels like "Design" or "Marketing" lack context for screen reader users. By using a dynamic `aria-label` that includes the state (e.g., "Filtre actif : Design") or the action (e.g., "Filtrer par catégorie : Marketing"), we provide much clearer guidance. This helps distinguish between a link to a "Design" page and a link that *filters* the current view by "Design".

**Action:** For filter lists, use `aria-label` to explicitly describe the filter action and its current state (active/inactive), rather than relying solely on `aria-current`.
