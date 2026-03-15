import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";

const mockGetCollection = mock(async (_collection: string) => {
  return [
    {
      id: "project-1",
      collection: "project",
      data: {
        title: "Project 1",
        pubDate: new Date("2023-01-01"),
      },
    },
    {
      id: "project-2",
      collection: "project",
      data: {
        title: "Project 2",
        pubDate: new Date("2023-03-01"),
      },
    },
    {
      id: "project-3",
      collection: "project",
      data: {
        title: "Project 3",
        pubDate: new Date("2023-02-01"),
      },
    },
  ];
});

mock.module("astro:content", () => {
  return {
    getCollection: mockGetCollection,
  };
});

describe("getSortedProjects", () => {
  let originalEnvDev: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let getSortedProjects: any;

  beforeEach(async () => {
    mockGetCollection.mockClear();
    originalEnvDev = import.meta.env.DEV;

    // Dynamically import to ensure mock is applied
    const module = await import("../../src/utils/projects");
    getSortedProjects = module.getSortedProjects;
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta.env as any).DEV = originalEnvDev;
  });

  it("should fetch and sort projects by pubDate descending", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta.env as any).DEV = true; // bypass cache for clean test

    const projects = await getSortedProjects();

    expect(mockGetCollection).toHaveBeenCalledWith("project");
    expect(projects.length).toBe(3);

    // Check sorting
    expect(projects[0].id).toBe("project-2"); // March 1st
    expect(projects[1].id).toBe("project-3"); // Feb 1st
    expect(projects[2].id).toBe("project-1"); // Jan 1st
  });

  it("should bypass cache in DEV mode", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta.env as any).DEV = true;

    await getSortedProjects();
    await getSortedProjects();

    // Should have been called twice because cache is bypassed
    expect(mockGetCollection).toHaveBeenCalledTimes(2);
  });

  it("should use cache in PROD mode", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta.env as any).DEV = false;

    await getSortedProjects();
    await getSortedProjects();

    // Only 1 call if PROD mode caches the promise successfully
    expect(mockGetCollection).toHaveBeenCalledTimes(1);
  });
});
