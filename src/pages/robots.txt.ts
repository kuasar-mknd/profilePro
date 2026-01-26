import type { APIRoute } from "astro";
import config from "../config.mjs";

const robots = `
User-agent: *
Allow: /
Disallow: /404
Sitemap: ${new URL("sitemap-index.xml", config.url).href}
`.trim();

export const GET: APIRoute = () => {
  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
};
