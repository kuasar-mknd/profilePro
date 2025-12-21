## 2025-02-18 - [ReDoS Protection]
**Vulnerability:** Weak regex in video URL parsing allowed potential ReDoS via nested quantifiers or unconstrained matches.
**Learning:** Even simple video ID extraction can be a vector if standard `.*` patterns are used.
**Prevention:** Always enforce specific lengths (e.g. `{11}` for YouTube) and avoid nested quantifiers (e.g. `(a+)+`).
