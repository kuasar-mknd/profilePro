import { describe, it, expect } from "bun:test";
import { sanitizeUrl, sanitizeInput, isValidUrl } from "./security";

describe("Security Utilities", () => {
  describe("isValidUrl", () => {
    it("should allow valid http/https URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://example.com")).toBe(true);
    });

    it("should allow valid absolute paths", () => {
      expect(isValidUrl("/about")).toBe(true);
      expect(isValidUrl("/path/to/resource")).toBe(true);
    });

    it("should reject protocol-relative URLs", () => {
      expect(isValidUrl("//example.com")).toBe(false);
      expect(isValidUrl("//malicious.com/script.js")).toBe(false);
    });

    it("should reject javascript: scheme", () => {
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
    });

    it("should reject invalid inputs", () => {
      expect(isValidUrl("")).toBe(false);
      // @ts-ignore
      expect(isValidUrl(null)).toBe(false);
    });

    it("should allow mailto if option enabled", () => {
      expect(isValidUrl("mailto:user@example.com", { allowMailto: true })).toBe(
        true,
      );
      expect(isValidUrl("mailto:user@example.com")).toBe(false);
    });

    it("should allow tel if option enabled", () => {
      expect(isValidUrl("tel:+1234567890", { allowTel: true })).toBe(true);
      expect(isValidUrl("tel:+1234567890")).toBe(false);
    });

    it("should allow sms if option enabled", () => {
      expect(isValidUrl("sms:+1234567890", { allowSms: true })).toBe(true);
      expect(isValidUrl("sms:+1234567890")).toBe(false);
    });

    it("should reject URLs with dangerous characters (XSS vectors)", () => {
      expect(isValidUrl("https://example.com<script>")).toBe(false);
      expect(isValidUrl('https://example.com" onclick="alert(1)')).toBe(false);
      expect(isValidUrl("https://example.com' onmouseover='alert(1)")).toBe(
        false,
      );
      expect(isValidUrl("https://example.com`")).toBe(false);
    });

    it("should reject URLs with control characters (Header Injection)", () => {
      // Note: "https://example.com\nHeader: Injection"
      expect(isValidUrl("https://example.com\nHeader: Injection")).toBe(false);
      expect(isValidUrl("https://example.com\rHeader: Injection")).toBe(false);
      expect(isValidUrl("https://example.com\t")).toBe(false);
    });
  });

  describe("sanitizeUrl", () => {
    it("should allow valid http/https URLs", () => {
      expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
      expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
    });

    it("should allow mailto, tel and sms schemes", () => {
      expect(sanitizeUrl("mailto:user@example.com")).toBe(
        "mailto:user@example.com",
      );
      expect(sanitizeUrl("tel:+1234567890")).toBe("tel:+1234567890");
      expect(sanitizeUrl("sms:+1234567890")).toBe("sms:+1234567890");
    });

    it("should allow relative paths and anchors", () => {
      expect(sanitizeUrl("/about")).toBe("/about");
      expect(sanitizeUrl("#section")).toBe("#section");
      expect(sanitizeUrl("/path/to/resource?query=1")).toBe(
        "/path/to/resource?query=1",
      );
    });

    it("should block javascript: scheme", () => {
      expect(sanitizeUrl("javascript:alert(1)")).toBe("");
      expect(sanitizeUrl("JAVASCRIPT:alert(1)")).toBe("");
    });

    it("should block data: scheme", () => {
      expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");
    });

    it("should block unknown schemes", () => {
      expect(sanitizeUrl("ftp://example.com")).toBe("");
      expect(sanitizeUrl("vbscript:msgbox(1)")).toBe("");
    });

    it("should handle mixed case schemes", () => {
      expect(sanitizeUrl("HTTPS://EXAMPLE.COM")).toBe("HTTPS://EXAMPLE.COM");
    });

    it("should handle whitespace", () => {
      expect(sanitizeUrl("  https://example.com  ")).toBe(
        "https://example.com",
      );
    });

    it("should handle control characters in scheme", () => {
      // \x01javascript:alert(1)
      expect(sanitizeUrl("\x01javascript:alert(1)")).toBe("about:blank");
    });

    it("should return empty string for URLs with dangerous characters", () => {
      expect(sanitizeUrl("https://example.com<script>")).toBe("");
      expect(sanitizeUrl('https://example.com" onclick="alert(1)')).toBe("");
    });
  });

  describe("sanitizeInput", () => {
    it("should sanitize dangerous characters", () => {
      expect(sanitizeInput("<script>alert(1)</script>")).toBe(
        "&lt;script&gt;alert&#40;1&#41;&lt;&#x2F;script&gt;",
      );
    });
  });
});
