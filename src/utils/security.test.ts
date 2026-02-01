import { describe, it, expect } from "bun:test";
import { sanitizeUrl, sanitizeInput, validateFormTimestamp } from "./security";

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
  });

  describe("validateFormTimestamp", () => {
    const NOW = 1620000000000; // Fixed timestamp for testing

    it("should return true for valid duration", () => {
      const loadTime = NOW - 3000; // 3 seconds ago
      expect(validateFormTimestamp(loadTime.toString(), NOW)).toBe(true);
    });

    it("should return false for too fast submission (bot)", () => {
      const loadTime = NOW - 1000; // 1 second ago (threshold is 2000ms)
      expect(validateFormTimestamp(loadTime.toString(), NOW)).toBe(false);
    });

    it("should return false for empty timestamp", () => {
      expect(validateFormTimestamp("", NOW)).toBe(false);
    });

    it("should return false for non-numeric timestamp", () => {
      expect(validateFormTimestamp("abc", NOW)).toBe(false);
      expect(validateFormTimestamp("NaN", NOW)).toBe(false);
    });

    it("should return false for future timestamp", () => {
      const loadTime = NOW + 1000; // Future
      expect(validateFormTimestamp(loadTime.toString(), NOW)).toBe(false);
    });

    it("should return false for expired timestamp", () => {
      const loadTime = NOW - 86400001; // > 24 hours ago
      expect(validateFormTimestamp(loadTime.toString(), NOW)).toBe(false);
    });

    it("should respect custom thresholds", () => {
      const loadTime = NOW - 3000;
      // Min duration 5000ms, should fail
      expect(validateFormTimestamp(loadTime.toString(), NOW, 5000)).toBe(false);
    });
  });
});
