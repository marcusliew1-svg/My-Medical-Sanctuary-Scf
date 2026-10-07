import { spawnSync } from "node:child_process";

const allowed = new Set([
  "@next/eslint-plugin-next",
  "braces",
  "eslint-config-next",
  "fast-glob",
  "micromatch",
]);

const result = spawnSync("npm", ["audit", "--json"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});

let report;
try {
  report = JSON.parse(result.stdout || "{}");
} catch {
  console.error(result.stdout || result.stderr || "Unable to parse npm audit output.");
  process.exit(1);
}

const vulnerabilities = report.vulnerabilities || {};
const names = Object.keys(vulnerabilities);
const unexpected = names.filter((name) => !allowed.has(name));
const nonHigh = names.filter((name) => vulnerabilities[name]?.severity !== "high");

console.log(`Dev/build audit findings: ${names.length}`);
for (const name of names) {
  console.log(`- ${name}: ${vulnerabilities[name]?.severity || "unknown"}`);
}

if (unexpected.length) {
  console.error(`Unexpected dev/build vulnerabilities: ${unexpected.join(", ")}`);
  process.exit(1);
}

if (nonHigh.length) {
  console.error(`Unexpected severities in the tracked residual set: ${nonHigh.join(", ")}`);
  process.exit(1);
}

if (names.length > 5) {
  console.error(`Dev/build vulnerability baseline worsened: ${names.length} > 5.`);
  process.exit(1);
}

console.log("Tracked dev/build residual is within the T6.21 ceiling and contains no unexpected packages.");
