import fs from "node:fs/promises";
import crypto from "node:crypto";
import * as cheerio from "cheerio";
import { glob } from "glob";
import path from "node:path";

const DIST_DIR = "dist";
const HEADERS_FILE = path.join(DIST_DIR, "_headers");
const PUBLIC_HEADERS_FILE = "public/_headers";

function calculateHash(content) {
  return crypto.createHash("sha256").update(content).digest("base64");
}

async function main() {
  console.log("🔒 Generating CSP hashes...");

  // Check if dist/ exists
  const distExists = await fs.stat(DIST_DIR).then(() => true).catch(() => false);
  if (!distExists) {
    console.error(`❌ Error: Directory "${DIST_DIR}" does not exist. Build might have failed.`);
    process.exit(1);
  }

  // 1. Find all HTML files in dist/
  const htmlFiles = await glob(`${DIST_DIR}/**/*.html`);
  if (htmlFiles.length === 0) {
    console.warn(`⚠️  No HTML files found in ${DIST_DIR}. Skipping CSP generation.`);
    return;
  }

  const scriptHashes = new Set();
  const styleHashes = new Set();

  // 2. Extract inline scripts and styles
  for (const file of htmlFiles) {
    try {
      const content = await fs.readFile(file, "utf-8");
      const $ = cheerio.load(content);

      $("script").each((_, el) => {
        const inlineContent = $(el).html();
        if (inlineContent && inlineContent.trim().length > 0) {
          scriptHashes.add(`'sha256-${calculateHash(inlineContent)}'`);
        }
      });

      $("style").each((_, el) => {
        const inlineContent = $(el).html();
        if (inlineContent && inlineContent.trim().length > 0) {
          styleHashes.add(`'sha256-${calculateHash(inlineContent)}'`);
        }
      });
    } catch (err) {
      console.warn(`⚠️  Could not read or process file ${file}: ${err.message}`);
    }
  }

  console.log(
    `✨ Found ${scriptHashes.size} inline scripts and ${styleHashes.size} inline styles.`,
  );

  // 3. Read the template _headers file
  try {
    const publicHeadersExists = await fs.stat(PUBLIC_HEADERS_FILE).then(() => true).catch(() => false);
    if (!publicHeadersExists) {
      console.warn(`⚠️  "${PUBLIC_HEADERS_FILE}" not found. Skipping hash injection.`);
      return;
    }

    let headersContent = await fs.readFile(PUBLIC_HEADERS_FILE, "utf-8");

    // 4. Inject hashes
    const cspRegex = /(Content-Security-Policy:.*)/g;

    const injectIntoDirective = (policy, directive, hashes) => {
      const regex = new RegExp(
        `(${directive}(?![a-zA-Z-])(?=\\s|;|$)[^;]*)(;?)`,
      );
      if (regex.test(policy)) {
        return policy.replace(regex, `$1 ${Array.from(hashes).join(" ")}$2`);
      } else {
        const separator = policy.trim().endsWith(";") ? " " : "; ";
        return `${policy}${separator}${directive} ${Array.from(hashes).join(" ")}`;
      }
    };

    headersContent = headersContent.replace(cspRegex, (match) => {
      let newPolicy = match;

      if (scriptHashes.size > 0) {
        if (new RegExp("script-src-elem(?=\\s|;|$)", "i").test(newPolicy)) {
          newPolicy = injectIntoDirective(newPolicy, "script-src-elem", scriptHashes);
        } else {
          newPolicy = injectIntoDirective(newPolicy, "script-src", scriptHashes);
        }
      }

      if (styleHashes.size > 0) {
        if (new RegExp("style-src-elem(?=\\s|;|$)", "i").test(newPolicy)) {
          newPolicy = injectIntoDirective(newPolicy, "style-src-elem", styleHashes);
        } else {
          newPolicy = injectIntoDirective(newPolicy, "style-src", styleHashes);
        }
      }
      return newPolicy;
    });

    // 5. Write back to dist/_headers
    await fs.writeFile(HEADERS_FILE, headersContent, "utf-8");
    console.log(`✅ CSP hashes injected into ${HEADERS_FILE}`);
  } catch (error) {
    console.error("❌ Error processing _headers:", error);
    process.exit(1);
  }
}

main();
