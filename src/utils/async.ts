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
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  // Worker function that continually grabs the next item
  const worker = async () => {
    while (currentIndex < items.length) {
      const i = currentIndex++;
      results[i] = await fn(items[i]);
    }
  };

  // ⚡ Bolt: Create at most `limit` workers
  const activeWorkers = Math.min(limit, items.length);
  const workers = Array.from({ length: activeWorkers }, () => worker());

  // Wait for all workers to finish
  await Promise.all(workers);

  return results;
}
