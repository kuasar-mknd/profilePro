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

## 2025-02-18 - Off-Screen Compositing Optimization
**Learning:** Full-screen overlays (like mobile menus) sitting off-screen with `translate` still consume GPU memory if they have `will-change: transform`.
**Action:** Use `visibility: hidden` (via `invisible` class) when the overlay is closed to remove it from the paint/composite tree entirely. Manage transitions by adding `invisible` only after the close transition completes (using `setTimeout`), and removing it immediately before the open transition starts (forcing a reflow with `void el.offsetWidth` if necessary).

## 2025-02-18 - Will-Change Memory Anti-Pattern
**Learning:** Permanently applying `will-change: opacity` to repeated list elements (e.g., `.card-glow` on every project card) forces the browser to keep a separate compositor layer for each item, significantly increasing GPU memory usage.
**Action:** Remove `will-change` from list items unless a specific, janky animation requires it. Browser heuristics for standard hover opacity transitions are sufficient and more memory-efficient.

## 2026-01-13 - Deferring Non-Critical DOM Scans
**Learning:** Synchronous DOM scans (like `querySelectorAll`) and global observers attached during `astro:after-swap` can significantly block the main thread during the critical post-navigation frame, increasing TBT.
**Action:** Wrapped non-critical initialization logic (like `secureLinks`) in a `requestIdleCallback` helper to yield control to the browser for painting and user input.
