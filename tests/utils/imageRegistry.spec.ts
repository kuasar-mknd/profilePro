import { expect, test, describe, beforeEach, beforeAll } from "bun:test";
import { plugin } from "bun";
import { readFileSync } from "fs";

plugin({
  name: "mock-import-meta-glob",
  setup(builder) {
    builder.onLoad({ filter: /imageRegistry\.ts$/ }, (args) => {
      let text = readFileSync(args.path, "utf8");
      // Strip import.meta.glob
      text = text.replace(
        /import\.meta\.glob<{ default: ImageMetadata }>\([^)]+\)/,
        "({} as any)",
      );
      // Remove type imports from astro to avoid parsing issues if bun has them
      text = text.replace(
        /import type \{ ImageMetadata \} from "astro";/,
        "type ImageMetadata = any;",
      );
      return {
        contents: text,
        loader: "tsx", // changed from ts to tsx, sometimes bun handles it better
      };
    });
  },
});

describe("getImagesForFolder", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let getImagesForFolder: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let imagesByFolder: any;

  beforeAll(async () => {
    // Dynamic import to allow the plugin to process the file
    const mod = await import("../../src/utils/imageRegistry");
    getImagesForFolder = mod.getImagesForFolder;
    imagesByFolder = mod.imagesByFolder;
  });

  beforeEach(() => {
    if (imagesByFolder) imagesByFolder.clear();
  });

  test("returns empty array for non-existent folder", () => {
    expect(getImagesForFolder("non-existent")).toEqual([]);
  });

  test("returns all images for a folder when no exclude patterns provided", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockLoader = async () => ({ default: {} as any });
    imagesByFolder.set("my-folder", [
      ["../assets/my-folder/image1.jpg", mockLoader],
      ["../assets/my-folder/image2.png", mockLoader],
    ]);

    const result = getImagesForFolder("my-folder");
    expect(result.length).toBe(2);
    expect(result[0][0]).toBe("../assets/my-folder/image1.jpg");
    expect(result[1][0]).toBe("../assets/my-folder/image2.png");
  });

  test("filters out images matching single exclude pattern", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockLoader = async () => ({ default: {} as any });
    imagesByFolder.set("my-folder", [
      ["../assets/my-folder/image1.jpg", mockLoader],
      ["../assets/my-folder/thumbnail.jpg", mockLoader],
      ["../assets/my-folder/image2.png", mockLoader],
    ]);

    const result = getImagesForFolder("my-folder", ["thumbnail"]);
    expect(result.length).toBe(2);
    expect(result[0][0]).toBe("../assets/my-folder/image1.jpg");
    expect(result[1][0]).toBe("../assets/my-folder/image2.png");
  });

  test("filters out images matching multiple exclude patterns", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockLoader = async () => ({ default: {} as any });
    imagesByFolder.set("my-folder", [
      ["../assets/my-folder/image1.jpg", mockLoader],
      ["../assets/my-folder/thumbnail.jpg", mockLoader],
      ["../assets/my-folder/hero-mobile.png", mockLoader],
      ["../assets/my-folder/image2.png", mockLoader],
    ]);

    const result = getImagesForFolder("my-folder", ["thumbnail", "mobile"]);
    expect(result.length).toBe(2);
    expect(result[0][0]).toBe("../assets/my-folder/image1.jpg");
    expect(result[1][0]).toBe("../assets/my-folder/image2.png");
  });

  test("returns empty array if all images are excluded", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockLoader = async () => ({ default: {} as any });
    imagesByFolder.set("my-folder", [
      ["../assets/my-folder/thumbnail1.jpg", mockLoader],
      ["../assets/my-folder/thumbnail2.jpg", mockLoader],
    ]);

    const result = getImagesForFolder("my-folder", ["thumbnail"]);
    expect(result.length).toBe(0);
  });
});
