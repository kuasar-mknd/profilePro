## 2025-02-20 - Global Listeners in Astro Transitions
**Learning:** In Astro with View Transitions, global scripts run once, but `astro:after-swap` re-runs initialization logic. If event listeners (window scroll, resize) are not explicitly removed before re-adding, they stack up indefinitely, causing memory leaks and performance degradation as they reference detached DOM elements.
**Action:** Always implement a cleanup pattern (store `cleanup` function in module scope) for any component that attaches global listeners or observers.
