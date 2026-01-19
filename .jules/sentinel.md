## 2025-02-18 - JSON Injection in JS Context

**Vulnerability:** JavaScript string literals do not support U+2028 (Line Separator) and U+2029 (Paragraph Separator), but JSON does.
**Learning:** Using JSON.stringify to inject data into a script tag can cause syntax errors if these characters are present.
**Prevention:** Explicitly replace \u2028 and \u2029 with their escaped unicode sequences when serializing JSON for JS contexts.

## 2024-05-20 - Use `safeJson` for JSON injection

<<<<<<< HEAD
**Vulnerability:** XSS via JSON injection in `<script>` tags.
**Learning:** `JSON.stringify` is not safe for generating HTML because it doesn't escape characters like `<` which can be used to close the script tag and inject arbitrary code.
**Prevention:** Use `safeJson` utility which escapes potentially dangerous characters when embedding JSON in HTML.

## 2024-05-21 - Hardened CSP and Permissions Policy

**Vulnerability:** Weak default headers allowing potential unauthorized resource loading and feature usage.
**Learning:** Static sites on Cloudflare Pages can leverage `_headers` for robust security. Explicitly denying permissions like `camera` and `microphone` and restricting `fullscreen` reduces attack surface. `upgrade-insecure-requests` is a simple win.
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
=======
**Vulnerability:** Limited input sanitization allowed potential injection vectors using parentheses and brackets (e.g., function calls, template syntax).
**Learning:** Expanding sanitization to include '()', '[]', '{}' provides defense-in-depth against template injection and specific parser exploits without affecting visual rendering in HTML.
**Prevention:** Use the enhanced 'sanitizeInput' utility for all user-facing inputs.

## 2025-02-18 - Modernizing Mixed Content Handling

**Vulnerability:** The deprecated `block-all-mixed-content` directive was used, which simply blocks insecure content, potentially breaking user experience without attempting recovery.
**Learning:** `upgrade-insecure-requests` is the modern standard (W3C Recommendation) that instructs the browser to automatically upgrade insecure HTTP requests to HTTPS before fetching. This improves both security (by ensuring encryption) and usability (by fixing broken links automatically where possible).
**Prevention:** Replace `block-all-mixed-content` with `upgrade-insecure-requests` in CSP.

## 2026-01-19 - Protocol-Relative URL Validation

**Vulnerability:** `isValidUrl` regex allowed protocol-relative URLs (`//example.com`) despite documentation claiming they were blocked to prevent open redirects.
**Learning:** Regex anchors alone are insufficient if the allowed character set overlaps with the forbidden pattern (e.g., `^/` matches the start of `//`).
**Prevention:** Use stricter regex `/^(https?:\/\/|\/([^\/]|$))/i` to explicitly ensure a leading slash is NOT followed by another slash.
