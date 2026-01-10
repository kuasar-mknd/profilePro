## 2024-05-23 - Conditional Scroll Listeners

**Learning:** Attaching scroll listeners globally (even passive ones) adds main-thread overhead on every scroll event, even if the element they affect is hidden.
**Action:** Use `IntersectionObserver` to dynamically attach/detach scroll listeners based on the visibility of the target UI element. This ensures the listener only runs when strictly necessary (e.g., when the 'Back to Top' button is actually visible).

⚡ Bolt: Critical Architectural Bottlenecks
