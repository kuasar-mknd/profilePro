## 2024-05-23 - Event Delegation for Global Components
**Learning:** When using a global interactive component (like `Lightbox.astro` in `Base.astro`) that handles events for distributed elements (like gallery images), do not duplicate event listeners in the child components.
**Action:** Rely on the global component's delegated listeners (`document.addEventListener`) to handle interactions. This reduces memory usage (N listeners -> 1 listener) and prevents potential double-handling logic or race conditions. Ensure the global component is always present (e.g., in the Layout) before removing child listeners.

## 2026-01-06 - Capping Infinite Scroll Items
**Learning:** When implementing infinite scroll by duplicating items, always apply a hard cap (e.g., slice(0, 15)) to the source array. Relying on the natural collection size allows DOM node count to grow unbounded as content is added, degrading performance over time.
**Action:** Explicitly slice source arrays for purely visual carousels/marquees.
