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
  maxWidth: 2560,

  // Qualité 68 en AVIF :
  // Visuellement "sans perte" pour l'œil humain, même pour un pro.
  quality: 68,
};

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

  for (const file of files) {
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
        continue;
      }
    } catch {
      // Le fichier n'existe pas, on continue
    }

    console.log(`⚙️  Traitement: ${relativePath}`);
    const start = Date.now();

    try {
      // Pipeline Sharp optimisé
      const image = sharp(file).rotate(); // Applique la rotation EXIF (important pour les portraits !)

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

      const end = Date.now();
      console.log(`   ✅ Ok (${((end - start) / 1000).toFixed(1)}s)`);
    } catch (error) {
      console.error(`❌ Erreur sur ${relativePath}:`, error);
    }
  }
  console.log("🏁 Terminé ! Vos assets sont prêts.");
}

processImages();
