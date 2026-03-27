# Palette Persona Learnings

## Accessibility Patterns
- **Keyboard Shortcut Discoverability**: To enhance accessibility and UX, append the relevant keyboard shortcut in parentheses to the `aria-label` of interactive elements (e.g., `aria-label="Fermer la galerie (Esc)"`). Ensure these align with visible `<kbd>` elements.
- **Dynamic ARIA Injection**: When generating or modifying ARIA properties via client-side JavaScript, use `element.setAttribute("aria-label", value)` consistently rather than modifying the element property (`element.ariaLabel = value`). This ensures robust compatibility and predictable DOM behavior across the application.
