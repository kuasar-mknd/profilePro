## 2026-03-06 - Empty State Recovery Paths
**Learning:** When users encounter an empty state (e.g., searching for a tag that yields no results), simply displaying "No items found" creates a dead end and degrades the user experience.
**Action:** Always provide a clear, actionable Call-To-Action (CTA) link in Empty States (like "See all projects" or "Return home") to guide the user back to safety and maintain engagement.

## 2026-03-07 - Lightbox Tactile Feedback
**Learning:** For interactive full-screen components like galleries or lightboxes, visual transitions alone can sometimes feel "thin" on mobile devices where the user expects a more physical response to swipe or click actions.
**Action:** For the Lightbox component, trigger tactile confirmation (vibrate 50ms) during image navigation via `next()` and `prev()` methods, provided `galleryElements.length > 1` to ensure feedback only triggers on actual state changes.
## 2024-03-07 - Avoid aria-pressed on dynamic action buttons
**Learning:** Using `aria-pressed` on a theme switcher button that dynamically changes its visual text (e.g., from "Sun" to "Moon") creates a WCAG 2.5.3 (Label in Name) violation. The `aria-pressed` attribute is designed exclusively for toggle buttons with *static* labels. When a button's visual representation describes the *next* action, forcing a static `aria-label` to satisfy `aria-pressed` breaks voice navigation and creates cognitive dissonance for screen reader users.
**Action:** For buttons with dynamically changing icons or text, keep them as standard action buttons and update their `aria-label` dynamically to match the visual presentation (e.g., "Activer le mode clair" when showing a Moon). Reserve `aria-pressed` for true toggle buttons like "Mute" or "Pin".

## 2024-03-07 - Visually expose aria-keyshortcuts
**Learning:** While `aria-keyshortcuts` provides essential information to assistive technologies, sighted keyboard power users often miss out on discovering these shortcuts if they aren't visually indicated in the UI.
**Action:** Always wrap keyboard shortcut text in `<kbd>` tags within custom tooltips or labels for controls that have `aria-keyshortcuts` defined, bridging the gap between ARIA attributes and visual accessibility.

## 2024-03-08 - Haptic Feedback Patterns
**Learning:** Visual feedback on mobile devices can sometimes go unnoticed if the user's thumb is obscuring the interaction point. Tactile (haptic) confirmation provides a more physical sense of responsiveness, especially for primary actions and state transitions.
**Action:** Standardize haptic feedback patterns across the app:
- Primary Actions (CTA, Submit, Play): `navigator.vibrate(50)`
- Success States: `navigator.vibrate(50)`
- Errors/Validation Failures: `navigator.vibrate([50, 50, 50])`
- Subtle Resets/Toggles: `navigator.vibrate(30)`

## 2024-03-10 - Theme Switcher Icon Alignment
**Learning:** In theme switchers that use action-oriented labels (e.g., "Activer le mode sombre"), showing the icon of the *current* state (e.g., Sun icon in Light Mode) creates cognitive dissonance. The visual affordance (icon) should match the target state or the action described by the label.
**Action:** Always display the icon representing the *target* theme state (Moon in Light mode, Sun in Dark mode) so it aligns with the "Switch to..." intent and text label.

## 2024-03-10 - Persistent Context for Truncated Text
**Learning:** Responsive truncation (e.g., breadcrumbs on mobile) effectively manages space but hides critical information. Screen readers might read the truncated text if not careful, and sighted users lose context.
**Action:** For elements prone to truncation on small screens, include a `title` attribute containing the full, untruncated text. This provides a native fallback for hover states and ensures the full content remains accessible without requiring complex UI expansions.

## 2026-03-08 - Empty State Contextual Recovery
**Learning:** For empty states dynamically rendered in components (like an empty image gallery), users may not always know where to go next if no images are present, particularly if the empty state lacks context.
**Action:** Always provide contextual CTA buttons in `EmptyState` component invocations (e.g., passing `actionUrl="/project"` and `actionText="Voir d'autres projets"`) so the user does not hit a dead-end and is prompted to continue browsing.

## 2026-03-09 - WCAG 2.5.3 Label in Name for Action Links
**Learning:** Using descriptive `aria-label` attributes on links and buttons (like "Aller à la page précédente" or "Filtre actif : Tous") that completely replace or bury the element's visible text ("Précédent", "Tous") causes a WCAG 2.5.3 (Label in Name) violation. This breaks voice control software (like Dragon NaturallySpeaking) because the user speaks the visible text, but the programmatic name doesn't match or start with it.
**Action:** Always ensure the `aria-label` starts with the exact visible text, followed by the contextual description in parentheses (e.g., `aria-label="Précédent (page 1)"` or `aria-label="Samuel Dulex (Retour à l'accueil)"`).

## 2026-03-09 - Avoid redundant cursor-pointer classes
**Learning:** Browsers automatically apply `cursor: pointer` to standard `<a>` tags with `href` attributes. Adding the `cursor-pointer` utility class to these elements is redundant and clutters the markup.
**Action:** Only apply `cursor-pointer` to interactive custom elements (like `div` or `img` tags with `role="button"`) or elements that don't natively receive pointer styling. Do not apply it to standard `<a>` tags.

## 2025-03-10 - Lightbox Backdrop Accessibility
**Learning:** Adding `role="button"` and `tabindex="0"` to a full-screen visual backdrop creates a redundant and confusing focus stop that can obscure or skip the actual modal content for keyboard and screen reader users.
**Action:** When a modal already has an explicit Close button, ensure the decorative backdrop only handles pointer events (click) and is hidden from assistive tech with `aria-hidden="true"` and no `tabindex`.
## 2024-03-24 - Unified ARIA Label for Complex CTA Cards
**Learning:** Screen readers announce all nested text nodes within a complex interactive element sequentially (e.g., heading + icon text + subtitle), creating a disjointed and noisy user experience.
**Action:** Provide a unified, concise `aria-label` on the wrapper interactive element (e.g., `<a>` or `<button>`) and apply `aria-hidden="true"` to the internal container wrapping the visual elements to ensure a single, clean announcement.

## 2026-03-12 - Mobile Menu Background Inertia
**Learning:** When a full-screen mobile menu traps focus, virtual cursor navigation (like VoiceOver's swipe) can still escape the trap and explore visually hidden background content if `inert` is not applied to the background elements.
**Action:** Always apply `inert` and `aria-hidden="true"` to `#main-content`, `footer`, and other root siblings when a full-screen mobile menu or modal is open to ensure a truly isolated experience for assistive technologies.

## 2026-03-13 - State Reset for Auto-Resizing Textareas
**Learning:** For forms containing textareas that dynamically adjust their height based on content (e.g., via `input` listeners), calling `form.reset()` clears the text but leaves the DOM element at its expanded height. This creates a visually jarring "gap" in the UI.
**Action:** Explicitly reset the `height` style property to `auto` (or the initial value) within the `reset` event listener or click handler of the reset button to ensure the textarea returns to its original collapsed state.

## 2024-05-20 - Unified Interactive Element Descriptions
**Learning:** For complex interactive elements like CTA cards or buttons with multiple icons and text layers, applying a unified `aria-label` to the wrapper while leaving inner text elements visible creates disjointed and duplicated reads for screen reader users. The screen reader announces the `aria-label` and then sequentially reads the internal visual content again.
**Action:** When a unified `aria-label` is applied to a wrapper link or button, always apply `aria-hidden="true"` to the inner textual and visual content to ensure a clean, single announcement.

## 2025-02-15 - [CTA Hover Interaction & Accessibility]
**Learning:** Decorative icons within CTAs (like arrows) must be hidden from screen readers (`aria-hidden="true"`) to prevent verbose double-speak.
**Action:** Always pair decorative CTA icons with `aria-hidden="true"` and a subtle `transform` animation on hover/focus to indicate interactivity, ensuring the parent link has `group` and `focus-visible` styles.
