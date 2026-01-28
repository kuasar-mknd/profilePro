import { describe, it, expect } from "bun:test";
import { sanitizeUrl, sanitizeInput, isValidUrl } from "./security";

describe("Security Utilities", () => {
  describe("isValidUrl", () => {
    it("should allow http/https protocols", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://example.com")).toBe(true);
    });

    it("should allow relative paths", () => {
      expect(isValidUrl("/about")).toBe(true);
      expect(isValidUrl("/path/to/resource")).toBe(true);
    });

    it("should block protocol-relative URLs", () => {
      expect(isValidUrl("//example.com")).toBe(false);
      expect(isValidUrl("//malicious.com")).toBe(false);
    });

    it("should allow double slashes inside path", () => {
      expect(isValidUrl("/foo//bar")).toBe(true);
    });

    it("should block invalid protocols", () => {
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
      expect(isValidUrl("ftp://example.com")).toBe(false);
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

    it("should block protocol-relative URLs", () => {
      // Should return empty string as it's not in the allowlist (which requires http/s or start with / but not //)
      // Actually, since it starts with //, the first check fails.
      // Then it tries new URL("//example.com"), which might parse as protocol relative.
      // But new URL("//example.com") throws or depends on base.
      // If we pass base, it works. But here we don't pass base.
      // Let's see behavior.
      // "http://example.com" is returned.
      // "//example.com" should be rejected.
      expect(sanitizeUrl("//example.com")).toBe("");
      expect(sanitizeUrl("//evil.com/path")).toBe("");
    });

    it("should allow double slashes inside path", () => {
      // This is still a relative path starting with /
      expect(sanitizeUrl("/foo//bar")).toBe("/foo//bar");
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
  });
});
