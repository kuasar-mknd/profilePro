/**
 * Security utilities for input sanitization and safe output rendering.
 */

/**
 * Safely stringifies a JSON object for injection into HTML (e.g., in <script> tags or data attributes).
 * Prevents XSS attacks by escaping the '<' character, which can be used to break out of script tags.
 *
 * @param data - The data to stringify.
 * @returns The escaped JSON string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJson(data: any): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Basic HTML sanitization for client-side inputs.
 * Replaces dangerous characters with their HTML entity equivalents.
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
