import rss from "@astrojs/rss";
import config from "../config.mjs";
import { getCollection } from "astro:content";

export async function get(context) {
  const project = await getCollection("project");
  return rss({
    title: config.title + config.titleSuffix,
    description: config.description,
    site: config.url,
    items: project.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.intro,
      link: `/project/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
