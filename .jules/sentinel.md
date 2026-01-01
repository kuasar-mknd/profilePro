## 2024-02-14 - JSON Injection in JS Strings
**Vulnerability:** `JSON.stringify` does not escape Line Separator (`U+2028`) and Paragraph Separator (`U+2029`). These characters are valid in JSON but treat as newlines in JavaScript string literals, causing syntax errors or potential injection if the JSON is assigned to a variable in an inline script.
**Learning:** Standard JSON serialization is insufficient for injecting data into JavaScript contexts within HTML (e.g., `<script>const x = ${json}</script>`).
**Prevention:** Always escape `U+2028` and `U+2029` when serializing JSON for HTML/JS injection. Use a centralized `safeJson` utility that handles these edge cases.
