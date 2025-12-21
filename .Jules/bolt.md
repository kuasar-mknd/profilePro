## 2024-05-23 - Lazy Loading External Widgets

**Learning:** When lazy-loading third-party widgets (like Website Carbon Badge) using `IntersectionObserver`, always assign a `min-height` or explicit dimensions to the placeholder container.
**Reason:** Without dimensions, the container may have 0px height, causing the `IntersectionObserver` to trigger immediately (or fail to trigger correctly depending on layout), defeating the lazy-loading purpose and causing Cumulative Layout Shift (CLS) when the content eventually loads.
**Action:** Always verify `min-h-[size]` is present on lazy-loaded containers.
