## 2024-05-23 - Inline Scripts and View Transitions Memory Leaks
**Learning:** In Astro with ClientRouter (View Transitions), scripts inside `<body>` without `is:inline` (which are processed as modules) or with `is:inline` (raw) are re-executed on every navigation if they are part of the swapped content. This leads to stacking event listeners (e.g., `document.addEventListener`) if cleanup logic is not implemented.
**Action:** When initializing global listeners in such scripts, either:
1. Use `astro:page-load` exclusively (it covers both initial load and swap) and avoid manual function calls that duplicate the logic.
2. Implement robust cleanup using a singleton pattern or `astro:before-swap` to remove previous listeners before adding new ones.
3. For heavy optimizations (like `MutationObserver` on `body`), carefully evaluate if the "catch-all" approach is worth the performance cost versus targeted handling in specific components.
