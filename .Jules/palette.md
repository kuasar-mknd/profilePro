## 2024-05-22 - Decorative Infinite Carousels
**Learning:** Infinite scroll carousels that serve purely as "visual ambiance" (no interactive elements) can create massive accessibility noise if they contain many images with alt text. Screen readers will announce every single duplicate image, confusing the user.
**Action:** Always mark such decorative, non-interactive carousels with `aria-hidden="true"` to remove them from the accessibility tree, while ensuring the actual content (projects) is available elsewhere in an accessible format.
