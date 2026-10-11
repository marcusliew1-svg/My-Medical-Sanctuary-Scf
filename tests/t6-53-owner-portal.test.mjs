import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const page = readFileSync("src/app/owner/page.tsx", "utf8");
test("owner portal is dynamic and disallows indexing", () => {
  assert.match(page,/dynamic = "force-dynamic"/);
  assert.match(page,/robots: \{ index: false, follow: false \}/);
});
test("server authenticates and requires owner-only role", () => {
  assert.match(page,/authenticateOperatorRequest\(request\)/);
  assert.match(page,/auth\.status !== "authenticated"/);
  assert.match(page,/auth\.claims\.roles\.length !== 1 \|\| auth\.claims\.roles\[0\] !== "owner"/);
  assert.match(page,/redirect\("\/operations"\)/);
});
test("portal does not embed sensitive identities or fictional dashboard metrics", () => {
  assert.doesNotMatch(page,/marcusliew1@gmail\.com|scfasiapac@gmail\.com/);
  assert.doesNotMatch(page,/\bRM\s*[0-9,]+/);
  assert.match(page,/Data connection pending/);
});
