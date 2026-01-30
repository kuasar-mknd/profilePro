# Bolt's Performance Journal

## 2024-05-22 - Unified IntersectionObservers
**Learning:** I found that `Hero.astro` and `Base.astro` were both instantiating separate `IntersectionObserver` instances to perform nearly identical tasks (toggling a `.paused` class on off-screen elements). This increases memory usage and complexity.
**Action:** When implementing visibility-based optimizations (like pausing animations), always check if the global animation optimizer in `Base.astro` can be extended by adding a selector, rather than writing a new observer in the component.
