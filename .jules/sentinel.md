## 2025-02-18 - JSON Injection in JS Context
**Vulnerability:** JavaScript string literals do not support U+2028 (Line Separator) and U+2029 (Paragraph Separator), but JSON does.
**Learning:** Using JSON.stringify to inject data into a script tag can cause syntax errors if these characters are present.
**Prevention:** Explicitly replace \u2028 and \u2029 with their escaped unicode sequences when serializing JSON for JS contexts.
