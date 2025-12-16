# Bolt's Journal - Critical Learnings

## 2025-02-27 - [Initial Setup]

**Learning:** Initialized Bolt's journal for performance tracking.
**Action:** Record critical performance learnings here.

## 2025-12-16 - [Astro View Transitions & Singletons]

**Learning:** When using Astro View Transitions, the `astro:page-load` event fires on every navigation. Creating new class instances (like Lightbox, IntersectionObservers) in these handlers causes memory leaks and duplicate event listeners. Singleton patterns with `rebind` methods are essential.
**Action:** Always check for existing instances before creating new ones. Use initialization guards (e.g., `dataset.initialized`) and cache references at module scope.
