/**
 * Calculates reading time in minutes for a given text.
 * Uses a non-allocating O(n) loop to count words, which is more memory efficient
 * than string.split(/\s+/).
 *
 * @param text The text content to analyze
 * @param wordsPerMinute Average reading speed (default: 200)
 * @returns Reading time in minutes (rounded up)
 */
export function getReadingTime(text: string, wordsPerMinute = 200): number {
  if (!text) return 0;

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

  return Math.ceil(wordCount / wordsPerMinute);
}
