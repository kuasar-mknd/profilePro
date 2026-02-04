import { describe, it, expect } from "bun:test";
import { getReadingTime } from "./readingTime";

describe("getReadingTime", () => {
  it("returns 0 for empty or undefined text", () => {
    expect(getReadingTime(undefined)).toBe(0);
    expect(getReadingTime("")).toBe(0);
  });

  it("calculates reading time correctly for small text", () => {
    expect(getReadingTime("Hello world")).toBe(1);
  });

  it("calculates reading time correctly for exact boundary (200 words)", () => {
    const text = new Array(200).fill("word").join(" ");
    expect(getReadingTime(text)).toBe(1);
  });

  it("calculates reading time correctly for 201 words", () => {
    const text = new Array(201).fill("word").join(" ");
    expect(getReadingTime(text)).toBe(2);
  });

  it("handles multiple spaces and newlines correctly", () => {
    const text = "word1   word2\nword3\tword4";
    // 4 words -> 1 min
    expect(getReadingTime(text)).toBe(1);
  });

  it("ignores leading/trailing whitespace", () => {
    const text = "  word1 word2  ";
    // 2 words -> 1 min
    expect(getReadingTime(text)).toBe(1);
  });
});
