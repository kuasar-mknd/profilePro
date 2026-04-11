import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";

// Mock astro:content before importing anything else
mock.module("astro:content", () => ({
  getCollection: mock(() => Promise.resolve([])),
}));

// Mock satori
const mockSatori = mock(() => Promise.resolve("<svg>mock</svg>"));
mock.module("satori", () => ({
  default: mockSatori,
}));

// Mock @resvg/resvg-js
const mockRender = mock(() => ({
  asPng: () => Buffer.from("mock-png-data"),
}));
const mockResvg = mock(() => ({
  render: mockRender,
}));
mock.module("@resvg/resvg-js", () => ({
  Resvg: mockResvg,
}));

// Mock utils/projects
const mockProjects = [
  {
    slug: "test-project-1",
    data: {
      title: "Test Project 1",
      intro: "Test Intro",
      description: "Test Description",
      tag: "test",
      pubDate: new Date("2023-01-01"),
    },
  },
  {
    slug: "test-project-2",
    data: {
      title: "Test Project 2",
      description: "Fallback Description",
      tag: "test2",
      pubDate: new Date("2023-01-02"),
    },
  },
];
const mockGetSortedProjects = mock(() => Promise.resolve(mockProjects));
mock.module("../../../src/utils/projects", () => ({
  getSortedProjects: mockGetSortedProjects,
}));

// Import the module to test AFTER mocks
const { getStaticPaths, GET } =
  await import("../../../src/pages/og/[slug].png");

// Mock fetch for the font
const originalFetch = global.fetch;

describe("OG Image Generation", () => {
  beforeEach(() => {
    mockSatori.mockClear();
    mockResvg.mockClear();
    mockRender.mockClear();
    mockGetSortedProjects.mockClear();

    global.fetch = mock(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      } as Response),
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("getStaticPaths", () => {
    it("should return paths and props for all projects", async () => {
      const paths = await getStaticPaths();
      expect(mockGetSortedProjects).toHaveBeenCalledTimes(1);
      expect(paths).toHaveLength(2);
      expect(paths[0]).toEqual({
        params: { slug: "test-project-1" },
        props: { project: mockProjects[0] },
      });
      expect(paths[1]).toEqual({
        params: { slug: "test-project-2" },
        props: { project: mockProjects[1] },
      });
    });
  });

  describe("GET", () => {
    it("should generate a PNG response using satori and resvg", async () => {
      const props = { project: mockProjects[0] };
      // @ts-ignore
      const response = await GET({ props });

      // Verify font fetch
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-700-normal.woff",
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );

      // Verify satori call
      expect(mockSatori).toHaveBeenCalledTimes(1);
      const satoriArgs = mockSatori.mock.calls[0];
      const satoriElement = satoriArgs[0];

      // Check that satori was called with project data
      const jsonString = JSON.stringify(satoriElement);
      expect(jsonString).toContain("Test Project 1");
      expect(jsonString).toContain("Test Intro");
      expect(jsonString).toContain("test"); // Tag
      expect(jsonString).toContain("Samuel Dulex | Portfolio");

      // Verify satori options
      const satoriOptions = satoriArgs[1];
      expect(satoriOptions.width).toBe(1200);
      expect(satoriOptions.height).toBe(630);
      expect(satoriOptions.fonts).toHaveLength(1);
      expect(satoriOptions.fonts[0].name).toBe("Inter");

      // Verify resvg call
      expect(mockResvg).toHaveBeenCalledTimes(1);
      expect(mockResvg).toHaveBeenCalledWith("<svg>mock</svg>", {
        fitTo: { mode: "width", value: 1200 },
      });
      expect(mockRender).toHaveBeenCalledTimes(1);

      // Verify response
      expect(response).toBeInstanceOf(Response);
      expect(response.headers.get("Content-Type")).toBe("image/png");
      const buffer = await response.arrayBuffer();
      expect(Buffer.from(buffer).toString()).toBe("mock-png-data");
    });

    it("should use description if intro is missing", async () => {
      const props = { project: mockProjects[1] }; // Missing intro
      // @ts-ignore
      await GET({ props });

      expect(mockSatori).toHaveBeenCalledTimes(1);
      const satoriElement = mockSatori.mock.calls[0][0];

      const jsonString = JSON.stringify(satoriElement);
      expect(jsonString).toContain("Fallback Description");
    });
  });
});
