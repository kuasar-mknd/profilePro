import { describe, it, expect } from "bun:test";
import {
  sanitizeUrl,
  sanitizeInput,
  YOUTUBE_ID_REGEX,
  VIMEO_ID_REGEX,
} from "./security";

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

  describe("Regex Patterns", () => {
    describe("YOUTUBE_ID_REGEX", () => {
      const extractId = (url: string) => {
        const match = url.match(YOUTUBE_ID_REGEX);
        return match ? match[1] : null;
      };

      it("should extract ID from youtu.be links", () => {
        expect(extractId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
        expect(extractId("https://youtu.be/dQw4w9WgXcQ?t=10")).toBe(
          "dQw4w9WgXcQ",
        );
        expect(extractId("https://youtu.be/dQw4w9WgXcQ#t=10")).toBe(
          "dQw4w9WgXcQ",
        );
      });

      it("should extract ID from watch?v= links", () => {
        expect(extractId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
          "dQw4w9WgXcQ",
        );
        expect(
          extractId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s"),
        ).toBe("dQw4w9WgXcQ");
        expect(
          extractId(
            "https://www.youtube.com/watch?feature=player_embedded&v=dQw4w9WgXcQ",
          ),
        ).toBe("dQw4w9WgXcQ");
      });

      it("should extract ID from embed links", () => {
        expect(extractId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
          "dQw4w9WgXcQ",
        );
      });

      it("should extract ID from v/ links", () => {
        expect(extractId("https://www.youtube.com/v/dQw4w9WgXcQ")).toBe(
          "dQw4w9WgXcQ",
        );
      });

      it("should extract ID from u/w/ links", () => {
        // Based on the regex u/\w/ matches one word char for user
        expect(extractId("https://www.youtube.com/u/x/dQw4w9WgXcQ")).toBe(
          "dQw4w9WgXcQ",
        );
      });

      it("should not match IDs that are not 11 characters", () => {
        expect(extractId("https://youtu.be/dQw4w9WgXc")).toBe(null); // 10 chars
        expect(extractId("https://youtu.be/dQw4w9WgXcQ1")).toBe(null); // 12 chars
      });

      it("should handle IDs with hyphens and underscores", () => {
        expect(extractId("https://youtu.be/abc-123_XYZ")).toBe("abc-123_XYZ");
      });
    });

    describe("VIMEO_ID_REGEX", () => {
      const extractVimeo = (url: string) => {
        const match = url.match(VIMEO_ID_REGEX);
        return match ? { id: match[1], hash: match[2] } : null;
      };

      it("should extract ID from simple vimeo links", () => {
        expect(extractVimeo("https://vimeo.com/123456789")).toEqual({
          id: "123456789",
          hash: undefined,
        });
        expect(extractVimeo("vimeo.com/123456789")).toEqual({
          id: "123456789",
          hash: undefined,
        });
      });

      it("should extract ID and hash from private vimeo links", () => {
        expect(extractVimeo("https://vimeo.com/123456789/abcdef1234")).toEqual({
          id: "123456789",
          hash: "abcdef1234",
        });
      });

      it("should not match invalid vimeo links", () => {
        expect(extractVimeo("https://example.com/123456789")).toBe(null);
        expect(extractVimeo("https://vimeo.com/abc")).toBe(null);
      });
    });
  });
});
