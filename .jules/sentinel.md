## 2025-04-10 - Strict Validation for Localhost Origins in Proxies
**Vulnerability:** CORS Bypass / SSRF in Serverless Proxy
**Learning:** Permissive CORS checks like `origin.startsWith("http://localhost:")` in proxy endpoints allow attackers to craft malicious domains (e.g., `http://localhost:8080.evil.com`) that successfully bypass validation and allow cross-origin requests.
**Prevention:** Use a strict regular expression such as `/^http:\/\/localhost(:\d+)?$/` to validate localhost origins, ensuring no trailing paths or malicious domain suffixes are allowed.
