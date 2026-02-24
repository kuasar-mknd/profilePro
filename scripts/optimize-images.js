import sharp from "sharp";
import { glob } from "glob";
import fs from "fs/promises";
import path from "path";
import pLimit from "p-limit";
import os from "os";

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
      // Décommenter pour voir les fichiers ignorés
      // console.log(`⏭️  Ignoré (à jour): ${relativePath}`);
      return;
    }
  } catch {
    // Le fichier n'existe pas, on continue
  }

  console.log(`⚙️  Traitement: ${relativePath}`);
  const start = Date.now();

  try {
    // Pipeline Sharp optimisé
    const image = sharp(file).rotate(); // Applique la rotation EXIF (important pour les portraits !)

    // Special handling for slides to enforce 9:16 aspect ratio
    if (filename.startsWith("slide-")) {
      await image
        .resize({
          width: 1080,
          height: 1920,
          fit: "cover",
          position: "center",
          withoutEnlargement: false, // Allow enlargement to fill the crop if needed
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
          height: CONFIG.maxWidth, // On contraint les deux dimensions
          fit: "inside", // L'image doit "tenir dedans" sans être coupée ni déformée
          withoutEnlargement: true, // Ne pas agrandir une petite image
          kernel: "lanczos3", // Meilleur algo de rééchantillonnage (netteté)
        })
        .avif({
          quality: CONFIG.quality,
          effort: 9, // Compression CPU intensive (mais fichier + petit)
          chromaSubsampling: "4:4:4", // Garde 100% des informations de couleur
        })
        .toFile(outputPath);
    }

    const end = Date.now();
    console.log(`   ✅ Ok (${((end - start) / 1000).toFixed(1)}s) : ${relativePath}`);
  } catch (error) {
    console.error(`❌ Erreur sur ${relativePath}:`, error);
  }
}

async function processImages() {
  console.log(`🔥 OPTIMISATION IMAGES : START`);
  console.log(`🎯 Cible: ${CONFIG.maxWidth}px max @ Q${CONFIG.quality} (AVIF)`);

  // Récupère toutes les images (y compris dans les sous-dossiers)
  const files = await glob(`${CONFIG.inputDir}/**/*.{jpg,jpeg,png,tiff,webp}`);

  if (files.length === 0) {
    console.log('⚠️  Aucune image trouvée dans le dossier "originals".');
    return;
  }

  console.log(`🚀 Traitement de ${files.length} images...`);

  const limit = pLimit(os.cpus().length);
  const tasks = files.map((file) => limit(() => processImage(file)));

  await Promise.all(tasks);

  console.log("🏁 Terminé ! Vos assets sont prêts.");
}

processImages();
