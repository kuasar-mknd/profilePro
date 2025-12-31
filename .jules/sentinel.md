## 2024-05-23 - Centralized Security Logic
**Vulnerability:** JSON-LD injection vulnerability where unescaped `<` characters could allow script injection.
**Learning:** Hardcoding security logic (like `.replace(/</g, '\\u003c')`) in multiple places increases the risk of inconsistencies and makes updates difficult. If one instance is missed or implemented incorrectly, the vulnerability remains.
**Prevention:** Centralize security logic in a dedicated utility (e.g., `src/utils/security.ts`) and use it consistently. This ensures a single source of truth for security controls and simplifies auditing.
