export const BOOKING_SESSIONS = ["1부", "2부", "3부", "시간대 무관"] as const;
export type BookingInquiry = { date: string; session: string; name: string; phone: string; people: string; memo: string; agree: boolean };
export function koreaToday(now = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function validateBooking(input: BookingInquiry, today = koreaToday()) {
  const errors: Partial<Record<keyof BookingInquiry, string>> = {};
  const date = new Date(`${input.date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== input.date || input.date < today) errors.date = "오늘 이후의 희망 날짜를 선택해주세요.";
  if (!(BOOKING_SESSIONS as readonly string[]).includes(input.session)) errors.session = "희망 부 또는 시간대 무관을 선택해주세요.";
  if (!input.name.trim() || input.name.trim().length > 40) errors.name = "예약자 이름을 40자 이내로 입력해주세요.";
  if (!/^01[016789]\d{7,8}$/.test(input.phone.replace(/[\s()-]/g, ""))) errors.phone = "연락받으실 휴대전화 번호를 확인해주세요.";
  if (!["2", "3", "4", "단체"].includes(input.people)) errors.people = "인원을 선택해주세요.";
  if (input.memo.length > 500) errors.memo = "요청사항은 500자 이내로 입력해주세요.";
  if (!input.agree) errors.agree = "개인정보 수집·이용 안내를 확인하고 동의해주세요.";
  return errors;
}
export function bookingPayload(input: BookingInquiry, course: { slug: string; name: string }, reference: string) {
  return {
    접수번호: reference, 문의유형: "할인부킹", 상품코드: course.slug, 골프장: course.name,
    희망날짜: input.date, 희망부: input.session, 인원: input.people === "단체" ? "단체 (별도 상담)" : `${input.people}명`,
    예약자: input.name.trim(), 연락처: input.phone.replace(/[\s()-]/g, ""), 요청사항: input.memo.trim() || "없음",
    접수상태: "예약 가능 여부 및 할인 금액 확인 요청 (예약 미확정)", 개인정보동의: "동의",
  };
}
