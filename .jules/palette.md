## 2026-03-06 - Empty State Recovery Paths
**Learning:** When users encounter an empty state (e.g., searching for a tag that yields no results), simply displaying "No items found" creates a dead end and degrades the user experience.
**Action:** Always provide a clear, actionable Call-To-Action (CTA) link in Empty States (like "See all projects" or "Return home") to guide the user back to safety and maintain engagement.

## 2026-03-07 - Lightbox Tactile Feedback
**Learning:** For interactive full-screen components like galleries or lightboxes, visual transitions alone can sometimes feel "thin" on mobile devices where the user expects a more physical response to swipe or click actions.
**Action:** For the Lightbox component, trigger tactile confirmation (vibrate 50ms) during image navigation via `next()` and `prev()` methods, provided `galleryElements.length > 1` to ensure feedback only triggers on actual state changes.