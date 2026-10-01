"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { deliverQuote } from "@/lib/quote-delivery";
import { track } from "@/lib/analytics";
import { BOOKING_SESSIONS, bookingPayload, koreaToday, validateBooking, type BookingInquiry } from "@/lib/booking-inquiry";

export default function BookingInquiryForm({ course }: { course: { name: string; slug: string } }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const [values, setValues] = useState<BookingInquiry>({ date: "", session: "", name: "", phone: "", people: "4", memo: "", agree: false });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingInquiry, string>>>({});
  const [sending, setSending] = useState(false);
  const [ticket, setTicket] = useState("");
  const [failed, setFailed] = useState<{ body: string; subject: string } | null>(null);
  const [copied, setCopied] = useState("");
  const busy = useRef(false);
  const attempt = useRef<{ fingerprint: string; reference: string } | null>(null);
  const result = useRef<HTMLDivElement>(null);
  const set = (key: keyof BookingInquiry, value: string | boolean) => { setValues(v => ({ ...v, [key]: value })); setErrors(v => ({ ...v, [key]: undefined })); setCopied(""); };
  const error = (key: keyof BookingInquiry) => errors[key] ? <p id={`booking-${key}-error`} className="mt-2 text-sm text-red-700">{errors[key]}</p> : null;
  const attrs = (key: keyof BookingInquiry) => ({ "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `booking-${key}-error` : undefined });
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy.current || ticket) return;
    const invalid = validateBooking(values);
    setErrors(invalid);
    if (Object.keys(invalid).length) { e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(invalid)[0]}"]`)?.focus(); return; }
    busy.current = true; setSending(true); setFailed(null); setCopied("");
    const fingerprint = JSON.stringify({ ...values, course: course.slug });
    // Same reference for a retry: the provider can accept a request even if its reply times out.
    if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, reference: `STB-${koreaToday().replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}` };
    const reference = attempt.current.reference;
    const payload = bookingPayload(values, course, reference);
    const subject = `[에스티골프투어 할인부킹 ${reference}] ${course.name} · ${values.date} · ${values.session}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    track("quote_start", { kind: "discount_booking", product_id: course.slug });
    try {
      await deliverQuote({ subject, email: "", payload: { ...payload, 접수시각: new Date().toISOString() }, signal: controller.signal });
      setTicket(reference);
      track("quote_submit_success", { kind: "discount_booking", product_id: course.slug });
    } catch {
      setFailed({ subject, body: ["[할인부킹 요청 · 접수 확인 필요]", "아래 참조번호로 중복 접수 여부를 먼저 확인해주세요.", ...Object.entries(payload).map(([k, v]) => `${k === "접수번호" ? "요청 참조번호" : k}: ${v}`)].join("\n") });
      track("quote_submit_error", { kind: "discount_booking", product_id: course.slug });
    } finally {
      clearTimeout(timer); busy.current = false; setSending(false);
      requestAnimationFrame(() => { result.current?.focus(); });
    }
  }
  if (ticket) return <div ref={result} tabIndex={-1} role="status" className="quote-form rounded-3xl bg-white border border-line p-6 sm:p-8 shadow-soft">
    <p className="eyebrow text-royaldark">할인부킹 문의 접수</p><h2 className="headline text-2xl my-3">문의가 접수되었습니다</h2>
    <p className="text-sm text-mute break-all">접수번호 <strong className="text-navy">{ticket}</strong></p>
    <div className="rounded-xl bg-paper p-4 my-5"><p className="font-bold">{course.name}</p><p className="mt-1">{values.date} · {values.session} · {values.people === "단체" ? "단체" : `${values.people}명`}</p></div>
    <p>담당자가 예약 가능 여부와 할인 금액을 확인해 남겨주신 연락처로 안내드립니다.</p><p className="mt-3 font-bold text-royaldark">아직 예약이 확정된 상태는 아닙니다.</p>
    <a href={site.phoneHref} className="btn btn-light mt-6 w-full">전화 상담 {site.phone}</a><p className="mt-4 text-xs text-mute">{site.company.hours}</p>
  </div>;
  return <form method="post" noValidate onSubmit={submit} className="quote-form rounded-3xl border border-line bg-white p-5 sm:p-8 shadow-soft" aria-label="할인부킹 문의" aria-busy={sending}>
    <p className="eyebrow text-royaldark">금액은 문의로 안내</p><h2 className="headline text-2xl mt-2">내 날짜의 할인 금액 받기</h2><p className="text-sm text-mute mt-3 mb-6">{course.name} · 가능 여부 확인 후 연락드립니다.</p>
    <noscript><p className="mb-5 rounded-xl bg-paper p-4">문의 양식을 사용하려면 자바스크립트를 켜주세요. 전화 <a href={site.phoneHref} className="underline">{site.phone}</a>로도 할인 금액을 문의할 수 있습니다.</p></noscript>
    <fieldset disabled={sending || !ready} className="space-y-5 min-w-0">
      <div><label htmlFor="booking-date" className="block font-bold mb-2">희망 날짜 <span className="text-royal">*</span></label><input id="booking-date" name="date" type="date" min={koreaToday()} value={values.date} onChange={e => set("date", e.target.value)} className="field w-full min-h-12" required {...attrs("date")} />{error("date")}</div>
      <div><p id="booking-session-label" className="font-bold mb-2">희망 부 <span className="text-royal">*</span></p><div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="booking-session-label" {...attrs("session")}>{BOOKING_SESSIONS.map(s => <button name="session" key={s} type="button" className="choice min-h-12 !px-2" data-on={values.session === s} aria-pressed={values.session === s} onClick={() => set("session", s)}>{s}</button>)}</div>{error("session")}<p className="text-xs text-mute mt-2">희망 시간대입니다. 운영 부와 정확한 티타임은 확인 후 안내합니다.</p></div>
      <div><label htmlFor="booking-people" className="block font-bold mb-2">인원</label><select id="booking-people" name="people" value={values.people} onChange={e => set("people", e.target.value)} className="field w-full min-h-12" {...attrs("people")}><option value="2">2명</option><option value="3">3명</option><option value="4">4명</option><option value="단체">단체 · 여러 팀</option></select>{error("people")}</div>
      <div className="grid sm:grid-cols-2 gap-4"><div><label htmlFor="booking-name" className="block font-bold mb-2">예약자 <span className="text-royal">*</span></label><input id="booking-name" name="name" autoComplete="name" maxLength={40} value={values.name} onChange={e => set("name", e.target.value)} className="field w-full min-h-12" placeholder="성함" required {...attrs("name")} />{error("name")}</div><div><label htmlFor="booking-phone" className="block font-bold mb-2">연락처 <span className="text-royal">*</span></label><input id="booking-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={values.phone} onChange={e => set("phone", e.target.value)} className="field w-full min-h-12" placeholder="010-0000-0000" required {...attrs("phone")} />{error("phone")}</div></div>
      <div><label htmlFor="booking-memo" className="block font-bold mb-2">요청사항 <span className="font-normal text-sm text-mute">선택</span></label><textarea id="booking-memo" name="memo" rows={2} maxLength={500} value={values.memo} onChange={e => set("memo", e.target.value)} placeholder="예: 2부 중 오후 1시 이후, 3팀 희망" className="field w-full" {...attrs("memo")} />{error("memo")}</div>
      <div className="rounded-xl bg-paper p-4 text-sm"><p className="font-semibold">개인정보 수집·이용 안내</p><p className="mt-2 text-mute">이름·연락처·부킹 조건을 가능 여부 확인과 금액 안내에 사용하며 상담 완료 후 1년간 보관합니다. Formspree에 저장되어 담당자 이메일로 전달됩니다.</p><Link href="/privacy/#quote-processing" target="_blank" className="inline-block py-2 underline">접수 처리 및 개인정보 안내 보기</Link><label className="flex items-start gap-3 py-2 cursor-pointer"><input name="agree" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0" checked={values.agree} onChange={e => set("agree", e.target.checked)} required {...attrs("agree")} /><span>[필수] 개인정보 수집·이용에 동의합니다.</span></label>{error("agree")}</div>
      <button type="submit" className="btn btn-royal w-full min-h-14">{sending ? "접수 확인 중…" : "할인 금액 · 가능 여부 문의"}</button><p className="text-xs text-center text-mute">문의는 무료이며, 접수만으로 예약·결제가 진행되지 않습니다.</p>
    </fieldset>
    {failed && <div ref={result} tabIndex={-1} role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4"><h3 className="font-bold">접수 여부를 확인하지 못했습니다</h3><p className="text-sm mt-2">입력 내용은 남아 있습니다. 중복 문의를 피하려면 아래 참조번호로 전화 확인해 주세요. 또는 요청 내용을 복사해 전달할 수 있습니다.</p><textarea aria-label="전달할 할인부킹 요청 내용" readOnly value={failed.body} rows={7} className="field mt-3 w-full text-sm" /><div className="flex flex-wrap gap-2 mt-3"><button type="button" className="btn btn-light" onClick={async () => { try { await navigator.clipboard.writeText(failed.body); setCopied("복사했습니다."); } catch { setCopied("위 내용을 직접 선택해 복사해주세요."); } }}>요청 내용 복사</button><a href={site.phoneHref} className="btn btn-light">전화로 확인</a><a href={`mailto:${site.email}?subject=${encodeURIComponent(failed.subject)}&body=${encodeURIComponent(failed.body)}`} className="btn btn-light">메일 앱으로 전달</a></div><p className="text-sm mt-2" role="status">{copied}</p></div>}
    <p className="mt-5 text-xs text-mute">전화 {site.phone} · {site.company.hours}</p>
  </form>;
}
