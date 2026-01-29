import { describe, it, expect } from "bun:test";
import { sanitizeUrl, sanitizeInput, sanitizeFilename } from "./security";

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

  describe("sanitizeFilename", () => {
    it("should allow valid filenames", () => {
      expect(sanitizeFilename("file.txt")).toBe("file.txt");
      expect(sanitizeFilename("image-123.png")).toBe("image-123.png");
      expect(sanitizeFilename("my_document.pdf")).toBe("my_document.pdf");
    });

    it("should remove directory traversal patterns", () => {
      // Slashes are removed by allowlist, dots are processed
      // ../../etc/passwd -> ..etcpasswd -> etcpasswd
      expect(sanitizeFilename("../../etc/passwd")).toBe("etcpasswd");
      expect(sanitizeFilename("..")).toBe("");
      // foo/../bar -> foo..bar -> foobar
      expect(sanitizeFilename("foo/../bar")).toBe("foobar");
    });

    it("should handle recursive directory traversal attempts", () => {
      // ....// -> .... -> .. -> ""
      expect(sanitizeFilename("....//")).toBe("");
      // ..././ -> .... -> .. -> ""
      expect(sanitizeFilename("..././")).toBe("");
    });

    it("should enforce allowlist", () => {
      expect(sanitizeFilename("file.txt; rm -rf /")).toBe("file.txtrm-rf");
      expect(sanitizeFilename("image.jpg<script>")).toBe("image.jpgscript");
    });

    it("should strip control characters", () => {
      expect(sanitizeFilename("file\u0000.txt")).toBe("file.txt");
      expect(sanitizeFilename("file\n.txt")).toBe("file.txt");
    });

    it("should truncate long filenames", () => {
      const longName = "a".repeat(300);
      expect(sanitizeFilename(longName).length).toBe(255);
    });
  });
});
