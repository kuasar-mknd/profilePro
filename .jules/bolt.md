## 2025-02-20 - Redundant Event Listeners in Component Interactions
**Learning:** When multiple components interact (e.g., Gallery and Lightbox), ensure event handling responsibilities are clearly defined to avoid duplication. I found that `ImageGallery` was adding a `keydown` listener to simulate clicks, while `Lightbox` was *also* listening for `keydown` globally. This caused double execution of the open logic and unnecessary event listener overhead.
**Action:** Centralize interaction logic in the controlling component (`Lightbox`) and keep UI components (`ImageGallery`) purely presentational where possible, relying on global delegation for interactions.

## 2025-02-20 - Content Visibility for Off-Screen Sections
**Learning:** Applying `content-visibility: auto` to large, static sections that are typically off-screen (like Footer, ContactForm, CTA) is a high-yield, low-risk optimization. It significantly reduces main-thread work during initial load by deferring layout and paint.
**Action:** Implemented `[content-visibility:auto]` with `[contain-intrinsic-size:...]` using Tailwind arbitrary values across 4 major UI sections.
## 2025-02-20 - Perceived Performance via Prefetching
**Learning:** For heavy interactions that require large modules (like a video player), waiting for the 'click' event to load resources introduces noticeable latency (~200ms+). Prefetching the resources on 'hover' or 'focus' (with a global flag to prevent duplication) effectively eliminates this delay, making the interface feel instant without increasing initial page load size.
**Action:** Applied 'hover-to-prefetch' pattern to the VideoPlayer component.
