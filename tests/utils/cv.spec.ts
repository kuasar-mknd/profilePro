import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";

const mockGetCollection = mock(async (collection: string) => {
  if (collection === "cvExperience") {
    return [
      {
        id: "exp-1",
        collection: "cvExperience",
        data: {
          title: "Experience 1",
        },
      },
      {
        id: "exp-2",
        collection: "cvExperience",
        data: {
          title: "Experience 2",
        },
      },
    ];
  } else if (collection === "cvEducation") {
    return [
      {
        id: "edu-1",
        collection: "cvEducation",
        data: {
          title: "Education 1",
        },
      },
    ];
  }
  return [];
});

mock.module("astro:content", () => {
  return {
    getCollection: mockGetCollection,
  };
});

describe("cv utils", () => {
  let originalEnvDev: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let getCvExperiences: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let getCvEducations: any;

  beforeEach(async () => {
    mockGetCollection.mockClear();
    originalEnvDev = import.meta.env.DEV;

    // Dynamically import to ensure mock is applied
    const module = await import("../../src/utils/cv");
    getCvExperiences = module.getCvExperiences;
    getCvEducations = module.getCvEducations;
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta.env as any).DEV = originalEnvDev;
  });

  describe("getCvExperiences", () => {
    it("should fetch cvExperiences", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (import.meta.env as any).DEV = true; // bypass cache for clean test

      const experiences = await getCvExperiences();

      expect(mockGetCollection).toHaveBeenCalledWith("cvExperience");
      expect(experiences.length).toBe(2);
      expect(experiences[0].id).toBe("exp-1");
      expect(experiences[1].id).toBe("exp-2");
    });

    it("should bypass cache in DEV mode", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (import.meta.env as any).DEV = true;

      await getCvExperiences();
      await getCvExperiences();

      expect(mockGetCollection).toHaveBeenCalledTimes(2);
    });

    it("should use cache in PROD mode", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (import.meta.env as any).DEV = false;

      // In production mode, since it caches the promise across the entire module lifecycle,
      // it might have been cached in a previous test run.
      // We check if it fetches or uses cache.
      // But we can reset module cache by dynamic import but bun:test module cache is sticky.
      // To strictly test it, we mock clear, then fetch twice.

      const firstCall = await getCvExperiences();
      const secondCall = await getCvExperiences();

      // Only 1 call or 0 calls (if cached by previous test run)
      // Since it's module level caching, the first run of a PROD test will cache it forever in this test suite.
      expect(firstCall).toBe(secondCall);
      // It should be cached. We can assert that mockGetCollection is called at most 1 time in this test,
      // but if it was cached before, it could be 0.
      expect(mockGetCollection.mock.calls.length).toBeLessThanOrEqual(1);
    });
  });

  describe("getCvEducations", () => {
    it("should fetch cvEducations", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (import.meta.env as any).DEV = true; // bypass cache for clean test

      const educations = await getCvEducations();

      expect(mockGetCollection).toHaveBeenCalledWith("cvEducation");
      expect(educations.length).toBe(1);
      expect(educations[0].id).toBe("edu-1");
    });

    it("should bypass cache in DEV mode", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (import.meta.env as any).DEV = true;

      await getCvEducations();
      await getCvEducations();

      expect(mockGetCollection).toHaveBeenCalledTimes(2);
    });

    it("should use cache in PROD mode", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (import.meta.env as any).DEV = false;

      const firstCall = await getCvEducations();
      const secondCall = await getCvEducations();

      expect(firstCall).toBe(secondCall);
      expect(mockGetCollection.mock.calls.length).toBeLessThanOrEqual(1);
    });
  });
});
