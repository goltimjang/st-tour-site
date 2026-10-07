import { HttpError } from "./types";
export async function readJson(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new HttpError(415, "json_required");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "body_required");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 24576) {
        await reader.cancel();
        throw new HttpError(413, "body_too_large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const part of chunks) {
    bytes.set(part, offset);
    offset += part.length;
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new HttpError(400, "invalid_json");
  }
}
const allowed = new Set([
  "접수번호",
  "상품",
  "상품코드",
  "상품구성확인사항",
  "type",
  "지역",
  "희망시기",
  "인원",
  "기간",
  "총라운드",
  "1일 라운드",
  "숙박",
  "항공",
  "숙박수준",
  "가는편_출발희망시간",
  "오는편_출발희망시간",
  "항공시간기준",
  "예산",
  "선호골프장",
  "요청사항",
  "이름",
  "연락처",
  "이메일",
  "접수시각",
  "문의유형",
  "골프장",
  "예약자",
  "희망날짜",
  "희망부",
  "팀수",
  "개인정보동의",
  "접수상태",
]);
export function validate(body: unknown) {
  const bad = () => new HttpError(400, "invalid_inquiry");
  if (!body || typeof body !== "object" || Array.isArray(body)) throw bad();
  const b = body as Record<string, unknown>;
  if (b.consent !== true || b.consentVersion !== "2026-10-backend-v1")
    throw new HttpError(400, "consent_required");
  if (
    typeof b.requestKey !== "string" ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
      b.requestKey,
    )
  )
    throw bad();
  if (typeof b.token !== "string" || b.token.length > 2048) throw bad();
  if (!b.payload || typeof b.payload !== "object" || Array.isArray(b.payload))
    throw bad();
  const entries = Object.entries(b.payload);
  if (entries.length > 40) throw bad();
  const p: Record<string, string> = {};
  for (const [k, v] of entries) {
    if (
      !allowed.has(k) ||
      typeof v !== "string" ||
      v.length > 3000 ||
      v.includes("\u0000")
    )
      throw bad();
    p[k] = v.trim();
  }
  const kind = p.문의유형 === "할인부킹" ? "booking" : "tour";
  const name = p.예약자 || p.이름 || "";
  const phone = (p.연락처 || "").replace(/[\s()-]/g, "");
  const email = typeof b.email === "string" ? b.email.trim() : "";
  if (
    !name ||
    name.length > 80 ||
    !/^0\d{8,10}$/.test(phone) ||
    email.length > 254 ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  )
    throw bad();
  if (!p.접수번호 || p.접수번호.length > 100 || !p.인원) throw bad();
  if (kind === "booking") {
    if (
      !p.골프장 ||
      !p.상품코드 ||
      !["1부", "2부", "3부", "시간대 무관"].includes(p.희망부)
    )
      throw bad();
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(p.희망날짜) ||
      Number.isNaN(Date.parse(p.희망날짜)) ||
      new Date(p.희망날짜).toISOString().slice(0, 10) !== p.희망날짜
    )
      throw bad();
    if (
      !["3명", "4명"].includes(p.인원) &&
      !/^단체 (?:[1-9]|10)팀$/.test(p.인원)
    )
      throw bad();
    if (p.인원.startsWith("단체 ") && p.인원 !== `단체 ${p.팀수}`) throw bad();
    if (p.인원.startsWith("단체") && !/^(?:[1-9]|10)팀$/.test(p.팀수))
      throw bad();
  } else if (
    !["국내 골프투어", "해외 골프투어"].includes(p.type) ||
    !p.지역 ||
    !p.희망시기 ||
    !/^\d{1,3}명$/.test(p.인원) ||
    parseInt(p.인원) < 1
  )
    throw bad();
  // The client timestamp is display data only. Database time is always server time.
  const stable = Object.fromEntries(
    Object.entries(p)
      .filter(([k]) => k !== "접수시각")
      .sort(([a], [b]) => a.localeCompare(b)),
  );
  return {
    requestKey: b.requestKey,
    token: b.token,
    kind,
    name,
    phone,
    email,
    payload: p,
    consentVersion: b.consentVersion,
    canonical: JSON.stringify({
      payload: stable,
      email,
      consentVersion: b.consentVersion,
    }),
  };
}
