## 2024-05-23 - Event Delegation for Global Components
**Learning:** When using a global interactive component (like `Lightbox.astro` in `Base.astro`) that handles events for distributed elements (like gallery images), do not duplicate event listeners in the child components.
**Action:** Rely on the global component's delegated listeners (`document.addEventListener`) to handle interactions. This reduces memory usage (N listeners -> 1 listener) and prevents potential double-handling logic or race conditions. Ensure the global component is always present (e.g., in the Layout) before removing child listeners.

## 2024-05-24 - Dynamic `will-change` Management
**Learning:** Applying `will-change: transform` globally via CSS (e.g., on list items or cards) forces the browser to reserve GPU memory for every instance, which can lead to high VRAM usage on pages with many elements.
**Action:** Apply `will-change` dynamically via JavaScript only during the interaction (e.g., `mouseenter` or `touchstart`) and remove it (`auto`) immediately after (`mouseleave` or `touchend`). This preserves smooth animations while significantly reducing idle memory consumption.
