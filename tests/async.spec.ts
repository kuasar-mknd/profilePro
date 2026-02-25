import { describe, it, expect } from "bun:test";
import { limitConcurrency } from "../src/utils/async";

describe("limitConcurrency", () => {
  it("should process all items and return results in order", async () => {
    const items = [1, 2, 3, 4, 5];
    const results = await limitConcurrency(items, 2, async (item) => item * 2);
    expect(results).toEqual([2, 4, 6, 8, 10]);
  });

  it("should limit concurrency", async () => {
    let running = 0;
    let maxRunning = 0;
    const items = [1, 2, 3, 4, 5];
    const limit = 2;

    await limitConcurrency(items, limit, async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      // Simulate async work
      await new Promise((resolve) => setTimeout(resolve, 10));
      running--;
    });

    expect(maxRunning).toBeLessThanOrEqual(limit);
  });

  it("should handle errors gracefully", async () => {
    const items = [1, 2, 3];
    const errorMsg = "Test error";

    // We expect the promise to reject if any task fails
    expect(limitConcurrency(items, 2, async (item) => {
      if (item === 2) throw new Error(errorMsg);
      return item;
    })).rejects.toThrow(errorMsg);
  });

  it("should work when items length is less than limit", async () => {
    const items = [1, 2];
    const results = await limitConcurrency(items, 5, async (item) => item * 2);
    expect(results).toEqual([2, 4]);
  });

  it("should work with empty array", async () => {
    const items: number[] = [];
    const results = await limitConcurrency(items, 5, async (item) => item * 2);
    expect(results).toEqual([]);
  });
});
