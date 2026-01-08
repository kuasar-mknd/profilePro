## 2024-05-23 - Event Delegation for Global Components
**Learning:** When using a global interactive component (like `Lightbox.astro` in `Base.astro`) that handles events for distributed elements (like gallery images), do not duplicate event listeners in the child components.
**Action:** Rely on the global component's delegated listeners (`document.addEventListener`) to handle interactions. This reduces memory usage (N listeners -> 1 listener) and prevents potential double-handling logic or race conditions. Ensure the global component is always present (e.g., in the Layout) before removing child listeners.

## 2024-05-24 - Lazy Initialization of Global UI Components
**Learning:** Global components (like Lightbox) that run on every page load can cause unnecessary main-thread blocking if they eagerly query the DOM for elements that might not exist or aren't immediately needed (e.g., `inertElements` or `galleryElements`).
**Action:** Implement lazy initialization using getter patterns or checks (e.g., `if (this.elements.length === 0)`) inside interaction methods (`open`, `activate`) rather than in the constructor or `init()` method. This defers the cost of `querySelectorAll` until the user actually interacts with the component.

## 2025-02-20 - Redundant Event Listeners in Component Interactions
**Learning:** When multiple components interact (e.g., Gallery and Lightbox), ensure event handling responsibilities are clearly defined to avoid duplication. I found that `ImageGallery` was adding a `keydown` listener to simulate clicks, while `Lightbox` was *also* listening for `keydown` globally. This caused double execution of the open logic and unnecessary event listener overhead.
**Action:** Centralize interaction logic in the controlling component (`Lightbox`) and keep UI components (`ImageGallery`) purely presentational where possible, relying on global delegation for interactions.

## 2025-02-20 - Content Visibility for Off-Screen Sections
**Learning:** Applying `content-visibility: auto` to large, static sections that are typically off-screen (like Footer, ContactForm, CTA) is a high-yield, low-risk optimization. It significantly reduces main-thread work during initial load by deferring layout and paint.
**Action:** Implemented `[content-visibility:auto]` with `[contain-intrinsic-size:...]` using Tailwind arbitrary values across 4 major UI sections.
