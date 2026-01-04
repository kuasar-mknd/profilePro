## 2024-05-23 - [Keyboard Affordance Parity]
**Learning:** Visual affordances designed for hover states (like zoom overlays or "view more" icons) are often completely invisible to keyboard users. This creates a "second-class" experience where sighted keyboard users must guess functionality.
**Action:** Always pair `group-hover` utilities with `group-focus-within` (for containers) or `group-focus-visible` to ensure interactive affordances are universally visible.
