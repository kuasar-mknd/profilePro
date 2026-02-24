import sharp from "sharp";
import { glob } from "glob";
import fs from "fs/promises";
import path from "path";
import pLimit from "p-limit";

// --- CONFIGURATION SWEET SPOT ---
const CONFIG = {
  inputDir: "originals", // Source (non versionnée)
  outputDir: "src/assets", // Destination (versionnée)
  maxWidth: 1600,
  quality: 68,
  effort: 4, // ⚡ Reduit de 9 à 4 pour accélérer le build sur Render
  concurrency: 2, // 🛡️ Limite la concurrence pour éviter les OOM sur Render Free Tier
};

// Set sharp concurrency and cache limits
sharp.concurrency(1);
sharp.cache(false);

async function processImages() {
  console.log(`🔥 OPTIMISATION IMAGES : START`);
  console.log(`🎯 Cible: ${CONFIG.maxWidth}px max @ Q${CONFIG.quality} (AVIF, effort ${CONFIG.effort})`);

  const files = await glob(`${CONFIG.inputDir}/**/*.{jpg,jpeg,png,tiff,webp}`);

  if (files.length === 0) {
    console.log('⚠️  Aucune image trouvée dans le dossier "originals".');
    return;
  }

  console.log(`🚀 Traitement de ${files.length} images (concurrency: ${CONFIG.concurrency})...`);

  const limit = pLimit(CONFIG.concurrency);

  const tasks = files.map((file) => limit(async () => {
    const relativePath = path.relative(CONFIG.inputDir, file);
    const relativeDir = path.dirname(relativePath);
    const targetDir = path.join(CONFIG.outputDir, relativeDir);

    const filename = path.basename(file, path.extname(file));
    const outputPath = path.join(targetDir, `${filename}.avif`);

    await fs.mkdir(targetDir, { recursive: true });

    try {
      const statsOriginal = await fs.stat(file);
      const statsOutput = await fs.stat(outputPath);
      if (statsOutput.mtime > statsOriginal.mtime) {
        return;
      }
    } catch {
      // Continue
    }

    console.log(`⚙️  Traitement: ${relativePath}`);
    const start = Date.now();

    try {
      const image = sharp(file).rotate();

      if (filename.startsWith("slide-")) {
        await image
          .resize({
            width: 1080,
            height: 1920,
            fit: "cover",
            position: "center",
            withoutEnlargement: false,
            kernel: "lanczos3",
          })
          .avif({
            quality: CONFIG.quality,
            effort: CONFIG.effort,
            chromaSubsampling: "4:4:4",
          })
          .toFile(outputPath);
      } else {
        await image
          .resize({
            width: CONFIG.maxWidth,
            height: CONFIG.maxWidth,
            fit: "inside",
            withoutEnlargement: true,
            kernel: "lanczos3",
          })
          .avif({
            quality: CONFIG.quality,
            effort: CONFIG.effort,
            chromaSubsampling: "4:4:4",
          })
          .toFile(outputPath);
      }

      const end = Date.now();
      console.log(`   ✅ Ok (${((end - start) / 1000).toFixed(1)}s)`);
    } catch (error) {
      console.error(`❌ Erreur sur ${relativePath}:`, error);
    }
  }));

  await Promise.all(tasks);
  console.log("🏁 Terminé ! Vos assets sont prêts.");
}

processImages();
