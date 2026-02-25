import sharp from "sharp";
import { glob } from "glob";
import fs from "fs/promises";
import path from "path";

// --- CONFIGURATION SWEET SPOT ---
const CONFIG = {
  inputDir: "originals", // Source (non versionnée)
  outputDir: "src/assets", // Destination (versionnée)

  // 1600px : Suffisant pour couvrir le max (1280px) avec marge.
  maxWidth: 1600,

  // Qualité 68 en AVIF :
  // Visuellement "sans perte" pour l'œil humain, même pour un pro.
  quality: 68,

  // Effort 4: Good balance between compression and speed for build environments
  effort: 4,

  // Concurrency: Number of images to process in parallel
  concurrency: 2,
};

async function limitConcurrency(items, limit, fn) {
  const executing = new Set();
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(executing);
}

async function processImage(file) {
  const relativePath = path.relative(CONFIG.inputDir, file);
  const relativeDir = path.dirname(relativePath);
  const targetDir = path.join(CONFIG.outputDir, relativeDir);

  const filename = path.basename(file, path.extname(file));
  const outputPath = path.join(targetDir, `${filename}.avif`);

  // Crée le dossier de destination s'il n'existe pas
  await fs.mkdir(targetDir, { recursive: true });

  // --- SYSTÈME DE CACHE INTELLIGENT ---
  try {
    const statsOriginal = await fs.stat(file);
    const statsOutput = await fs.stat(outputPath);

    // Si l'image optimisée existe et n'est pas plus vieille que l'original, on passe
    // On utilise >= car sur les environnements de CI, les fichiers ont souvent le même timestamp
    if (statsOutput.mtime >= statsOriginal.mtime) {
      return;
    }
  } catch {
    // Le fichier n'existe pas, on continue
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
    console.log(`   ✅ Ok ${relativePath} (${((end - start) / 1000).toFixed(1)}s)`);
  } catch (error) {
    console.error(`❌ Erreur sur ${relativePath}:`, error);
  }
}

async function main() {
  console.log(`🔥 OPTIMISATION IMAGES : START`);
  console.log(`🎯 Cible: ${CONFIG.maxWidth}px max @ Q${CONFIG.quality} (AVIF, Effort ${CONFIG.effort})`);

  const files = await glob(`${CONFIG.inputDir}/**/*.{jpg,jpeg,png,tiff,webp}`);

  if (files.length === 0) {
    console.log('⚠️  Aucune image trouvée dans le dossier "originals".');
    return;
  }

  console.log(`🚀 Traitement de ${files.length} images (concurrency: ${CONFIG.concurrency})...`);

  await limitConcurrency(files, CONFIG.concurrency, processImage);

  console.log("🏁 Terminé ! Vos assets sont prêts.");
}

main();
