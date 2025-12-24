## 2024-05-23 - Astro View Transitions & Event Listeners
**Learning:** In Astro with View Transitions (`ClientRouter`), `document` persists across navigations. Adding event listeners to `document` inside component scripts (which re-run on every navigation) creates memory leaks and duplicate handlers if not explicitly cleaned up.
**Action:** Always store cleanup functions for global listeners in module-scoped variables and call them before re-initialization. Closure-based listeners (defined inside `init`) must be captured for removal.
