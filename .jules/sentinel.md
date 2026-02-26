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

## 2026-02-26 - Inconsistent URL Sanitization

**Vulnerability:** `sanitizeUrl` allowed protocol-relative URLs (`//example.com`) while `isValidUrl` explicitly blocked them. This created an inconsistency where a URL deemed invalid could still be returned by the sanitizer, potentially leading to open redirects or ambiguous protocol usage.
**Learning:** Security utilities must be consistent in their policy enforcement. When one utility blocks a pattern, others should not silently allow it unless explicitly documented and justified.
**Prevention:** Added a check in `sanitizeUrl` to reject strings starting with `//` before processing them as relative paths, aligning it with `isValidUrl`.

## 2026-02-26 - Deployment Environment Mismatch

**Vulnerability:** The project used `bun run` in build scripts and relied on `devDependencies` for build tools. This caused deployments on standard Node.js environments (like Render) to fail because `bun` was missing and `devDependencies` were pruned in production mode.
**Learning:** Deployment environments often differ from local dev environments. Standardizing on `npm run` and ensuring build tools are in `dependencies` (not `devDependencies`) ensures compatibility and reproducible builds.
**Prevention:** Updated `package.json` to use `npm run`, moved critical build tools to `dependencies`, and generated `package-lock.json`.

## 2026-02-26 - Bun to NPM Migration

**Vulnerability:** The project's build system relied on `bun` specific features and types (`bun-types`), which caused deployment failures on platforms that default to Node.js/NPM environments like Render. This could lead to availability issues or incomplete deployments.
**Learning:** For broad compatibility with standard Node.js hosting providers, sticking to `npm` and removing runtime-specific types from `devDependencies` ensures a smoother deployment pipeline.
**Prevention:** Removed `bun-types`, deleted `bun.lock`, and fully standardized on `npm` and `package-lock.json`.
