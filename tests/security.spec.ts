import { describe, expect, test } from "bun:test";
import { safeJson, sanitizeInput, sanitizeUrl, isValidUrl } from "../src/utils/security";

test("safeJson handles undefined or function inputs safely", () => {
  // JSON.stringify returns undefined for functions and undefined itself
  const undefinedOutput = safeJson(undefined);
  const functionOutput = safeJson(() => {});

  expect(undefinedOutput).toBe("null");
  expect(functionOutput).toBe("null");
});

test("safeJson escapes dangerous characters", () => {
  const input = {
    script: "<script>alert(1)</script>",
    ampersand: "Me & You",
    greater: "10 > 5",
    separator: "Line\u2028Break",
  };
  const output = safeJson(input);

  expect(output).toContain("\\u003cscript\\u003ealert(1)\\u003c/script\\u003e");
  expect(output).toContain("Me \\u0026 You");
  expect(output).toContain("10 \\u003e 5");
  expect(output).toContain("Line\\u2028Break");
});

test("sanitizeInput escapes HTML entities", () => {
  const input = '<script>alert("hello")</script>';
  const output = sanitizeInput(input);

  expect(output).toBe(
    "&lt;script&gt;alert&#40;&quot;hello&quot;&#41;&lt;&#x2F;script&gt;",
  );
});

test("sanitizeInput handles other dangerous characters", () => {
  const input = "javascript:alert(1)";
  // ( and ) are escaped, so function call is broken in attribute context if strict
  const output = sanitizeInput(input);
  expect(output).toBe("javascript:alert&#40;1&#41;");
});

test("sanitizeInput strips control characters", () => {
  // CR should be stripped, LF kept
  const input = "Header\r\nInjection";
  const output = sanitizeInput(input);
  expect(output).toBe("Header\nInjection");

  // Vertical Tab (\x0B) should be stripped
  const input2 = "Vertical\x0BTab";
  expect(sanitizeInput(input2)).toBe("VerticalTab");
});

test("sanitizeUrl blocks obfuscated javascript URLs", () => {
  expect(sanitizeUrl("jav%0Aascript:alert(1)")).toBe("");
  expect(sanitizeUrl("javascript&#58;alert(1)")).toBe("");
  expect(sanitizeUrl("javascript&colon;alert(1)")).toBe("");
  expect(sanitizeUrl(" jav&#x0a;ascript:alert(1)")).toBe("");

  expect(isValidUrl("javascript&#58;alert(1)")).toBe(false);
  expect(isValidUrl(" jav&#x0a;ascript:alert(1)")).toBe(false);
});

describe("isValidUrl", () => {
  test("allows standard web protocols", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
    expect(isValidUrl("https://example.com")).toBe(true);
  });

  test("handles optional protocols based on options", () => {
    // By default, these should be false
    expect(isValidUrl("mailto:test@example.com")).toBe(false);
    expect(isValidUrl("tel:+1234567890")).toBe(false);
    expect(isValidUrl("sms:+1234567890")).toBe(false);

    // With options enabled
    expect(isValidUrl("mailto:test@example.com", { allowMailto: true })).toBe(true);
    expect(isValidUrl("tel:+1234567890", { allowTel: true })).toBe(true);
    expect(isValidUrl("sms:+1234567890", { allowSms: true })).toBe(true);
  });

  test("allows relative paths, fragments, and queries", () => {
    expect(isValidUrl("/about")).toBe(true);
    expect(isValidUrl("/")).toBe(true);
    expect(isValidUrl("#section")).toBe(true);
    expect(isValidUrl("?query=param")).toBe(true);
  });

  test("rejects dangerous or malformed URLs", () => {
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("vbscript:msgbox(1)")).toBe(false);
    expect(isValidUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isValidUrl("ftp://example.com")).toBe(false); // Only http/https are in default allowlist
  });

  test("rejects protocol-relative URLs", () => {
    expect(isValidUrl("//example.com")).toBe(false);
  });

  test("rejects URLs with control characters or dangerous patterns", () => {
    expect(isValidUrl("https://example.com/test\n")).toBe(false);
    expect(isValidUrl("https://example.com/test\t")).toBe(false);
    expect(isValidUrl("https://example.com/test\r")).toBe(false);
    expect(isValidUrl("https://example.com/<script>")).toBe(false);
    expect(isValidUrl("https://example.com/test\"")).toBe(false);
    expect(isValidUrl("https://example.com/test'")).toBe(false);
    expect(isValidUrl("https://example.com/test`")).toBe(false);
  });

  test("handles invalid inputs gracefully", () => {
    expect(isValidUrl("")).toBe(false);
    // @ts-expect-error - testing invalid type
    expect(isValidUrl(null)).toBe(false);
    // @ts-expect-error - testing invalid type
    expect(isValidUrl(undefined)).toBe(false);
    // @ts-expect-error - testing invalid type
    expect(isValidUrl(123)).toBe(false);
    // @ts-expect-error - testing invalid type
    expect(isValidUrl({})).toBe(false);
  });
});
