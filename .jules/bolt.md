## 2024-05-23 - Event Delegation for Global Components
**Learning:** When using a global interactive component (like `Lightbox.astro` in `Base.astro`) that handles events for distributed elements (like gallery images), do not duplicate event listeners in the child components.
**Action:** Rely on the global component's delegated listeners (`document.addEventListener`) to handle interactions. This reduces memory usage (N listeners -> 1 listener) and prevents potential double-handling logic or race conditions. Ensure the global component is always present (e.g., in the Layout) before removing child listeners.

## 2024-05-24 - LCP Image Decoding
**Learning:** For LCP candidates (images above the fold), explicitly setting `decoding="sync"` alongside `loading="eager"` and `fetchpriority="high"` can improve LCP by ensuring the image is painted immediately after loading, rather than waiting for an async decode.
**Action:** Use `decoding={priority ? "sync" : "async"}` for critical image components to optimize paint timing while preventing main-thread blocking for non-critical images.
