/**
 * 🛡️ Sentinel: Centralized Security Utilities
 *
 * This file contains helper functions for security-related operations
 * such as safe JSON serialization and input sanitization.
 */

/**
 * Safely serializes a value to JSON for injection into HTML (e.g., script tags, data attributes).
 * Escapes characters to prevent Script Injection via JSON in HTML context.
 *
 * @param value - The value to serialize
 * @returns The JSON string with '<', '>', '&', U+2028, and U+2029 escaped to prevent XSS.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJson(value: any): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
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
 * This function is intended for lightweight client-side usage (e.g., form inputs) where the output
 * is text content, NOT for sanitizing HTML attributes like 'href' or 'src'.
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
  const reg = /[&<>"'/`=(){}[\]%\\]/g;

  return cleanStr.replace(reg, (match) => map[match] || match);
}

/**

 * 🛡️ Sentinel: Stricter regex to prevent invalid domain formats.
 * Enforces:
 * - Standard email structure
 * - No leading/trailing hyphens in domain parts
 * - TLD length of at least 2 chars
 * - Avoids nested quantifiers that could lead to ReDoS
 */
export const EMAIL_PATTERN =
  /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

/**
 * Validates an email address against strict structural requirements.
 *
 * @param email - The email address to validate
 * @returns True if the email is structurally valid
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return EMAIL_PATTERN.test(email);
}

/**
 * 🛡️ Sentinel: Optimized regex for YouTube ID extraction.
 * Enforces 11-char ID and safe delimiters to avoid catastrophic backtracking.
 * Matches:
 * - youtu.be/ID
 * - v/ID
 * - u/w/ID
 * - embed/ID
 * - watch?v=ID
 * - &v=ID
 */
export const YOUTUBE_ID_REGEX =
  /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([\w-]{11})(?:[#&?]|$)/;

/**
 * 🛡️ Sentinel: Safe regex for Vimeo ID extraction.
 * Avoids nested quantifiers.
 * Matches:
 * - vimeo.com/ID
 * - vimeo.com/ID/HASH
 */
export const VIMEO_ID_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)(?:\/(\w+))?$/;

/**
 * Validates a URL protocol to prevent XSS (e.g., javascript: URI).
 * Allows http, https, and relative paths (/).
 * Optionally allows mailto:, tel:, and sms:.
 *
 * 🛡️ Sentinel Improvement:
 * - Parses URL to ensure structural validity
 * - Rejects dangerous characters like quotes, angle brackets, and control chars
 * - Explicitly rejects protocol-relative URLs (//)
 *
 * @param url - The URL to validate
 * @param options - Validation options
 * @returns True if the URL is safe
 */
export function isValidUrl(
  url: string,
  options: {
    allowMailto?: boolean;
    allowTel?: boolean;
    allowSms?: boolean;
  } = {},
): boolean {
  if (!url || typeof url !== "string") return false;

  // 🛡️ Sentinel: Check ORIGINAL string for control characters or dangerous patterns
  // BEFORE trimming. Trimming hides trailing/leading control chars that might be malicious
  // or indicative of a malformed input.
  if (/[<>"'`\r\n\t]/.test(url)) {
    return false;
  }

  const trimmedUrl = url.trim();

  // 🛡️ Sentinel: Explicitly reject protocol-relative URLs (//)
  if (trimmedUrl.startsWith("//")) {
    return false;
  }

  const { allowMailto = false, allowTel = false, allowSms = false } = options;

  try {
    // Try parsing as absolute URL
    const parsed = new URL(trimmedUrl);
    const protocol = parsed.protocol.toLowerCase();

    // Whitelist of safe protocols
    const allowedProtocols = ["http:", "https:"];
    if (allowMailto) {
      allowedProtocols.push("mailto:");
    }
    if (allowTel) {
      allowedProtocols.push("tel:");
    }
    if (allowSms) {
      allowedProtocols.push("sms:");
    }

    return allowedProtocols.includes(protocol);
  } catch {
    // If parsing fails, check if it's a valid relative path
    // Must start with / (but not //), #, or ?
    if (
      trimmedUrl.startsWith("/") ||
      trimmedUrl.startsWith("#") ||
      trimmedUrl.startsWith("?")
    ) {
      return true;
    }

    return false;
  }
}

/**
 * Sanitizes a URL to ensure it uses a safe protocol.
 * Allowed protocols: http, https, mailto, tel, sms.
 * Allowed formats: Relative paths (starting with /), anchors (#), query (?).
 *
 * @param url - The URL to sanitize
 * @returns The sanitized URL or an empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";

  // 🛡️ Sentinel: Check for control characters BEFORE trimming
  if (/[\x00-\x1F\x7F]/.test(url)) {
    return "about:blank";
  }

  // 🛡️ Sentinel: Strip dangerous characters to prevent injection
  if (/[<>"'`]/.test(url)) {
    return "";
  }

  let trimmedUrl = url.trim();

  // Allow relative URLs (starting with / or #)
  // 🛡️ Sentinel: Ensure we don't accidentally allow // (protocol relative)
  if (
    (trimmedUrl.startsWith("/") && !trimmedUrl.startsWith("//")) ||
    trimmedUrl.startsWith("#") ||
    trimmedUrl.startsWith("?")
  ) {
    return trimmedUrl;
  }

  try {
    // Try parsing as absolute URL
    const parsed = new URL(trimmedUrl);
    const protocol = parsed.protocol.toLowerCase();

    // Whitelist of safe protocols
    if (["http:", "https:", "mailto:", "tel:", "sms:"].includes(protocol)) {
      return trimmedUrl;
    }

    return ""; // Block other protocols (javascript:, data:, etc.)
  } catch {
    return ""; // Block malformed URLs
  }
}
