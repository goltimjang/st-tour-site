import { HttpError, type Env } from "./types";

export function ownerTestReady(env: Env) {
  const expires = Date.parse(env.TEST_EXPIRES_AT || "");
  if (
    env.TEST_INTAKE_ENABLED !== "true" ||
    !Number.isFinite(expires) ||
    expires <= Date.now() ||
    expires > Date.now() + 24 * 3600000 ||
    env.INTAKE_ENABLED !== "false" ||
    env.ALIMTALK_ENABLED !== "false"
  )
    throw new HttpError(503, "owner_test_disabled");
  if (
    !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
      env.TEST_REQUEST_KEY || "",
    ) ||
    !/^010\d{8}$/.test(env.TEST_PHONE || "") ||
    !env.TURNSTILE_SITE_KEY ||
    !env.TURNSTILE_SECRET ||
    !env.RATE_SALT ||
    !env.SOLAPI_API_KEY ||
    !env.SOLAPI_API_SECRET ||
    !env.RESEND_API_KEY ||
    !env.MAIL_FROM ||
    env.MAIL_TO !== "goltimjang@gmail.com"
  )
    throw new HttpError(503, "owner_test_not_configured");
}

// Recipient, request key and test conditions are server-owned. The browser cannot
// turn this into a general send endpoint or create another inquiry by changing a UUID.
export function ownerTestInput(env: Env, body: Record<string, unknown>) {
  ownerTestReady(env);
  if (body.consent !== true) throw new HttpError(400, "consent_required");
  return {
    requestKey: env.TEST_REQUEST_KEY,
    token: body.token,
    consent: true,
    consentVersion: "2026-10-11-backend-v2",
    email: "",
    payload: {
      접수번호: "OWNER-E2E-TEST",
      type: "해외 골프투어",
      지역: "베트남 · 하노이",
      희망시기: "미정",
      인원: "4명",
      이름: "운영자 종단 시험",
      연락처: env.TEST_PHONE,
      요청사항: "운영자 승인 시험 접수 1건. 실제 상담·예약 요청이 아닙니다.",
    },
  };
}

export function ownerTestPage() {
  return new Response(
    `<!doctype html><html lang="ko"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>시험 접수 | 에스티골프투어</title>
<link rel="stylesheet" href="/admin/admin.css">
<script src="/admin/owner-test.js" defer></script></head><body>
<header><strong>에스티골프투어 · 관리자 시험 접수</strong><a href="/admin/">접수함으로</a></header>
<main><h1>접수부터 알림까지 확인</h1>
<p>승인된 본인 번호로만 시험 접수 1건을 생성합니다. 베트남 하노이 · 일정 미정 · 4명 조건으로 공통 접수 검증을 거칩니다.</p>
<p>운영 메일에는 접수번호와 관리자 주소만 보냅니다. 알림톡에는 접수번호를 넣으며 문자로 대체하지 않습니다.</p>
<p id="setup" role="status">연결 상태 확인 중</p>
<form id="test-form" hidden><label><input type="checkbox" id="consent" required> 시험 연락처를 Cloudflare에 저장하고 SOLAPI·카카오로 알림톡 1건을 보내는 데 동의합니다.</label>
<div id="captcha"></div><button type="submit" id="submit" disabled>승인된 시험 접수 1건 보내기</button></form>
<p id="result" role="status" aria-live="polite"></p>
<p>저장 완료, 발송 서비스 접수, 실제 메일·카카오톡 수신은 각각 확인합니다.</p>
</main></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
