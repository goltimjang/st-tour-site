import { NextResponse } from "next/server";

/**
 * 견적 접수 API
 * - 접수 내용을 운영자 이메일로 전달 (FormSubmit 무료 릴레이 — 첫 접수 시
 *   QUOTE_TO_EMAIL 수신함에 도착하는 활성화 메일을 1회 승인해야 합니다)
 * - Phase 2: 카카오 알림톡 + Google Sheets 기록으로 확장 예정
 */

const TO_EMAIL = process.env.QUOTE_TO_EMAIL || "caddiewow@gmail.com";

export async function POST(req: Request) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  // 최소 검증
  if (!data["이름"] || !data["연락처"] || !data["type"]) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const subject = `[에스티투어 견적] ${data["type"]} · ${data["지역"] ?? ""} · ${data["이름"]}님 (${data["인원"] ?? ""})`;

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${TO_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        ...data,
        접수시각: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
      }),
    });
    if (!res.ok) throw new Error(`formsubmit ${res.status}`);
    console.log("[quote] delivered:", subject);
    return NextResponse.json({ ok: true });
  } catch (e) {
    // 전달 실패 시 사용자에게 실패를 알려 전화 폴백을 유도 (리드 유실 방지)
    console.error("[quote] delivery FAILED:", subject, e);
    return NextResponse.json({ ok: false, error: "delivery failed" }, { status: 502 });
  }
}
