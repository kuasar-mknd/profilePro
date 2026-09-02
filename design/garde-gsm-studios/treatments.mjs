/**
 * Traitements d'impression alternatifs pour les spécimens :
 *   grain     — grain risograph stochastique (points jetés, pas de grille)
 *   cyanotype — ton continu d'une encre, comme une exposition photosensible
 *   photocopy — seuillage dur bruité, noir/blanc de photocopieuse
 *
 * Usage : node treatments.mjs <in> <out.png> '<opts JSON>'
 * opts = { treatment, outWidth, ink, gamma, lowClip, invert, crop, mask }
 */
import sharp from "sharp";

const [, , input, out, optsJson] = process.argv;
const o = Object.assign(
  {
    treatment: "grain",
    outWidth: 1400,
    ink: "#173AE3",
    gamma: 1.0,
    lowClip: 0.06,
    invert: false,
    crop: null,
    mask: null,
    // grain : taille de grain en px de sortie ; photocopy : bloc en px
    speck: 3,
  },
  optsJson ? JSON.parse(optsJson) : {},
);

const hex = o.ink.replace("#", "");
const INK = [
  parseInt(hex.slice(0, 2), 16),
  parseInt(hex.slice(2, 4), 16),
  parseInt(hex.slice(4, 6), 16),
];

// hash déterministe (pas de Math.random : reproductible)
const hash = (x, y, s = 0) => {
  const v = Math.sin(x * 12.9898 + y * 78.233 + s * 37.719) * 43758.5453;
  return v - Math.floor(v);
};

const meta = await sharp(input, { limitInputPixels: false }).metadata();
let region = { left: 0, top: 0, width: meta.width, height: meta.height };
if (o.crop) {
  region = {
    left: Math.round(o.crop.left * meta.width),
    top: Math.round(o.crop.top * meta.height),
    width: Math.round(o.crop.width * meta.width),
    height: Math.round(o.crop.height * meta.height),
  };
}
const W = o.outWidth;
const H = Math.round((region.height / region.width) * W);

const claheWin = Math.min(260, W - 2, H - 2);
let pipe = sharp(input, { limitInputPixels: false })
  .extract(region)
  .resize(W, H, { fit: "fill" })
  .grayscale()
  .normalise();
if (claheWin >= 30)
  pipe = pipe.clahe({ width: claheWin, height: claheWin, maxSlope: 2 });
const { data } = await pipe.raw().toBuffer({ resolveWithObject: true });

const maskAt = (nx, ny) => {
  if (!o.mask) return 1;
  const m = o.mask;
  if (m.type === "radial") {
    const d = Math.sqrt(((nx - m.cx) / m.rx) ** 2 + ((ny - m.cy) / m.ry) ** 2);
    return d <= 1 ? 1 : Math.max(0, 1 - (d - 1) / (m.feather ?? 0.3));
  }
  if (m.type === "band-x") {
    const fe = m.feather ?? 0.08;
    if (nx < m.start) return Math.max(0, 1 - (m.start - nx) / fe);
    if (nx > m.end) return Math.max(0, 1 - (nx - m.end) / fe);
    return 1;
  }
  return 1;
};

const darkAt = (x, y) => {
  const lum = data[y * W + x] / 255;
  let d = Math.pow(o.invert ? lum : 1 - lum, o.gamma);
  if (d < o.lowClip) return 0;
  return Math.min(d, 1);
};

const rgba = Buffer.alloc(W * H * 4);
const put = (x, y, a) => {
  const i = (y * W + x) * 4;
  rgba[i] = INK[0];
  rgba[i + 1] = INK[1];
  rgba[i + 2] = INK[2];
  rgba[i + 3] = Math.max(rgba[i + 3], Math.round(a * 255));
};

if (o.treatment === "cyanotype") {
  // ton continu : alpha = densité, léger bruit de papier photosensible
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const f = maskAt(x / W, y / H);
      if (f <= 0.02) continue;
      let d = darkAt(x, y);
      if (d <= 0) continue;
      d = Math.min(1, d * (0.94 + 0.12 * hash(x, y, 1)));
      put(x, y, d * f * 0.96);
    }
} else if (o.treatment === "grain") {
  // grain stochastique : cellules fines, présence tirée au sort selon la densité
  const cell = o.speck;
  for (let cy = 0; cy < H / cell; cy++)
    for (let cx = 0; cx < W / cell; cx++) {
      const px = Math.min(W - 1, Math.round((cx + 0.5) * cell));
      const py = Math.min(H - 1, Math.round((cy + 0.5) * cell));
      const f = maskAt(px / W, py / H);
      if (f <= 0.05) continue;
      const d = darkAt(px, py) * f;
      if (d <= 0) continue;
      if (hash(cx, cy) < d * 1.18) {
        // petit amas irrégulier autour du centre jitté
        const jx = px + Math.round((hash(cx, cy, 2) - 0.5) * cell);
        const jy = py + Math.round((hash(cx, cy, 3) - 0.5) * cell);
        const r = cell * (0.42 + 0.5 * hash(cx, cy, 4));
        for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++)
          for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
            const X = jx + dx,
              Y = jy + dy;
            if (X < 0 || X >= W || Y < 0 || Y >= H) continue;
            if (dx * dx + dy * dy <= r * r) put(X, Y, 0.92);
          }
      }
    }
} else if (o.treatment === "photocopy") {
  // seuillage dur bruité + trainées horizontales de photocopieuse
  const block = o.speck;
  for (let by = 0; by < H / block; by++) {
    const streak = (hash(0, by, 5) - 0.5) * 0.14;
    for (let bx = 0; bx < W / block; bx++) {
      const px = Math.min(W - 1, Math.round((bx + 0.5) * block));
      const py = Math.min(H - 1, Math.round((by + 0.5) * block));
      const f = maskAt(px / W, py / H);
      if (f <= 0.3) continue;
      const d = darkAt(px, py);
      const t = 0.5 + (hash(bx, by, 6) - 0.5) * 0.24 + streak;
      if (d > t) {
        for (let dy = 0; dy < block; dy++)
          for (let dx = 0; dx < block; dx++) {
            const X = bx * block + dx,
              Y = by * block + dy;
            if (X < W && Y < H) put(X, Y, 0.97);
          }
      }
    }
  }
}

await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .png()
  .toFile(out);
console.log(`✅ ${out} — ${o.treatment}, ${W}x${H}`);
