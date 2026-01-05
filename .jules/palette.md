## 2025-02-23 - Consistent Focus & Hover States
**Learning:** Interactive elements often have rich visual feedback on hover (scaling, tooltips, expansion) that is missing on keyboard focus, creating a degraded experience for keyboard users.
**Action:** Always pair `hover:` classes with corresponding `focus-visible:` or `group-focus-visible:` classes to ensure feature parity (e.g., `hover:scale-110` -> `focus-visible:scale-110`).
