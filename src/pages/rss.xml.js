import getRss from "@astrojs/rss";
import config from "../config.mjs";
import { getSortedProjects } from "../utils/projects";
import sanitizeHtml from "sanitize-html";

const SANITIZE_OPTIONS = {
  allowedTags: [],
  allowedAttributes: {},
};

export async function GET(_context) {
  const projects = await getSortedProjects();
  return getRss({
    title: config.title + config.titleSuffix,
    description: config.description,
    site: config.url,
    items: projects.map((post) => ({
      title: sanitizeHtml(post.data.title, SANITIZE_OPTIONS),
      pubDate: post.data.pubDate,
      description: sanitizeHtml(post.data.intro, SANITIZE_OPTIONS),
      link: `/project/${post.slug}/`,
    })),
    customData: `<language>fr-ch</language>`,
  });
}
