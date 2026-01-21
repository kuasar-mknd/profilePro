import { expect, test, describe } from "bun:test";
import { calculateReadingTime } from "./readingTime";

describe("calculateReadingTime", () => {
  test("returns 0 for empty or null input", () => {
    expect(calculateReadingTime("")).toBe(0);
    expect(calculateReadingTime(null)).toBe(0);
    expect(calculateReadingTime(undefined)).toBe(0);
  });

  test("calculates correct time for short text", () => {
    const text = "word ".repeat(100); // 100 words
    expect(calculateReadingTime(text)).toBe(1); // 100/200 = 0.5 -> 1
  });

  test("calculates correct time for exact match", () => {
    const text = "word ".repeat(200); // 200 words
    expect(calculateReadingTime(text)).toBe(1); // 200/200 = 1 -> 1
  });

  test("calculates correct time for long text", () => {
    const text = "word ".repeat(401); // 401 words
    expect(calculateReadingTime(text)).toBe(3); // 401/200 = 2.005 -> 3
  });
});
