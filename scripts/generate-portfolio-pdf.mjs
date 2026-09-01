/**
 * Export PDF interactif du portfolio.
 *
 * Sert le dossier `dist/` en local, ouvre la page /portfolio-pdf/ dans un
 * Chromium headless (Playwright) et l'imprime en A4 paysage. Le PDF conserve
 * les liens externes (films, études de cas), les ancres internes du sommaire
 * et les signets (outline) générés depuis les titres.
 *
 * Usage :
 *   bun run pdf              # construit dist/ si absent, puis génère le PDF
 *   bun run pdf -- --build   # force une reconstruction complète de dist/
 *   bun run pdf -- --out chemin/vers/portfolio.pdf
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const DIST_DIR = path.resolve("dist");
const PDF_ROUTE = "/portfolio-pdf/";
const DEFAULT_OUT = "portfolio-samuel-dulex.pdf";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
};

function parseArgs(argv) {
  const args = { build: false, out: DEFAULT_OUT };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--build") args.build = true;
    else if (argv[i] === "--out" && argv[i + 1]) args.out = argv[++i];
  }
  return args;
}

/**
 * Résout une URL vers un fichier de dist/ (format "directory" d'Astro).
 * @param {string} urlPath
 * @returns {string | null}
 */
function resolveDistFile(urlPath) {
  const cleaned = decodeURIComponent(urlPath.split("?")[0]);
  const withIndex = cleaned.endsWith("/") ? `${cleaned}index.html` : cleaned;
  const filePath = path.normalize(path.join(DIST_DIR, withIndex));
  // 🛡️ Sentinel: bloque toute traversée hors de dist/
  if (!filePath.startsWith(DIST_DIR + path.sep)) return null;
  return filePath;
}

/** Sert dist/ sur un port éphémère et retourne { server, baseUrl }. */
async function serveDist() {
  const server = http.createServer(async (req, res) => {
    let filePath = resolveDistFile(req.url ?? "/");
    if (filePath) {
      try {
        let info = await stat(filePath);
        if (info.isDirectory()) {
          filePath = path.join(filePath, "index.html");
          info = await stat(filePath);
        }
        res.writeHead(200, {
          "Content-Type":
            MIME_TYPES[path.extname(filePath)] ?? "application/octet-stream",
          "Content-Length": info.size,
        });
        createReadStream(filePath).pipe(res);
        return;
      } catch {
        // 404 ci-dessous
      }
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch (error) {
    // Environnements où le Chromium épinglé par Playwright n'est pas installé
    // (ex. conteneur avec un Chromium système) : repli sur un exécutable connu.
    const fallback =
      process.env.PORTFOLIO_PDF_BROWSER ?? "/opt/pw-browsers/chromium";
    if (existsSync(fallback)) {
      console.warn(
        `⚠️  Chromium Playwright indisponible, repli sur ${fallback}`,
      );
      return chromium.launch({ executablePath: fallback });
    }
    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const pageFile = path.join(DIST_DIR, "portfolio-pdf", "index.html");

  if (args.build || !existsSync(pageFile)) {
    console.log("🏗️  Construction du site (bun run build)…");
    const build = spawnSync("bun", ["run", "build"], { stdio: "inherit" });
    if (build.status !== 0) {
      throw new Error("La construction du site a échoué.");
    }
  }
  if (!existsSync(pageFile)) {
    throw new Error(`Page introuvable : ${pageFile}`);
  }

  const { server, baseUrl } = await serveDist();
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    console.log(`📄 Rendu de ${PDF_ROUTE}…`);
    await page.goto(`${baseUrl}${PDF_ROUTE}`, { waitUntil: "networkidle" });
    // Polices et images doivent être prêtes avant l'impression.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() =>
      Array.from(document.images).every(
        (img) => img.complete && img.naturalWidth > 0,
      ),
    );

    const sheetCount = await page.locator(".sheet").count();
    const outPath = path.resolve(args.out);
    await page.pdf({
      path: outPath,
      format: "A4",
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      // PDF balisé (accessibilité) + signets générés depuis les titres.
      tagged: true,
      outline: true,
    });

    const { size } = await stat(outPath);
    console.log(
      `✅ ${path.relative(process.cwd(), outPath)} — ${sheetCount} pages, ${(size / 1024 / 1024).toFixed(2)} Mo`,
    );
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error("❌ Échec de la génération du PDF :", error);
  process.exitCode = 1;
});
