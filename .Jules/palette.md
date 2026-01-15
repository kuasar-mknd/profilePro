## 2025-02-19 - Adding Anchor Links to Dynamic Content
**Learning:** In Astro, when using MDX/Markdown content via collections, adding enhancing features like anchor links to headings can be done purely client-side to avoid build complexity. However, because Astro uses View Transitions, these client-side scripts must be idempotent and re-run on `astro:after-swap`.
**Action:** When enhancing `.prose` content, always wrap logic in a function that checks for existence (guards) and attach it to both initial execution and `astro:after-swap`.
