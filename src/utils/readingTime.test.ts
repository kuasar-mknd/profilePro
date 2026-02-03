import { describe, it, expect } from "bun:test";
import { calculateReadingTime } from "./readingTime";

describe("calculateReadingTime", () => {
  it("should return 0 for empty string", () => {
    expect(calculateReadingTime("")).toBe(0);
  });

  it("should return 0 for null or undefined", () => {
    expect(calculateReadingTime(null)).toBe(0);
    expect(calculateReadingTime(undefined)).toBe(0);
  });

  it("should calculate reading time correctly for simple sentence", () => {
    // 10 words. 10/200 = 0.05. Ceil = 1.
    const text = "This is a simple sentence with ten words in it.";
    expect(calculateReadingTime(text)).toBe(1);
  });

  it("should calculate reading time correctly for longer text", () => {
    // 201 words -> 2 mins.
    const word = "word ";
    const text = word.repeat(201);
    expect(calculateReadingTime(text)).toBe(2);
  });

  it("should calculate reading time correctly for exactly 200 words", () => {
    const word = "word ";
    const text = word.repeat(200);
    expect(calculateReadingTime(text)).toBe(1);
  });

  it("should handle multiple spaces and newlines", () => {
    const text = "Word1   Word2\nWord3\tWord4";
    // 4 words.
    expect(calculateReadingTime(text)).toBe(1);
  });

  it("should handle leading and trailing whitespace", () => {
    const text = "  Word1 Word2  ";
    // 2 words.
    expect(calculateReadingTime(text)).toBe(1);
  });

  it("should handle non-breaking space", () => {
    const text = "Word1\u00A0Word2";
    // 2 words.
    expect(calculateReadingTime(text)).toBe(1);
  });
});
