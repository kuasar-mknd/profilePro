import { expect, test } from "bun:test";
import { GET } from "../src/pages/robots.txt.ts";
import config from "../src/config.mjs";

test("robots.txt returns correct content", async () => {
  // @ts-ignore - passing empty object as APIContext since it's not used in GET
  const response = await GET({});

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("text/plain");

  const body = await response.text();
  expect(body).toContain("User-agent: *");
  expect(body).toContain("Allow: /");

  const expectedSitemap = new URL("sitemap-index.xml", config.url).href;
  expect(body).toContain(`Sitemap: ${expectedSitemap}`);
});
