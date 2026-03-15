import { getCollection, type CollectionEntry } from "astro:content";

// ⚡ Bolt: Cache the Promise of CV collections to prevent redundant fetching
// during parallel SSG builds. By caching the Promise instead of the resolved array,
// concurrent calls before the first fetch completes will simply await the existing Promise,
// reducing memory allocation and redundant operations.

let experiencesPromise: Promise<CollectionEntry<"cvExperience">[]> | null =
  null;
let educationsPromise: Promise<CollectionEntry<"cvEducation">[]> | null = null;

/**
 * Fetches the 'cvExperience' collection and caches the result.
 * Bypasses cache during development to support HMR.
 */
export async function getCvExperiences(): Promise<
  CollectionEntry<"cvExperience">[]
> {
  if (experiencesPromise && !import.meta.env.DEV) {
    return experiencesPromise;
  }

  const fetchFn = async () => {
    return await getCollection("cvExperience");
  };

  if (import.meta.env.DEV) {
    return fetchFn();
  }

  experiencesPromise = fetchFn();
  return experiencesPromise;
}

/**
 * Fetches the 'cvEducation' collection and caches the result.
 * Bypasses cache during development to support HMR.
 */
export async function getCvEducations(): Promise<
  CollectionEntry<"cvEducation">[]
> {
  if (educationsPromise && !import.meta.env.DEV) {
    return educationsPromise;
  }

  const fetchFn = async () => {
    return await getCollection("cvEducation");
  };

  if (import.meta.env.DEV) {
    return fetchFn();
  }

  educationsPromise = fetchFn();
  return educationsPromise;
}
