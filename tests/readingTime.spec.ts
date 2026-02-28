import { describe, expect, test } from "bun:test";
import { getReadingTime } from "../src/utils/readingTime";

describe("getReadingTime", () => {
  test("returns 0 for empty text", () => {
    expect(getReadingTime("")).toBe(0);
  });

  test("calculates time for short text", () => {
    // 200 words per minute
    const text = "word ".repeat(100);
    expect(getReadingTime(text)).toBe(1);
  });

  test("calculates time for longer text", () => {
    const text = "word ".repeat(400);
    expect(getReadingTime(text)).toBe(2);
  });

  test("handles mixed whitespace", () => {
    const text = "word\n\tword  word";
    expect(getReadingTime(text)).toBe(1);
  });
});
