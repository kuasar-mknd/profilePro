import { describe, it, expect } from "bun:test";
import { sanitizeUrl, sanitizeInput, EMAIL_PATTERN } from "./security";

describe("Security Utilities", () => {
  describe("sanitizeUrl", () => {
    it("should allow valid http/https URLs", () => {
      expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
      expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
    });

    it("should allow mailto and tel schemes", () => {
      expect(sanitizeUrl("mailto:user@example.com")).toBe(
        "mailto:user@example.com",
      );
      expect(sanitizeUrl("tel:+1234567890")).toBe("tel:+1234567890");
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
  });

  describe("sanitizeInput", () => {
    it("should sanitize dangerous characters", () => {
      expect(sanitizeInput("<script>alert(1)</script>")).toBe(
        "&lt;script&gt;alert&#40;1&#41;&lt;&#x2F;script&gt;",
      );
    });

    it("should escape template injection and command characters", () => {
      const input = "Hello $ { world } | ^";
      const actual = sanitizeInput(input);
      expect(actual).toContain("&#36;"); // $
      expect(actual).toContain("&#124;"); // |
      expect(actual).toContain("&#94;"); // ^
      expect(actual).toContain("&#123;"); // {
      expect(actual).toContain("&#125;"); // }
    });
  });

  describe("EMAIL_PATTERN", () => {
    it("should accept IDN TLDs and enforce 2 chars", () => {
      // Valid cases
      expect(EMAIL_PATTERN.test("test@example.com")).toBe(true);
      expect(EMAIL_PATTERN.test("test@example.co.uk")).toBe(true);
      expect(EMAIL_PATTERN.test("test@example.xn--p1ai")).toBe(true); // .рф (IDN)
      expect(EMAIL_PATTERN.test("test@example.museum")).toBe(true);

      // Invalid cases
      expect(EMAIL_PATTERN.test("test@example.a")).toBe(false); // Too short
      expect(EMAIL_PATTERN.test("test@example")).toBe(false); // No TLD
      expect(EMAIL_PATTERN.test("test@.com")).toBe(false); // No domain
    });
  });
});
