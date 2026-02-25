import sharp from "sharp";
import { glob } from "glob";
import fs from "fs/promises";
import path from "path";
import os from "os";

// ⚡ Optimize Sharp for memory-constrained environments
sharp.cache(false);
sharp.concurrency(1);

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
};

// Map to track created directories to avoid redundant fs.mkdir calls
const createdDirs = new Set();

async function processFile(file) {
  // Calcul des chemins pour respecter la structure des dossiers
  const relativePath = path.relative(CONFIG.inputDir, file);
  const relativeDir = path.dirname(relativePath);
  const targetDir = path.join(CONFIG.outputDir, relativeDir);

  const filename = path.basename(file, path.extname(file));
  const outputPath = path.join(targetDir, `${filename}.avif`);

  // Crée le dossier de destination s'il n'existe pas
  if (!createdDirs.has(targetDir)) {
    try {
      await fs.mkdir(targetDir, { recursive: true });
      createdDirs.add(targetDir);
    } catch  {
      // Ignore errors if directory already exists (race condition)
    }
  }

  // --- SYSTÈME DE CACHE INTELLIGENT ---
  try {
    const statsOriginal = await fs.stat(file);
    const statsOutput = await fs.stat(outputPath);

    // Si l'image optimisée existe et est plus récente que l'original, on passe
    if (statsOutput.mtime > statsOriginal.mtime) {
      return;
    }
  } catch {
    // Le fichier n'existe pas, on continue
  }

  console.log(`⚙️  Traitement: ${relativePath}`);
  const start = Date.now();

  try {
    // Pipeline Sharp optimisé
    const image = sharp(file, { failOn: 'none' }).rotate();

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
          effort: 9,
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
          effort: 9,
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

async function processImages() {
  console.log(`🔥 OPTIMISATION IMAGES : START`);
  console.log(`🎯 Cible: ${CONFIG.maxWidth}px max @ Q${CONFIG.quality} (AVIF)`);

  try {
    if (!await fs.stat(CONFIG.inputDir).catch(() => false)) {
      console.log(`⚠️  Dossier "${CONFIG.inputDir}" introuvable. Skip.`);
      return;
    }

    const files = await glob(`${CONFIG.inputDir}/**/*.{jpg,jpeg,png,tiff,webp}`);

    if (files.length === 0) {
      console.log('⚠️  Aucune image trouvée dans le dossier "originals".');
      return;
    }

    console.log(`🚀 Traitement de ${files.length} images...`);

    // Parallel processing with conservative concurrency
    // Use 2 by default, or 1 if memory is very tight, or override via ENV
    const defaultConcurrency = os.cpus().length > 1 ? 2 : 1;
    const concurrency = parseInt(process.env.CONCURRENCY) || defaultConcurrency;
    console.log(`🧵 Concurrence: ${concurrency} workers (Sharp threads: 1)`);

    const queue = [...files];
    const workers = Array.from({ length: concurrency }, async () => {
      while (queue.length > 0) {
        const file = queue.shift();
        if (file) {
          await processFile(file);
        }
      }
    });

    await Promise.all(workers);
    console.log("🏁 Terminé ! Vos assets sont prêts.");
  } catch (error) {
    console.error("❌ Erreur globale lors de l'optimisation des images:", error);
    process.exit(1);
  }
}

processImages();
