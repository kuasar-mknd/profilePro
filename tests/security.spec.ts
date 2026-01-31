import { expect, test } from "bun:test";
import {
  safeJson,
  sanitizeInput,
  isValidUrl,
  sanitizeUrl,
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

test("sanitizeInput handles pipe character", () => {
  const input = "ls | grep";
  const output = sanitizeInput(input);
  expect(output).toBe("ls &#124; grep");
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


test("isValidUrl handles protocol-relative URLs", () => {
  expect(isValidUrl("https://google.com")).toBe(true);
  expect(isValidUrl("/path/to/page")).toBe(true);
  expect(isValidUrl("//google.com")).toBe(false); // Blocked by default
  expect(isValidUrl("//google.com", { allowProtocolRelative: true })).toBe(
    true,
  );
});

test("sanitizeUrl blocks protocol-relative URLs", () => {
  expect(sanitizeUrl("https://google.com")).toBe("https://google.com");
  expect(sanitizeUrl("/path/to/page")).toBe("/path/to/page");
  expect(sanitizeUrl("//google.com")).toBe("");
  expect(sanitizeUrl("javascript:alert(1)")).toBe("");
});
