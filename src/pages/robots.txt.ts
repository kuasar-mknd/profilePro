import type { APIRoute } from "astro";
import config from "../config.mjs";

const robots = `
User-agent: *
Allow: /
Sitemap: ${new URL("sitemap-index.xml", config.url).href}

# AI Crawlers
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
`.trim();

export const GET: APIRoute = () => {
  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
};
