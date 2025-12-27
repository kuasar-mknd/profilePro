## 2024-07-25 - Harden Client-Side Sanitization
**Vulnerability:** The custom client-side sanitization function in `src/components/common/ContactForm.astro` did not escape backticks (`` ` ``) or equals signs (`=`).
**Learning:** This is a defense-in-depth issue. While the application's strict Content Security Policy (CSP) is the primary defense against XSS, this sanitization function is the last line of defense before data is sent to a third-party service. Unescaped characters could be exploited in other contexts where the data is viewed, such as an email client or an admin dashboard, if those systems have their own vulnerabilities. Relying solely on one layer of defense (like CSP) is fragile.
**Prevention:** Custom sanitization functions must be comprehensive. When not using a vetted library, the default should be to escape a broad range of characters with special meaning in HTML, CSS, and JavaScript contexts (`<`, `>`, `&`, `"`, `'`, `/`, `\``, `=`). This ensures the data is inert, providing stronger protection regardless of how it's rendered downstream.

## 2025-02-21 - Dynamic Content Security
**Vulnerability:** Static analysis and initial page-load scripts fail to secure content injected dynamically (e.g., by third-party scripts or user interaction), leaving gaps like unsecured `target="_blank"` links.
**Learning:** Security controls must be reactive, not just proactive. In a modern component-based or SPA-like architecture (even with Astro View Transitions), the DOM is mutable.
**Prevention:** Use `MutationObserver` to monitor DOM changes and apply security transformations (like `rel="noopener noreferrer"`) to new elements in real-time.
## 2024-07-22 - Defense-in-Depth Enhancement: CORP Header

**Vulnerability:** N/A - Security Enhancement.

**Learning:** The project's existing security posture is exceptionally strong, leaving no obvious vulnerabilities. However, a defense-in-depth enhancement was identified. The `Cross-Origin-Resource-Policy` (CORP) header was missing. Adding `Cross-Origin-Resource-Policy: same-origin` prevents other domains from embedding the site's resources (e.g., images, scripts), mitigating potential cross-site information leakage attacks.

**Prevention:** For future features, ensure that all relevant security headers are considered and implemented as part of the development process. A periodic review of security headers against best practices (e.g., OWASP Secure Headers Project) can help identify other opportunities for hardening.
