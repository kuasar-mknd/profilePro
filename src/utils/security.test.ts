import { describe, it, expect } from "bun:test";
import { sanitizeUrl } from "./security";

describe("sanitizeUrl", () => {
  it("should allow safe URLs", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
    expect(sanitizeUrl("/path/to/file")).toBe("/path/to/file");
    expect(sanitizeUrl("#anchor")).toBe("#anchor");
    expect(sanitizeUrl("mailto:user@example.com")).toBe("mailto:user@example.com");
    expect(sanitizeUrl("tel:123456789")).toBe("tel:123456789");
    expect(sanitizeUrl("images/logo.png")).toBe("images/logo.png");
  });

  it("should block dangerous URLs", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
    expect(sanitizeUrl("JAVASCRIPT:alert(1)")).toBe("");
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");
    expect(sanitizeUrl("vbscript:alert(1)")).toBe("");
  });

  it("should handle edge cases", () => {
    expect(sanitizeUrl("")).toBe("");
    expect(sanitizeUrl("   https://example.com   ")).toBe("https://example.com");
    expect(sanitizeUrl("//example.com")).toBe("//example.com"); // Protocol relative is safe-ish
  });

  it("should block relative URLs with colons", () => {
     // "foo:bar" is parsed as protocol "foo:" by URL(). "foo" is not in whitelist.
     expect(sanitizeUrl("foo:bar")).toBe("");
  });
});
