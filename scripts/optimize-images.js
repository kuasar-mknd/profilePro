import sharp from "sharp";
import { glob } from "glob";
import fs from "fs/promises";
import path from "path";

// --- CONFIGURATION SWEET SPOT ---
const CONFIG = {
  inputDir: "originals", // Source (non versionnée)
  outputDir: "src/assets", // Destination (versionnée)

  // 2560px : Le compromis parfait.
  // Suffisant pour Retina sur laptop 15" et très propre sur écran 4K.
  // Divise le poids par ~2.5 par rapport à la 4K native.
  // 1600px : Suffisant pour couvrier le max (1280px) avec marge.
  maxWidth: 1600,

  // Qualité 68 en AVIF :
  // Visuellement "sans perte" pour l'œil humain, même pour un pro.
  quality: 68,

  // Effort 4: Significant speed boost for encoding while maintaining good compression.
  // Essential for CI/CD environments with time limits.
  effort: 4,

  // Concurrency limit for parallel processing
  concurrency: 4
};

async function processImage(file) {
  // Calcul des chemins pour respecter la structure des dossiers
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

    // Si l'image optimisée existe et est plus récente que l'original, on passe
    if (statsOutput.mtime > statsOriginal.mtime) {
      return { skipped: true, path: relativePath };
    }
  } catch {
    // Le fichier n'existe pas, on continue
  }

  console.log(`⚙️  Traitement: ${relativePath}`);
  const start = Date.now();

  try {
    // Pipeline Sharp optimisé
    const image = sharp(file).rotate(); // Applique la rotation EXIF

    // Special handling for slides to enforce 9:16 aspect ratio
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
    return { skipped: false, path: relativePath, duration: (end - start) / 1000 };
  } catch (error) {
    console.error(`❌ Erreur sur ${relativePath}:`, error);
    return { error: true, path: relativePath };
  }
}

async function processImages() {
  console.log(`🔥 OPTIMISATION IMAGES : START`);
  console.log(`🎯 Cible: ${CONFIG.maxWidth}px max @ Q${CONFIG.quality} (AVIF, Effort ${CONFIG.effort})`);
  console.log(`⚡ Parallélisation: ${CONFIG.concurrency} images simultanées`);

  // Récupère toutes les images
  const files = await glob(`${CONFIG.inputDir}/**/*.{jpg,jpeg,png,tiff,webp}`);

  if (files.length === 0) {
    console.log('⚠️  Aucune image trouvée dans le dossier "originals".');
    return;
  }

  console.log(`🚀 Traitement de ${files.length} images...`);

  // Basic semaphore-like queue
  const queue = [...files];
  const total = files.length;
  let processed = 0;

  async function worker() {
    while (queue.length > 0) {
      const file = queue.shift();
      const result = await processImage(file);
      processed++;
      if (!result.skipped && !result.error) {
        console.log(`   ✅ ${result.path} (${result.duration.toFixed(1)}s) [${processed}/${total}]`);
      }
    }
  }

  const workers = Array.from({ length: Math.min(CONFIG.concurrency, files.length) }, worker);
  await Promise.all(workers);

  console.log("🏁 Terminé ! Vos assets sont prêts.");
}

processImages();
