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
    const threshold = 2000;
    const expiry = 86400000;

    it("should return valid: true for a standard submission", () => {
      const loadTimestamp = Date.now() - 5000; // 5 seconds ago
      expect(validateFormTimestamp(loadTimestamp, threshold, expiry)).toEqual({
        valid: true,
      });
    });

    it("should reject NaN timestamps", () => {
      expect(validateFormTimestamp(NaN)).toEqual({
        valid: false,
        error: "Invalid timestamp",
      });
    });

    it("should reject future timestamps", () => {
      const loadTimestamp = Date.now() + 1000; // 1 second in future
      expect(validateFormTimestamp(loadTimestamp)).toEqual({
        valid: false,
        error: "Future timestamp",
      });
    });

    it("should reject too fast submissions", () => {
      const loadTimestamp = Date.now() - 500; // 0.5 seconds ago
      expect(validateFormTimestamp(loadTimestamp, threshold)).toEqual({
        valid: false,
        error: "Too fast",
      });
    });

    it("should reject expired sessions", () => {
      const loadTimestamp = Date.now() - (expiry + 1000); // Exceeded expiry
      expect(validateFormTimestamp(loadTimestamp, threshold, expiry)).toEqual({
        valid: false,
        error: "Expired session",
      });
    });
  });
});
