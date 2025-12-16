import fs from "fs";
import https from "https";
import path from "path";

const FONTS_DIR = path.join(process.cwd(), "public", "fonts");
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Targets
const TARGETS = [
  {
    family: "Space Grotesk",
    weight: 700,
    style: "normal",
    filename: "space-grotesk-bold.woff2",
  },
  {
    family: "Outfit",
    weight: 300,
    style: "normal",
    filename: "outfit-light.woff2",
  },
  {
    family: "Outfit",
    weight: 400,
    style: "normal",
    filename: "outfit-regular.woff2",
  },
  {
    family: "Outfit",
    weight: 700,
    style: "normal",
    filename: "outfit-bold.woff2",
  },
  {
    family: "Inter",
    weight: 400,
    style: "normal",
    filename: "inter-regular.woff2",
  },
  {
    family: "Inter",
    weight: 700,
    style: "normal",
    filename: "inter-bold.woff2",
  },
];

async function fetchCSS(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": USER_AGENT } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    });
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        res.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

async function run() {
  console.log("⚡ Bolt: Fetching optimized font subsets...");

  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  // Google Fonts URL for all targets, asking for latin subset implicitly by how modern browsers work
  // or we filter the result.
  // We request all of them.
  const url = `https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Outfit:wght@300;400;700&family=Space+Grotesk:wght@700&display=swap`;

  try {
    const css = await fetchCSS(url);

    // Parse CSS to identify the correct URLs
    // Google returns blocks like:
    /* latin */
    // @font-face {
    //   font-family: 'Space Grotesk';
    //   font-style: normal;
    //   font-weight: 700;
    //   src: url(https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oDA.woff2) format('woff2');
    //   unicode-range: U+0000-00FF, ...;
    // }

    // We regex for this structure.
    const fontFaces = css.split("@font-face");

    for (const target of TARGETS) {
      // Find matching block
      // Look for block that contains font-family, font-weight, AND "latin" comment or unicode-range text
      // Google puts /* latin */ comment before the block usually, but in the split array it might be at the end of previous.
      // Actually, checking for `unicode-range: U+0000-00FF` inside the block is safer for "Latin".

      const match = fontFaces.find((block) => {
        return (
          block.includes(`font-family: '${target.family}'`) &&
          block.includes(`font-weight: ${target.weight}`) &&
          block.includes(`U+0000-00FF`)
        ); // Basic Latin
      });

      if (match) {
        const srcMatch = match.match(/src: url\((https:\/\/[^)]+)\)/);
        if (srcMatch && srcMatch[1]) {
          const downloadUrl = srcMatch[1];
          const destPath = path.join(FONTS_DIR, target.filename);
          console.log(
            `Downloading ${target.family} ${target.weight} -> ${target.filename}`,
          );
          await downloadFile(downloadUrl, destPath);
        } else {
          console.error(
            `Could not find src for ${target.family} ${target.weight}`,
          );
        }
      } else {
        console.error(
          `Could not find font-face block for ${target.family} ${target.weight}`,
        );
      }
    }

    console.log("✅ Fonts updated!");
  } catch (error) {
    // Sanitize error output to prevent log injection
    let errMsg =
      (error && error.message ? error.message : String(error)).replace(
        /[\r\n]+/g,
        " "
      );
    console.error("Error:", errMsg);
  }
}

run();
