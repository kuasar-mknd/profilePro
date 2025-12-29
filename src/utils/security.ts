// 🛡️ Sentinel: Centralized security utilities

/**
 * Safely serializes data to JSON for injection into HTML (e.g., <script> tags or attributes).
 * Prevents XSS by escaping the '<' character to \u003c.
 *
 * @param data - The data to serialize
 * @returns Safe JSON string
 */
export function safeJson(data: any): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Basic sanitization for client-side strings to prevent obvious HTML injection.
 * Useful for defense-in-depth on input fields before sending to APIs.
 *
 * @param str - The string to sanitize
 * @returns Sanitized string with special chars escaped
 */
export function sanitizeInput(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };
  const reg = /[&<>"'\/`=]/gi;

  return str.replace(reg, (match) => map[match]);
}
