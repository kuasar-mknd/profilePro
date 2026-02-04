import { describe, it, expect } from "bun:test";
import { sanitizeUrl, sanitizeInput, isValidUrl } from "./security";

describe("Security Utilities", () => {
  describe("isValidUrl", () => {
    it("should allow valid http/https URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://example.com")).toBe(true);
    });

    it("should allow relative paths", () => {
      expect(isValidUrl("/about")).toBe(true);
      expect(isValidUrl("/")).toBe(true);
    });

    it("should block protocol-relative URLs", () => {
      expect(isValidUrl("//example.com")).toBe(false);
    });

    it("should block javascript: scheme", () => {
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
    });

    it("should block control characters", () => {
      expect(isValidUrl("https://example.com\n")).toBe(false);
      expect(isValidUrl("https://example.com\r")).toBe(false);
      expect(isValidUrl("https://example.com\x01")).toBe(false);
    });

    it("should optionally allow mailto", () => {
      expect(isValidUrl("mailto:user@example.com")).toBe(false);
      expect(isValidUrl("mailto:user@example.com", { allowMailto: true })).toBe(
        true,
      );
    });
  });

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

    it("should block protocol-relative URLs", () => {
      expect(sanitizeUrl("//example.com")).toBe("about:blank");
    });
  });

  describe("sanitizeInput", () => {
    it("should sanitize dangerous characters", () => {
      expect(sanitizeInput("<script>alert(1)</script>")).toBe(
        "&lt;script&gt;alert&#40;1&#41;&lt;&#x2F;script&gt;",
      );
    });

    it("should sanitize $, |, and ^", () => {
      expect(sanitizeInput("$")).toBe("&#36;");
      expect(sanitizeInput("|")).toBe("&#124;");
      expect(sanitizeInput("^")).toBe("&#94;");
    });
  });
});
