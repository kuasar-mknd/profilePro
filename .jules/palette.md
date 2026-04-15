# Palette Persona Learnings

## Accessibility Patterns

- **Keyboard Shortcut Discoverability**: To enhance accessibility and UX, append the relevant keyboard shortcut in parentheses to the `aria-label` of interactive elements (e.g., `aria-label="Fermer la galerie (Esc)"`). Ensure these align with visible `<kbd>` elements.
- **Dynamic ARIA Injection**: When generating or modifying ARIA properties via client-side JavaScript, use `element.setAttribute("aria-label", value)` consistently rather than modifying the element property (`element.ariaLabel = value`). This ensures robust compatibility and predictable DOM behavior across the application.

## 2026-03-29 - Lightbox Single Image Navigation

**Learning:** Rendering previous/next arrows and a counter for a single-image gallery adds visual noise and confusion, as users might attempt to navigate non-existent items.
**Action:** Dynamically hide navigation controls (, , ) and set their attributes to when the gallery length is 1 or fewer.

## 2024-05-19 - Lightbox Single Image Navigation

**Learning:** Rendering previous/next arrows and a counter for a single-image gallery adds visual noise and confusion, as users might attempt to navigate non-existent items.
**Action:** Dynamically hide navigation controls (.lightbox-prev, .lightbox-next, .lightbox-counter) and set their aria-hidden attributes to true when the gallery length is 1 or fewer.

## 2026-03-31 - Interaction Consistency for CTA Buttons

**Learning:** Primary action links on secondary pages (like "Voir mon portfolio" or "Me contacter" on the About page) often lack the interaction feedback and visual cues present on the homepage CTA. Missing icons and haptic properties can make navigation feel disjointed and less responsive.
**Action:** Always ensure that call-to-action buttons across the site follow the established interaction pattern (e.g., including directional icons for navigation, contextual icons for actions, and standard `data-haptic` attributes for tactile feedback) to maintain a cohesive user experience.

## 2024-04-03 - In-Page Navigation Haptics

**Learning:** In-page navigation links like Table of Contents (TOC) items often lack the tactile feedback provided by primary site navigation, making them feel less responsive on mobile devices despite being critical interaction points.
**Action:** Apply the standard `data-haptic="30"` attribute to all secondary in-page navigation links, including Table of Contents anchors, to maintain tactile consistency with main navigation elements.

## 2024-05-19 - Haptic Feedback on Lightbox Controls

**Learning:** Full-screen modal interactions like Lightboxes often lack the tactile feedback present on standard page elements, making the mobile experience feel less responsive.
**Action:** Consistently apply `data-haptic="50"` to modal navigation controls (.lightbox-close, .lightbox-prev, .lightbox-next) to match the global interaction pattern.

## 2026-04-08 - Global Keyboard Shortcuts

**Learning:** When implementing global keyboard shortcuts (e.g., "T" for Back to Top), it is critical to explicitly check that modifier keys (`e.ctrlKey`, `e.metaKey`, `e.altKey`) are false. Failing to do so can intercept standard browser navigation commands (like Cmd+T to open a new tab), causing a severe UX regression.
**Action:** Always include `!e.ctrlKey && !e.metaKey && !e.altKey` in global keydown event listeners, and ensure inputs (`INPUT`, `TEXTAREA`, `SELECT`, `isContentEditable`) are ignored.

## 2026-04-10 - Empty State Call-to-Action Feedback

**Learning:** Call-to-action links inside empty state components (e.g., "Aucun élément trouvé") can feel disconnected from the primary interactive patterns if they lack visual cues and reactive feedback. Users might miss them as actionable items.
**Action:** Enhance empty state CTA links by wrapping their text in a `span`, appending a directional icon (like `mdi:arrow-right`), and utilizing `group-hover` and `group-focus-visible` Tailwind classes with `transition-transform` to introduce a subtle directional micro-interaction.

## 2024-04-11 - Global Haptic Feedback Centralization

**Learning:** Adding custom JavaScript event listeners to individual components to call `navigator.vibrate()` is redundant and can lead to duplicated logic. The project already has a global `initHaptics()` listener set up in `src/layouts/Base.astro`.
**Action:** Always leverage the centralized haptics management by simply adding the `data-haptic` attribute (e.g., `data-haptic="30"` or `data-haptic="50"`) directly to the HTML markup of the interactive element. No custom JS listeners are needed.

## 2024-05-19 - Haptic Feedback Centralization

**Learning:** Adding custom JavaScript event listeners to individual components to call `navigator.vibrate()` is redundant and can lead to duplicated logic. The project already has a global `initHaptics()` listener set up in `src/layouts/Base.astro`.
**Action:** Always leverage the centralized haptics management by simply adding the `data-haptic` attribute (e.g., `data-haptic="30"` or `data-haptic="50"`) directly to the HTML markup of the interactive element. No custom JS listeners are needed.

## 2026-04-14 - Pagination Accessibility & Navigation Context
**Learning:** When adding keyboard shortcuts to pagination controls in a Single Page Application (SPA) utilizing View Transitions (like Astro's `astro:page-load`), global event listeners (like `document.addEventListener("keydown", ...)`) must be explicitly managed. They must be registered with a singleton pattern, where the previous instance is removed on subsequent page loads, otherwise memory leaks and duplicate trigger events will occur on every keystroke. Furthermore, when adding elements like `<kbd>` hints to Astro pagination controls, you must account for both active `<a>` tags and inactive boundary states, where the controls render as disabled `<span>` elements with `cursor-not-allowed` class.
**Action:** Always test pagination components on both the first and last pages to ensure interactive styles (like hovers and keyboard shortcuts) don't apply to disabled states, and wrap global event listener additions in a cleanup check to ensure they survive SPA transitions intact.

## 2024-05-20 - Lightbox Vertical Swipe Dismissal
**Learning:** On mobile devices, users intuitively expect full-screen modals like image Lightboxes to support vertical swipe gestures (specifically swipe down) to dismiss the content, complementing the standard close button. This aligns with modern OS-level interaction patterns (e.g., iOS Photos, Instagram).
**Action:** Implement vertical touch tracking in Lightbox components and trigger a close action when a significant downward displacement is detected, ensuring the gesture is dominant over horizontal navigation (ratio-based check).
