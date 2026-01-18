## 2026-01-18 - Semantic Tagging and Interactivity
**Learning:** `Tag.astro` component was used as both a static badge and a link, but lacked `rel="tag"` for SEO.
**Action:** Always verify semantic attributes like `rel` on polymorphic components that can render as links.
