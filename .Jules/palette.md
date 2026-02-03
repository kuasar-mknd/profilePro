# Palette's Journal - UX & Accessibility Learnings

## 2025-05-15 - Scroll Indicator Pattern in Astro
**Learning:** Adding a scroll indicator to a long hero section improves content discovery, especially on mobile. In Astro with View Transitions, global scroll listeners must be managed carefully: attached on `astro:page-load` and explicitly removed on `astro:before-swap` to prevent memory leaks and duplicate behaviors.
**Action:** Always use the `astro:page-load` / `astro:before-swap` lifecycle pair for scroll-based UX elements.

## 2025-05-15 - Decorative Carousel Accessibility
**Learning:** Infinite carousels used for background "vibe" or decorative flair should be explicitly hidden from screen readers using `aria-hidden="true"`, even if they contain informative images. This reduces DOM noise and prevents screen readers from tabbing through dozens of redundant items that are already listed elsewhere in a primary navigation or bento grid.
**Action:** Identify decorative-only repeating elements and apply `aria-hidden="true"` to their parent container.
