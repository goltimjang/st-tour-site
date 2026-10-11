import { HttpError, type Dependencies, type Env } from "./types";

const action = "operator-mail-domain-test-20261011";
const requestKey = "2de2cdda-2288-42b7-a48c-b9b90b093247";

// One approved operator-only message. Claim is durable even if delivery is ambiguous.
// No inquiry, notification queue or Alimtalk job is created or retried here.
export async function mailTest(
  request: Request,
  env: Env,
  deps: Dependencies,
  actor: string,
) {
  const expires = Date.parse(env.MAIL_TEST_EXPIRES_AT || "");
  if (
    !Number.isFinite(expires) ||
    expires <= Date.now() ||
    expires > Date.now() + 3600000 ||
    env.INTAKE_ENABLED !== "false" ||
    env.ALIMTALK_ENABLED !== "false" ||
    env.TEST_INTAKE_ENABLED !== "false" ||
    env.MAIL_TO !== "goltimjang@gmail.com" ||
    env.MAIL_FROM !==
      "에스티골프투어 접수 알림 <inquiries@notify.stgolftours.com>"
  )
    throw new HttpError(503, "mail_test_disabled");
  const inquiry = await env.DB.prepare(
    "SELECT id,receipt FROM inquiries WHERE request_key=?",
  )
    .bind(requestKey)
    .first<{ id: string; receipt: string }>();
  if (!inquiry) throw new HttpError(409, "test_inquiry_missing");
  if (request.method === "GET") {
    return new Response(
      `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>운영 메일 인증 시험</title><link rel="stylesheet" href="/admin/admin.css"><script src="/admin/mail-test.js" defer></script><body><main><h1>운영 메일 인증 시험</h1><p>발신: inquiries@notify.stgolftours.com</p><p>수신: goltimjang@gmail.com</p><p>기존 시험 접수 ${inquiry.receipt}의 메일만 1건 보냅니다. 추가 접수나 카카오톡 발송은 없습니다.</p><form id="mail-test-form" method="post"><button type="submit">승인된 운영 메일 1건 보내기</button></form><p id="mail-test-result" role="status"></p><p><a href="/admin/">관리자 접수함</a></p></main></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
  if (request.method !== "POST") throw new HttpError(405, "method_not_allowed");
  const claim = await env.DB.prepare(
    `INSERT INTO audit_events(inquiry_id,actor,action,created_at) SELECT ?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM audit_events WHERE inquiry_id=? AND action=?) RETURNING id`,
  )
    .bind(inquiry.id, actor, action, Date.now(), inquiry.id, action)
    .first();
  if (!claim)
    return Response.json(
      { ok: false, error: "mail_test_already_attempted" },
      { status: 409 },
    );
  try {
    const result = await deps.send(
      env,
      `${inquiry.receipt} (발신 인증 시험)`,
      action,
    );
    await env.DB.prepare(
      "INSERT INTO audit_events(inquiry_id,actor,action,created_at) VALUES(?,?,?,?)",
    )
      .bind(inquiry.id, actor, `${action}:accepted:${result.id}`, Date.now())
      .run();
    return Response.json({
      ok: true,
      status: "accepted",
      providerId: result.id,
      receipt: inquiry.receipt,
    });
  } catch {
    throw new HttpError(503, "mail_test_result_requires_review");
  }
}
