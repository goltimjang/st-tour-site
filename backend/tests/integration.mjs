import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { build } from "esbuild";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
await fs.mkdir(".test-build", { recursive: true });
await build({
  entryPoints: ["tests/entry.ts"],
  outfile: ".test-build/worker.mjs",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
});
const mf = new Miniflare(
  convertV4MiniflareOptions({
    modules: true,
    scriptPath: ".test-build/worker.mjs",
    compatibilityDate: "2026-10-01",
    d1Databases: ["DB"],
    bindings: {
      ALLOWED_ORIGINS: "https://www.stgolftours.com",
      RATE_SALT: "test-salt",
      ADMIN_EMAILS: "test-admin@example.invalid",
    },
  }),
);
let count = 0;
try {
  const db = await mf.getD1Database("DB");
  const schema = await fs.readFile("migrations/0001_intake.sql", "utf8");
  for (const statement of schema.split(";").filter((x) => x.trim()))
    await db.prepare(statement).run();
  await db.exec(
    "CREATE TABLE test_mail (mode TEXT); INSERT INTO test_mail VALUES('success'); CREATE TABLE test_sent (key TEXT PRIMARY KEY,receipt TEXT);",
  );
  const payload = {
    접수번호: "ST-TEST-0001",
    type: "해외 골프투어",
    지역: "베트남 · 하노이",
    희망시기: "미정",
    인원: "4명",
    이름: "시험 고객",
    연락처: "01000000000",
    요청사항: "실제 상담 아님",
  };
  const input = (extra = {}) => ({
    requestKey: crypto.randomUUID(),
    payload,
    email: "",
    token: "test-valid-token",
    consent: true,
    consentVersion: "2026-10-backend-v1",
    ...extra,
  });
  const submit = (body, headers = {}) =>
    mf.dispatchFetch("https://backend.example/v1/inquiries", {
      method: "POST",
      headers: {
        Origin: "https://www.stgolftours.com",
        "Content-Type": "application/json",
        "CF-Connecting-IP": crypto.randomUUID(),
        ...headers,
      },
      body: JSON.stringify(body),
    });
  const auth = { "X-Test-Admin": "allowed" };
  const admin = (path, options = {}) =>
    mf.dispatchFetch("https://backend.example/admin/api/" + path, {
      ...options,
      headers: {
        ...auth,
        Origin: "https://backend.example",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  const check = (value, expected, label) => {
    assert.deepEqual(value, expected, label);
    count++;
  };
  const request = input();
  const response = await submit(request);
  check(response.status, 201, "stored");
  const receipt = await response.json();
  check(receipt.stored, true, "DB confirmation");
  const row = await db
    .prepare("SELECT * FROM inquiries WHERE request_key=?")
    .bind(request.requestKey)
    .first();
  assert(row);
  check(row.receipt, receipt.receipt, "server receipt");
  await mf.dispatchFetch("https://backend.example/__test/drain");
  check(
    (await db.prepare("SELECT count(*) AS n FROM test_sent").first()).n,
    1,
    "mail job",
  );
  const retry = await submit({
    ...request,
    payload: { ...payload, 접수시각: "later" },
    token: "",
  });
  check(retry.status, 200, "response loss replay with consumed token");
  check((await retry.json()).receipt, receipt.receipt, "same receipt");
  check(
    (await submit({ ...request, payload: { ...payload, 인원: "8명" } })).status,
    409,
    "key collision",
  );
  const parallel = input();
  const requests = await Promise.all(
    Array.from({ length: 5 }, () => submit(parallel)),
  );
  const receipts = await Promise.all(requests.map((r) => r.json()));
  check(
    new Set(receipts.map((r) => r.receipt)).size,
    1,
    "concurrent deduplication",
  );
  check(
    (
      await db
        .prepare("SELECT COUNT(*) AS n FROM inquiries WHERE request_key=?")
        .bind(parallel.requestKey)
        .first()
    ).n,
    1,
    "one row",
  );
  for (const [override, status] of [
    [{ consent: false }, 400],
    [{ token: "invalid" }, 400],
    [{ payload: { ...payload, 연락처: "bad" } }, 400],
    [{ payload: { ...payload, 인원: "0명" } }, 400],
    [{ payload: { ...payload, 요청사항: "a".repeat(25000) } }, 413],
  ])
    check((await submit(input(override))).status, status, "invalid input");
  check(
    (await submit(input(), { Origin: "https://evil.example" })).status,
    403,
    "origin denial",
  );
  check(
    (await mf.dispatchFetch("https://backend.example/admin/api/inquiries"))
      .status,
    401,
    "unauthorized read",
  );
  check(
    await (
      await mf.dispatchFetch("https://backend.example/__test/production-auth", {
        headers: {
          "Cf-Access-Authenticated-User-Email": "test-admin@example.invalid",
          "Cf-Access-Jwt-Assertion": "forged",
        },
      })
    ).text(),
    "null",
    "forged identity rejected",
  );
  let detail = await (await admin("inquiries/" + row.id)).json();
  check(detail.inquiry.request_key, undefined, "secret replay key withheld");
  check(
    (
      await admin("inquiries/" + row.id, {
        method: "PATCH",
        headers: { Origin: "https://evil.example" },
        body: JSON.stringify({ status: "consulting", note: "x", version: 1 }),
      })
    ).status,
    403,
    "CSRF denial",
  );
  check(
    (
      await admin("inquiries/" + row.id, {
        method: "PATCH",
        body: JSON.stringify({
          status: "consulting",
          note: "상담 메모",
          version: 1,
        }),
      })
    ).status,
    200,
    "update",
  );
  check(
    (
      await admin("inquiries/" + row.id, {
        method: "PATCH",
        body: JSON.stringify({ status: "booked", note: "stale", version: 1 }),
      })
    ).status,
    409,
    "optimistic locking",
  );
  check(
    (
      await db
        .prepare("SELECT COUNT(*) AS n FROM audit_events WHERE inquiry_id=?")
        .bind(row.id)
        .first()
    ).n,
    1,
    "no audit for stale write",
  );
  check(
    (
      await admin("inquiries/" + row.id + "/retry", {
        method: "POST",
        body: "{}",
      })
    ).status,
    409,
    "accepted mail never resent",
  );
  await db.exec("UPDATE test_mail SET mode='fail'");
  const failure = input();
  await submit(failure);
  await mf.dispatchFetch("https://backend.example/__test/drain");
  const failrow = await db
    .prepare("SELECT id FROM inquiries WHERE request_key=?")
    .bind(failure.requestKey)
    .first();
  let job = await db
    .prepare("SELECT * FROM notifications WHERE inquiry_id=?")
    .bind(failrow.id)
    .first();
  check(job.status, "retry", "mail failure retains enquiry");
  await db.exec("UPDATE test_mail SET mode='success'");
  await admin("inquiries/" + failrow.id + "/retry", {
    method: "POST",
    body: "{}",
  });
  await mf.dispatchFetch("https://backend.example/__test/drain");
  job = await db
    .prepare("SELECT * FROM notifications WHERE inquiry_id=?")
    .bind(failrow.id)
    .first();
  check(job.status, "accepted", "retry recovers");
  await db.exec("UPDATE test_mail SET mode='blocked'");
  const blocked = input();
  await submit(blocked);
  await mf.dispatchFetch("https://backend.example/__test/drain");
  const blockedRow = await db
    .prepare("SELECT id FROM inquiries WHERE request_key=?")
    .bind(blocked.requestKey)
    .first();
  check(
    (
      await db
        .prepare("SELECT status FROM notifications WHERE inquiry_id=?")
        .bind(blockedRow.id)
        .first()
    ).status,
    "blocked",
    "missing email config visible",
  );
  await db
    .prepare("UPDATE notifications SET first_attempt_at=? WHERE inquiry_id=?")
    .bind(Date.now() - 24 * 3600000, blockedRow.id)
    .run();
  check(
    (
      await admin("inquiries/" + blockedRow.id + "/retry", {
        method: "POST",
        body: "{}",
      })
    ).status,
    409,
    "expired provider dedup window",
  );
  // Force failure in the second statement; D1 must roll back the inquiry as well.
  await db.exec(
    "CREATE TRIGGER reject_job BEFORE INSERT ON notifications BEGIN SELECT RAISE(ABORT,'test rollback'); END;",
  );
  const rollback = input();
  check((await submit(rollback)).status, 503, "transaction error");
  check(
    await db
      .prepare("SELECT id FROM inquiries WHERE request_key=?")
      .bind(rollback.requestKey)
      .first(),
    null,
    "no partial inquiry",
  );
  await db.exec("DROP TRIGGER reject_job");
  const booking = input({
    payload: {
      접수번호: "STB-TEST",
      문의유형: "할인부킹",
      상품코드: "fourseven-geumgang",
      골프장: "포세븐 금강CC",
      희망날짜: "2026-12-20",
      희망부: "2부",
      인원: "단체 10팀",
      팀수: "10팀",
      예약자: "시험 단체",
      연락처: "01000000000",
    },
  });
  check((await submit(booking)).status, 201, "group booking");
  check(
    (await submit(input({ payload: { ...booking.payload, 팀수: "11팀" } })))
      .status,
    400,
    "invalid teams",
  );
  const list = await (await admin("inquiries?status=consulting")).json();
  check(list.items.length, 1, "status filter");
  check(list.items[0].phone, undefined, "list minimizes personal data");
  check(
    (await admin("inquiries?offset=-1")).status,
    400,
    "pagination validation",
  );
  const rateHeaders = { "CF-Connecting-IP": "same-client" };
  for (let i = 0; i < 20; i++)
    await submit(input({ token: "invalid" }), rateHeaders);
  check((await submit(input(), rateHeaders)).status, 429, "request limit");
  console.log(
    `PASS ${count} backend integration assertions: real local D1, no external email or customer data.`,
  );
} finally {
  await mf.dispose();
}
