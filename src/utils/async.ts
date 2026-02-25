/**
 * Limits the number of concurrent asynchronous operations.
 *
 * @param items Array of items to process
 * @param fn Asynchronous function to apply to each item
 * @param limit Maximum number of concurrent operations
 * @returns Array of results
 */
export async function limitConcurrency<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit: number = 3,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  const queue = items.map((item, index) => ({ item, index }));
  let current = 0;

  async function worker() {
    while (current < queue.length) {
      const { item, index } = queue[current++];
      results[index] = await fn(item);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);

  return results;
}
