import { describe, it, expect } from "bun:test";
import {
  sanitizeUrl,
  sanitizeInput,
  isValidEmail,
  safeJson,
  isValidUrl,
  YOUTUBE_ID_REGEX,
  VIMEO_ID_REGEX,
} from "../src/utils/security";

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

    it("should allow query-only relative URLs", () => {
      expect(sanitizeUrl("?query=1")).toBe("?query=1");
    });

    it("should allow safe relative paths without leading slash", () => {
      expect(sanitizeUrl("images/photo.jpg")).toBe("images/photo.jpg");
      expect(sanitizeUrl("path/to/page")).toBe("path/to/page");
    });

    it("should block malformed or non-whitelisted protocols in catch block", () => {
      expect(sanitizeUrl("malformed:protocol")).toBe("");
      expect(sanitizeUrl("javascript :alert(1)")).toBe("");
    });
  });

  describe("sanitizeInput", () => {
    it("should sanitize dangerous characters", () => {
      expect(sanitizeInput("<script>alert(1)</script>")).toBe(
        "&lt;script&gt;alert&#40;1&#41;&lt;&#x2F;script&gt;",
      );
    });
  });

  describe("isValidEmail", () => {
    it("should return true for valid email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
      expect(isValidEmail("user+filter@sub.domain.com")).toBe(true);
      expect(isValidEmail("1234567890@example.com")).toBe(true);
      expect(isValidEmail("email@example-one.com")).toBe(true);
      expect(isValidEmail("_______@example.com")).toBe(true);
    });

    it("should return false for invalid email addresses", () => {
      expect(isValidEmail("plainaddress")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("Joe Smith <email@example.com>")).toBe(false);
      expect(isValidEmail("email.example.com")).toBe(false);
      expect(isValidEmail("email@example@example.com")).toBe(false);
      expect(isValidEmail("email@example")).toBe(false);
      expect(isValidEmail("email@-example.com")).toBe(false);
      expect(isValidEmail("email@example-.com")).toBe(false);
      expect(isValidEmail("email@example.c")).toBe(false);
      expect(isValidEmail("email@example..com")).toBe(false);
    });

    it("should return false for non-string or empty inputs", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail(null as any)).toBe(false);
      expect(isValidEmail(undefined as any)).toBe(false);
      expect(isValidEmail(123 as any)).toBe(false);
    });
  });

  describe("safeJson", () => {
    it("should escape dangerous characters for HTML context", () => {
      const data = { html: "<script>alert(1)</script>", escaped: "&" };
      const serialized = safeJson(data);
      expect(serialized).not.toContain("<");
      expect(serialized).not.toContain(">");
      expect(serialized).not.toContain("&");
      expect(serialized).toContain("\\u003c");
      expect(serialized).toContain("\\u003e");
      expect(serialized).toContain("\\u0026");
    });

    it("should escape unicode line separators", () => {
      const data = { line: "\u2028", paragraph: "\u2029" };
      const serialized = safeJson(data);
      expect(serialized).toContain("\\u2028");
      expect(serialized).toContain("\\u2029");
    });
  });

  describe("isValidUrl", () => {
    it("should validate absolute and relative URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://example.com")).toBe(true);
      expect(isValidUrl("/path/to/page")).toBe(true);
    });

    it("should block dangerous protocols by default", () => {
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
      expect(isValidUrl("data:text/html,xss")).toBe(false);
      expect(isValidUrl("mailto:user@example.com")).toBe(false);
    });

    it("should allow mailto when option is enabled", () => {
      expect(isValidUrl("mailto:user@example.com", { allowMailto: true })).toBe(
        true,
      );
    });

    it("should return false for invalid inputs", () => {
      expect(isValidUrl("")).toBe(false);
      expect(isValidUrl(null as any)).toBe(false);
    });
  });

  describe("Video ID Regexes", () => {
    describe("YOUTUBE_ID_REGEX", () => {
      it("should extract IDs from various YouTube URL formats", () => {
        const id = "dQw4w9WgXcQ";
        const formats = [
          `https://www.youtube.com/watch?v=${id}`,
          `https://youtu.be/${id}`,
          `https://www.youtube.com/embed/${id}`,
          `https://www.youtube.com/v/${id}`,
          `https://www.youtube.com/u/w/${id}`,
          `https://www.youtube.com/watch?v=${id}&feature=shared`,
        ];
        formats.forEach((url) => {
          const match = url.match(YOUTUBE_ID_REGEX);
          expect(match).not.toBeNull();
          expect(match![1]).toBe(id);
        });
      });
    });

    describe("VIMEO_ID_REGEX", () => {
      it("should extract IDs from Vimeo URLs", () => {
        const id = "123456789";
        const url = `https://vimeo.com/${id}`;
        const match = url.match(VIMEO_ID_REGEX);
        expect(match).not.toBeNull();
        expect(match![1]).toBe(id);
      });

      it("should extract ID and hash from private Vimeo URLs", () => {
        const id = "123456789";
        const hash = "abcdef1234";
        const url = `https://vimeo.com/${id}/${hash}`;
        const match = url.match(VIMEO_ID_REGEX);
        expect(match).not.toBeNull();
        expect(match![1]).toBe(id);
        expect(match![2]).toBe(hash);
      });
    });
  });
});
