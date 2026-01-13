## 2025-05-17 - Idle DOM Initialization
**Learning:** Heavy global DOM scanners (like security auditors or accessibility fixers running on `document.body`) block the main thread during critical hydration/navigation phases (`astro:after-swap`).
**Action:** Wrap these non-critical initializations in `requestIdleCallback` (with `setTimeout` fallback). This unblocks the main thread for user interaction while ensuring the tasks eventually run. Use a helper function `runWhenIdle` for consistency.
