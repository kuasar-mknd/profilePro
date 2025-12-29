## 2024-05-23 - Centralized Security Utilities
**Vulnerability:** Repeated manual JSON escaping (`JSON.stringify(...).replace(/</g, "\\u003c")`) across the codebase created a risk of developer error (forgetting the replace) and inconsistency.
**Learning:** Even simple security patterns like escaping `<` in JSON-LD injection should be centralized. Copy-pasting security logic increases the surface area for bugs and makes future updates (e.g., adding more characters to escape) harder.
**Prevention:** Created `src/utils/security.ts` with `safeJson` and `sanitizeInput`. Refactored all occurrences to use this utility. Future data injection into HTML attributes or `<script>` tags MUST use `safeJson`.
