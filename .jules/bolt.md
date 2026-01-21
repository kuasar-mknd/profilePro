# Bolt's Journal ⚡

## Architectural Bottlenecks

### Redundant Content Collection Fetching
- **Discovery:** `LatestPosts.astro` was calling `getCollection("project")` twice (once for the list, once for the count).
- **Impact:** Doubled the disk I/O and parsing time for the projects collection on every page render that included this component.
- **Fix:** Consolidated into a single fetch and derived the count from the in-memory array.

### Dependency Bloat: `dateformat`
- **Discovery:** The `dateformat` library was used in a single component (`PublishDate.astro`) for a simple "dd-mm-yyyy" format.
- **Impact:** Unnecessary bundle size for functionality natively available in JS.
- **Fix:** Replaced with native `Date` string manipulation and removed the dependency.

### GPU Compositing: `mix-blend-mode`
- **Discovery:** `BackgroundAnimation.astro` used `mix-blend-overlay` on a continuously animating element.
- **Impact:** Forces constant GPU compositing and repainting, which drains battery on mobile.
- **Fix:** Replaced with opacity adjustment to achieve similar visual effect without the compositing cost.
