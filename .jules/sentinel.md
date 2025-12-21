## 2025-02-18 - [Security Discovery Standardization]
**Vulnerability:** Missing `security.txt` and `robots.txt` makes it harder for researchers to report issues and for bots to know what to index.
**Learning:** Even static portfolios benefit from standard security discovery files (RFC 9116) to facilitate responsible disclosure.
**Prevention:** Always include `security.txt` in `.well-known` and `robots.txt` in `public` for all web projects.
