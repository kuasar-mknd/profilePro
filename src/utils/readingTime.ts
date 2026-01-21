/**
 * Calculates the estimated reading time for a given text.
 * Assumes an average reading speed of 200 words per minute.
 *
 * @param text The text to calculate reading time for.
 * @returns The estimated reading time in minutes (rounded up).
 */
export function calculateReadingTime(text: string | undefined | null): number {
  if (!text) return 0;
  // Trim whitespace to ensure accurate word count
  const wordCount = text.trim().split(/\s+/g).length;
  return Math.ceil(wordCount / 200);
}
