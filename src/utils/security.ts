// 🛡️ Sentinel: Centralized Security Utilities

/**
 * Safely serializes data to JSON for injection into HTML (e.g., JSON-LD, data attributes).
 * Prevents XSS attacks by escaping the '<' character, which prevents the "terminating script tag" attack.
 *
 * @param data - The data to serialize.
 * @returns The JSON string with '<' escaped as '\\u003c'.
 *
 * Usage:
 * <script type="application/ld+json" set:html={safeJson(data)} />
 */
export function safeJson(data: any): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Basic HTML sanitization for client-side display.
 * Replaces dangerous characters with their HTML entity equivalents.
 * Note: This is NOT a replacement for server-side validation or a robust library like DOMPurify for complex HTML.
 * Use this for simple text inputs where full HTML is not expected.
 *
 * @param str - The string to sanitize.
 * @returns The sanitized string.
 */
export function sanitizeInput(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;", // Prevent template injection
    "=": "&#x3D;", // Prevent unquoted attribute injection
  };
  const reg = /[&<>"'\/`=]/gi;

  return str.replace(reg, (match) => map[match]);
}
