import sys

with open('src/components/ui/ImageGallery.astro', 'r') as f:
    content = f.read()

old_code = """// ⚡ Bolt: Pre-generate optimized full-size images for Lightbox
// Serves 1600px WebP (Q80) instead of massive original uploads (often 5MB+) or tiny thumbnails
const optimizedImages = await Promise.all(
  galleryImages.map(async (img) => {
    const optimized = await getImage({
      src: img.src,
      width: 1600,
      format: "webp",
      quality: 80,
    });
    return {
      ...img,
      lightboxSrc: optimized.src,
    };
  }),
);"""

new_code = """// ⚡ Bolt: Pre-generate optimized full-size images for Lightbox with bounded concurrency
// Serves 1600px WebP (Q80) instead of massive original uploads (often 5MB+) or tiny thumbnails
const CONCURRENCY_LIMIT = 5;
const optimizedImages = [];

for (let i = 0; i < galleryImages.length; i += CONCURRENCY_LIMIT) {
  const chunk = galleryImages.slice(i, i + CONCURRENCY_LIMIT);
  const optimizedChunk = await Promise.all(
    chunk.map(async (img) => {
      const optimized = await getImage({
        src: img.src,
        width: 1600,
        format: "webp",
        quality: 80,
      });
      return {
        ...img,
        lightboxSrc: optimized.src,
      };
    }),
  );
  optimizedImages.push(...optimizedChunk);
}"""

if old_code in content:
    new_content = content.replace(old_code, new_code)
    with open('src/components/ui/ImageGallery.astro', 'w') as f:
        f.write(new_content)
    print("Success")
else:
    print("Old code not found exactly. Checking for variations...")
    # Try to find it without exact whitespace match if needed
    import re
    pattern = re.escape(old_code).replace(r'\ ', r'\s+')
    if re.search(pattern, content):
        new_content = re.sub(pattern, new_code, content)
        with open('src/components/ui/ImageGallery.astro', 'w') as f:
            f.write(new_content)
        print("Success (with regex)")
    else:
        print("Failed to find the code block.")
        sys.exit(1)
