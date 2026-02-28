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

## 2026-01-13 - Dynamic Will-Change Management

**Learning:** Even with `visibility: hidden`, elements with permanent `will-change: transform` might retain layer hints in some browser engines or complicate layer tree management.
**Action:** Dynamically toggle `will-change` via JavaScript: add it immediately before the opening animation, and remove it (`will-change: auto`) after the closing animation finishes.

## 2025-02-20 - Redundant Event Listeners in Component Interactions

**Learning:** When multiple components interact (e.g., Gallery and Lightbox), ensure event handling responsibilities are clearly defined to avoid duplication. I found that `ImageGallery` was adding a `keydown` listener to simulate clicks, while `Lightbox` was _also_ listening for `keydown` globally. This caused double execution of the open logic and unnecessary event listener overhead.
**Action:** Centralize interaction logic in the controlling component (`Lightbox`) and keep UI components (`ImageGallery`) purely presentational where possible, relying on global delegation for interactions.

## 2025-02-21 - Capping Infinite Scroll DOM Size

**Learning:** In infinite scroll carousels that duplicate items for looping, using the full dataset (e.g., all projects) can lead to exponential DOM growth as content scales. Slicing the dataset to a sufficient minimum (e.g., 15 items) before duplication ensures performance remains O(1) regardless of total content size.
**Action:** Always slice datasets used for visual-only loops to the minimum required for screen coverage + buffer.

## 2024-05-23 - Event Delegation for Global Components

**Learning:** When using a global interactive component (like `Lightbox.astro` in `Base.astro`) that handles events for distributed elements (like gallery images), do not duplicate event listeners in the child components.
**Action:** Rely on the global component's delegated listeners (`document.addEventListener`) to handle interactions. This reduces memory usage (N listeners -> 1 listener) and prevents potential double-handling logic or race conditions. Ensure the global component is always present (e.g., in the Layout) before removing child listeners.

## 2026-01-06 - Capping Infinite Scroll Items

**Learning:** When implementing infinite scroll by duplicating items, always apply a hard cap (e.g., slice(0, 15)) to the source array. Relying on the natural collection size allows DOM node count to grow unbounded as content is added, degrading performance over time.
**Action:** Explicitly slice source arrays for purely visual carousels/marquees.

## 2026-02-23 - Infinite Animation GPU Efficiency

**Learning:** Infinite CSS animations (like floating background blobs) continue to consume CPU (style recalc/layout) and GPU memory (compositor layers) even when off-screen, especially if `will-change: transform` is used permanently.
**Action:** Implement a global `IntersectionObserver` in the layout to automatically toggle a `.paused` class on these elements when they leave the viewport. The `.paused` class forces `animation-play-state: paused` and `will-change: auto`, recovering resources without manual management in every component.

## 2024-05-23 - Inline Scripts and View Transitions Memory Leaks

**Learning:** In Astro with ClientRouter (View Transitions), scripts inside `<body>` without `is:inline` (which are processed as modules) or with `is:inline` (raw) are re-executed on every navigation if they are part of the swapped content. This leads to stacking event listeners (e.g., `document.addEventListener`) if cleanup logic is not implemented.
**Action:** When initializing global listeners in such scripts, either:

1. Use `astro:page-load` exclusively (it covers both initial load and swap) and avoid manual function calls that duplicate the logic.
2. Implement robust cleanup using a singleton pattern or `astro:before-swap` to remove previous listeners before adding new ones.
3. For heavy optimizations (like `MutationObserver` on `body`), carefully evaluate if the "catch-all" approach is worth the performance cost versus targeted handling in specific components.

## 2026-01-24 - HTML-First Visibility State

**Learning:** Initializing off-screen elements with `visibility: hidden` (e.g., via `invisible` class) directly in HTML prevents initial paint/compositing costs more effectively than applying it via JavaScript on load. This reduces the browser's workload during critical initial render (FCP/LCP) and eliminates potential layout shifts or flashes if JS is delayed.
**Action:** Apply `invisible` class to off-screen interactive elements (like mobile menus) in the HTML markup, and use JavaScript only to toggle it during interaction.

## 2024-05-24 - DOM Query Specificity in SPAs
**Learning:** In applications using Astro View Transitions (or any SPA framework), DOM nodes often persist across navigations. Running generic queries like `document.querySelectorAll('a[target="_blank"]')` on every navigation event means redundantly processing nodes that have already been modified.
**Action:** Use specific CSS pseudo-classes like `:not([attribute])` or `:not(.class)` in `querySelectorAll` to let the native browser engine pre-filter elements, preventing redundant JS execution and string manipulation on the main thread.
