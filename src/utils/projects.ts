import { getCollection, type CollectionEntry } from "astro:content";

// ⚡ Bolt: Cache sorted projects during SSG to prevent redundant O(N log N) sorting
let cachedProjects: CollectionEntry<"project">[] | null = null;

/**
 * Fetches the 'project' collection, sorts it by pubDate descending, and caches the result.
 * Bypasses cache during development to support HMR.
 */
export async function getSortedProjects(): Promise<
  CollectionEntry<"project">[]
> {
  if (cachedProjects && !import.meta.env.DEV) {
    return cachedProjects;
  }

  const allProjects = await getCollection("project");
  const sorted = allProjects.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  if (!import.meta.env.DEV) {
    cachedProjects = sorted;
  }

  return sorted;
}
