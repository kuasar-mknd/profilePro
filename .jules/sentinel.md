# Sentinel Journal

## 2024-05-20 - Use `safeJson` for JSON injection
**Vulnerability:** XSS via JSON injection in `<script>` tags.
**Learning:** `JSON.stringify` is not safe for generating HTML because it doesn't escape characters like `<` which can be used to close the script tag and inject arbitrary code.
**Prevention:** Use `safeJson` utility which escapes potentially dangerous characters when embedding JSON in HTML.

## 2024-05-21 - Hardened CSP and Permissions Policy
**Vulnerability:** Weak default headers allowing potential unauthorized resource loading and feature usage.
**Learning:**  Static sites on Cloudflare Pages can leverage `_headers` for robust security. Explicitly denying permissions like `camera` and `microphone` and restricting `fullscreen` reduces attack surface. `upgrade-insecure-requests` is a simple win.
**Prevention:** Regularly audit and harden `public/_headers`.

## 2024-05-22 - Missing Expires field in security.txt
**Vulnerability:** RFC 9116 non-compliance.
**Learning:** The `Expires` field is mandatory in `security.txt` to prevent stale security contacts.
**Prevention:** Ensure `security.txt` always includes a future `Expires` date.

## 2024-05-23 - Client-side Input Sanitization
**Vulnerability:** Potential for localized XSS or injection if user input is reflected back into the DOM without sanitization.
**Learning:** Even on static sites, forms (like contact forms) should sanitize input before processing or displaying it (e.g., in success messages or potential future features).
**Prevention:** Implemented `sanitizeInput` in `src/utils/security.ts` to strip dangerous characters.

## 2024-05-24 - External Link Security
**Vulnerability:** `target="_blank"` links without `rel="noopener noreferrer"` expose the user to reverse tabnabbing attacks.
**Learning:** Markdown content often generates external links. Automated handling via rehype plugins or script-based injection is more reliable than manual checks.
**Prevention:** Configured `rehype-external-links` in `astro.config.mjs` and added a client-side script in `Base.astro` to enforce security on dynamic links.
