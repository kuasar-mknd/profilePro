[Output truncated for brevity]

ill-change: opacity` to repeated list elements (e.g., `.card-glow` on every project card) forces the browser to keep a separate compositor layer for each item, significantly increasing GPU memory usage.
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

## 2026-02-23 - Duplicate Listeners in Re-executed Scripts

**Learning:** When scripts in Astro components (e.g., `Lightbox.astro` in `Base.astro`) are re-executed during View Transitions (because they are in the swapped body), simply using `document.addEventListener('astro:page-load', ...)` accumulates duplicate listeners on every navigation. Each listener fires, causing redundant logic execution and potential memory leaks if closures hold onto stale references.
**Action:** Implement a global guard (e.g., `window.__listenerAttached`) to ensure the `astro:page-load` listener is added exactly once per session, regardless of how many times the script is re-evaluated. Combine this with a global singleton instance (e.g., `window.__instance`) to persist state and ensure proper cleanup across navigations.

## 2024-05-24 - DOM Query Specificity in SPAs

**Learning:** In applications using Astro View Transitions (or any SPA framework), DOM nodes often persist across navigations. Running generic queries like `document.querySelectorAll('a[target="_blank"]')` on every navigation event means redundantly processing nodes that have already been modified.
**Action:** Use specific CSS pseudo-classes like `:not([attribute])` or `:not(.class)` in `querySelectorAll` to let the native browser engine pre-filter elements, preventing redundant JS execution and string manipulation on the main thread.

## 2026-02-28 - Tag Frequency Calculation Optimization

**Learning:** Calculating tag frequencies for a large number of projects (e.g., using `reduce` with a nested `filter`) results in an O(N*M) time complexity, where N is the number of tags and M is the number of projects. This can become a performance bottleneck during SSG builds as the number of projects scales.
**Action:** Replaced the O(N*M) nested loop tag counting with a single-pass O(N) iteration using a hash map to accumulate counts.

## 2026-03-01 - Global Animation Observer Centralization

**Learning:** Multiple components (like Hero carousels and backgrounds) were instantiating separate `IntersectionObserver` instances to pause infinite CSS animations when off-screen. This fragments performance optimizations and creates redundant memory overhead.
**Action:** Centralized visibility tracking into a single global `animationObserver` in `Base.astro`. Appended selectors like `.infinite-scroll` and `.hero-gradient-vibrant` to the `querySelectorAll` block, allowing one observer (with a uniform `rootMargin: "200px"`) to orchestrate memory recovery for all infinite animations site-wide.

## 2026-03-01 - Avoid internal getCollection calls in repeated components

**Learning:** Calling `getCollection('project')` internally inside a component like `ProjectFilter.astro` that is rendered multiple times (e.g., on every paginated page or tag page) causes redundant data processing and nested loops during the SSG build. If P is the number of static pages and N is the number of projects, this results in an O(P*N) complexity.
**Action:** Lift the data fetching and heavy computations (like calculating tag frequencies) up to the page route's `getStaticPaths` function. Compute it exactly once, and pass the results down as props to the presentational component, effectively reducing the complexity to O(N).

## 2026-03-02 - Redundant O(N) String Parsing for Reading Time

**Learning:** `getReadingTime` performs an O(N) loop over the characters of a given text, typically a large blog post or project body. Without memoization, if multiple components (like `Post.astro`, `[slug].astro`) call `getReadingTime` for the same content during a page build (or on the client side), the exact same O(N) parsing is redundantly repeated.
**Action:** Implemented a simple cache using `Map<string, number>` within `src/utils/readingTime.ts` to memoize previously computed reading times based on the text. Capped the cache size at 1000 items to prevent unbounded memory growth during continuous SSG dev server runs.

## 2026-03-02 - Redundant O(N log N) Sorting Optimization

**Learning:** Multiple components and pages (like `Hero`, `LatestPosts`, `index`, and various project routing pages) were individually calling `getCollection("project")` and frequently chaining `.sort()` directly on the result. Since standard JS `.sort()` mutates arrays in place, and each route performs this sort, it results in redundant O(N log N) processing and potential memory side effects across generated pages during Astro SSG builds.
**Action:** Centralized project fetching into a new `getSortedProjects()` utility in `src/utils/projects.ts` that fetches, sorts once, and caches the result for all subsequent calls during production builds (bypassing the cache in `import.meta.env.DEV` to support HMR). All relevant components were refactored to use this utility, stripping out their local `.sort()` implementations.

## 2026-03-03 - Memoize Repeated URL Sanitization

**Learning:** In list and card components (like `Tag.astro`), the `sanitizeUrl` function is called hundreds of times during static site generation. Repeatedly parsing the exact same URLs using `new URL()` and evaluating strict regex expressions inside these loops becomes an unnecessary CPU bottleneck.
**Action:** Introduced an LRU-style Map cache inside `src/utils/security.ts` to memoize previously sanitized URLs. This ensures `new URL()` is only ever executed once per unique link across the entire build, eliminating redundant parsing overhead without sacrificing security.

## 2026-03-03 - Added attributeFilter to MutationObserver for Theme Color Sync
**Learning:** `MutationObserver` on the `<html>` root node without an `attributeFilter` fires indiscriminately on any attribute change, causing unnecessary main-thread overhead. While relying on existing application-level custom events is ideal, when a `MutationObserver` is necessary to catch changes from multiple sources (like inline scripts and user toggles), it must be scoped.
**Action:** Added `attributeFilter: ["class"]` to the global `MutationObserver` in `Base.astro` and added an explicit `updateThemeColor()` call on load to prevent missing initial state syncs. This prevents the observer from firing on non-class attribute changes, improving main-thread performance.

## 2026-03-03 - Reverting <Picture> to <img> Regression

**Learning:** Replacing Astro's `<Picture>` components with `getImage()` and native `<img>` tags across the application to "reduce DOM nodes" is a massive anti-pattern for responsive design. While it removes a `<picture>` wrapper, it strips out all `widths` and `sizes` properties, forcing mobile devices to download high-resolution desktop images, completely destroying LCP performance on low-end devices.
**Action:** Never replace responsive `<Picture>` components with single `<img>` tags unless the image strictly has a fixed, small dimension (like an icon).

## 2026-03-03 - DOM Query Pre-filtering with View Transitions

**Learning:** In Astro with View Transitions, scripts that attach to elements often re-execute to handle newly swapped DOM nodes. Queries like `document.querySelectorAll(".prose pre")` and applying checks in a loop cause redundant JS execution over nodes that have already been handled.
**Action:** Shift the filtering logic to the browser's native C++ engine by using specific CSS pseudo-classes in the query itself, such as `document.querySelectorAll(".prose pre:not(.code-wrapper pre)")`. This is significantly faster and makes the JavaScript simpler.

## 2026-03-03 - O(N) Array Filter vs O(limit) Early Exit

**Learning:** When generating multiple static pages during SSG (e.g., `LatestPosts` rendered on every project page), chaining `.filter(post => post.title !== skip).slice(0, limit)` iterates over the entire collection creating new array instances every time. For N projects, this is an O(N) operation per page, compounding to O(N²) across the build, creating unnecessary CPU cycles and memory garbage.
**Action:** Replace `Array.prototype.filter().slice()` chains with a basic `for` loop that pushes to an array and `break`s as soon as the limit is reached. This drops the complexity from O(N) to O(limit) locally, turning the global build impact from O(N²) to O(N * limit).
