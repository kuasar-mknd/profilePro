## 2024-03-24 - [JSON Injection Safety]
**Vulnerability:** The default `JSON.stringify` does not escape `U+2028` (Line Separator) and `U+2029` (Paragraph Separator). While valid in JSON, these are treated as newline characters in JavaScript. If a JSON string containing these characters is injected directly into a `<script>` tag (e.g., `const data = ${safeJson(data)}`), it can break the script syntax or potentially lead to injection attacks if not properly handled.
**Learning:** `JSON.stringify` is not fully safe for direct injection into JavaScript source code contexts without additional escaping of these specific Unicode characters.
**Prevention:** Always escape `U+2028` and `U+2029` when serializing data for injection into script tags. Updated `safeJson` utility to handle this.
