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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // 🛡️ Sentinel: Strip control characters (CR, LF, Vertical Tab, etc.) to prevent Header Injection
  // and other control-character based attacks.
  // Exceptions: Horizontal Tab (\t) is usually safe in text content.
  const cleanStr = str.replace(/[\x00-\x08\x0B-\x1F\x7F]/g, "");

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
    "%": "&#37;", // Prevent URL-encoding attacks
    "\\": "&#92;", // Prevent escaping attacks
  };
  // Regex matches all keys in the map
  const reg = /[&<>"'\/`=(){}[\]%\\]/g;

  return cleanStr.replace(reg, (match) => map[match] || match);
}

/**
 * Validates a URL to ensure it uses a safe protocol.
 * Allowed protocols: http, https, mailto, tel.
 * Allowed formats: Relative paths (starting with /), anchors (#), query (?).
 *
 * @param url - The URL to validate
 * @returns The original URL if safe, or 'about:blank' if unsafe.
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "about:blank";

  const trimmedUrl = url.trim();

  // 🛡️ Sentinel: Prevent control characters (0x00-0x1F) in URL to avoid filter bypass
  if (/[\x00-\x1F\x7F]/.test(trimmedUrl)) {
    return "about:blank";
  }

  // Allow relative paths (absolute path /, anchor #, query ?)
  if (/^[\/#?]/.test(trimmedUrl)) {
    return trimmedUrl;
  }

  // Whitelist schemes
  if (/^(?:https?|mailto|tel):/i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return "about:blank";
}
