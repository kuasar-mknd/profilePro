/**
 * ⚡ Bolt: Async Utilities
 * Helper functions for managing asynchronous operations efficiently.
 */

/**
 * Limits the concurrency of asynchronous operations.
 * Use this to process a large array of items without overwhelming system resources (e.g., image optimization).
 *
 * @param items - Array of items to process
 * @param limit - Maximum number of concurrent operations
 * @param fn - Async function to run for each item
 * @returns Promise that resolves with an array of results in the same order as items
 */
export async function limitConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const executing: Promise<void>[] = [];
  const resultPromises: Promise<R>[] = [];

  for (const item of items) {
    // Create a promise that runs the function
    const p = Promise.resolve().then(() => fn(item));
    resultPromises.push(p);

    // If we have more items than the limit, we need to manage concurrency
    if (limit <= items.length) {
      const e: Promise<void> = p.then(() => {
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(resultPromises);
}
