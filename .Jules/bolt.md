## 2024-05-23 - Lazy Loading External Widgets

**Learning:** When lazy-loading third-party widgets (like Website Carbon Badge) using `IntersectionObserver`, always assign a `min-height` or explicit dimensions to the placeholder container.
**Reason:** Without dimensions, the container may have 0px height, causing the `IntersectionObserver` to trigger immediately (or fail to trigger correctly depending on layout), defeating the lazy-loading purpose and causing Cumulative Layout Shift (CLS) when the content eventually loads.
**Action:** Always verify `min-h-[size]` is present on lazy-loaded containers.

## 2024-05-24 - Caching Layout Metrics

**Learning:** Caching `document.scrollHeight` or `clientHeight` outside the event loop (e.g., on load) is unsafe for dynamic pages.
**Reason:** Content loaded asynchronously (images, fonts, accordions) changes dimensions without triggering a resize event, causing cached metrics to become stale and scroll calculations to break.
**Action:** Calculate layout metrics *inside* the throttled `requestAnimationFrame` loop. The performance cost is negligible compared to the correctness gain, provided the loop itself is throttled.
