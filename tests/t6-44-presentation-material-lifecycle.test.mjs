import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (file) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8");

test("T6.44 defaults Presentation Centre assets to pending and constrains states", () => {
  const sql = read("database/migrations/0047_mms_presentation_material_lifecycle.sql");
  assert.match(sql, /approval_status text not null default 'PENDING'/);
  for (const state of ["PENDING", "APPROVED", "EXPIRED", "WITHDRAWN"]) {
    assert.match(sql, new RegExp("'"+state+"'"));
  }
  assert.doesNotMatch(sql, /update\s+mms_commercial\.presentation_assets\s+set\s+approval_status\s*=\s*'APPROVED'/i);
});

test("T6.44 partner read requires approved and current materials", () => {
  const source = read("src/lib/partnerHubPostgres.ts");
  assert.match(source, /where approval_status = 'APPROVED'\s+and effective_from <= now\(\)\s+and \(effective_to is null or effective_to > now\(\)\)/);
});
