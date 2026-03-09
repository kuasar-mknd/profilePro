import { getCollection, type CollectionEntry } from "astro:content";

// ⚡ Bolt: Cache the Promise of sorted projects to prevent redundant fetching and sorting
// during parallel SSG builds. By caching the Promise instead of the resolved array,
// concurrent calls before the first fetch completes will simply await the existing Promise,
// reducing memory allocation and redundant O(N log N) operations.
let projectsPromise: Promise<CollectionEntry<"project">[]> | null = null;

/**
 * Fetches the 'project' collection, sorts it by pubDate descending, and caches the result.
 * Bypasses cache during development to support HMR.
 */
export async function getSortedProjects(): Promise<
  CollectionEntry<"project">[]
> {
  if (projectsPromise && !import.meta.env.DEV) {
    return projectsPromise;
  }

  const fetchAndSort = async () => {
    const allProjects = await getCollection("project");
    return allProjects.sort(
      (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );
  };

  // In DEV mode, skip the cache entirely to ensure HMR continues to work
  if (import.meta.env.DEV) {
    return fetchAndSort();
  }

  projectsPromise = fetchAndSort();

  return projectsPromise;
}
