## 2025-04-10 - Strict Validation for Localhost Origins in Proxies

**Vulnerability:** CORS Bypass / SSRF in Serverless Proxy
**Learning:** Permissive CORS checks like `origin.startsWith("http://localhost:")` in proxy endpoints allow attackers to craft malicious domains (e.g., `http://localhost:8080.evil.com`) that successfully bypass validation and allow cross-origin requests.
**Prevention:** Use a strict regular expression such as `/^http:\/\/localhost(:\d+)?$/` to validate localhost origins, ensuring no trailing paths or malicious domain suffixes are allowed.

## 2024-04-13 - [Add timeout to external API calls in serverless function]

**Vulnerability:** The server-side proxy function `functions/api/submit.ts` lacked a timeout on its external `fetch` request.
**Learning:** Cloudflare Pages Functions (serverless workers) can hang indefinitely and consume concurrency limits if external APIs are unresponsive, creating a DoS vulnerability.
**Prevention:** Always wrap `fetch` calls in serverless environments with an `AbortController` and a strict timeout (e.g. `setTimeout`), ensuring `clearTimeout` is called when the request successfully resolves.
