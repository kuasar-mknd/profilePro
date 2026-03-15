/**
 * Calculates reading time in minutes for a given text.
 * Uses a non-allocating O(n) loop to count words, which is more memory efficient
 * than string.split(/\s+/).
 *
 * @param text The text content to analyze
 * @param wordsPerMinute Average reading speed (default: 200)
 * @returns Reading time in minutes (rounded up)
 */
// ⚡ Bolt: Cache calculated word counts
// Post bodies can be large, and getReadingTime might be called multiple times
// for the same post (e.g., in Post.astro, [slug].astro, etc.).
// Using an LRU cache or a simple Map prevents redundant O(n) string parsing.
const wordCountCache = new Map<string, number>();

export function getReadingTime(text: string, wordsPerMinute = 200): number {
  if (!text) return 0;

  // By caching the word count mapped exactly to the text reference,
  // we avoid expensive string concatenations and large allocations
  // that would occur if we used composite keys like `${wpm}:${text}`.
  const cachedWords = wordCountCache.get(text);
  if (cachedWords !== undefined) return Math.ceil(cachedWords / wordsPerMinute);

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

  // Prevent unbounded memory growth in long-running processes (like dev server)
  if (wordCountCache.size > 1000) {
    const firstKey = wordCountCache.keys().next().value;
    if (firstKey) wordCountCache.delete(firstKey);
  }

  wordCountCache.set(text, wordCount);

  return Math.ceil(wordCount / wordsPerMinute);
}
