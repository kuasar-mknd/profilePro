# Palette's Journal

## 2025-02-18 - Clickable Tags in Detail Views
**Learning:** The `Tag` component is polymorphic; it renders as an anchor (`<a>`) when the `href` prop is provided. This allows for seamless navigation filters without changing the visual design or requiring a wrapper.
**Action:** Always provide `href` props to `Tag` components in detail views (like `[slug].astro`) to allow users to pivot to category listings.
