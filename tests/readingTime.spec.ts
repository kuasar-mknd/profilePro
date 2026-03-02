import { expect, test, describe, beforeEach } from "bun:test";
import { getReadingTime } from "../src/utils/readingTime";

describe("getReadingTime", () => {
  test("returns 0 for empty text", () => {
    expect(getReadingTime("")).toBe(0);
    expect(getReadingTime(null as any)).toBe(0);
    expect(getReadingTime(undefined as any)).toBe(0);
  });

  test("calculates time for short text", () => {
    const text = "This is a short text.";
    expect(getReadingTime(text)).toBe(1);
  });

  test("calculates time for longer text", () => {
    // 200 words
    const word = "word ";
    const text = word.repeat(200);
    expect(getReadingTime(text)).toBe(1);

    // 201 words -> 2 minutes
    expect(getReadingTime(text + "extra")).toBe(2);
  });

  test("handles mixed whitespace", () => {
    const text = "word1\nword2\tword3  word4\rword5";
    expect(getReadingTime(text)).toBe(1); // 5 words < 200
  });

  test("memoization works without breaking", () => {
    const text = "one two three";
    expect(getReadingTime(text)).toBe(1);
    expect(getReadingTime(text)).toBe(1);
    // Use a custom WPM to hit different cache key
    expect(getReadingTime(text, 1)).toBe(3);
  });
});
