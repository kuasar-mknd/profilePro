## 2024-05-23 - Print Styles for Portfolios
**Learning:** Digital portfolios are often printed to PDF for offline review or archiving. Standard CSS animations and scroll-triggered reveals (`opacity: 0`) often result in blank pages in print.
**Action:** Always include a `@media print` block that forces visibility (`opacity: 1 !important`, `transform: none !important`) on all animated elements and hides interactive-only elements (video players, share buttons) to ensure the content is readable offline.
