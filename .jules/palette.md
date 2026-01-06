## 2024-05-22 - [Enhancing 404 Page Actions]
**Learning:** Users on error pages need clear, comforting navigation paths. Text-only buttons can feel colder/broken compared to icon-rich primary navigation. Adding icons (Home, Back) provides visual anchors that reduce cognitive load during a stress state (getting a 404).
**Action:** When designing error states or empty states, always couple action buttons with recognizable icons to signal functionality and maintain design system consistency.

## 2024-05-24 - [Breadcrumb Visual Hierarchy]
**Learning:** Text-based separators (like `/`) in breadcrumbs create visual noise and lack directionality. Replacing them with scalable chevron icons (SVG) improves the "flow" of navigation and modernizes the interface, while `aria-hidden="true"` ensures they remain decorative.
**Action:** Prefer SVG chevron icons over text characters for directional separators in navigation components.
