## 2024-05-22 - [Keyboard Affordance Parity]
**Learning:** Interactive elements that reveal additional UI on hover (like zoom icons or tooltips) must also reveal them on keyboard focus (`focus-within` or `focus-visible`). Relying solely on focus rings is often insufficient for conveying the *function* of the element (e.g., "this zooms in" vs "this navigates away").
**Action:** When using `group-hover:opacity-100`, always pair it with `group-focus-within:opacity-100` (or similar) to ensure functional parity for keyboard users.
