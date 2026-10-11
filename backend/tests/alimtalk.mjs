import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { build } from "esbuild";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import fs from "node:fs/promises";
await fs.mkdir(".test-build", { recursive: true });
await build({
  entryPoints: ["src/alimtalk.ts"],
  outfile: ".test-build/alimtalk.mjs",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
});
const {
  sendAlimtalk,
  drainAlimtalk,
  solapiAuthorization,
  TOUR_TEMPLATE,
  TOUR_CHANNEL,
} = await import("../.test-build/alimtalk.mjs");
const manifest = JSON.parse(
  await fs.readFile("config/alimtalk-templates.json", "utf8"),
);
assert.equal(TOUR_TEMPLATE, manifest.templates[0].templateId);
assert.equal(TOUR_CHANNEL, manifest.pfId);
const fake = {
  ALIMTALK_ENABLED: "true",
  SOLAPI_API_KEY: "test-key",
  SOLAPI_API_SECRET: "test-secret",
};
const job = {
  id: crypto.randomUUID(),
  receipt: "ST-20261011-ABCDEF123456",
  phone: "01000000000",
};
const header = await solapiAuthorization("test-key", "test-secret");
const values = Object.fromEntries(
  header
    .replace("HMAC-SHA256 ", "")
    .split(", ")
    .map((x) => x.split("=")),
);
assert.equal(
  values.signature,
  createHmac("sha256", "test-secret")
    .update(values.date + values.salt)
    .digest("hex"),
);
assert.notEqual(header, await solapiAuthorization("test-key", "test-secret"));
let calls = 0;
const ok = async (url, options) => {
  calls++;
  assert.equal(url, "https://api.solapi.com/messages/v4/send-many/detail");
  const b = JSON.parse(options.body);
  assert.equal(b.messages[0].kakaoOptions.disableSms, true);
  assert.equal(b.messages[0].type, "ATA");
  assert.deepEqual(b.messages[0].kakaoOptions.variables, {
    "#{접수번호}": job.receipt,
  });
  assert.equal(b.allowDuplicates, false);
  return Response.json({
    groupInfo: { groupId: "G-TEST", count: { registeredSuccess: 1 } },
    failedMessageList: [],
  });
};
await assert.rejects(
  sendAlimtalk({ ...fake, ALIMTALK_ENABLED: "false" }, job, ok),
  (e) => e.state === "blocked",
);
await assert.rejects(
  sendAlimtalk({ ...fake, SOLAPI_API_SECRET: "" }, job, ok),
  (e) => e.state === "blocked",
);
await assert.rejects(
  sendAlimtalk(fake, { ...job, phone: "garbage" }, ok),
  (e) => e.state === "failed",
);
assert.equal(calls, 0);
assert.deepEqual(await sendAlimtalk(fake, job, ok), { groupId: "G-TEST" });
for (const [response, state] of [
  [new Response("", { status: 500 }), "unknown"],
  [new Response("", { status: 403 }), "failed"],
  [new Response("bad"), "unknown"],
  [Response.json({}), "unknown"],
  [Response.json({ failedMessageList: [{}] }), "failed"],
])
  await assert.rejects(
    sendAlimtalk(fake, job, async () => response),
    (e) => e.state === state,
  );
await assert.rejects(
  sendAlimtalk(fake, job, async () => {
    throw Error("timeout");
  }),
  (e) => e.state === "unknown",
);
const mf = new Miniflare(
  convertV4MiniflareOptions({
    modules: true,
    script: 'export default {fetch(){return new Response("test")}}',
    compatibilityDate: "2026-10-01",
    d1Databases: ["DB"],
  }),
);
try {
  const db = await mf.getD1Database("DB");
  for (const name of ["0001_intake.sql", "0002_alimtalk.sql"])
    for (const sql of (await fs.readFile("migrations/" + name, "utf8"))
      .split(";")
      .filter((x) => x.trim()))
      await db.prepare(sql).run();
  const env = { ...fake, DB: db };
  const seed = async () => {
    const id = crypto.randomUUID(),
      now = Date.now();
    await db
      .prepare(
        "INSERT INTO inquiries(id,receipt,request_key,content_hash,kind,name,phone,email,payload,consent_version,created_at,updated_at) VALUES(?,?,?,'hash','tour','Test','01000000000','','{}','test',?,?)",
      )
      .bind(id, id, id, now, now)
      .run();
    await db
      .prepare(
        "INSERT INTO alimtalk_jobs(inquiry_id,template_key,created_at,updated_at) VALUES(?,'tour_received_v1',?,?)",
      )
      .bind(id, now, now)
      .run();
    return id;
  };
  const state = async (id) =>
    await db
      .prepare("SELECT * FROM alimtalk_jobs WHERE inquiry_id=?")
      .bind(id)
      .first();
  let sends = 0;
  const sender = async () => {
    sends++;
    return { groupId: "TEST-GROUP" };
  };
  const id = await seed();
  await drainAlimtalk({ ...env, ALIMTALK_ENABLED: "false" }, sender);
  assert.equal(sends, 0);
  await drainAlimtalk({ ...env, SOLAPI_API_KEY: "" }, sender);
  assert.equal((await state(id)).status, "blocked");
  assert.equal((await state(id)).attempts, 0);
  await Promise.all([
    drainAlimtalk(env, sender),
    drainAlimtalk(env, sender),
    drainAlimtalk(env, sender),
  ]);
  assert.equal(sends, 1);
  assert.equal((await state(id)).status, "accepted");
  await drainAlimtalk(env, sender);
  assert.equal(sends, 1);
  const timeout = await seed();
  await drainAlimtalk(env, async () => {
    sends++;
    throw Error("connection lost");
  });
  assert.equal((await state(timeout)).status, "unknown");
  await drainAlimtalk(env, sender);
  assert.equal(sends, 2);
  const crash = await seed();
  await db
    .prepare(
      "UPDATE alimtalk_jobs SET status='processing',attempts=1,lease_until=0 WHERE inquiry_id=?",
    )
    .bind(crash)
    .run();
  await drainAlimtalk(env, sender);
  assert.equal((await state(crash)).status, "unknown");
  assert.equal(sends, 2);
  const stale = await seed();
  await db
    .prepare("UPDATE alimtalk_jobs SET created_at=0 WHERE inquiry_id=?")
    .bind(stale)
    .run();
  await drainAlimtalk(env, sender);
  assert.equal((await state(stale)).error_code, "alimtalk_expired");
  assert.equal(sends, 2);
  console.log(
    "PASS Alimtalk: HMAC, configuration gates, SMS fallback off, rejection, timeout, concurrent claims, no ambiguous resend. Provider requests mocked.",
  );
} finally {
  await mf.dispose();
}
