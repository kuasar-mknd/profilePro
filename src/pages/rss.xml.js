import rss from "@astrojs/rss";
import config from "../config.mjs";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";

export async function get(_context) {
  const project = await getCollection("project");
  return rss({
    title: config.title + config.titleSuffix,
    description: config.description,
    site: config.url,
    items: project.map((post) => ({
      title: sanitizeHtml(post.data.title),
      pubDate: post.data.pubDate,
      description: sanitizeHtml(post.data.intro),
      link: `/project/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
