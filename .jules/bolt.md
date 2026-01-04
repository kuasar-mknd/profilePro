## 2024-05-23 - Event Delegation for Global Components
**Learning:** When using a global interactive component (like `Lightbox.astro` in `Base.astro`) that handles events for distributed elements (like gallery images), do not duplicate event listeners in the child components.
**Action:** Rely on the global component's delegated listeners (`document.addEventListener`) to handle interactions. This reduces memory usage (N listeners -> 1 listener) and prevents potential double-handling logic or race conditions. Ensure the global component is always present (e.g., in the Layout) before removing child listeners.

## 2024-05-24 - Observer Cleanup in View Transitions
**Learning:** When using `IntersectionObserver` singletons with Astro View Transitions (`ClientRouter`), simply reusing the observer causes memory leaks. The observer retains references to detached DOM nodes from previous pages because `ClientRouter` swaps the body content but the observer persists in the module scope.
**Action:** Always attach an `astro:after-swap` listener to explicitly `disconnect()` any singleton observers. This flushes the list of observed targets (releasing the detached nodes) before the new page's logic runs on `astro:page-load`.
