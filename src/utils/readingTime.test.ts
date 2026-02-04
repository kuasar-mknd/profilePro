import { expect, test, describe } from "bun:test";
import { getReadingTime } from "./readingTime";

describe("getReadingTime", () => {
  test("returns 0 for empty string", () => {
    expect(getReadingTime("")).toBe(0);
  });

  test("calculates reading time correctly for short text", () => {
    // 200 words = 1 minute
    const words = Array(200).fill("word").join(" ");
    expect(getReadingTime(words)).toBe(1);
  });

  test("calculates reading time correctly for long text", () => {
    // 400 words = 2 minutes
    const words = Array(401).fill("word").join(" ");
    expect(getReadingTime(words)).toBe(3); // Ceil(401/200) = 3
  });

  test("handles mixed whitespace", () => {
    const text = "one\ntwo\tthree\rfour  five";
    // 5 words. 5/200 = 0.025 -> ceil -> 1
    expect(getReadingTime(text)).toBe(1);
  });
});
