import { describe, it, expect } from "bun:test";
import { getReadingTime } from "./readingTime";

describe("getReadingTime", () => {
  it("should return 0 for empty string", () => {
    expect(getReadingTime("")).toBe(0);
  });

  it("should correctly count words for a simple sentence", () => {
    // 5 words -> ceil(5/200) = 1
    expect(getReadingTime("This is a simple test.")).toBe(1);
  });

  it("should handle multiple spaces and newlines", () => {
    // 3 words: Hello, World, Test
    const text = "Hello   \n\n World \t Test";
    expect(getReadingTime(text)).toBe(1);
  });

  it("should calculate minutes correctly for longer text", () => {
    // Generate 201 words
    const text = Array(201).fill("word").join(" ");
    // 201 / 200 = 1.005 -> ceil = 2
    expect(getReadingTime(text)).toBe(2);
  });

  it("should handle custom wpm", () => {
    const text = "One two three four";
    // 4 / 2 = 2
    expect(getReadingTime(text, 2)).toBe(2);
  });
});
