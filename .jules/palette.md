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
