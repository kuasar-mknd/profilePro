## 2024-05-24 - Do not mutate `getCollection` results in place
**Learning:** Calling `Array.prototype.sort()` directly on the array returned by Astro's `getCollection('collectionName')` mutates the cached collection array in-place, which can cause unexpected side effects (like reversed chronological ordering on other pages). The data must be cloned or chained after `.filter()` to create a new array.
**Action:** Always verify if an optimization alters shared reference objects and prefer non-mutating equivalents (`toSorted`) or mapping/filtering before sorting when dealing with Astro content collections.

## 2024-05-24 - DOM Query Performance in Forms
**Learning:** Real-time form validation running on the `input` event can suffer from minor layout thrashing and redundant computations if it queries the DOM for validation icons (e.g., `querySelector('.validation-icon')`) and blindly sets `dataset` properties on every keystroke.
**Action:** Use a `WeakMap<HTMLElement, HTMLElement>` to cache the DOM lookup based on the input element, and only update the DOM (like `dataset.visible`) if the state actually changes, preventing unnecessary style recalculations.