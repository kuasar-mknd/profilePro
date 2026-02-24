/**
 * Processes an array of items with a limit on the number of concurrent executions.
 * Useful for CPU or I/O intensive tasks like image processing.
 *
 * @param items The items to process
 * @param concurrency Maximum number of concurrent executions
 * @param fn The function to execute for each item
 * @returns A promise that resolves to an array of results
 */
export async function limitConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      results[index] = await fn(items[index]);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker()
  );

  await Promise.all(workers);
  return results;
}
