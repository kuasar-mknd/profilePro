## 2025-02-20 - Redundant Event Listeners in Component Interactions
**Learning:** When multiple components interact (e.g., Gallery and Lightbox), ensure event handling responsibilities are clearly defined to avoid duplication. I found that `ImageGallery` was adding a `keydown` listener to simulate clicks, while `Lightbox` was *also* listening for `keydown` globally. This caused double execution of the open logic and unnecessary event listener overhead.
**Action:** Centralize interaction logic in the controlling component (`Lightbox`) and keep UI components (`ImageGallery`) purely presentational where possible, relying on global delegation for interactions.

## 2025-02-21 - Capping Infinite Scroll DOM Size
**Learning:** In infinite scroll carousels that duplicate items for looping, using the full dataset (e.g., all projects) can lead to exponential DOM growth as content scales. Slicing the dataset to a sufficient minimum (e.g., 15 items) before duplication ensures performance remains O(1) regardless of total content size.
**Action:** Always slice datasets used for visual-only loops to the minimum required for screen coverage + buffer.
