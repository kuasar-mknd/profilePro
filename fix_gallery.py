import re

with open('src/components/ui/ImageGallery.astro', 'r') as f:
    content = f.read()

# Pattern to match the broken block
pattern = r'const CONCURRENCY_LIMIT = 5;.*?optimizedImages\.push\(\.\.\.optimizedChunk\);\n}'
# Wait, it's not even that far.

# Let's just use a broader match and replace it with the correct one.
start_marker = "// ⚡ Bolt: Pre-generate optimized full-size images for Lightbox"
end_marker = "// Column class mapping"

new_block = """// ⚡ Bolt: Pre-generate optimized full-size images for Lightbox with bounded concurrency
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
}

"""

parts = content.split(start_marker)
if len(parts) > 1:
    after_start = parts[1]
    sub_parts = after_start.split(end_marker)
    if len(sub_parts) > 1:
        new_content = parts[0] + start_marker + "\n" + new_block + end_marker + sub_parts[1]
        with open('src/components/ui/ImageGallery.astro', 'w') as f:
            f.write(new_content)
        print("Success")
    else:
        print("End marker not found")
else:
    print("Start marker not found")
