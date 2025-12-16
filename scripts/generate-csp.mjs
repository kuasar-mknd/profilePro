import fs from "node:fs/promises";

import crypto from "node:crypto";
import * as cheerio from "cheerio";
import { glob } from "glob";

const DIST_DIR = "dist";
const HEADERS_FILE = "dist/_headers";
const PUBLIC_HEADERS_FILE = "public/_headers";

/**
 * Calculates the SHA-256 hash of a string.
 * @param {string} content
 * @returns {string}
 */
function calculateHash(content) {
  return crypto.createHash("sha256").update(content).digest("base64");
}

async function main() {
  console.log("🔒 Generating CSP hashes...");

  // 1. Find all HTML files in dist/
  const htmlFiles = await glob(`${DIST_DIR}/**/*.html`);

  const scriptHashes = new Set();
  const styleHashes = new Set();

  // 2. Extract inline scripts and styles
  for (const file of htmlFiles) {
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
  }

  console.log(
    `✨ Found ${scriptHashes.size} inline scripts and ${styleHashes.size} inline styles.`,
  );

  // 3. Read the template _headers file (from public/ or dist/ if copied)
  // We prefer reading from public/ as source of truth, but dist/ might have it copied already.
  // Let's read from public/_headers to be safe and write to dist/_headers.
  try {
    let headersContent = await fs.readFile(PUBLIC_HEADERS_FILE, "utf-8");

    // 4. Inject hashes
    // We look for the Content-Security-Policy line
    const cspRegex = /(Content-Security-Policy:.*)/g;

    // Helper to inject into a specific directive
    const injectIntoDirective = (policy, directive, hashes) => {
      const regex = new RegExp(`(${directive}[^;]*)(;?)`);
      if (regex.test(policy)) {
        return policy.replace(regex, `$1 ${Array.from(hashes).join(" ")}$2`);
      } else {
        // Directive doesn't exist, append it (simplified assumption, usually it exists)
        return `${policy}; ${directive} ${Array.from(hashes).join(" ")}`;
      }
    };

    headersContent = headersContent.replace(cspRegex, (match) => {
      let newPolicy = match;
      if (scriptHashes.size > 0) {
        newPolicy = injectIntoDirective(newPolicy, "script-src", scriptHashes);
      }
      if (styleHashes.size > 0) {
        newPolicy = injectIntoDirective(newPolicy, "style-src", styleHashes);
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
