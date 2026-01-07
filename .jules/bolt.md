## 2024-05-23 - Event Delegation for Global Components

**Learning:** When using a global interactive component (like `Lightbox.astro` in `Base.astro`) that handles events for distributed elements (like gallery images), do not duplicate event listeners in the child components.
**Action:** Rely on the global component's delegated listeners (`document.addEventListener`) to handle interactions. This reduces memory usage (N listeners -> 1 listener) and prevents potential double-handling logic or race conditions. Ensure the global component is always present (e.g., in the Layout) before removing child listeners.

## 2024-05-23 - content-visibility Optimization

**Learning:** Adding `content-visibility: auto` to large off-screen sections (like `ServicesPreview`) is a safe, high-impact optimization.
**Action:** Always pair it with `contain-intrinsic-size` to prevent scrollbar jumping and CLS. This can be done via inline styles if Tailwind utilities are not available.
