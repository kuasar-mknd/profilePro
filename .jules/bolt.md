# Bolt's Journal ⚡

## Performance Patterns

### Rendering Stability
- **Cluster:** `contain` and `content-visibility` usage.
- **Insight:** Static lists (Navigation, Breadcrumbs) and self-contained UI elements (EmptyState, Skeleton, Lightbox loader) are prime candidates for CSS containment (`contain: layout` or `contain: strict`). This isolates their layout/paint lifecycle, reducing browser reflow costs during global page changes.
- **Action:** Applied `contain: layout` to heavy static lists and `contain: strict` to purely decorative/placeholder elements like Skeletons and Sentinels.

### Layout Isolation
- **Cluster:** `contain: layout` on major regions.
- **Insight:** Isolating `#main-content` with `contain: layout` prevents internal reflows from propagating to the global document structure (Header/Footer), which is beneficial for Single Page Application (SPA) transitions and heavy dynamic content updates.

### Micro-Optimizations
- **Cluster:** High-frequency components (Tag, SocialIcon).
- **Insight:** Even small components like tags and icons, when used in lists (loops), benefit from `contain: layout style`. This prevents style recalculations from leaking or affecting the parent container unnecessarily.
