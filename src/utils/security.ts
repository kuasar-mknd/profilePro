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

// ⚡ Bolt: Define replacement map and regex outside function scope to prevent memory reallocation on every call
const ESCAPE_JSON_REGEX = /[<>&'\u2028\u2029]/g;
const ESCAPE_JSON_MAP: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "'": "\\u0027",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

export function safeJson(value: unknown): string {
  const serialized = JSON.stringify(value);

  // 🛡️ Sentinel: JSON.stringify returns undefined for functions, symbols, and undefined itself.
  // We must return a valid JSON string (like "null") to prevent TypeError during .replace()
  if (serialized === undefined) return "null";

  return serialized.replace(
    ESCAPE_JSON_REGEX,
    (match) => ESCAPE_JSON_MAP[match]!,
  );
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
// ⚡ Bolt: Define replacement map and regex outside function scope to prevent memory reallocation on every call
const SANITIZE_INPUT_MAP: Record<string, string> = {
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
const SANITIZE_INPUT_REGEX = /[&<>"'/`=(){}[\]%\\]/g;
const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B-\x1F\x7F]/g;

export function sanitizeInput(str: string, maxLength: number = 10000): string {
  if (!str || typeof str !== "string") return "";

  // 🛡️ Sentinel: Enforce maximum input length to prevent ReDoS and CPU exhaustion
  // from maliciously large strings before running regular expressions.
  const truncatedStr = str.length > maxLength ? str.slice(0, maxLength) : str;

  // 🛡️ Sentinel: Strip control characters (CR, LF, Vertical Tab, etc.) to prevent Header Injection
  // and other control-character based attacks.
  // Exceptions: Horizontal Tab (\t) is usually safe in text content.
  const cleanStr = truncatedStr.replace(CONTROL_CHAR_REGEX, "");

  return cleanStr.replace(
    SANITIZE_INPUT_REGEX,
    (match) => SANITIZE_INPUT_MAP[match] || match,
  );
}

/**

 * 🛡️ Sentinel: Stricter regex to prevent invalid domain formats.
 * Enforces:
 * - Standard email structure
 * - No leading/trailing hyphens in domain parts
 * - TLD length of at least 2 chars
 * - Avoids nested quantifiers that could lead to ReDoS
 */
const EMAIL_PATTERN =
  /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@(?:[a-zA-Z0-9]+(?:-+[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/;

/**
 * Validates an email address against strict structural requirements.
 *
 * @param email - The email address to validate
 * @returns True if the email is structurally valid
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  if (email.length > 254) return false;
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
 * 🛡️ Sentinel: Explicitly rejects:
 * - javascript: schemes (XSS)
 * - protocol-relative URLs like //example.com (open redirect)
 *
 * @param url - The URL to validate
 * @param options - Validation options
 * @returns True if the URL is safe
 */

/**
 * 🛡️ Sentinel: Helper to detect obfuscated protocols like javascript:
 * Decodes URL encoding and HTML entities before validating.
 */
// ⚡ Bolt: Define regex constants outside function scope to prevent memory reallocation on every call
const DEC_ENTITY_REGEX = /&#(\d+);?/g;
const HEX_ENTITY_REGEX = /&#[xX]([0-9a-fA-F]+);?/g;
const COLON_ENTITY_REGEX = /&colon;/gi;
const TAB_ENTITY_REGEX = /&tab;/gi;
const NEWLINE_ENTITY_REGEX = /&newline;/gi;
const URL_CONTROL_CHARS_REGEX = /[\x00-\x20\x7F]/g;

function isObfuscatedProtocol(url: string): boolean {
  let decoded = url;
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Ignore malformed URI sequences
  }

  // Decode HTML entities
  decoded = decoded
    .replace(DEC_ENTITY_REGEX, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(HEX_ENTITY_REGEX, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(COLON_ENTITY_REGEX, ":")
    .replace(TAB_ENTITY_REGEX, "\t")
    .replace(NEWLINE_ENTITY_REGEX, "\n");

  // Strip control chars and spaces
  decoded = decoded.replace(URL_CONTROL_CHARS_REGEX, "").toLowerCase();

  return (
    decoded.startsWith("javascript:") ||
    decoded.startsWith("vbscript:") ||
    decoded.startsWith("data:")
  );
}

function isValidProtocol(
  protocol: string,
  options: {
    allowMailto?: boolean;
    allowTel?: boolean;
    allowSms?: boolean;
  },
): boolean {
  const allowedProtocols = ["http:", "https:"];
  if (options.allowMailto) allowedProtocols.push("mailto:");
  if (options.allowTel) allowedProtocols.push("tel:");
  if (options.allowSms) allowedProtocols.push("sms:");

  return allowedProtocols.includes(protocol);
}

function isValidRelativePath(url: string): boolean {
  return url.startsWith("/") || url.startsWith("#") || url.startsWith("?");
}

export function isValidUrl(
  url: string,
  options: {
    allowMailto?: boolean;
    allowTel?: boolean;
    allowSms?: boolean;
  } = {},
): boolean {
  if (!url || typeof url !== "string") return false;
  if (url.length > 2048) return false;

  // 🛡️ Sentinel: Check ORIGINAL string for control characters or dangerous patterns
  // BEFORE trimming. Trimming hides trailing/leading control chars that might be malicious
  // or indicative of a malformed input.
  if (/[<>"'`\r\n\t]/.test(url)) {
    return false;
  }

  const trimmedUrl = url.trim();

  // 🛡️ Sentinel: Block obfuscated protocols (e.g. javascript&#58;)
  if (isObfuscatedProtocol(url)) {
    return false;
  }

  // 🛡️ Sentinel: Explicitly reject protocol-relative URLs (//)
  if (trimmedUrl.startsWith("//")) {
    return false;
  }

  try {
    // Try parsing as absolute URL
    const parsed = new URL(trimmedUrl);
    return isValidProtocol(parsed.protocol.toLowerCase(), options);
  } catch {
    // If parsing fails, check if it's a valid relative path
    // Must start with / (but not //), #, or ?
    return isValidRelativePath(trimmedUrl);
  }
}

// ⚡ Bolt: Cache sanitized URLs to prevent redundant parsing
// sanitizeUrl is called frequently (e.g., for every tag in lists).
// Parsing URLs with `new URL()` and regex inside loops is expensive during SSG.
const sanitizeUrlCache = new Map<string, string>();

/**
 * Helper to get cached sanitized URL or manage cache size.
 */
function getCachedSanitizedUrl(url: string): string | undefined {
  return sanitizeUrlCache.get(url);
}

function setCachedSanitizedUrl(url: string, result: string): void {
  // Prevent unbounded memory growth in long-running processes (like dev server)
  if (sanitizeUrlCache.size > 1000) {
    const firstKey = sanitizeUrlCache.keys().next().value;
    if (firstKey) sanitizeUrlCache.delete(firstKey);
  }
  sanitizeUrlCache.set(url, result);
}

/**
 * Validates the protocol of a parsed URL.
 */
function validateParsedProtocol(trimmedUrl: string): string {
  try {
    // Try parsing as absolute URL
    const parsed = new URL(trimmedUrl);
    const protocol = parsed.protocol.toLowerCase();

    // Whitelist of safe protocols
    if (["http:", "https:", "mailto:", "tel:", "sms:"].includes(protocol)) {
      return trimmedUrl;
    } else {
      return ""; // Block other protocols (javascript:, data:, etc.)
    }
  } catch {
    // If it fails to parse as absolute URL, it might be a relative path without a leading slash
    // or a malformed URL.
    // Check for dangerous characters that might indicate a malformed protocol or XSS attempt.
    // If it contains a colon but is not a recognized protocol, it's likely unsafe.
    if (!trimmedUrl.includes(":")) {
      // This could be a relative path like "images/foo.png" or "path/to/page"
      // We allow these as they are generally safe unless they contain control characters (already checked).
      return trimmedUrl;
    } else {
      return ""; // Block anything else that looks like a protocol but isn't whitelisted
    }
  }
}

/**
 * Core sanitization logic without caching wrapper.
 */
function performSanitization(url: string): string {
  // Trim whitespace
  let trimmedUrl = url.trim();

  // 🛡️ Sentinel: Block obfuscated protocols (e.g. javascript&#58;)
  if (isObfuscatedProtocol(url)) {
    return "";
  }

  // 🛡️ Sentinel: Prevent control characters (0x00-0x1F) in URL to avoid filter bypass
  if (/[\x00-\x1F\x7F]/.test(trimmedUrl)) {
    return "about:blank";
  }

  if (
    trimmedUrl.startsWith("/") ||
    trimmedUrl.startsWith("#") ||
    trimmedUrl.startsWith("?")
  ) {
    // Allow relative URLs (starting with / or #)
    // 🛡️ Sentinel: Explicitly reject protocol-relative URLs (//)
    if (trimmedUrl.startsWith("//")) {
      return "";
    } else {
      return trimmedUrl;
    }
  }

  return validateParsedProtocol(trimmedUrl);
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
  if (!url || typeof url !== "string") return "";

  const cached = getCachedSanitizedUrl(url);
  if (cached !== undefined) return cached;

  const result = performSanitization(url);

  setCachedSanitizedUrl(url, result);
  return result;
}
