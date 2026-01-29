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
    it("should allow valid alphanumeric filenames", () => {
      expect(sanitizeFilename("image.png")).toBe("image.png");
      expect(sanitizeFilename("my-file_v2.txt")).toBe("my-file_v2.txt");
    });

    it("should strip special characters and spaces", () => {
      expect(sanitizeFilename("file name.jpg")).toBe("filename.jpg");
      expect(sanitizeFilename("file@#$%.png")).toBe("file.png");
    });

    it("should prevent directory traversal", () => {
      expect(sanitizeFilename("../etc/passwd")).toBe(".etcpasswd");
      expect(sanitizeFilename("..")).toBe(".");
      expect(sanitizeFilename(".../file")).toBe(".file");
    });

    it("should handle obfuscated traversal attempts", () => {
      expect(sanitizeFilename(". .")).toBe("."); // space stripped -> .. -> .
      expect(sanitizeFilename("..//file")).toBe(".file");
    });

    it("should handle control characters", () => {
      expect(sanitizeFilename("file\u0000name.png")).toBe("filename.png");
    });

    it("should truncate long filenames", () => {
      const longName = "a".repeat(300) + ".txt";
      expect(sanitizeFilename(longName).length).toBe(255);
      expect(sanitizeFilename(longName).endsWith(".txt")).toBe(false); // It's truncated
    });

    it("should handle empty or non-string inputs", () => {
      expect(sanitizeFilename("")).toBe("");
      // @ts-expect-error Testing invalid input
      expect(sanitizeFilename(null)).toBe("");
      // @ts-expect-error Testing invalid input
      expect(sanitizeFilename(undefined)).toBe("");
    });
  });
});
