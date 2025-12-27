## 2024-07-22 - Defense-in-Depth Enhancement: CORP Header

**Vulnerability:** N/A - Security Enhancement.

**Learning:** The project's existing security posture is exceptionally strong, leaving no obvious vulnerabilities. However, a defense-in-depth enhancement was identified. The `Cross-Origin-Resource-Policy` (CORP) header was missing. Adding `Cross-Origin-Resource-Policy: same-origin` prevents other domains from embedding the site's resources (e.g., images, scripts), mitigating potential cross-site information leakage attacks.

**Prevention:** For future features, ensure that all relevant security headers are considered and implemented as part of the development process. A periodic review of security headers against best practices (e.g., OWASP Secure Headers Project) can help identify other opportunities for hardening.
