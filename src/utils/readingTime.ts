/**
 * ⚡ Bolt: Efficient Reading Time Calculation
 *
 * Optimized to avoid creating substrings (O(N) memory allocation) which happens with
 * String.prototype.split(/\s+/).
 *
 * This function iterates through the string once (O(N) time) and counts word boundaries
 * using simple character checks, allocating only primitive loop variables.
 *
 * @param text - The text content to analyze
 * @param wordsPerMinute - Reading speed (default: 200 wpm)
 * @returns Estimated reading time in minutes (rounded up)
 */
export function calculateReadingTime(
  text: string | null | undefined,
  wordsPerMinute = 200,
): number {
  if (!text) return 0;

  let words = 0;
  let isSpace = true;
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const char = text.charCodeAt(i);
    // Check for whitespace: space (32), tab (9), newline (10), return (13), form feed (12), vtab (11)
    // 160 is non-breaking space
    const currentIsSpace =
      char === 32 ||
      char === 9 ||
      char === 10 ||
      char === 13 ||
      char === 12 ||
      char === 11 ||
      char === 160;

    if (isSpace && !currentIsSpace) {
      words++;
    }
    isSpace = currentIsSpace;
  }

  return Math.ceil(words / wordsPerMinute);
}
