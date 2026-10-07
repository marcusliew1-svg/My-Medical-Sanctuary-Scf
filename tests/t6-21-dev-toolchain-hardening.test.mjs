import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.21 migrates Tailwind to the v4 PostCSS path",()=>{
  const pkg=JSON.parse(read("package.json"));
  assert.equal(pkg.devDependencies.tailwindcss,"4.3.3");
  assert.equal(pkg.devDependencies["@tailwindcss/postcss"],"4.3.3");
  assert.equal(pkg.devDependencies.autoprefixer,undefined);
  assert.match(read("postcss.config.mjs"),/["']@tailwindcss\/postcss["']/);
  const css=read("src/app/globals.css");
  assert.match(css,/@config "\.\.\/\.\.\/tailwind\.config\.js";/);
  assert.match(css,/@import "tailwindcss";/);
  assert.doesNotMatch(css,/@tailwind base/);
});

test("T6.21 pins patched brace-expansion lines without hiding audit output",()=>{
  const pkg=JSON.parse(read("package.json"));
  assert.equal(pkg.overrides["brace-expansion@<2"],"1.1.21");
  assert.equal(pkg.overrides["brace-expansion@>=4 <6"],"5.0.12");
  const script=read("scripts/t6-21-dev-toolchain-audit.mjs");
  assert.match(script,/Unexpected dev\/build vulnerabilities/);
  assert.match(script,/names\.length > 5/);
  assert.match(script,/@next\/eslint-plugin-next/);
});

test("T6.21 keeps Production audit independent and fail-closed",()=>{
  const pkg=JSON.parse(read("package.json"));
  assert.match(pkg.scripts["security:prod"],/npm audit --omit=dev --audit-level=high/);
  assert.match(pkg.scripts["security:dev-baseline"],/t6-21-dev-toolchain-audit/);
  const doc=read("docs/t6-21-dev-toolchain-hardening.md");
  assert.match(doc,/Production dependency audit remains 0 vulnerabilities/);
  assert.match(doc,/Production\/main remain untouched/);
});
