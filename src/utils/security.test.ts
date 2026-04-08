import { describe, it, expect } from "bun:test";
import {
  sanitizeUrl,
  sanitizeInput,
  isValidUrl,
  isValidEmail,
  VIMEO_ID_REGEX,
  YOUTUBE_ID_REGEX,
} from "./security";

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

    it("should allow valid URL variants with ports, subdomains, and IP addresses", () => {
      expect(isValidUrl("https://sub.domain.example.com")).toBe(true);
      expect(isValidUrl("http://localhost:8080/path")).toBe(true);
      expect(isValidUrl("http://192.168.1.1")).toBe(true);
      expect(isValidUrl("http://192.168.1.1:3000/api")).toBe(true);
      expect(isValidUrl("http://[2001:db8::1]:8080")).toBe(true); // IPv6
    });

    it("should allow URLs with complex query parameters and fragments", () => {
      expect(
        isValidUrl("https://example.com/search?q=test+query&lang=en#results"),
      ).toBe(true);
      expect(isValidUrl("https://example.com/api?array[]=1&array[]=2")).toBe(
        true,
      );
      expect(
        isValidUrl("https://example.com/?redirect=https%3A%2F%2Fother.com"),
      ).toBe(true);
    });

    it("should safely reject non-string inputs", () => {
      // @ts-ignore
      expect(isValidUrl(undefined)).toBe(false);
      // @ts-ignore
      expect(isValidUrl(123)).toBe(false);
      // @ts-ignore
      expect(isValidUrl(true)).toBe(false);
      // @ts-ignore
      expect(isValidUrl({})).toBe(false);
      // @ts-ignore
      expect(isValidUrl([])).toBe(false);
    });

    it("should reject invalid inputs", () => {
      expect(isValidUrl("")).toBe(false);
      // @ts-expect-error
      expect(isValidUrl(null)).toBe(false);
    });

    it("should allow valid URL variants", () => {
      expect(isValidUrl("https://example.com:8080")).toBe(true);
      expect(isValidUrl("https://sub.domain.example.co.uk")).toBe(true);
      expect(isValidUrl("http://192.168.1.1")).toBe(true);
      expect(
        isValidUrl("http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]"),
      ).toBe(true);
      expect(
        isValidUrl("https://example.com/path?query=1&param=2#fragment"),
      ).toBe(true);
    });

    it("should strictly reject non-string inputs", () => {
      // @ts-ignore
      expect(isValidUrl(undefined)).toBe(false);
      // @ts-ignore
      expect(isValidUrl(123)).toBe(false);
      // @ts-ignore
      expect(isValidUrl({})).toBe(false);
      // @ts-ignore
      expect(isValidUrl([])).toBe(false);
      // @ts-ignore
      expect(isValidUrl(NaN)).toBe(false);
      // @ts-ignore
      expect(isValidUrl(true)).toBe(false);
    });

    it("should reject obfuscation bypass attempts in isValidUrl", () => {
      expect(isValidUrl("jav%0Aascript:alert(1)")).toBe(false);
      expect(isValidUrl("javascript&#58;alert(1)")).toBe(false);
      expect(isValidUrl("javascript&colon;alert(1)")).toBe(false);
      expect(isValidUrl(" jav&#x0a;ascript:alert(1)")).toBe(false);
      expect(isValidUrl("\x01javascript:alert(1)")).toBe(false);
      expect(isValidUrl("javascript:alert(1)\x00")).toBe(false);
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

    it("should allow relative paths with anchors or queries", () => {
      expect(isValidUrl("#section")).toBe(true);
      expect(isValidUrl("?param=value")).toBe(true);
      expect(isValidUrl("/path?query=1#hash")).toBe(true);
    });

    it("should reject unsupported protocols", () => {
      expect(isValidUrl("ftp://example.com")).toBe(false);
      expect(isValidUrl("data:text/html,<script>alert(1)</script>")).toBe(
        false,
      );
      expect(isValidUrl("file:///etc/passwd")).toBe(false);
      expect(isValidUrl("ws://example.com")).toBe(false);
      expect(isValidUrl("vbscript:msgbox(1)")).toBe(false);
    });

    it("should reject bare domains or malformed relative paths", () => {
      expect(isValidUrl("example.com")).toBe(false);
      expect(isValidUrl("www.example.com")).toBe(false);
      expect(isValidUrl("invalid-path")).toBe(false);
    });

    it("should handle URLs with leading or trailing whitespace", () => {
      expect(isValidUrl("  https://example.com  ")).toBe(true);
      expect(isValidUrl("  #section  ")).toBe(true);
      expect(isValidUrl("  javascript:alert(1)  ")).toBe(false); // Validates trimmed string rejection
    });
  });

  describe("sanitizeUrl", () => {
    it("should reject non-string inputs safely", () => {
      // @ts-expect-error
      expect(sanitizeUrl(null)).toBe("");
      // @ts-expect-error
      expect(sanitizeUrl(123)).toBe("");
      // @ts-expect-error
      expect(sanitizeUrl({})).toBe("");
      // @ts-expect-error
      expect(sanitizeUrl(undefined)).toBe("");
    });

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

    it("should block protocol-relative URLs", () => {
      expect(sanitizeUrl("//example.com")).toBe("");
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
      expect(sanitizeUrl("\x01javascript:alert(1)")).toBe("");
    });

    it("should handle empty inputs", () => {
      expect(sanitizeUrl("")).toBe("");
    });

    it("should return about:blank for URLs with control characters", () => {
      expect(sanitizeUrl("https://example.com/\x01")).toBe("about:blank");
      expect(sanitizeUrl("https://example.com/\x1F")).toBe("about:blank");
      expect(sanitizeUrl("https://example.com/\x7F")).toBe("about:blank");
    });

    it("should allow safe relative paths without leading slashes", () => {
      expect(sanitizeUrl("images/foo.png")).toBe("images/foo.png");
      expect(sanitizeUrl("path/to/page")).toBe("path/to/page");
    });

    it("should block unparseable strings containing colons (potential protocols)", () => {
      expect(sanitizeUrl("invalid:path/to/resource")).toBe("");
      expect(sanitizeUrl("foo:bar")).toBe("");
    });

    it("should block unparseable strings containing colons (potential protocols) if colon exists", () => {
      expect(sanitizeUrl("invalid:protocol:format")).toBe("");
      expect(sanitizeUrl("javascript: alert(1);")).toBe("");
      // "some_string:" fails URL construct because it's missing trailing parts, but also triggers the fallback path because it's not a whitelisted protocol format but has a colon.
      expect(sanitizeUrl("some_string:")).toBe("");
      expect(sanitizeUrl("a:b")).toBe("");
      expect(sanitizeUrl("invalid:/protocol/test")).toBe("");
    });

    it("should cache parsed URLs and evict after 1000 items", () => {
      // Clear cache conceptually by filling it up and testing eviction
      const uniqueUrl = "https://example.com/cache-test";

      // First call, should calculate and cache
      expect(sanitizeUrl(uniqueUrl)).toBe(uniqueUrl);

      // We can't easily inspect the internal Map, but we can verify it doesn't break
      // when adding more than 1000 items.
      for (let i = 0; i < 1005; i++) {
        sanitizeUrl(`https://cache-fill.com/${i}`);
      }

      // The original URL might have been evicted, but requesting it again should still work
      expect(sanitizeUrl(uniqueUrl)).toBe(uniqueUrl);
    });
  });

  describe("sanitizeInput", () => {
    it("should reject non-string inputs safely", () => {
      // @ts-expect-error
      expect(sanitizeInput(null)).toBe("");
      // @ts-expect-error
      expect(sanitizeInput(123)).toBe("");
      // @ts-expect-error
      expect(sanitizeInput({})).toBe("");
      // @ts-expect-error
      expect(sanitizeInput(undefined)).toBe("");
    });

    it("should sanitize dangerous characters", () => {
      expect(sanitizeInput("<script>alert(1)</script>")).toBe(
        "&lt;script&gt;alert&#40;1&#41;&lt;&#x2F;script&gt;",
      );
    });
  });

  describe("isValidEmail", () => {
    it("should allow valid emails", () => {
      const validEmails = [
        "test@example.com",
        "user.name+tag@example.co.uk",
        "123@domain.com",
        "a@b.cc",
        "user_name@domain.com",
        "user-name@domain.com",
      ];
      validEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it("should reject non-string and empty inputs", () => {
      expect(isValidEmail("")).toBe(false);
      // @ts-expect-error
      expect(isValidEmail(null)).toBe(false);
      // @ts-expect-error
      expect(isValidEmail(undefined)).toBe(false);
      // @ts-expect-error
      expect(isValidEmail(123)).toBe(false);
      // @ts-expect-error
      expect(isValidEmail({})).toBe(false);
    });

    it("should reject emails missing required parts", () => {
      const missingParts = [
        "plainaddress",
        "@no-local-part.com",
        "no-at-sign.com",
        "user@domain",
      ];
      missingParts.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it("should reject invalid domain formats", () => {
      const invalidDomains = [
        "user@.com",
        "user@domain..com",
        "user@domain.c",
        "user@domain.com.",
        "user@-domain.com",
        "user@domain-.com",
      ];
      invalidDomains.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it("should reject invalid local part formats", () => {
      const invalidLocals = [
        ".user@domain.com",
        "user.@domain.com",
        "user..name@domain.com",
      ];
      invalidLocals.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });
  describe("VIMEO_ID_REGEX", () => {
    it("should match valid Vimeo URLs and extract ID", () => {
      const urls = [
        "https://vimeo.com/123456789",
        "http://vimeo.com/123456789",
        "vimeo.com/123456789",
        "https://www.vimeo.com/123456789",
      ];
      urls.forEach((url) => {
        const match = url.match(VIMEO_ID_REGEX);
        expect(match).not.toBeNull();
        expect(match![1]).toBe("123456789");
        expect(match![2]).toBeUndefined();
      });
    });

    it("should match valid Vimeo URLs with hash", () => {
      const url = "https://vimeo.com/123456789/abcdef0123";
      const match = url.match(VIMEO_ID_REGEX);
      expect(match).not.toBeNull();
      expect(match![1]).toBe("123456789");
      expect(match![2]).toBe("abcdef0123");
    });

    it("should match additional valid URL formats", () => {
      const urls = [
        "http://www.vimeo.com/123456789",
        "www.vimeo.com/123456789",
      ];
      urls.forEach((url) => {
        const match = url.match(VIMEO_ID_REGEX);
        expect(match).not.toBeNull();
        expect(match![1]).toBe("123456789");
        expect(match![2]).toBeUndefined();
      });
    });

    it("should strictly reject URLs with query params, fragments, or extra paths due to anchors in regex", () => {
      const invalidUrls = [
        "https://vimeo.com/123456789?query=1",
        "https://vimeo.com/123456789#hash",
        "https://vimeo.com/123456789/hash/extra",
        "https://vimeo.com/123456789/",
        "https://vimeo.com/",
        "vimeo.com",
      ];
      invalidUrls.forEach((url) => {
        expect(url.match(VIMEO_ID_REGEX)).toBeNull();
      });
    });

    it("should not match invalid Vimeo URLs", () => {
      const invalidUrls = [
        "https://notvimeo.com/123456789",
        "https://vimeo.com/abc",
        "https://vimeo.com/123456789/abc/def",
      ];
      invalidUrls.forEach((url) => {
        expect(url.match(VIMEO_ID_REGEX)).toBeNull();
      });
    });
  });

  describe("YOUTUBE_ID_REGEX", () => {
    it("should extract 11-character ID from various YouTube formats", () => {
      const cases = [
        {
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          id: "dQw4w9WgXcQ",
        },
        { url: "https://youtu.be/dQw4w9WgXcQ", id: "dQw4w9WgXcQ" },
        { url: "https://www.youtube.com/embed/dQw4w9WgXcQ", id: "dQw4w9WgXcQ" },
        { url: "https://www.youtube.com/v/dQw4w9WgXcQ", id: "dQw4w9WgXcQ" },
        {
          url: "https://www.youtube.com/watch?feature=player_embedded&v=dQw4w9WgXcQ",
          id: "dQw4w9WgXcQ",
        },
        { url: "https://www.youtube.com/u/x/dQw4w9WgXcQ", id: "dQw4w9WgXcQ" },
      ];
      cases.forEach(({ url, id }) => {
        const match = url.match(YOUTUBE_ID_REGEX);
        expect(match).not.toBeNull();
        expect(match![1]).toBe(id);
      });
    });

    it("should handle IDs with hyphens and underscores", () => {
      const url = "https://youtu.be/a-B_3456789";
      const match = url.match(YOUTUBE_ID_REGEX);
      expect(match).not.toBeNull();
      expect(match![1]).toBe("a-B_3456789");
    });

    it("should extract ID when followed by additional parameters or fragments", () => {
      const cases = [
        { url: "https://youtu.be/dQw4w9WgXcQ?t=10", id: "dQw4w9WgXcQ" },
        {
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123",
          id: "dQw4w9WgXcQ",
        },
        { url: "https://youtu.be/dQw4w9WgXcQ#time=1", id: "dQw4w9WgXcQ" },
      ];
      cases.forEach(({ url, id }) => {
        const match = url.match(YOUTUBE_ID_REGEX);
        expect(match).not.toBeNull();
        expect(match![1]).toBe(id);
      });
    });

    it("should not match invalid YouTube IDs", () => {
      const invalidUrls = [
        "https://youtu.be/short",
        "https://youtu.be/too-long-id-123",
      ];
      invalidUrls.forEach((url) => {
        const match = url.match(YOUTUBE_ID_REGEX);
        expect(match).toBeNull();
      });
    });

    it("should match YouTube patterns even on non-youtube domains (current behavior)", () => {
      const url = "https://notyoutube.com/watch?v=dQw4w9WgXcQ";
      const match = url.match(YOUTUBE_ID_REGEX);
      expect(match).not.toBeNull();
      expect(match![1]).toBe("dQw4w9WgXcQ");
    });
  });
});

describe("obfuscated URLs", () => {
  it("should block obfuscated javascript URLs", () => {
    expect(sanitizeUrl("jav%0Aascript:alert(1)")).toBe("");
    expect(sanitizeUrl("javascript&#58;alert(1)")).toBe("");
    expect(sanitizeUrl("javascript&colon;alert(1)")).toBe("");
    expect(sanitizeUrl(" jav&#x0a;ascript:alert(1)")).toBe("");
  });

  it("should reject obfuscated javascript URLs in validation", () => {
    expect(isValidUrl("javascript&#58;alert(1)")).toBe(false);
    expect(isValidUrl(" jav&#x0a;ascript:alert(1)")).toBe(false);
  });
});
