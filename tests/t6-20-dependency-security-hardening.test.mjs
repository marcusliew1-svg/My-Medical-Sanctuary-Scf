import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.20 pins patched Next.js and matching eslint config",()=>{
  const pkg=JSON.parse(read("package.json"));
  assert.equal(pkg.dependencies.next,"16.4.0");
  assert.equal(pkg.devDependencies["eslint-config-next"],"16.4.0");
});

test("T6.20 enforces production dependency audit",()=>{
  const pkg=JSON.parse(read("package.json"));
  assert.match(pkg.scripts["security:prod"],/npm audit --omit=dev --audit-level=high/);
  const ci=read(".github/workflows/ci.yml");
  assert.match(ci,/Production dependency security audit/);
  assert.match(ci,/npm run security:prod/);
});

test("T6.20 keeps dev-tooling findings explicit rather than hiding them",()=>{
  const doc=read("docs/t6-20-dependency-security-hardening.md");
  assert.match(doc,/production dependency audit.*0 vulnerabilities/is);
  assert.match(doc,/dev\/build tooling/i);
  assert.match(doc,/Tailwind 4/i);
  assert.match(doc,/Production\/main remain untouched/);
});
