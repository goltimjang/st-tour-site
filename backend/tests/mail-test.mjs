import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { build } from "esbuild";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
await fs.mkdir(".test-build", { recursive: true });
await build({
  entryPoints: ["src/mail-test.ts"],
  outfile: ".test-build/mail-test.mjs",
  bundle: true,
  format: "esm",
  platform: "node",
});
const { mailTest } = await import("../.test-build/mail-test.mjs");
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
  for (const q of (await fs.readFile("migrations/0001_intake.sql", "utf8"))
    .split(";")
    .filter((x) => x.trim()))
    await DB.prepare(q).run();
  const env = {
    DB,
    MAIL_TEST_EXPIRES_AT: new Date(Date.now() + 1800000).toISOString(),
    INTAKE_ENABLED: "false",
    ALIMTALK_ENABLED: "false",
    TEST_INTAKE_ENABLED: "false",
    MAIL_TO: "goltimjang@gmail.com",
    MAIL_FROM: "에스티골프투어 접수 알림 <inquiries@notify.stgolftours.com>",
  };
  let sends = 0;
  const deps = {
    send: async () => {
      sends++;
      return { id: "mock-mail" };
    },
  };
  const request = (method = "POST") =>
    new Request("https://test.invalid/admin/mail-test", { method });
  await assert.rejects(
    () =>
      mailTest(request(), { ...env, MAIL_TEST_EXPIRES_AT: "" }, deps, "tester"),
    /mail_test_disabled/,
  );
  await assert.rejects(
    () =>
      mailTest(
        request(),
        { ...env, MAIL_TO: "other@example.invalid" },
        deps,
        "tester",
      ),
    /mail_test_disabled/,
  );
  await assert.rejects(
    () => mailTest(request(), env, deps, "tester"),
    /test_inquiry_missing/,
  );
  await DB.prepare(
    "INSERT INTO inquiries(id,receipt,request_key,content_hash,kind,name,phone,email,payload,consent_version,created_at,updated_at) VALUES('test','TEST-RECEIPT','2de2cdda-2288-42b7-a48c-b9b90b093247','test','tour','test','01000000000','','{}','test',0,0)",
  ).run();
  assert.equal(
    (await mailTest(request("GET"), env, deps, "tester")).status,
    200,
  );
  assert.equal(sends, 0);
  const results = await Promise.all(
    Array.from({ length: 5 }, () => mailTest(request(), env, deps, "tester")),
  );
  assert.equal(results.filter((r) => r.status === 200).length, 1);
  assert.equal(results.filter((r) => r.status === 409).length, 4);
  assert.equal(sends, 1);
  assert.equal(
    (await DB.prepare("SELECT COUNT(*) n FROM notifications").first()).n,
    0,
  );
  await DB.prepare("DELETE FROM audit_events").run();
  await assert.rejects(
    () =>
      mailTest(
        request(),
        env,
        {
          send: async () => {
            throw Error("timeout");
          },
        },
        "tester",
      ),
    /mail_test_result_requires_review/,
  );
  assert.equal((await mailTest(request(), env, deps, "tester")).status, 409);
  assert.equal(sends, 1);
  console.log(
    "PASS operator mail test: disabled, recipient, missing record, GET, concurrent claim, no queue, ambiguous result no retry",
  );
} finally {
  await mf.dispose();
}
