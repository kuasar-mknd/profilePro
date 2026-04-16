import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test";
import {
  limitConcurrency,
  fetchVimeoPosterWithCache,
} from "../src/utils/async";

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
    expect(
      limitConcurrency(items, 2, async (item) => {
        if (item === 2) throw new Error(errorMsg);
        return item;
      }),
    ).rejects.toThrow(errorMsg);
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

describe("fetchVimeoPosterWithCache", () => {
  let fetchSpy: import("bun:test").Mock<typeof global.fetch>;
  let setTimeoutSpy: import("bun:test").Mock<typeof global.setTimeout>;
  let clearTimeoutSpy: import("bun:test").Mock<typeof global.clearTimeout>;

  beforeEach(() => {
    fetchSpy = spyOn(global, "fetch");
    setTimeoutSpy = spyOn(global, "setTimeout");
    clearTimeoutSpy = spyOn(global, "clearTimeout");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    setTimeoutSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });

  it("should fetch and cache vimeo poster", async () => {
    const mockResponseData = {
      thumbnail_url: "https://example.com/poster.jpg",
    };
    fetchSpy.mockResolvedValue({
      json: async () => mockResponseData,
    } as any);

    const url = "https://vimeo.com/1234567";

    // First call should fetch
    const result1 = await fetchVimeoPosterWithCache(url);
    expect(result1).toBe("https://example.com/poster.jpg");
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Second call should return cached result without fetching
    const result2 = await fetchVimeoPosterWithCache(url);
    expect(result2).toBe("https://example.com/poster.jpg");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle fetch errors and not cache failures", async () => {
    fetchSpy.mockRejectedValue(new Error("Network error"));

    const url = "https://vimeo.com/error-case-2";

    // Expect error to be thrown
    await expect(fetchVimeoPosterWithCache(url)).rejects.toThrow(
      "Network error",
    );

    // Try again. It should return null since the failure cached null
    const result = await fetchVimeoPosterWithCache(url);
    expect(result).toBeNull();
  });

  it("should clear timeout on success", async () => {
    fetchSpy.mockResolvedValue({
      json: async () => ({ thumbnail_url: "https://example.com/poster2.jpg" }),
    } as any);

    const url = "https://vimeo.com/timeout-case-2";
    await fetchVimeoPosterWithCache(url);

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
