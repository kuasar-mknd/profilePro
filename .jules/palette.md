# Palette Persona Learnings

## Accessibility Patterns
- **Keyboard Shortcut Discoverability**: To enhance accessibility and UX, append the relevant keyboard shortcut in parentheses to the `aria-label` of interactive elements (e.g., `aria-label="Fermer la galerie (Esc)"`). Ensure these align with visible `<kbd>` elements.
- **Dynamic ARIA Injection**: When generating or modifying ARIA properties via client-side JavaScript, use `element.setAttribute("aria-label", value)` consistently rather than modifying the element property (`element.ariaLabel = value`). This ensures robust compatibility and predictable DOM behavior across the application.

## 2026-03-29 - Lightbox Single Image Navigation
**Learning:** Rendering previous/next arrows and a counter for a single-image gallery adds visual noise and confusion, as users might attempt to navigate non-existent items.
**Action:** Dynamically hide navigation controls (, , ) and set their  attributes to  when the gallery length is 1 or fewer.

## 2024-05-19 - Lightbox Single Image Navigation
**Learning:** Rendering previous/next arrows and a counter for a single-image gallery adds visual noise and confusion, as users might attempt to navigate non-existent items.
**Action:** Dynamically hide navigation controls (.lightbox-prev, .lightbox-next, .lightbox-counter) and set their aria-hidden attributes to true when the gallery length is 1 or fewer.
