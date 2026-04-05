## 2026-03-12 - O(N) Array iteration in IntersectionObserver

**Learning:** When using an `IntersectionObserver` to highlight active navigation items like a Table of Contents (`src/components/features/projects/TableOfContents.astro`), running an O(N) `querySelectorAll` or `Array.forEach` loop inside the callback to match `id`s to link elements creates an O(M \* N) overhead on every scroll event where an element intersects. This can cause unnecessary layout thrashing and main thread delays on scroll.
**Action:** Replace the O(N) loop with an O(1) Map lookup. Create a `Map<string, Element[]>` during component initialization linking heading IDs to their respective navigation link elements. Then, during the intersection callback, look up the target ID in the map and apply the active state directly in O(1) time. Keep track of the currently active elements to easily deactivate them on the next change.

## 2026-03-12 - Expensive Intl.DateTimeFormat instantiation in high-frequency components

**Learning:** When using `Intl.DateTimeFormat` inside a component that is rendered frequently (like a post/project card rendered for every item in a list or grid during SSG), creating a new instance on every render is computationally expensive and measurably slows down build times in Node/Bun environments.
**Action:** Cache the `Intl.DateTimeFormat` instance globally (e.g., using `globalThis.__publishDateFormatter`) so it is only instantiated once and reused across all component renders. Ensure the global variable is typed in `src/env.d.ts` to prevent TypeScript errors.

## 2026-03-15 - Optimize getReadingTime Cache Memory

**Learning:** Caching results of operations on large strings using composite keys (e.g. `${wpm}:${text}`) causes severe memory allocations because it duplicates the large string for the key.
**Action:** Replaced composite string caching with a `Map` keyed directly to the original `text` reference, caching the intermediate `wordCount` instead of the final result. Reduced memory allocation from ~76MB to 0MB per 100 misses on 1MB strings.

## 2024-05-19 - Replaced heavy Picture component with img and srcset

**Learning:** In Astro, the `<Picture>` component generates multiple `<source>` tags for different formats and sizes. When this component is used in repeatedly rendered elements (like Post cards in LatestPosts or Project loops), it creates immense DOM bloat, increasing frontend parsing time and memory overhead.
**Action:** Use `getImage` to pre-generate optimized WebP assets and pass them to a standard `<img>` tag via `srcset` and `sizes` attributes. This provides the exact same responsive functionality but drastically reduces DOM complexity.

## 2025-03-17 - Bounded concurrency for getImage calls

**Learning:** In Astro SSG builds, calling `getImage()` repeatedly inside frequent components (like a Post card rendered in an unbounded `map` loop) without concurrency limits can cause massive memory allocation overhead and CPU spikes.
**Action:** Always wrap heavy asynchronous generation functions like `getImage()` in a concurrency limiting wrapper (e.g., `limitConcurrency`) when used repeatedly in components that iterate over large collections.

## 2025-03-17 - RegEx and Map hoisting

**Learning:** Instantiating Regular Expressions and lookup dictionaries inside heavily-called string formatting or sanitization functions (like `sanitizeInput`) causes redundant memory reallocation on every call.
**Action:** Extract static regex patterns and replacement dictionaries to the module/file scope outside of the function body.

## 2024-05-18 - Awaiting sequential Astro operations

**Learning:** Sequential async operations like `entry.render()`, `getEntry()`, and multiple `getImage()` calls block execution during Astro SSG builds and create measurable performance overhead per mapped page.
**Action:** Group these independent asynchronous operations into a single `Promise.all()` to dramatically increase SSG concurrency and shorten build time, maintaining typing via `Awaited<ReturnType<typeof func>>`.

## 2026-03-20 - Replace forEach with standard for loops

**Learning:** Using `Array.prototype.forEach` or `NodeList.prototype.forEach` creates a new function execution context (callback) for every item in the array or list. In performance-critical sections like scroll events, mutation observers, or components rendered frequently, this allocation overhead and lack of loop optimization adds up to measurable CPU spikes.
**Action:** Replace `forEach` with standard `for (let i = 0; i < elements.length; i++)` loops or `for...of` loops. This avoids the function callback allocation overhead and allows JavaScript engines (V8/JavaScriptCore) to better optimize the hot path execution.

## 2026-03-24 - Base Layout getImage Parallelization

**Learning:** Sequential `await getImage` calls in layout frontmatter (like `Base.astro`) block the main thread and significantly slow down SSG builds, as they execute per-page.
**Action:** Group these calls into `Promise.all()` to enable concurrent fetching and processing.

## 2026-03-24 - Global ResizeObserver Singleton

**Learning:** Instantiating multiple `ResizeObserver`s that all observe `document.documentElement` across different components (like Base layout, individual projects, etc.) causes memory overhead and redundant layout thrashing during scroll/resize events.
**Action:** Consolidate multiple `ResizeObserver`s into a single `window.__globalResizeObserver` singleton in `src/layouts/Base.astro`. This singleton observes `document.documentElement` once and dispatches a lightweight custom `app:resize` event that other components can listen to using standard `window.addEventListener('app:resize', ...)`.

## 2026-03-24 - Efficient Scroll Progress Calculation

**Learning:** In Astro components with scroll listeners (like `scroll-progress` in `[slug].astro`), calculating the scroll progress using `document.body.scrollTop || document.documentElement.scrollTop` forces a synchronous layout reflow on every scroll frame.
**Action:** Replace `document.body.scrollTop || document.documentElement.scrollTop` with the pre-calculated `window.scrollY` value to prevent layout thrashing and preserve smooth scrolling performance (60fps).

## 2026-03-24 - Layout Thrashing with Width Animation

**Learning:** Animating properties like `width` on elements (like a scroll progress bar) using CSS transitions or requestAnimationFrame forces the browser to recalculate the layout (reflow) on every frame. This causes layout thrashing and significant main thread jank, especially on mobile devices.
**Action:** Replace layout-triggering property animations with composite-layer animations like `transform: scaleX(...)`. Add `origin-left` and `will-change: transform` to ensure the animation is offloaded to the GPU without triggering layout reflows.

## 2026-03-24 - Singleton Pattern for View Transitions Observers

**Learning:** In Astro applications using View Transitions, component `<script>` tags may re-execute upon page navigation (e.g., via `astro:after-swap`). If observers (like `IntersectionObserver` or `MutationObserver`) are not explicitly disconnected and their references are lost, they accumulate and cause memory leaks or duplicate execution. Relying solely on a DOM dataset check (e.g., `data-observer-initialized="true"`) is insufficient if the DOM node itself is recreated during the transition.
**Action:** Always use the Singleton Pattern for observers. Store the observer instance on the `window` object (e.g., `window.__carouselObserver`), explicitly call `.disconnect()` if it already exists before creating a new one, and attach an event listener to `astro:before-swap` or `astro:after-swap` to ensure proper cleanup during navigation.

## 2026-03-24 - Expensive window.matchMedia parsing in event listeners

**Learning:** Evaluating `window.matchMedia("(prefers-reduced-motion: reduce)").matches` inside hot paths like event listeners (e.g., `click` or `mousemove`) forces the browser engine to repeatedly parse and evaluate the media query string upon every interaction, which can cause micro-stutters.
**Action:** Always cache the `MediaQueryList` object outside the listener (e.g., `const prefersReducedMotionQuery = window.matchMedia(...)`) and strictly evaluate its `.matches` property inside the listener callback to eliminate the string parsing overhead.

## 2026-03-24 - Frontmatter Array Map Optimization

**Learning:** In Astro components, iterating over the same props array multiple times (e.g., using `.map()` for JSON-LD schema generation and then again for HTML rendering) causes redundant allocations and repetitive function calls (like `sanitizeUrl` or `new URL`).
**Action:** Consolidate multiple `.map()` passes into a single frontmatter variable (e.g., `processedItems`) that pre-calculates sanitized properties, schema objects, and loop conditions (like `isLast`). This avoids duplicating work in both the metadata generation and the template execution.

## 2025-05-18 - Caching matchMedia in event listeners

**Learning:** `window.matchMedia("(prefers-reduced-motion: reduce)")` string parsing and evaluation can become a bottleneck when executed repeatedly inside high-frequency event listeners like `click` or `scroll`.
**Action:** Always cache the `MediaQueryList` object outside the listener using a variable like `prefersReducedMotionQuery` and check its `.matches` property dynamically inside the listener callback to correctly access the current media status without parsing overhead.

## 2026-03-24 - Cache matchMedia outside class constructor

**Learning:** Initializing window.matchMedia inside a class constructor still forces the browser engine to repeatedly parse the media query string every time the class is instantiated on page load or navigation.
**Action:** Always cache the MediaQueryList object at the top level of the script block, outside of any class definitions or event listeners, to strictly evaluate its matches property when needed and eliminate string parsing overhead entirely across instantiations.
| 2024-03-31 | Bolt | src/pages/cv/[...lang].astro | Replaced synchronous fs.readFileSync with asynchronous fs.promises.readFile to prevent main thread blocking during SSG page generation |

## 2024-04-01 - Cache matchMedia globally in inline scripts
**Learning:** `window.matchMedia("(prefers-color-scheme: dark)")` parsing and evaluation inside a frequently called function (like `applyTheme` triggered on every page transition via View Transitions) forces the browser engine to repeatedly parse the media query string, which is a micro-stutter hazard.
**Action:** Always cache the `MediaQueryList` object outside the function body (at the top level of the inline script) and check its `.matches` property dynamically inside the function to eliminate the string parsing overhead.

## 2026-03-24 - Native querySelectorAll vs JS loop filtering

**Learning:** When optimizing client-side DOM queries, prefer native `querySelectorAll` over `getElementsByClassName` or `getElementsByTagName` combined with manual JavaScript filtering loops. Native `querySelectorAll` is highly optimized in modern browser engines (written in C++), making manual JS filtering (like using `closest()` or `classList.contains()` inside a loop) generally slower and an unnecessary micro-optimization, and it increases main-thread work.
**Action:** Replace `getElementsByTagName` with manual loops with `querySelectorAll` with the appropriate CSS selector.
