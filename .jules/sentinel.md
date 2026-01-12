## 2024-05-23 - Centralized Security Logic

**Vulnerability:** JSON-LD injection vulnerability where unescaped `<` characters could allow script injection.
**Learning:** Hardcoding security logic (like `.replace(/</g, '\\u003c')`) in multiple places increases the risk of inconsistencies and makes updates difficult. If one instance is missed or implemented incorrectly, the vulnerability remains.
**Prevention:** Centralize security logic in a dedicated utility (e.g., `src/utils/security.ts`) and use it consistently. This ensures a single source of truth for security controls and simplifies auditing.

## 2025-02-18 - Input Sanitization Enhancement

**Vulnerability:** Limited input sanitization allowed potential injection vectors using parentheses and brackets (e.g., function calls, template syntax).
**Learning:** Expanding sanitization to include '()', '[]', '{}' provides defense-in-depth against template injection and specific parser exploits without affecting visual rendering in HTML.
**Prevention:** Use the enhanced 'sanitizeInput' utility for all user-facing inputs.

## 2025-02-18 - Modernizing Mixed Content Handling

**Vulnerability:** The deprecated `block-all-mixed-content` directive was used, which simply blocks insecure content, potentially breaking user experience without attempting recovery.
**Learning:** `upgrade-insecure-requests` is the modern standard (W3C Recommendation) that instructs the browser to automatically upgrade insecure HTTP requests to HTTPS before fetching. This improves both security (by ensuring encryption) and usability (by fixing broken links automatically where possible).
**Prevention:** Replace `block-all-mixed-content` with `upgrade-insecure-requests` in CSP.
