## 2025-04-10 - Strict Validation for Localhost Origins in Proxies

**Vulnerability:** CORS Bypass / SSRF in Serverless Proxy
**Learning:** Permissive CORS checks like `origin.startsWith("http://localhost:")` in proxy endpoints allow attackers to craft malicious domains (e.g., `http://localhost:8080.evil.com`) that successfully bypass validation and allow cross-origin requests.
**Prevention:** Use a strict regular expression such as `/^http:\/\/localhost(:\d+)?$/` to validate localhost origins, ensuring no trailing paths or malicious domain suffixes are allowed.

## 2024-04-13 - [Add timeout to external API calls in serverless function]

**Vulnerability:** The server-side proxy function `functions/api/submit.ts` lacked a timeout on its external `fetch` request.
**Learning:** Cloudflare Pages Functions (serverless workers) can hang indefinitely and consume concurrency limits if external APIs are unresponsive, creating a DoS vulnerability.
**Prevention:** Always wrap `fetch` calls in serverless environments with an `AbortController` and a strict timeout (e.g. `setTimeout`), ensuring `clearTimeout` is called when the request successfully resolves.

## 2025-04-15 - Implement Defense-in-Depth for Serverless Contact Form Endpoint

**Vulnerability:** The Cloudflare Pages Function proxy (`functions/api/submit.ts`) forwarded JSON payloads to the Web3Forms API without server-side allowlisting, sanitization, or validation, relying solely on client-side logic. This created a Mass Assignment vulnerability (where arbitrary properties could be added) and potentially allowed Server-Side Request Forgery or XSS.
**Learning:** Client-side validation in Astro/React components is easily bypassed. Any serverless function acting as a proxy for secrets must validate and sanitize all incoming payloads before forwarding them, implementing a defense-in-depth approach.
**Prevention:** Always implement an explicit `Set` or `Array` of allowed keys, strongly type and validate fields (e.g., email), and strip/sanitize string inputs on the server-side before attaching secrets and proxying to external services.

## 2024-04-17 - API Key Exposure via Dev Endpoint
**Vulnerability:** The Web3Forms API key was exposed to the client in the development environment via the `/api/dev-key` endpoint to bypass proxy requirements locally.
**Learning:** Development endpoints that expose secrets break environment parity and risk accidental leakage if left active or if development code paths make their way to production or are accessible externally.
**Prevention:** Always maintain environment parity. For external APIs requiring server-side secret injection, use local development proxies (e.g. Astro API Routes) that mirror production behavior instead of creating dev-only client-side workarounds.

## 2026-04-17 - Add explicit version override for basic-ftp

**Vulnerability:** A denial of service via unbounded memory consumption in Client.list() in basic-ftp version <=5.2.2. A transitive dependency coming from @lhci/cli.
**Learning:** High-severity security vulnerabilities in deep transitive dependencies should be resolved by adding explicit version overrides in the `pnpm.overrides` section of `package.json` to satisfy security audits (e.g., `pnpm audit`).
**Prevention:** Added `"basic-ftp": ">=5.3.0"` to the `pnpm.overrides` block in `package.json` to enforce a non-vulnerable version, preventing Denial of Service through unbounded memory growth.
