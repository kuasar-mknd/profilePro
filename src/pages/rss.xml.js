import getRss from "@astrojs/rss";
import config from "../config.mjs";
import { getSortedProjects } from "../utils/projects";
import sanitizeHtml from "sanitize-html";

export async function GET(_context) {
  const projects = await getSortedProjects();
  return getRss({
    title: config.title + config.titleSuffix,
    description: config.description,
    site: config.url,
    items: projects.map((post) => ({
      title: sanitizeHtml(post.data.title, {
        allowedTags: [],
        allowedAttributes: {},
      }),
      pubDate: post.data.pubDate,
      description: sanitizeHtml(post.data.intro, {
        allowedTags: [],
        allowedAttributes: {},
      }),
      link: `/project/${post.slug}/`,
    })),
    customData: `<language>fr-ch</language>`,
  });
}
