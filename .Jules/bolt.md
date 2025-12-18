# Bolt's Journal - Critical Learnings

## 2025-02-27 - [Initial Setup]

**Learning:** Initialized Bolt's journal for performance tracking.
**Action:** Record critical performance learnings here.

## 2025-12-16 - [Astro View Transitions & Singletons]

**Learning:** When using Astro View Transitions, the `astro:page-load` event fires on every navigation. Creating new class instances (like Lightbox, IntersectionObservers) in these handlers causes memory leaks and duplicate event listeners. Singleton patterns with `rebind` methods are essential.
**Action:** Always check for existing instances before creating new ones. Use initialization guards (e.g., `dataset.initialized`) and cache references at module scope.

## 2025-12-16 - [Magnetic Button Interaction]

**Learning:** Apply magnetic transforms to the _element itself_ causes it to move out from under the cursor, triggering a -> -> loop (flickering).
**Action:** Always use a **Wrapper/Target** pattern. The detects mouse events and stays static. The (inner child) receives the transform.

## 2025-12-16 - [Expert Optimizations: Speculation Rules & PWA]

**Learning:** is the modern standard for instant navigation, replacing older prefetch libraries. makes offline support trivial with the right configuration.
**Action:** When optimizing fonts, always verify if generic Google Fonts binaries are full-size. Using binaries for specific subsets (like Latin) can save ~50% of font file size vs standard fetches.

## 2025-02-27 - [Layout Thrashing in Tilt Interactions]

**Learning:** Querying `getBoundingClientRect()` inside a `mousemove` handler forces the browser to recalculate layout (reflow) on every frame, causing significant jank.
**Action:** Cache layout metrics on `mouseenter` and only read them during calculation. Use `requestAnimationFrame` to decouple the input sampling rate (mouse events) from the render rate (screen refresh).
