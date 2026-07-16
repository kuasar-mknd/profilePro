import type { APIRoute } from "astro";
import config from "../config.mjs";

const robots = `
User-agent: *
Allow: /
Sitemap: ${new URL("sitemap-index.xml", config.url).href}

# AI Crawlers
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: CCBot
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Meta-ExternalAgent
Allow: /
User-agent: DuckAssistBot
Allow: /

# Guidance LLM : ${new URL("llms.txt", config.url).href}
`.trim();

export const GET: APIRoute = () => {
  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
};
