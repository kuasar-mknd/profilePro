/**
 * Calculates reading time in minutes for a given text.
 * Uses a non-allocating O(n) loop to count words, which is more memory efficient
 * than string.split(/\s+/).
 *
 * @param text The text content to analyze
 * @param wordsPerMinute Average reading speed (default: 200)
 * @returns Reading time in minutes (rounded up)
 */
// ⚡ Bolt: Cache calculated reading times
// Post bodies can be large, and getReadingTime might be called multiple times
// for the same post (e.g., in Post.astro, [slug].astro, etc.).
// Using an LRU cache or a simple Map prevents redundant O(n) string parsing.
const readingTimeCache = new Map<string, number>();

export function getReadingTime(text: string, wordsPerMinute = 200): number {
  if (!text) return 0;

  // Create a composite cache key if wordsPerMinute varies,
  // though it's typically constant. We can just use text length as a fast initial
  // check, but exact text matching is safer.
  // We'll hash or use length prefix for safer large string keys if needed,
  // but a simple Map with the text reference works well for SSG.
  const cacheKey = `${wordsPerMinute}:${text}`;

  const cached = readingTimeCache.get(cacheKey);
  if (cached !== undefined) return cached;

  let wordCount = 0;
  let inWord = false;
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const charCode = text.charCodeAt(i);
    const isSpace =
      charCode === 32 ||
      charCode === 10 ||
      charCode === 13 ||
      charCode === 9 ||
      charCode === 11 ||
      charCode === 12;

    if (isSpace) {
      inWord = false;
    } else if (!inWord) {
      inWord = true;
      wordCount++;
    }
  }

  const time = Math.ceil(wordCount / wordsPerMinute);

  // Prevent unbounded memory growth in long-running processes (like dev server)
  if (readingTimeCache.size > 1000) {
    const firstKey = readingTimeCache.keys().next().value;
    if (firstKey) readingTimeCache.delete(firstKey);
  }

  readingTimeCache.set(cacheKey, time);

  return time;
}
