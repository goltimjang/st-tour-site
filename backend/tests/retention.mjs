import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { build } from "esbuild";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
await build({
  entryPoints: ["src/retention.ts"],
  outfile: ".test-build/retention.mjs",
  bundle: true,
  format: "esm",
  platform: "node",
});
const { purgeExpired } = await import("../.test-build/retention.mjs");
const mf = new Miniflare(
  convertV4MiniflareOptions({
    modules: true,
    script: 'export default {fetch(){return new Response("ok")}}',
    compatibilityDate: "2026-10-01",
    d1Databases: ["DB"],
  }),
);
try {
  const DB = await mf.getD1Database("DB");
  for (const file of ["0001_intake.sql", "0002_alimtalk.sql"])
    for (const s of (await fs.readFile("migrations/" + file, "utf8"))
      .split(";")
      .filter((s) => s.trim()))
      await DB.prepare(s).run();
  const now = Date.parse("2026-10-11T00:00:00Z");
  for (const [id, age, status, previouslyBooked] of [
    ["expired", 2, "closed", false],
    ["recent", 0.5, "new", false],
    ["booked", 2, "booked", false],
    ["closed-booking", 2, "closed", true],
    ["old-booking", 6, "closed", true],
  ]) {
    const timestamp = now - age * 365.25 * 86400000;
    await DB.prepare(
      "INSERT INTO inquiries(id,receipt,request_key,content_hash,kind,name,phone,email,payload,consent_version,created_at,updated_at,status) VALUES(?,?,?,'x','tour','test','01000000000','','{}','test',?,?,?)",
    )
      .bind(id, id, id, timestamp, timestamp, status)
      .run();
    await DB.prepare(
      "INSERT INTO audit_events(inquiry_id,actor,action,created_at) VALUES(?,'tester',?,?)",
    )
      .bind(
        id,
        previouslyBooked
          ? "status:booked;note_updated"
          : "status:closed;note_updated",
        timestamp,
      )
      .run();
    await DB.prepare(
      "INSERT INTO notifications(inquiry_id,next_at,updated_at) VALUES(?,0,0)",
    )
      .bind(id)
      .run();
    await DB.prepare(
      "INSERT INTO alimtalk_jobs(inquiry_id,template_key,created_at,updated_at) VALUES(?,'tour_received_v1',0,0)",
    )
      .bind(id)
      .run();
  }
  await purgeExpired({ DB }, now);
  assert.equal(
    (await DB.prepare("SELECT COUNT(*) n FROM inquiries").first()).n,
    5,
  );
  await purgeExpired({ DB, RETENTION_ENABLED: "true" }, now);
  await purgeExpired({ DB, RETENTION_ENABLED: "true" }, now);
  assert.deepEqual(
    (
      await DB.prepare("SELECT id FROM inquiries ORDER BY id").all()
    ).results.map((x) => x.id),
    ["booked", "closed-booking", "recent"],
  );
  for (const table of ["notifications", "alimtalk_jobs", "audit_events"])
    assert.equal(
      (await DB.prepare(`SELECT COUNT(*) n FROM ${table}`).first()).n,
      3,
    );
  console.log(
    "PASS retention: disabled guard, one-year inquiry expiry, five-year booked history, dependent records removed atomically",
  );
} finally {
  await mf.dispose();
}
