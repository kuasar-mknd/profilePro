/**
 * Rend garde.html en garde.png (A4 paysage, aperçu 2x).
 * Usage : node design/garde-gsm-studios/render.mjs
 */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = path.join(dir, "garde.html");
const out = path.join(dir, "garde.png");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1123, height: 794 },
  deviceScaleFactor: 2,
});
await page.goto(`file://${html}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out });
await browser.close();
console.log(`✅ ${path.relative(process.cwd(), out)}`);
