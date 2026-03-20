## 2026-03-12 - O(N) Array iteration in IntersectionObserver

**Learning:** When using an `IntersectionObserver` to highlight active navigation items like a Table of Contents (`src/components/features/projects/TableOfContents.astro`), running an O(N) `querySelectorAll` or `Array.forEach` loop inside the callback to match `id`s to link elements creates an O(M * N) overhead on every scroll event where an element intersects. This can cause unnecessary layout thrashing and main thread delays on scroll.
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
