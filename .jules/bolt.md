## 2024-05-23 - MutationObserver and Astro View Transitions
**Learning:** In Astro sites using View Transitions (`<ClientRouter />`), global `MutationObserver` instances on `document.body` can be overkill if the site content is mostly static. Astro's `astro:page-load` event is sufficient for re-running initialization logic on navigation, and observing the entire subtree is expensive.
**Action:** Replace global body observers with scoped initialization on `astro:page-load` unless there is unpredictable client-side injection (like from third-party scripts).
