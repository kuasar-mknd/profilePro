import { describe, it, expect } from "bun:test";
import { GET } from "../../src/pages/robots.txt";
import config from "../../src/config.mjs";

describe("robots.txt API Route", () => {
  it("should return a Response with text/plain content type", async () => {
    const response = await GET();

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
  });

  it("should contain the correct content", async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain("User-agent: *");
    expect(text).toContain("Allow: /");

    const expectedSitemapUrl = new URL("sitemap-index.xml", config.url).href;
    expect(text).toContain(`Sitemap: ${expectedSitemapUrl}`);

    // Check AI crawlers
    const aiCrawlers = [
      "GPTBot",
      "ChatGPT-User",
      "Google-Extended",
      "anthropic-ai",
      "ClaudeBot",
      "PerplexityBot",
    ];

    for (const crawler of aiCrawlers) {
      expect(text).toContain(`User-agent: ${crawler}`);
    }
  });
});
