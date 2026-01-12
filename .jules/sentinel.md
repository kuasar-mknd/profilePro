## 2024-05-23 - Centralized Security Logic

**Vulnerability:** JSON-LD injection vulnerability where unescaped `<` characters could allow script injection.
**Learning:** Hardcoding security logic (like `.replace(/</g, '\\u003c')`) in multiple places increases the risk of inconsistencies and makes updates difficult. If one instance is missed or implemented incorrectly, the vulnerability remains.
**Prevention:** Centralize security logic in a dedicated utility (e.g., `src/utils/security.ts`) and use it consistently. This ensures a single source of truth for security controls and simplifies auditing.

## 2025-02-18 - Input Sanitization Enhancement

**Vulnerability:** Limited input sanitization allowed potential injection vectors using parentheses and brackets (e.g., function calls, template syntax).
**Learning:** Expanding sanitization to include '()', '[]', '{}' provides defense-in-depth against template injection and specific parser exploits without affecting visual rendering in HTML.
**Prevention:** Use the enhanced 'sanitizeInput' utility for all user-facing inputs.

## 2025-02-18 - Centralized Validation Logic

**Vulnerability:** Decentralized validation logic (e.g., duplicate email regexes in `ContactForm.astro`, inconsistent URL checks in `SocialIcon` vs `VideoPlayer`) increases the risk of "fix one, miss the other" errors and makes it harder to audit security controls globally.
**Learning:** Moving regex patterns (Email, YouTube ID, Vimeo ID) and validation functions (`isValidEmail`, `isValidUrl`) to a shared utility (`src/utils/security.ts`) ensures consistency across both client-side and server-side contexts. This also allows for easier upgrades to regex patterns if ReDoS or other vulnerabilities are discovered.
**Prevention:** Always define validation rules in `src/utils/security.ts` and import them, rather than re-writing regexes inline.
