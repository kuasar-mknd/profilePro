## 2024-05-23 - Event Delegation for Global Components
**Learning:** When using a global interactive component (like `Lightbox.astro` in `Base.astro`) that handles events for distributed elements (like gallery images), do not duplicate event listeners in the child components.
**Action:** Rely on the global component's delegated listeners (`document.addEventListener`) to handle interactions. This reduces memory usage (N listeners -> 1 listener) and prevents potential double-handling logic or race conditions. Ensure the global component is always present (e.g., in the Layout) before removing child listeners.

## 2024-05-24 - Lazy Initialization of Global UI Components
**Learning:** Global components (like Lightbox) that run on every page load can cause unnecessary main-thread blocking if they eagerly query the DOM for elements that might not exist or aren't immediately needed (e.g., `inertElements` or `galleryElements`).
**Action:** Implement lazy initialization using getter patterns or checks (e.g., `if (this.elements.length === 0)`) inside interaction methods (`open`, `activate`) rather than in the constructor or `init()` method. This defers the cost of `querySelectorAll` until the user actually interacts with the component.
