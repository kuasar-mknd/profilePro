[Output truncated for brevity]

edundantly processing nodes that have already been modified.
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

## 2026-03-04 - O(N²) Array Splice in Promise Loops

**Learning:** Managing concurrent promises in a loop by storing them in an array and using `executing.splice(executing.indexOf(e), 1)` upon completion creates an O(N²) time complexity bottleneck. Finding the index and splicing the array shifts elements repeatedly on the main thread, causing significant CPU lag when processing thousands of items (e.g., image optimization during SSG).
**Action:** Replace `Promise.race` and `Array.splice` concurrency management with a worker-pool pattern. Creating a fixed number of async "worker" functions that pull from a shared `currentIndex` iterator processes tasks with O(1) overhead per task, completely eliminating array mutations.

## 2025-02-14 - Optimize Tag Pages SSG Generation
**Learning:** During Astro Static Site Generation (SSG), dynamic routes that depend on grouped data (like `/project/tag/[tag]`) can suffer from O(T * N) performance if they map over a set of unique tags and filter the entire content collection for each tag. For repositories with many items and tags, this causes massive redundant array allocations.
**Action:** Replace `uniqueTags.map(tag => allItems.filter(...))` patterns in `getStaticPaths` with a single O(N) pass over `allItems` that groups items into a `Map<string, Item[]>` and computes associated counts simultaneously.

## 2026-03-04 - Event Delegation for SPA Navigations

**Learning:** In Astro with View Transitions, querying DOM elements like `document.querySelectorAll('[data-slide-transition]')` on initial load fails to attach event listeners to newly injected elements after a page transition unless explicitly re-initialized on `astro:page-load`. Additionally, looping over these elements creates an O(N) performance overhead.
**Action:** Use a single event delegation listener attached to `document` for `click` events. This completely avoids DOM queries, reduces memory usage (from N listeners to 1), and automatically handles dynamically injected elements with zero re-initialization overhead.

## 2026-03-04 - Optimize Carousel Array Allocation

**Learning:** When randomly picking a small subset of items (e.g., 15 items) from a large array (like a collection of `projectImages` in `Hero.astro`), performing a full array clone (`[...array]`) and then executing an O(N) shuffle function allocates unnecessary memory and burns CPU cycles during the SSG build. As the content repository grows, this $O(N)$ operation worsens.

**Action:** Replace the full array clone and O(N) shuffle with an O(K) partial Fisher-Yates algorithm. By iterating only up to the limit (K=15) and randomly picking/swapping indices from a tracking array, you can extract the exact number of unique random items directly in $O(K)$ time, effectively capping memory and CPU usage regardless of total content size.

## 2026-03-05 - Synchronous scrollHeight reads cause layout thrashing

**Learning:** Setting an element's style (e.g., `textarea.style.height = "auto"`) and immediately reading a layout property (e.g., `textarea.scrollHeight`) within the same synchronous event handler (like `input`) forces the browser to recalculate the layout synchronously on the main thread. This causes layout thrashing and jank during rapid typing.
**Action:** Wrap the height recalculation logic inside `requestAnimationFrame`. This debounces the layout read/write operations and syncs them with the browser's render cycle, preventing the main thread from blocking.
## 2026-03-05 - Avoid DOM queries in keydown handlers

**Learning:** Running `document.querySelectorAll()` or `element.querySelectorAll()` inside frequently triggered event handlers like `keydown` (especially for common keys like Tab in a focus trap) executes redundantly on the main thread. Since the structure of a modal or menu rarely changes while it is open, querying the DOM on every keystroke burns CPU cycles unnecessarily.
**Action:** When setting up a focus trap or similar keyboard interaction, cache the focusable elements (or specifically the first and last elements) during the initialization phase (e.g., when the menu opens). Use these cached references inside the `keydown` handler instead of executing a new DOM query.

## 2026-03-05 - Event Delegation over node iteration for interactions
**Learning:** Using `querySelectorAll("a").forEach(link => link.addEventListener("click", ...))` inside component initialization scripts creates O(N) event listeners and executes a redundant DOM query for interactive menus. This increases main thread execution time.
**Action:** Replace `querySelectorAll` loops with event delegation by attaching a single listener to the parent container (`nav.addEventListener("click", ...)`) and using `e.target.closest("a")` to detect interactions.

## 2026-03-05 - Event Delegation over node iteration for interactions
**Learning:** Using `querySelectorAll(".tilt-card:not(.tilt-initialized)")` inside component initialization scripts creates O(N) DOM queries and attaches an event listener to each matching element. This increases main thread execution time, particularly in lists with many items, and increases memory usage.
**Action:** Replace `querySelectorAll` loops with event delegation by attaching a single listener to the document (`document.addEventListener("mouseover", ...)`) and using `e.target.closest(".tilt-card")` to detect interactions and initialize elements dynamically only when needed.

## 2025-02-19 - The "Delegator" Batch (Event Delegation)
**Learning:** Found multiple instances where event listeners were being redundantly attached inside `querySelectorAll` loops for UI components (ModeSwitch) and dynamically generated elements (code copy buttons). This creates O(N) memory overhead and requires complex cleanup logic for Astro view transitions.
**Action:** Replaced O(N) `.forEach(btn => btn.addEventListener('click', ...))` bindings with O(1) `document.addEventListener('click', ...)` delegation using `e.target.closest()`. Applied this fix to `src/components/ui/ModeSwitch.astro`, `src/pages/[slug].astro`, and `src/pages/project/[slug].astro`, significantly reducing listener count and improving memory efficiency.

## 2026-03-05 - Event Delegation over node iteration for resource prefetching
**Learning:** Using `querySelectorAll(".video-player-wrapper").forEach(wrapper => wrapper.addEventListener("mouseenter", ...))` inside component initialization scripts creates O(N) event listeners and executes a redundant DOM query for resource prefetching. This increases main thread execution time, particularly when dealing with multiple video elements on a single page, and increases memory usage.
**Action:** Replace `querySelectorAll` loops with event delegation by attaching a single listener to the document (`document.addEventListener("mouseover", ...)`) and using `e.target.closest(".video-player-wrapper")` to detect interactions and initiate resource prefetching dynamically only when needed. Added an initialization guard and cleanup logic to remove the global listeners once prefetching is complete.
