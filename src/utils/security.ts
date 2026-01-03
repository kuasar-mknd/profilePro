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
 * @returns The JSON string with '<' escaped as '\u003c'
 */
export function safeJson(value: any): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * Enhanced client-side input sanitization to prevent XSS and injection attacks.
 * Replaces dangerous characters with their HTML entity equivalents.
 *
 * 🛡️ Sentinel Improvement:
 * - Expanded character map to include braces, brackets, and parentheses.
 * - This helps prevent logic injection or syntax manipulation if the data
 *   is improperly handled in a JavaScript context.
 *
 * Note: For server-side rendering or robust XSS prevention, use a dedicated library like 'sanitize-html'.
 * This function is intended for lightweight client-side usage (e.g., form inputs before API submission).
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
    "(": "&#x28;", // Prevent function calls
    ")": "&#x29;",
    "{": "&#x7B;", // Prevent object/block syntax
    "}": "&#x7D;",
    "[": "&#x5B;", // Prevent array syntax
    "]": "&#x5D;",
  };
  const reg = /[&<>"'\/`=(){}[\]]/gi;

  return str.replace(reg, (match) => map[match] || match);
}
