## 2025-02-23 - Astro View Transitions & Event Listeners
**Learning:** When using Astro View Transitions, global event listeners (like `keydown` for navigation) persist across page navigations. If not cleaned up, they can accumulate (memory leaks) or fire multiple times.
**Action:** Use the `astro:page-load` event to attach listeners and `astro:before-swap` to remove them. This ensures a clean slate for every navigation while supporting the initial load and subsequent soft navigations.

Example pattern:
```javascript
const handler = (e) => { ... };

document.addEventListener('astro:page-load', () => {
  document.addEventListener('keydown', handler);
});

document.addEventListener('astro:before-swap', () => {
  document.removeEventListener('keydown', handler);
});
```
