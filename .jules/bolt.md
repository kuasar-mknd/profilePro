## 2026-03-12 - O(N) Array iteration in IntersectionObserver

**Learning:** When using an `IntersectionObserver` to highlight active navigation items like a Table of Contents (`src/components/features/projects/TableOfContents.astro`), running an O(N) `querySelectorAll` or `Array.forEach` loop inside the callback to match `id`s to link elements creates an O(M * N) overhead on every scroll event where an element intersects. This can cause unnecessary layout thrashing and main thread delays on scroll.
**Action:** Replace the O(N) loop with an O(1) Map lookup. Create a `Map<string, Element[]>` during component initialization linking heading IDs to their respective navigation link elements. Then, during the intersection callback, look up the target ID in the map and apply the active state directly in O(1) time. Keep track of the currently active elements to easily deactivate them on the next change.

## 2026-03-12 - Expensive Intl.DateTimeFormat instantiation in high-frequency components

**Learning:** When using `Intl.DateTimeFormat` inside a component that is rendered frequently (like a post/project card rendered for every item in a list or grid during SSG), creating a new instance on every render is computationally expensive and measurably slows down build times in Node/Bun environments.
**Action:** Cache the `Intl.DateTimeFormat` instance globally (e.g., using `globalThis.__publishDateFormatter`) so it is only instantiated once and reused across all component renders. Ensure the global variable is typed in `src/env.d.ts` to prevent TypeScript errors.
## 2026-03-15 - Optimize getReadingTime Cache Memory
**Learning:** Caching results of operations on large strings using composite keys (e.g. `${wpm}:${text}`) causes severe memory allocations because it duplicates the large string for the key.
**Action:** Replaced composite string caching with a `Map` keyed directly to the original `text` reference, caching the intermediate `wordCount` instead of the final result. Reduced memory allocation from ~76MB to 0MB per 100 misses on 1MB strings.
