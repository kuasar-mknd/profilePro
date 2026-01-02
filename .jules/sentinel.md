# 🛡️ Sentinel's Journal

## Critical Learnings

### 🔒 Standardizing JSON Injection (Batch: JSON Injection Hardening)
**Context:** Several components (`Breadcrumbs`, `LocalBusinessSchema`, `SeoHead`) were manually escaping JSON using `JSON.stringify(val).replace(/</g, "\\u003c")`.
**Risk:** Manual implementation is prone to errors (e.g., forgetting the replacement) and creates code duplication.
**Mitigation:** Enforced the use of `src/utils/security.ts` -> `safeJson()` across the codebase.
**Rule:** Any JSON injected into HTML (e.g., `<script type="application/ld+json">`) MUST use `safeJson()`.

### ⚙️ Strict Inline Styles
**Context:** `astro.config.mjs` was set to `inlineStylesheets: "auto"`.
**Action:** Changed to `inlineStylesheets: "always"`.
**Why:** While "auto" allows caching, "always" eliminates render-blocking CSS requests entirely (improving LCP) and simplifies Content Security Policy (CSP) by removing the need to allow external stylesheets (unless from CDNs), making the policy stricter and easier to manage with hashes.
