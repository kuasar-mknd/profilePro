# Sentinel Journal 🛡️

## 2025-02-20 - Markdown External Links Vulnerability
**Vulnerability:** External links in Markdown content (rendered via `@astrojs/mdx`) open in new tabs (`target="_blank"`) without `rel="noopener noreferrer"`, exposing users to Reverse Tabnabbing attacks.
**Learning:** Astro's default MDX integration does not automatically sanitize or configure external links. It requires explicit plugins like `rehype-external-links`.
**Prevention:** Verify MDX configuration for link handling. If adding dependencies is restricted, implement client-side mitigation to enforce `rel="noopener noreferrer"`.

## 2025-12-16 - JSON-LD Injection XSS
**Vulnerability:** `JSON.stringify` does not escape HTML characters, allowing XSS via `</script>` injection in `set:html`.
**Learning:** Astro's `set:html` directives blindly inject content. `JSON.stringify` is insufficient for sanitization in this context.
**Prevention:** Always append `.replace(/</g, "\\u003c")` when injecting JSON objects into `script` tags via `set:html`.

## 2025-05-24 - [Attack Surface Reduction]
**Vulnerability:** Unused third-party script (`website-carbon-badges.js`) contained an unsafe `innerHTML` injection pattern using external data.
**Learning:** Even "trusted" external scripts can introduce DOM-based XSS vectors. Unused code is technical debt that can become a security liability.
**Prevention:** Regularly audit `public/scripts` and remove unused files. Prefer local, type-safe implementations over dropping in external JS files.
