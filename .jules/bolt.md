Bolt: Optimized Footer, AuthorInfo, and ImageGallery rendering performance.
## 2025-02-18 - JIT Layer Promotion
**Learning:** Applying `will-change: transform` globally (e.g., via utility classes on many elements) is a memory anti-pattern. It forces the browser to keep compositor layers active even when elements are off-screen.
**Action:** Use a "Just-in-Time" approach: apply `will-change` via JS in an `IntersectionObserver` just before the animation starts, and remove it on `transitionend`.
