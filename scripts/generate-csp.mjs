import fs from "node:fs/promises";
import crypto from "node:crypto";
import * as cheerio from "cheerio";
import { glob } from "glob";
import pLimit from "p-limit";

const DIST_DIR = "dist";
const HEADERS_FILE = "dist/_headers";
const PUBLIC_HEADERS_FILE = "public/_headers";
const CONCURRENCY = 5; // 🛡️ Evite d'ouvrir trop de fichiers en même temps

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

  const htmlFiles = await glob(`${DIST_DIR}/**/*.html`);

  if (htmlFiles.length === 0) {
    console.log("⚠️ No HTML files found in dist/.");
    return;
  }

  const scriptHashes = new Set();
  const styleHashes = new Set();

  const limit = pLimit(CONCURRENCY);

  const tasks = htmlFiles.map((file) => limit(async () => {
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
      console.error(`❌ Error reading ${file}:`, err);
    }
  }));

  await Promise.all(tasks);

  console.log(
    `✨ Found ${scriptHashes.size} inline scripts and ${styleHashes.size} inline styles.`,
  );

  try {
    let headersContent = await fs.readFile(PUBLIC_HEADERS_FILE, "utf-8");

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

    await fs.writeFile(HEADERS_FILE, headersContent, "utf-8");
    console.log(`✅ CSP hashes injected into ${HEADERS_FILE}`);
  } catch (error) {
    console.error("❌ Error processing _headers:", error);
    process.exit(1);
  }
}

main();
