/**
 * ⚡ Bolt: Efficiently counts words in a string without allocating an array.
 * Replaces expensive str.split(/\s+/).length operation.
 *
 * This implementation iterates through the string once (O(n)) and uses constant space (O(1)).
 * It counts transitions from whitespace to non-whitespace characters.
 *
 * @param text The text to count words from
 * @returns The estimated reading time in minutes (based on 200 words/min)
 */
export function getReadingTime(text: string | undefined): number {
  if (!text) return 0;

  let count = 0;
  let inWord = false;
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const code = text.charCodeAt(i);
    // Check for standard whitespace: space, tab, newline, carriage return, form feed
    // This covers standard Markdown whitespace.
    const isSpace =
      code === 32 || // space
      code === 9 || // tab
      code === 10 || // \n
      code === 13 || // \r
      code === 12; // \f

    if (isSpace) {
      inWord = false;
    } else if (!inWord) {
      inWord = true;
      count++;
    }
  }

  return Math.ceil(count / 200);
}
