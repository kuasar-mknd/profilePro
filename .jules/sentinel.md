## 2024-05-23 - Centralized Security Logic

**Vulnerability:** JSON-LD injection vulnerability where unescaped `<` characters could allow script injection.
**Learning:** Hardcoding security logic (like `.replace(/</g, '\\u003c')`) in multiple places increases the risk of inconsistencies and makes updates difficult. If one instance is missed or implemented incorrectly, the vulnerability remains.
**Prevention:** Centralize security logic in a dedicated utility (e.g., `src/utils/security.ts`) and use it consistently. This ensures a single source of truth for security controls and simplifies auditing.

## 2025-02-18 - Input Sanitization Enhancement

**Vulnerability:** Limited input sanitization allowed potential injection vectors using parentheses and brackets (e.g., function calls, template syntax).
**Learning:** Expanding sanitization to include '()', '[]', '{}' provides defense-in-depth against template injection and specific parser exploits without affecting visual rendering in HTML.
**Prevention:** Use the enhanced 'sanitizeInput' utility for all user-facing inputs.

## 2024-07-26 - CSP Backward Compatibility

**Vulnerability:** Replacing `block-all-mixed-content` with `upgrade-insecure-requests` improves security for modern browsers but removes mixed-content protection for older browsers that don't support the newer directive.
**Learning:** For defense-in-depth and maximum browser compatibility, the best practice is to include *both* `block-all-mixed-content` and `upgrade-insecure-requests` in the Content Security Policy. Modern browsers will prioritize `upgrade-insecure-requests`, while older browsers will fall back to the `block-all-mixed-content` directive.
**Prevention:** When enhancing the CSP for mixed content, add `upgrade-insecure-requests` alongside the existing `block-all-mixed-content` directive instead of replacing it.

## 2025-10-26 - Hidden Field Sanitization

**Vulnerability:** Unsanitized hidden fields (e.g., `botcheck`, `timestamp`) in form submissions.
**Learning:** Hidden fields are trustless; they can be manipulated by attackers just like visible inputs. Failing to sanitize them creates a potential XSS vector if the backend reflects these values (e.g., in email notifications).
**Prevention:** Apply input sanitization to ALL string fields in a payload by default, opting-out only for specific fields that have stricter, dedicated validation (like email regex).
