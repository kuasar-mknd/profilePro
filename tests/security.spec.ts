import { expect, test } from "bun:test";
import {
  isValidUrl,
  safeJson,
  sanitizeFilename,
  sanitizeInput,
} from "../src/utils/security";

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

test("sanitizeFilename removes dangerous characters", () => {
  expect(sanitizeFilename("valid-file.jpg")).toBe("valid-file.jpg");
  expect(sanitizeFilename("foo/bar.jpg")).toBe("foobar.jpg");
  expect(sanitizeFilename("../../etc/passwd")).toBe("....etcpasswd"); // Dots are allowed, slashes removed
  expect(sanitizeFilename("evil<script>.js")).toBe("evilscript.js");
  expect(sanitizeFilename("foo bar.jpg")).toBe("foobar.jpg"); // Spaces removed
  expect(sanitizeFilename("corps&ame")).toBe("corps&ame"); // Ampersand allowed
});

test("sanitizeFilename truncates long filenames", () => {
  const longName = "a".repeat(300);
  expect(sanitizeFilename(longName).length).toBe(255);
});

test("isValidUrl validates protocols correctly", () => {
  expect(isValidUrl("https://example.com")).toBe(true);
  expect(isValidUrl("/relative/path")).toBe(true);
  expect(isValidUrl("javascript:alert(1)")).toBe(false);

  // Mailto
  expect(isValidUrl("mailto:test@example.com")).toBe(false);
  expect(isValidUrl("mailto:test@example.com", { allowMailto: true })).toBe(
    true,
  );

  // Tel
  expect(isValidUrl("tel:+1234567890")).toBe(false);
  expect(isValidUrl("tel:+1234567890", { allowTel: true })).toBe(true);
});
