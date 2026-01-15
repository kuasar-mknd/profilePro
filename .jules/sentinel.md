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
**Learning:** For defense-in-depth and maximum browser compatibility, the best practice is to include _both_ `block-all-mixed-content` and `upgrade-insecure-requests` in the Content Security Policy. Modern browsers will prioritize `upgrade-insecure-requests`, while older browsers will fall back to the `block-all-mixed-content` directive.
**Prevention:** When enhancing the CSP for mixed content, add `upgrade-insecure-requests` alongside the existing `block-all-mixed-content` directive instead of replacing it.

<<<<<<< HEAD

## 2025-02-18 - Centralized Validation Logic

**Vulnerability:** Decentralized validation logic (e.g., duplicate email regexes in `ContactForm.astro`, inconsistent URL checks in `SocialIcon` vs `VideoPlayer`) increases the risk of "fix one, miss the other" errors and makes it harder to audit security controls globally.
**Learning:** Moving regex patterns (Email, YouTube ID, Vimeo ID) and validation functions (`isValidEmail`, `isValidUrl`) to a shared utility (`src/utils/security.ts`) ensures consistency across both client-side and server-side contexts. This also allows for easier upgrades to regex patterns if ReDoS or other vulnerabilities are discovered.
**Prevention:** Always define validation rules in `src/utils/security.ts` and import them, rather than re-writing regexes inline.

## 2025-02-18 - Standardized JSON Injection Sanitization

**Vulnerability:** Inconsistent manual sanitization of JSON-LD data in Astro components (`JSON.stringify(data).replace(/</g, "\\u003c")`) increases the risk of XSS if the replacement is omitted or implemented incorrectly in future components.
**Learning:** While individual components implemented the fix correctly, the lack of centralization meant new components could easily miss this critical security step. "Don't Repeat Yourself" (DRY) is a security feature.
**Prevention:** Centralized the logic in `src/utils/security.ts` as `safeJson`. Enforced its usage across `LocalBusinessSchema`, `SeoHead`, and `Breadcrumbs`. Future code reviews should look for manual JSON injection and require `safeJson`.

## 2025-10-26 - Hidden Field Sanitization

**Vulnerability:** Unsanitized hidden fields (e.g., `botcheck`, `timestamp`) in form submissions.
**Learning:** Hidden fields are trustless; they can be manipulated by attackers just like visible inputs. Failing to sanitize them creates a potential XSS vector if the backend reflects these values (e.g., in email notifications).
**Prevention:** Apply input sanitization to ALL string fields in a payload by default, opting-out only for specific fields that have stricter, dedicated validation (like email regex).

## 2026-01-15 - Robust rel Attribute Handling

**Vulnerability:** The client-side `secureLink` function naively appended `noopener noreferrer` if `noopener` was missing. This could lead to missing `noreferrer` if `noopener` was already present (e.g., manually added), or duplicate attributes.
**Learning:** Checking for the presence of a single security token (like `noopener`) is insufficient when multiple tokens (`noreferrer`) are required for full protection. Attribute manipulation should always parse, tokenize, and reconstruct the attribute value to ensure correctness and avoid duplication.
**Prevention:** Use token-based attribute manipulation (splitting by space) instead of string concatenation or simple inclusion checks for `rel`, `class`, and other space-separated attributes.
