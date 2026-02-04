/**
 * ⚡ Bolt: Highly optimized reading time calculator
 * Uses a single pass iteration to count words without allocating intermediate arrays (like split()).
 * This reduces memory pressure during SSG builds with large collections.
 *
 * @param text The text to analyze
 * @param wordsPerMinute Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
export function getReadingTime(text: string, wordsPerMinute = 200): number {
  if (!text) return 0;

  let wordCount = 0;
  let inWord = false;
  const length = text.length;

  for (let i = 0; i < length; i++) {
    const charCode = text.charCodeAt(i);
    // Check for common whitespace: space (32), newline (10), carriage return (13), tab (9)
    // We intentionally skip checking for all unicode whitespace for performance,
    // as Markdown bodies are predominantly standard ASCII/UTF-8 with standard whitespace.
    const isWhitespace =
      charCode === 32 || charCode === 10 || charCode === 13 || charCode === 9;

    if (isWhitespace) {
      if (inWord) {
        inWord = false;
      }
    } else {
      if (!inWord) {
        inWord = true;
        wordCount++;
      }
    }
  }

  return Math.ceil(wordCount / wordsPerMinute);
}
