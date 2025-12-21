## 2025-02-18 - [ReDoS Protection]
**Vulnerability:** Weak regex in video URL parsing allowed potential ReDoS via nested quantifiers or unconstrained matches.
**Learning:** Even simple video ID extraction can be a vector if standard `.*` patterns are used.
**Prevention:** Always enforce specific lengths (e.g. `{11}` for YouTube) and avoid nested quantifiers (e.g. `(a+)+`).
## 2025-02-18 - [Security Discovery Standardization]
**Vulnerability:** Missing `security.txt` and `robots.txt` makes it harder for researchers to report issues and for bots to know what to index.
**Learning:** Even static portfolios benefit from standard security discovery files (RFC 9116) to facilitate responsible disclosure.
**Prevention:** Always include `security.txt` in `.well-known` and `robots.txt` in `public` for all web projects.

## 2025-02-27 - Strict Input Validation for Video IDs
**Vulnerability:** The `VideoPlayer.astro` component extracted YouTube video IDs using a regex that allowed any character except `#`, `&`, and `?`, combined with a simple length check. This could theoretically allow malformed strings or special characters to pass as valid IDs if they met the length requirement.
**Learning:** Relying solely on negative lookahead/exclusion regexes (e.g., `[^...]*`) and length checks is insufficient for security-critical input validation. Positive validation (allowlisting) is safer.
**Prevention:** Always implement strict allowlist validation for inputs that follow a known format. For YouTube IDs, we now enforce `/^[a-zA-Z0-9_-]{11}$/`.
