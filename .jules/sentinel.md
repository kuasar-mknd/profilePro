# Sentinel Security Log

This file tracks security improvements made by the Sentinel agent to the profilePro application.

## Format

Each entry should include:

- Date of fix
- Vulnerability type
- Description of the issue
- How it was fixed

---

## 2024-12-15 - Safe JSON Serialization

**Vulnerability:** XSS via JSON injection in `<script>` tags.
**Learning:** `JSON.stringify` is not safe for generating HTML because it doesn't escape characters like `<` which can be used to close the script tag and inject arbitrary code.
**Prevention:** Use `safeJson` utility which escapes potentially dangerous characters when embedding JSON in HTML.

## 2025-05-11 - Safer SVG Generation

**Vulnerability:** Use of `innerHTML` to inject static SVGs into the DOM. While not immediately exploitable if content is static, it encourages unsafe patterns and bypasses some CSP protections.
**Learning:** `document.createElementNS` is the correct API for creating SVG elements dynamically. It requires the namespace URI `http://www.w3.org/2000/svg`.
**Prevention:** Replaced `innerHTML` assignments with a `createIcon` helper using `createElementNS` in client-side scripts.

## 2025-05-15 - URL Sanitization & Encoding

**Vulnerability:** Potential XSS via unsanitized `href` attributes and broken links due to unencoded dynamic segments.
**Learning:** User-controlled inputs or content collection fields (like tags) used in URLs must be sanitized to prevent `javascript:` injection and properly encoded to handle special characters.
**Prevention:** Applied `sanitizeUrl` to `href` props in `Tag.astro` and `Breadcrumbs.astro`. Applied `encodeURIComponent` to dynamic path segments in `ProjectFilter.astro`, `Post.astro`, and `src/pages/project/[slug].astro`.
