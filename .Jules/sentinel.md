# Sentinel Journal 🛡️

## 2025-02-20 - Markdown External Links Vulnerability

**Vulnerability:** External links in Markdown content (rendered via `@astrojs/mdx`) open in new tabs (`target="_blank"`) without `rel="noopener noreferrer"`, exposing users to Reverse Tabnabbing attacks.
**Learning:** Astro's default MDX integration does not automatically sanitize or configure external links. It requires explicit plugins like `rehype-external-links`.
**Prevention:** Verify MDX configuration for link handling. If adding dependencies is restricted, implement client-side mitigation to enforce `rel="noopener noreferrer"`.
