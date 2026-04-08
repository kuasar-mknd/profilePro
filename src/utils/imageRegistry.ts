import type { ImageMetadata } from "astro";

// Pre-compile the module map at module load time to avoid re-evaluating the regex and filtering
// on every gallery component instance. This significantly reduces O(N) string matches.
export const allGalleryImages = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/**/*.{avif,png,jpg,jpeg,webp,JPEG,PNG,JPG}",
  { eager: false },
);

// Group images by folder for O(1) lookup
export const imagesByFolder = new Map<
  string,
  Array<[string, () => Promise<{ default: ImageMetadata }>]>
>();

const prefix = "../assets/";
for (const [path, loader] of Object.entries(allGalleryImages)) {
  if (path.startsWith(prefix)) {
    const relativePath = path.slice(prefix.length); // e.g., "nested/folder/image.jpg"
    const lastSlashIndex = relativePath.lastIndexOf("/");
    if (lastSlashIndex !== -1) {
      const folder = relativePath.slice(0, lastSlashIndex); // e.g., "nested/folder"

      let folderImages = imagesByFolder.get(folder);
      if (!folderImages) {
        folderImages = [];
        imagesByFolder.set(folder, folderImages);
      }
      folderImages.push([path, loader]);
    }
  }
}

export function getImagesForFolder(
  folder: string,
  excludePatterns: string[] = [],
): Array<[string, () => Promise<{ default: ImageMetadata }>]> {
  const rawImages = imagesByFolder.get(folder) || [];

  if (excludePatterns.length === 0) {
    return rawImages;
  }

  return rawImages.filter(([path]) => {
    for (const pattern of excludePatterns) {
      if (path.includes(pattern)) return false;
    }
    return true;
  });
}
