/**
 * 🛡️ Sentinel: Centralized Security Utilities
 *
 * This file contains helper functions for security-related operations
 * such as safe JSON serialization and input sanitization.
 */

/**
 * Safely serializes a value to JSON for injection into HTML (e.g., script tags, data attributes).
 * Escapes the '<' character to prevent Script Injection via JSON in HTML context.
 *
 * @param value - The value to serialize
 * @returns The JSON string with '<', U+2028, and U+2029 escaped to prevent XSS.
 */
export function safeJson(value: any): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Basic client-side input sanitization to prevent simple XSS and injection attacks.
 * Replaces dangerous characters with their HTML entity equivalents.
 *
 * Note: For server-side rendering or robust XSS prevention, use a dedicated library like 'sanitize-html'.
 * This function is intended for lightweight client-side usage (e.g., form inputs).
 *
 * @param str - The input string to sanitize
 * @returns The sanitized string
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
    "(": "&#40;", // Prevent function calls / logic injection
    ")": "&#41;",
    "{": "&#123;", // Prevent template/logic injection
    "}": "&#125;",
    "[": "&#91;", // Prevent array/logic injection
    "]": "&#93;",
  };
  // Regex matches all keys in the map
  const reg = /[&<>"'\/`=(){}[\]]/gi;

  return str.replace(reg, (match) => map[match] || match);
}
