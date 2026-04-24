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

## 2026-04-16 - Centralized Contact Form Navigation & Smart Focus

**Learning:** In-page navigation to a contact form (especially from different pages or sections) can be jarring if it lacks visual feedback or causes unintended layout shifts on mobile due to automatic keyboard activation. Directing users to a form field on mobile can cover half the screen immediately, which might be undesirable if they just wanted to see the section.
**Action:** Implement a centralized navigation handler for contact form links. Use "Smart Focus": on desktop, focus the first input to facilitate immediate typing; on mobile, focus the form container to provide visual context without triggering the virtual keyboard. Additionally, apply a temporary "highlight glow" animation to the form to clearly signal successful navigation.

## 2026-04-17 - Tactile Feedback Snappiness

**Learning:** The default `transition-all duration-300` combined with `active:scale-95` creates a sluggish tactile response, as the 300ms transition delays both the scale down and the release. This reduces the perceived snappiness of interactive elements.
**Action:** Add `active:duration-75` alongside `active:scale-95` to shorten the animation curve specifically during the active (click/press) phase, making the tactile feedback feel immediate and responsive.

## 2024-05-20 - Scaled Tactile Feedback for Large Surfaces

**Learning:** Applying the standard `active:scale-95` to large interactive elements like project cards or wide CTA buttons causes an exaggerated and jarring visual distortion.
**Action:** Use a more subtle scale factor such as `active:scale-[0.98]` for components with large surface areas to maintain snappy tactile feedback without compromising visual stability.

## 2026-04-18 - Hover Elevation Consistency

**Learning:** Interactive primary and secondary CTA elements occasionally lack the tactile `hover-lift` class despite having standard press feedback (`active:scale`). This makes hover states feel inconsistent.
**Action:** Ensure all standard CTA buttons utilize the `hover-lift` utility class to supplement base hover styles, creating a cohesive visual response.

## 2026-05-20 - Global Anchor Link Highlight

**Learning:** In-page navigation via anchor links (hashes) can be disorienting as the scroll jump often happens instantaneously, leaving the user to scan the page for their intended target.
**Action:** Implement a site-wide anchor highlight listener in the base layout that applies a temporary visual "glow" animation to any element targeted by a hash link, providing immediate visual confirmation.

## 2026-04-20 - Toggle Button State Communication

**Learning:** Toggle buttons (like the Dark/Light Mode switch) that rely purely on `aria-label` updates to communicate state changes can be less robust than standard ARIA states, especially if the `aria-label` content relies on complex text that screen readers might interpret differently.
**Action:** When implementing a toggle button, always utilize the `aria-pressed` attribute (dynamically updating between "true" and "false") alongside `aria-label` changes to provide explicit, standardized state feedback to assistive technologies.

## 2026-05-22 - Scroll Accessibility for Fixed Headers

**Learning:** Fixed headers (e.g., `h-20` / 80px) often obscure the target of in-page anchor links, as the browser scrolls to the top of the viewport by default. This forces users to manually scroll up to see the targeted content.
**Action:** Apply `scroll-pt-[header_height + buffer]` (e.g., `scroll-pt-24`) to the `<html>` element to ensure all anchor targets are cleared from the fixed header, maintaining context and accessibility.

## 2024-04-21 - Form Submission Loading State Visibility & Accessibility

**Learning:** When a full-width submit button enters a loading state, replacing the button text with a single, small centered spinner creates an unbalanced, ambiguous visual state. Additionally, relying on `aria-live` directly on a button that simultaneously receives `aria-busy="true"` can suppress the loading announcement for screen readers.
**Action:** Always include descriptive text (e.g., "Envoi en cours...") alongside the spinner in the button's loading state to maintain visual weight and clarity. Use a separate, dedicated `sr-only` live region outside the button to guarantee the loading state is announced to assistive technologies.

## 2026-05-24 - Tactile Feedback Consistency

**Learning:** Applying the standard `active:scale-95` to large interactive elements like project cards or wide CTA buttons causes an exaggerated and jarring visual distortion.
**Action:** Use a more subtle scale factor such as `active:scale-[0.98]` for components with large surface areas to maintain snappy tactile feedback without compromising visual stability. Always pair it with `active:duration-75`.

## 2026-04-22 - Contextual Keyboard Shortcut Reveal

**Learning:** Displaying keyboard shortcuts (like `[` and `]`) permanently on navigation links can clutter a minimalist UI, yet they are vital for power users.
**Action:** Use a "Contextual Reveal" pattern by setting the `<kbd>` element to `opacity-0` by default and `group-hover:opacity-100 group-focus-visible:opacity-100` with a smooth transition. This rewards exploration without penalizing casual users with extra visual noise.

## 2026-05-25 - Contextual Keyboard Shortcuts for Primary Branding Links

**Learning:** Main branding links (like the site logo) are frequently used by keyboard users to quickly navigate back to the home page, but they often lack explicit keyboard shortcuts, requiring manual tabbing.
**Action:** Always provide explicit keyboard shortcuts (e.g., `Alt+H`) for primary navigational elements and reveal them using the consistent `<kbd>` contextual reveal pattern (`opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100`) so they are discoverable without cluttering the interface.

## 2024-05-26 - Keyboard Shortcut Discoverability for Navigation Actions

**Learning:** Navigation buttons (like "Go back" on a 404 page) can have keyboard shortcuts added for power users, but if they are not explicitly exposed via `aria-keyshortcuts` and visual cues (like a `<kbd>` element), they remain undiscoverable.
**Action:** When adding global keyboard shortcuts to common navigational buttons, use the established Contextual Reveal pattern for the `<kbd>` tag to provide a visual hint without cluttering the UI, and always pair it with the corresponding `aria-keyshortcuts` attribute.
