## 2025-02-18 - Input Sanitization Enhancement
**Vulnerability:** Limited input sanitization allowed potential injection vectors using parentheses and brackets (e.g., function calls, template syntax).
**Learning:** Expanding sanitization to include '()', '[]', '{}' provides defense-in-depth against template injection and specific parser exploits without affecting visual rendering in HTML.
**Prevention:** Use the enhanced 'sanitizeInput' utility for all user-facing inputs.
