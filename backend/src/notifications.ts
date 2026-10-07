import type { Dependencies, Env } from "./types";
export async function send(env: Env, receipt: string, key: string) {
  if (
    !env.RESEND_API_KEY ||
    !env.MAIL_FROM ||
    !env.MAIL_TO ||
    !env.ADMIN_ORIGIN
  )
    throw new Error("mail_not_configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": key,
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [env.MAIL_TO],
      subject: `[에스티골프투어] 새 문의 ${receipt}`,
      text: `새 문의가 저장되었습니다.\n접수번호: ${receipt}\n관리자 접수함: ${env.ADMIN_ORIGIN}/admin/\n\n고객 연락처와 여행 조건은 로그인 후 확인하세요.`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok)
    throw new Error(
      response.status === 429 || response.status >= 500
        ? "mail_temporary_error"
        : "mail_rejected",
    );
  const data = (await response.json()) as { id?: string };
  if (!data.id) throw new Error("mail_invalid_response");
  return { id: data.id };
}
export async function drain(env: Env, deps: Dependencies) {
  const now = Date.now();
  const { results } = await env.DB.prepare(
    `SELECT inquiry_id FROM notifications WHERE (status IN ('pending','retry') AND next_at<=?) OR (status='processing' AND lease_until<=?) ORDER BY next_at LIMIT 20`,
  )
    .bind(now, now)
    .all<{ inquiry_id: string }>();
  for (const { inquiry_id: id } of results) {
    const token = crypto.randomUUID();
    const claim = await env.DB.prepare(
      `UPDATE notifications SET status='processing',lease_token=?,lease_until=?,attempts=attempts+1,first_attempt_at=COALESCE(first_attempt_at,?),updated_at=? WHERE inquiry_id=? AND ((status IN ('pending','retry') AND next_at<=?) OR (status='processing' AND lease_until<=?)) RETURNING attempts,first_attempt_at`,
    )
      .bind(token, now + 120000, now, now, id, now, now)
      .first<{ attempts: number; first_attempt_at: number }>();
    if (!claim) continue;
    let state = "retry",
      provider: string | null = null,
      error: string | null = null;
    if (now - claim.first_attempt_at >= 23 * 3600000 || claim.attempts > 5) {
      state = "failed";
      error = "manual_review_required";
    } else {
      try {
        const inquiry = await env.DB.prepare(
          "SELECT receipt FROM inquiries WHERE id=?",
        )
          .bind(id)
          .first<{ receipt: string }>();
        if (!inquiry) throw new Error("inquiry_missing");
        provider = (
          await deps.send(env, inquiry.receipt, `inquiry-notice/${id}`)
        ).id;
        state = "accepted"; // Provider accepted. This does not assert inbox delivery.
      } catch (e) {
        const code = e instanceof Error ? e.message : "";
        error = [
          "mail_not_configured",
          "mail_rejected",
          "mail_temporary_error",
          "mail_invalid_response",
        ].includes(code)
          ? code
          : "mail_transport_error";
        state =
          error === "mail_not_configured"
            ? "blocked"
            : error === "mail_rejected" || claim.attempts >= 5
              ? "failed"
              : "retry";
      }
    }
    await env.DB.prepare(
      `UPDATE notifications SET status=?,provider_id=?,error_code=?,next_at=?,lease_until=0,lease_token=NULL,attempts=CASE WHEN ?='blocked' THEN MAX(0,attempts-1) ELSE attempts END,first_attempt_at=CASE WHEN ?='blocked' AND attempts=1 THEN NULL ELSE first_attempt_at END,updated_at=? WHERE inquiry_id=? AND lease_token=?`,
    )
      .bind(
        state,
        provider,
        error,
        now + Math.min(60, 5 * 2 ** (claim.attempts - 1)) * 60000,
        state,
        state,
        Date.now(),
        id,
        token,
      )
      .run();
  }
  await env.DB.prepare("DELETE FROM rate_limits WHERE expires_at<?")
    .bind(now)
    .run();
}
