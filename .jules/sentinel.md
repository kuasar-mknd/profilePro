## 2025-02-18 - Standardized JSON Injection Sanitization
**Vulnerability:** Inconsistent manual sanitization of JSON-LD data in Astro components (`JSON.stringify(data).replace(/</g, "\\u003c")`) increases the risk of XSS if the replacement is omitted or implemented incorrectly in future components.
**Learning:** While individual components implemented the fix correctly, the lack of centralization meant new components could easily miss this critical security step. "Don't Repeat Yourself" (DRY) is a security feature.
**Prevention:** Centralized the logic in `src/utils/security.ts` as `safeJson`. Enforced its usage across `LocalBusinessSchema`, `SeoHead`, and `Breadcrumbs`. Future code reviews should look for manual JSON injection and require `safeJson`.
