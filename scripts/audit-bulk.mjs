/**
 * Audit de sécurité des dépendances via le bulk advisory endpoint de npm.
 *
 * `pnpm audit` repose sur les anciens endpoints d'audit, retirés par npm
 * (HTTP 410 « This endpoint is being retired. Use the bulk advisory
 * endpoint instead »). Ce script interroge directement l'endpoint de
 * remplacement à partir du lockfile pnpm.
 *
 * Usage : node scripts/audit-bulk.mjs [--level=high]
 *   --level : sévérité minimale provoquant un échec (low|moderate|high|critical).
 */
import fs from "node:fs";
import * as yaml from "js-yaml";
import semver from "semver";

const LEVELS = ["low", "moderate", "high", "critical"];
const levelArg = process.argv
  .find((a) => a.startsWith("--level="))
  ?.split("=")[1];
const failLevel = LEVELS.includes(levelArg) ? levelArg : "high";
const failIndex = LEVELS.indexOf(failLevel);

const lockfile = yaml.load(fs.readFileSync("pnpm-lock.yaml", "utf8"));
const packages = lockfile?.packages ?? {};

// Clés du lockfile v9 : "name@version" (ou "@scope/name@version").
const versionsByName = new Map();
for (const key of Object.keys(packages)) {
  const at = key.lastIndexOf("@");
  if (at <= 0) continue;
  const name = key.slice(0, at);
  const version = key.slice(at + 1).split("(")[0];
  if (!semver.valid(version)) continue;
  if (!versionsByName.has(name)) versionsByName.set(name, new Set());
  versionsByName.get(name).add(version);
}

const payload = {};
for (const [name, versions] of versionsByName) {
  payload[name] = [...versions];
}

const total = Object.keys(payload).length;
if (total === 0) {
  console.error("Aucun paquet trouvé dans pnpm-lock.yaml — abandon.");
  process.exit(2);
}

const response = await fetch(
  "https://registry.npmjs.org/-/npm/v1/security/advisories/bulk",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  },
);
if (!response.ok) {
  console.error(
    `Endpoint bulk advisory indisponible : HTTP ${response.status}`,
  );
  process.exit(2);
}
const advisories = await response.json();

let failures = 0;
let informational = 0;
for (const [name, entries] of Object.entries(advisories)) {
  for (const advisory of entries) {
    const affected = [...(versionsByName.get(name) ?? [])].filter((v) =>
      semver.satisfies(v, advisory.vulnerable_versions ?? "*"),
    );
    if (affected.length === 0) continue;
    const severityIndex = LEVELS.indexOf(advisory.severity);
    const gate = severityIndex >= failIndex;
    if (gate) failures++;
    else informational++;
    console.log(
      `${gate ? "✖" : "•"} [${advisory.severity}] ${name}@${affected.join(", ")} — ${advisory.title} (${advisory.url})`,
    );
  }
}

console.log(
  `\n${total} paquets analysés — ${failures} vulnérabilité(s) >= ${failLevel}, ${informational} de sévérité inférieure.`,
);
process.exit(failures > 0 ? 1 : 0);
