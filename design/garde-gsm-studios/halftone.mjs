/**
 * Trame de demi-teinte « riso brute » : convertit une photo en points
 * d'une seule encre sur papier, grille tournée à 15°, hautes lumières
 * en réserve de papier, ombres denses où les points fusionnent.
 *
 * Usage : node halftone.mjs <in> <outPngBase> [options JSON]
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const [, , input, outBase, optsJson] = process.argv;
const opts = Object.assign(
  {
    // largeur du rendu final en px
    outWidth: 2600,
    // nombre de cellules de trame sur la largeur (petit = trame grosse)
    cells: 95,
    // angle de la grille de trame (degrés)
    angle: 15,
    // encre et papier ("none" = fond transparent)
    ink: "#4f46e5",
    paper: "none",
    // recadrage source normalisé {left, top, width, height} en 0..1
    crop: null,
    // hauteur de sortie (défaut : ratio source ou crop)
    aspect: null,
    // gamma sur la darkness pour creuser les hautes lumières
    gamma: 1.0,
    // seuils : sous lowClip → papier nu ; au-dessus de highMerge → aplat
    lowClip: 0.055,
    highMerge: 0.93,
    // true : l'encre imprime la lumière (négatif, pour scènes sombres)
    invert: false,
    // masque d'extraction : les points s'évanouissent hors de la zone.
    // {type:"radial",cx,cy,rx,ry,feather} ou {type:"band-x",start,end,feather}
    // (coordonnées normalisées 0..1 du rendu)
    mask: null,
  },
  optsJson ? JSON.parse(optsJson) : {},
);

const img = sharp(input, { limitInputPixels: false });
const meta = await img.metadata();
let region = { left: 0, top: 0, width: meta.width, height: meta.height };
if (opts.crop) {
  region = {
    left: Math.round(opts.crop.left * meta.width),
    top: Math.round(opts.crop.top * meta.height),
    width: Math.round(opts.crop.width * meta.width),
    height: Math.round(opts.crop.height * meta.height),
  };
}
const srcAspect = region.height / region.width;
const aspect = opts.aspect ?? srcAspect;

// Échantillonnage : on lit la luminance sur une grille assez fine.
const sampleW = 800;
const sampleH = Math.round(sampleW * aspect);
const claheWin = Math.min(260, sampleW - 2, sampleH - 2);
let pipe = sharp(input, { limitInputPixels: false })
  .extract(region)
  .resize(sampleW, sampleH, { fit: "fill" })
  .grayscale()
  .normalise();
if (claheWin >= 30)
  pipe = pipe.clahe({ width: claheWin, height: claheWin, maxSlope: 2 });
const { data } = await pipe.raw().toBuffer({ resolveWithObject: true });

const lumAt = (x, y) => {
  const xi = Math.min(sampleW - 1, Math.max(0, Math.round(x * (sampleW - 1))));
  const yi = Math.min(sampleH - 1, Math.max(0, Math.round(y * (sampleH - 1))));
  return data[yi * sampleW + xi] / 255;
};

// Grille tournée : on parcourt un lattice dans le repère tourné et on
// projette chaque centre de point dans le canvas.
const W = opts.outWidth;
const H = Math.round(W * aspect);
const cell = W / opts.cells;
const maxR = cell * 0.58;
const a = (opts.angle * Math.PI) / 180;
const cosA = Math.cos(a);
const sinA = Math.sin(a);
const diag = Math.sqrt(W * W + H * H);

let dots = "";
let count = 0;
for (let v = -diag; v <= diag; v += cell) {
  for (let u = -diag; u <= diag; u += cell) {
    const x = u * cosA - v * sinA + W / 2;
    const y = u * sinA + v * cosA + H / 2;
    if (x < -cell || x > W + cell || y < -cell || y > H + cell) continue;
    const lum = lumAt(x / W, y / H);
    let dark = Math.pow(opts.invert ? lum : 1 - lum, opts.gamma);
    if (dark < opts.lowClip) continue; // papier nu
    if (dark > opts.highMerge) dark = 1.08; // l'encre fusionne
    let f = 1;
    if (opts.mask) {
      const nx = x / W;
      const ny = y / H;
      const m = opts.mask;
      if (m.type === "radial") {
        const d = Math.sqrt(
          ((nx - m.cx) / m.rx) ** 2 + ((ny - m.cy) / m.ry) ** 2,
        );
        f = d <= 1 ? 1 : Math.max(0, 1 - (d - 1) / (m.feather ?? 0.3));
      } else if (m.type === "band-x") {
        const fe = m.feather ?? 0.08;
        if (nx < m.start) f = Math.max(0, 1 - (m.start - nx) / fe);
        else if (nx > m.end) f = Math.max(0, 1 - (nx - m.end) / fe);
      }
      if (f < 0.12) continue;
    }
    const r = maxR * Math.sqrt(Math.min(dark, 1.15)) * f;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}"/>`;
    count++;
  }
}

const bg =
  opts.paper === "none"
    ? ""
    : `<rect width="${W}" height="${H}" fill="${opts.paper}"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${bg}<g fill="${opts.ink}">${dots}</g></svg>`;
writeFileSync(`${outBase}.svg`, svg);

await sharp(Buffer.from(svg), { limitInputPixels: false })
  .png({ palette: true })
  .toFile(`${outBase}.png`);
console.log(
  `✅ ${outBase}.png — ${W}x${H}, ${count} points, cellule ${cell.toFixed(1)}px`,
);
