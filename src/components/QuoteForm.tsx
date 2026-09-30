"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { site } from "@/data/site";
import DestinationRegionChoices from "@/components/DestinationRegionChoices";
import { destinations, validDestinationRegion } from "@/data/destinations";
import Calendar, { stayLabel } from "@/components/Calendar";
import CoursePicker, { type PickItem } from "@/components/CoursePicker";
import krCourses from "@/data/golf-courses.json";
import ovCourses from "@/data/overseas-courses.json";

type Props = {
  type: "domestic" | "overseas";
  /** 골프장 리스트에서 "이 골프장으로 견적받기"로 진입 시 미리 채움 */
  prefillCourse?: string;
  prefillRegion?: string;
  /** 국가 페이지에서 진입 시 국가 미리 선택 */
  prefillCountry?: string;
  inquiryProduct?: { id: string; title: string; country: string; area: string; duration?: string; notice?: string };
  product?: { id: string; title: string; country: string; start: string; end: string; duration: string; course: string };
};

const REGIONS = ["수도권", "강원", "충청", "호남", "영남", "제주"];

// 1단계에서 고른 국가명 -> 해외 골프장 데이터의 국가 슬러그
const COUNTRY_SLUG: Record<string, string> = {
  일본: "japan", 태국: "thailand", 베트남: "vietnam", 중국: "china", 필리핀: "philippines",
  대만: "taiwan", 말레이시아: "malaysia", "괌·사이판": "guam", 인도네시아: "indonesia",
  라오스: "laos", 몽골: "mongolia", "하와이·미국": "usa", "호주·뉴질랜드": "australia",
};

function ctryFromUrl(q: URLSearchParams) {
  return q.get("country");
}

type KrCourse = { name: string; sido: string; city: string; region: string; type: string | null };
type OvCourse = { country: string; area: string; name: string; city?: string | null; holes?: number | null };
const PEOPLE_MIN = 1;
const BUDGETS_DOM = ["30만원 이하", "30~50만원", "50~80만원", "80만원 이상", "상담하며 정할게요"];
const BUDGETS_OVS = ["60만원 이하", "60~100만원", "100~150만원", "150만원 이상", "상담하며 정할게요"];

export default function QuoteForm({ type, prefillCourse, prefillRegion, prefillCountry, product, inquiryProduct }: Props) {
  const isDom = type === "domestic";

  const boxRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const startedRef = useRef(false);
  const [step, setStep] = useState(1);

  /** 단계를 바꾸면 폼 상단이 화면에 오도록 맞춘다 (긴 폼에서 엉뚱한 위치로 가는 것 방지) */
  function goStep(next: number) {
    if (next > 1 && !startedRef.current) { track("quote_start", { kind: type, product_id: product?.id ?? inquiryProduct?.id ?? "custom" }); startedRef.current = true; }
    setStep(next);
    track("quote_step", { step: next, kind: type });
    requestAnimationFrame(() => {
      const el = boxRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 90; // 고정 헤더 여유
      window.scrollTo({ top, behavior: "instant" });
      el.focus({ preventScroll: true });
    });
  }
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [regions, setRegions] = useState<string[]>(prefillRegion ? [prefillRegion] : []);
  const [country, setCountry] = useState(product?.country ?? inquiryProduct?.country ?? prefillCountry ?? "");
  const [area, setArea] = useState(inquiryProduct?.area ?? "");
  const [dateMode, setDateMode] = useState<"date" | "flexible">("date");
  const [dateStart, setDateStart] = useState(product?.start ?? "");
  const [dateEnd, setDateEnd] = useState(product?.end ?? "");
  const [flexTime, setFlexTime] = useState("");
  const [people, setPeople] = useState(4);

  // Step 2
  const [duration, setDuration] = useState(product?.duration ?? (inquiryProduct?.duration?.includes("·") ? "" : inquiryProduct?.duration) ?? "");
  const [rounds, setRounds] = useState("");
  const [lodging, setLodging] = useState(""); // 국내: 숙박 필요 여부 / 해외: 숙박 수준
  const [flight, setFlight] = useState(product ? "항공 포함" : inquiryProduct ? "항공 불포함" : "");
  const [budget, setBudget] = useState("");
  const [course, setCourse] = useState(product?.course ?? prefillCourse ?? "");
  const [memo, setMemo] = useState("");

  // Step 3
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [ticket, setTicket] = useState("");
  const [restored, setRestored] = useState(false);
  const draftKey = `st-quote-v3-${type}-${product?.id ?? inquiryProduct?.id ?? prefillCountry ?? "general"}`;
  const [draftNotice, setDraftNotice] = useState(false);

  // 국가·상품별 초안. 연락처·성함·이메일은 기기에 저장하지 않는다.
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const fromUrl = !product && !inquiryProduct && ["region", "country", "area", "start", "flexible", "picked"].some((k) => q.has(k));
      const raw = !fromUrl && localStorage.getItem(draftKey);
      if (raw) {
        const d = JSON.parse(raw);
        const compatible = !prefillCountry || d.country === prefillCountry;
        if (compatible && d.savedAt > Date.now() - 7 * 86400000) {
          if (Array.isArray(d.regions)) setRegions(d.regions.filter((r: string) => [...REGIONS, "추천 받고 싶어요"].includes(r)));
          if (!product && !inquiryProduct && typeof d.country === "string") {
            setCountry(d.country);
            setArea(validDestinationRegion(d.country, d.area));
          }
          if (!product && ["date", "flexible"].includes(d.dateMode)) setDateMode(d.dateMode);
          if (!product && typeof d.dateStart === "string") setDateStart(d.dateStart);
          if (!product && typeof d.dateEnd === "string") setDateEnd(d.dateEnd);
          if (!product && typeof d.flexTime === "string") setFlexTime(d.flexTime);
          if (Number.isInteger(d.people) && d.people >= 1 && d.people <= 999) setPeople(d.people);
          for (const [key, setter] of [["duration", setDuration], ["rounds", setRounds], ["lodging", setLodging], ["flight", setFlight], ["budget", setBudget], ["course", setCourse]] as const) {
            if (typeof d[key] === "string" && !product && !(inquiryProduct && key === "flight")) setter(d[key]);
          }
          setDraftNotice(true);
          // 복원해도 첫 단계에서 조건을 다시 확인한다.
        }
      }
      if (fromUrl) {
        const region = q.get("region");
        const ctry = q.get("country");
        const st = q.get("start");
        const en = q.get("end");
        if (isDom && region) setRegions(region.split(",").filter((r) => [...REGIONS, "추천 받고 싶어요"].includes(r)));
        if (!isDom && ctry && (!prefillCountry || prefillCountry === ctry) && (destinations.some((d) => d.name === ctry) || ctry === "추천 받고 싶어요")) setCountry(ctry);
        if (!isDom && (!ctry || !prefillCountry || prefillCountry === ctry)) {
          setArea(validDestinationRegion(prefillCountry || ctry || "", q.get("area")));
        }
        if (st && /^\d{4}-\d{2}-\d{2}$/.test(st)) setDateStart(st);
        if (en && /^\d{4}-\d{2}-\d{2}$/.test(en)) setDateEnd(en);
        if (q.get("flexible") === "1") { setDateMode("flexible"); setFlexTime("미정 (상담 후 결정)"); }
      }
      const picked = q.get("picked") === "1" ? localStorage.getItem("st-picked") : null;
      if (picked && !product && !inquiryProduct) {
        const p = JSON.parse(picked);
        const intendedCountry = prefillCountry || ctryFromUrl(q);
        if (p && p.kind === type && Array.isArray(p.names) && (isDom || !intendedCountry || intendedCountry === p.country)) {
          setCourse(p.names.filter((n: unknown) => typeof n === "string").join(", "));
          if (!isDom && p.country && !intendedCountry) setCountry(p.country);
          if (isDom && Array.isArray(p.regions)) setRegions(p.regions.filter((r: string) => REGIONS.includes(r)));
        }
      }
    } catch { /* 손상된 초안은 새 양식으로 시작한다. */ }
    setRestored(true);
  }, [draftKey, isDom, prefillCountry, product, inquiryProduct, type]);

  useEffect(() => {
    if (!restored || done) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify({ savedAt: Date.now(), regions, country, area, dateMode, dateStart, dateEnd, flexTime, people, duration, rounds, lodging, flight, budget, course }));
    } catch { /* 저장 불가 환경에서도 견적 접수는 사용할 수 있다. */ }
  }, [restored, done, regions, country, area, dateMode, dateStart, dateEnd, flexTime, people, duration, rounds, lodging, flight, budget, course, draftKey]);

  // 달력 선택 시 "○박 ○일" 자동 계산 (출발·도착 모두 선택해야 완성)
  const stay = dateMode === "date" ? (product?.duration ?? stayLabel(dateStart, dateEnd)) : "";
  // 1단계 선택에 맞춘 골프장 선택기 범위
  const pickScope = useMemo(() => {
    if (isDom) {
      const rs = regions.length > 0 ? regions : REGIONS;
      const items: PickItem[] = (krCourses as KrCourse[])
        .filter((c) => rs.includes(c.region))
        .map((c) => ({ name: c.name, sub: `${c.sido} ${c.city}${c.type ? ` · ${c.type}` : ""}`, group: c.region }));
      return { items, groups: rs, label: regions.length > 0 ? regions.join("·") : "전국" };
    }
    const slug = COUNTRY_SLUG[country];
    if (!slug) return null; // 목록 없는 국가는 직접 입력만
    const list = (ovCourses as OvCourse[]).filter((c) => c.country === slug);
    if (list.length === 0) return null;
    const items: PickItem[] = list.map((c) => ({
      name: c.name,
      sub: `${c.area}${c.city && c.city !== c.area ? ` · ${c.city}` : ""}${c.holes ? ` · ${c.holes}홀` : ""}`,
      group: c.area,
    }));
    return { items, groups: Array.from(new Set(list.map((c) => c.area))), label: country };
  }, [isDom, regions, country]);

  const whenLabel =
    inquiryProduct ? (dateMode === "flexible" ? `${flexTime || "미정 (상담 후 결정)"} · ${duration || "기간 상담 후 결정"}` : dateStart && dateStart >= new Date().toLocaleDateString("sv-SE") ? `${dateStart} 출발 · ${duration || "기간 상담 후 결정"}` : "") : dateMode === "date"
      ? dateStart && dateEnd && dateEnd >= dateStart
        ? `${dateStart.replace(/-/g, ". ")} 출발 ~ ${dateEnd.replace(/-/g, ". ")} 도착 (${stay})`
        : ""
      : flexTime;
  const step1Ok = isDom
    ? regions.length > 0 && whenLabel && people >= PEOPLE_MIN
    : country && whenLabel && people >= PEOPLE_MIN;
  const phoneOk = /^0\d{8,10}$/.test(phone.replace(/[\s()-]/g, ""));
  const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const step3Ok = Boolean(step1Ok) && name.trim().length >= 1 && phoneOk && emailOk && agree;

  const destinationLabel = isDom ? regions.join(", ") : [country, area].filter(Boolean).join(" · ");

  function selectCountry(next: string) {
    if (next === country) return;
    setCountry(next);
    setArea("");
    setCourse("");
  }

  function toggleRegion(r: string) {
    setRegions((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  async function submit() {
    if (sendingRef.current || !step3Ok) return;
    sendingRef.current = true;
    setSending(true);
    setError("");
    const now = new Date();
    const no = `ST-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const payload = {
      접수번호: no,
      상품: product?.title ?? inquiryProduct?.title ?? "맞춤 골프투어",
      ...(inquiryProduct ? { 상품코드: inquiryProduct.id, 상품구성확인사항: inquiryProduct.notice || "출발일별 현지 구성 확인" } : {}),
      type: isDom ? "국내 골프투어" : "해외 골프투어",
      지역: destinationLabel,
      희망시기: whenLabel,
      인원: `${people}명`,
      기간: stay || duration || "미정",
      ...(product ? { 총라운드: "54홀 (18홀 × 3회)" } : {}),
      "1일 라운드": rounds || "미정",
      ...(isDom ? { 숙박: lodging || "미정" } : { 항공: inquiryProduct ? "항공 불포함 (현지 일정 견적)" : flight || "미정", 숙박수준: lodging || "미정" }),
      예산: budget || "미정",
      선호골프장: course || "없음(추천 요청)",
      요청사항: memo || "-",
      이름: name,
      연락처: phone,
      이메일: email || "-",
    };
    // 정적 호스팅(GitHub Pages): FormSubmit 릴레이로 운영자 메일 전달.
    // 해시 엔드포인트 사용: 소스에 이메일이 노출되지 않아 스팸봇 수집 방지 (goltimjang@gmail.com 수신)
    const subject = `[에스티골프투어 견적 ${no}] ${payload.type} · ${payload["지역"]} · ${name}님 (${people}명)`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch("https://formsubmit.co/ajax/dea690313c66c8f0af9faeae39e6b6dc", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          ...(email ? { _replyto: email } : {}),
          ...payload,
          접수시각: new Date().toLocaleString("ko-KR"),
        }),
      });
      const result = await res.json();
      if (!res.ok || ![true, "true"].includes(result?.success)) throw new Error("send failed");
      track("quote_submit_success", { kind: type, product_id: product?.id ?? inquiryProduct?.id ?? "custom" });
      setTicket(no);
      try {
        localStorage.removeItem(draftKey);
        localStorage.removeItem("st-picked");
      } catch {}
      setDone(true);
      requestAnimationFrame(() => { boxRef.current?.scrollIntoView({ behavior: "instant", block: "start" }); boxRef.current?.focus({ preventScroll: true }); });
    } catch {
      track("quote_submit_error", { kind: type });
      setError(`접수 여부를 확인하지 못했습니다. 중복 요청이 걱정되시면 전화로 먼저 확인해 주세요. 잠시 후 다시 시도하시거나, 지금 바로 전화(${site.phone})로 문의해 주세요.`);
    } finally {
      clearTimeout(timeout);
      sendingRef.current = false;
      setSending(false);
    }
  }

  /* ---------------- 완료 화면 ---------------- */
  if (done) {
    return (
      <div ref={boxRef} tabIndex={-1} className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 sm:p-10" role="status">
        <p className="eyebrow text-golddeep">견적 접수</p>
        <h3 className="headline text-2xl sm:text-3xl mt-2 mb-2">견적 요청이 접수되었습니다</h3>
        {ticket && (
          <p className="text-[14px] text-mute mb-4">
            접수번호 <b className="text-ink font-display text-[16px]">{ticket}</b>

          </p>
        )}
        <p className="text-[17px]">
          담당자가 여행 조건과 예약 가능 여부를 확인하고 견적서를 작성해 남겨주신 연락처로 보내드립니다.
          <br />
          <span className="text-mute">{site.company.hours}</span>
        </p>
        <div className="mt-5 rounded-xl bg-paper p-5 text-[15px] leading-relaxed">
          <p className="font-bold mb-1">접수 내용</p>
          <p>
            {(product || inquiryProduct) && <><b>{product?.title ?? inquiryProduct?.title}</b><br /></>}
            {isDom ? "국내" : "해외"} · {destinationLabel} · {whenLabel} · {people}명
            {course ? ` · ${course}` : ""}
          </p>
        </div>
        <p className="mt-5 text-[15px] text-mute">
          급하시면 지금 바로 연락 주세요. 대표 직통 {site.phone}
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <a href={site.phoneHref} className="btn btn-royal">전화 상담 {site.phone}</a>
          {site.kakaoUrl && (
            <a href={site.kakaoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">카카오톡 상담</a>
          )}
          <Link href="/promotion" className="btn btn-light">로얄CC 프로모션 보기</Link>
        </div>
        <p className="mt-6 text-[13px] text-mute">
          입력하신 개인정보는 견적 상담 목적으로만 사용되며, 상담 완료 후 1년 뒤 파기됩니다.
        </p>
      </div>
    );
  }

  /* ---------------- 입력 화면 ---------------- */
  return (
    <div ref={boxRef} tabIndex={-1} className="quote-form min-w-0 scroll-mt-24 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="mb-6 border-b border-line pb-4">
        <p className="text-sm font-bold text-royaldark" aria-live="polite">
          {step === 1 ? "여행 조건" : step === 2 ? "상세 조건 (선택)" : "연락처와 최종 확인"}
        </p>
        <h3 className="text-xl font-bold mt-1">{step === 1 ? (inquiryProduct ? "날짜와 인원만 선택하세요" : "아는 것만 알려주셔도 괜찮아요") : step === 2 ? "더 알려주시면 견적에 반영할게요" : "이 조건으로 상담을 요청할까요?"}</h3>
        <p className="text-sm text-mute mt-2">견적은 무료입니다. 접수만으로 예약이나 결제가 진행되지 않습니다.</p>
      </div>
      {draftNotice && step === 1 && <p className="mb-5 text-sm text-mute" role="status">이 페이지에서 작성하던 여행 조건을 불러왔습니다. 내용을 확인해 주세요.</p>}

      {step === 1 && (
        <div className="space-y-7">
          {product ? <div className="rounded-xl bg-paper p-4"><b>{product.title}</b><p>{product.start} ~ {product.end} · {product.duration}</p><p className="text-sm text-mute">베트남 닌빈 로얄CC · 항공 포함 · 총 54홀</p><Link href="/overseas/vietnam/?flexible=1#quote" className="inline-block py-2 underline text-royaldark">다른 날짜로 문의하기</Link></div> : <>
          {inquiryProduct ? <div className="rounded-xl bg-paper p-4"><p className="text-sm text-royaldark font-bold">선택한 상품</p><p className="font-semibold text-sm my-1">{inquiryProduct.title}</p><p className="text-sm">{inquiryProduct.country} · {inquiryProduct.area} · {inquiryProduct.duration}</p></div> : <>
          <Field label={isDom ? "희망 지역 (복수 선택 가능)" : "희망 국가"} required>
            {isDom ? (
              <div className="flex flex-wrap gap-2.5">
                {[...REGIONS, "추천 받고 싶어요"].map((r) => (
                  <button key={r} type="button" className="choice" data-on={regions.includes(r)} aria-pressed={regions.includes(r)} onClick={() => toggleRegion(r)}>
                    {r}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {destinations.filter((d) => d.tier === 1).map((d) => (
                  <button key={d.slug} type="button" className="choice" data-on={country === d.name} aria-pressed={country === d.name} onClick={() => selectCountry(d.name)}>
                    {d.name}
                  </button>
                ))}
                <select
                  className="field !w-auto"
                  value={destinations.some((d) => d.tier !== 1 && d.name === country) ? country : ""}
                  onChange={(e) => { if (e.target.value) selectCountry(e.target.value); }}
                  aria-label="그 외 국가 선택"
                >
                  <option value="">그 외 지역…</option>
                  {destinations.filter((d) => d.tier !== 1).map((d) => (
                    <option key={d.slug} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <button type="button" className="choice" data-on={country === "추천 받고 싶어요"} aria-pressed={country === "추천 받고 싶어요"} onClick={() => selectCountry("추천 받고 싶어요")}>
                  잘 모르겠어요, 추천해 주세요
                </button>
              </div>
            )}
          </Field>

          {!isDom && <DestinationRegionChoices country={country} value={area} onChange={setArea} />}
          </>}

          {inquiryProduct ? <div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button type="button" className="choice !min-w-0 !px-2" data-on={dateMode === "date"} aria-pressed={dateMode === "date"} onClick={() => setDateMode("date")}>출발일 선택</button>
              <button type="button" className="choice !min-w-0 !px-2" data-on={dateMode === "flexible"} aria-pressed={dateMode === "flexible"} onClick={() => {setDateMode("flexible"); if (!flexTime) setFlexTime("미정 (상담 후 결정)");}}>날짜 미정</button>
            </div>
            {dateMode === "date" ? <Field label="희망 출발일" htmlFor="product-departure" required><input id="product-departure" type="date" className="field min-w-0" min={new Date().toLocaleDateString("sv-SE")} value={dateStart} onChange={e => setDateStart(e.target.value)} /></Field> : <Field label="희망 시기" htmlFor="product-flexible"><select id="product-flexible" className="field" value={flexTime} onChange={e=>setFlexTime(e.target.value)}>{["미정 (상담 후 결정)","이번 달 안에","1~2개월 안에","3개월 이후"].map(t=><option key={t}>{t}</option>)}</select></Field>}
            <p className="text-sm text-mute mt-2">항공권 별도 · 출발 가능 여부는 상담 후 확정</p>
            {inquiryProduct.notice && <p className="mt-3 text-sm leading-relaxed rounded-lg bg-amber-50 p-3">{inquiryProduct.notice}</p>}
          </div> : <>
          <Field label="희망 일정 (출발일 → 도착일)" required>
            <div className="flex flex-wrap gap-2.5 mb-3">
              <button type="button" className="choice" data-on={dateMode === "date"} aria-pressed={dateMode === "date"} onClick={() => setDateMode("date")}>날짜를 정했어요</button>
              <button type="button" className="choice" data-on={dateMode === "flexible"} aria-pressed={dateMode === "flexible"} onClick={() => setDateMode("flexible")}>시기만 정했거나 미정이에요</button>
            </div>
            {dateMode === "date" ? (
              <Calendar
                start={dateStart}
                end={dateEnd}
                onChange={(s, e) => {
                  setDateStart(s);
                  setDateEnd(e);
                }}
              />
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {["이번 달 안에", "1~2개월 안에", "3개월 이후", "미정 (상담 후 결정)"].map((t) => (
                  <button key={t} type="button" className="choice" data-on={flexTime === t} aria-pressed={flexTime === t} onClick={() => setFlexTime(t)}>{t}</button>
                ))}
              </div>
            )}
          </Field>
</>}

          </>}
          {inquiryProduct?.duration?.includes("·") && <Field label="여행 기간"><select aria-label="여행 기간" className="field" value={duration} onChange={e=>setDuration(e.target.value)}><option value="">상담하며 정할게요</option>{inquiryProduct.duration.match(/\d+/g)?.map(n=><option key={n} value={`${n}일`}>{n}일</option>)}</select></Field>}
          <Field label="인원" required>
            <div className="flex items-center gap-4">
              <button type="button" className="choice !min-w-[52px] text-xl" onClick={() => setPeople(Math.max(PEOPLE_MIN, people - 1))} aria-label="인원 줄이기">−</button>
              <span className="text-2xl font-display w-16 text-center" aria-live="polite">{people}명</span>
              <button type="button" className="choice !min-w-[52px] text-xl" onClick={() => setPeople(Math.min(999, people + 1))} aria-label="인원 늘리기">+</button>
            </div>
          </Field>

          <div className="flex flex-col gap-3">
            <NextBtn disabled={!step1Ok} onClick={() => goStep(3)} label="연락처 남기기" />
            {!product && <button type="button" className="btn btn-light" disabled={!step1Ok} onClick={() => goStep(2)}>상세 조건 추가하기 (선택)</button>}
          </div>
          <CallEscape />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-7">
          <div className="rounded-xl bg-paper p-4"><p className="text-sm mb-3">모든 항목은 선택사항입니다. 상담하면서 함께 정할 수 있어요.</p><NextBtn onClick={() => goStep(3)} label="건너뛰고 연락처 남기기" /></div>
          <Field label="여행 기간">
            {stay ? (
              // 1단계 달력에서 출발·도착일을 선택한 경우 자동 계산
              <div className="rounded-xl bg-paper px-4 py-3.5 text-[15px]">
                달력에서 선택하신 일정 기준 <b className="text-royaldark">{stay}</b>
                <span className="text-mute"> ({dateStart.replace(/-/g, ". ")} ~ {dateEnd.replace(/-/g, ". ")})</span>
                <br />
                <span className="text-mute text-[13.5px]">일정을 바꾸시려면 이전 단계에서 날짜를 다시 선택해 주세요.</span>
              </div>
            ) : (
              <Choices value={duration} set={setDuration} items={isDom ? ["당일", "1박 2일", "2박 3일", "3박 이상"] : ["2박 3일", "3박 4일", "3박 5일", "4박 이상"]} />
            )}
          </Field>
          <Field label="1일 라운드">
            <Choices value={rounds} set={setRounds} items={["18홀", "36홀", "상담 후 결정"]} />
            <p className="text-[13px] text-mute mt-2">하루에 몇 홀 도실지 골라주세요. 일정에 맞춰 티타임을 잡아드립니다.</p>
          </Field>
          {isDom ? (
            <Field label="숙박이 필요하신가요?">
              <Choices value={lodging} set={setLodging} items={["네, 숙박 포함", "아니요, 라운드만", "상담 후 결정"]} />
            </Field>
          ) : (
            <>
              <Field label="항공 포함 여부">
                {inquiryProduct ? <p className="text-sm text-mute">항공권은 제외한 현지 일정으로 견적을 안내합니다.</p> : <>
                <Choices value={flight} set={setFlight} items={["항공 포함", "항공 불포함 (직접 예약)", "미정"]} /></>}
              </Field>
              <Field label="숙박 수준">
                <Choices value={lodging} set={setLodging} items={["골프텔·실속", "4성급", "5성급·리조트", "풀빌라", "상담 후 결정"]} />
              </Field>
            </>
          )}
          <Field label="1인 예산 (선택)">
            <Choices value={budget} set={setBudget} items={isDom ? BUDGETS_DOM : BUDGETS_OVS} />
          </Field>
          <Field label="선호 골프장 (선택)">
            {pickScope ? (
              <CoursePicker
                value={course}
                onChange={setCourse}
                items={pickScope.items}
                groups={pickScope.groups}
                scopeLabel={pickScope.label}
                placeholder="희망 골프장이 있으면 적어주세요. 비워두시면 추천해 드립니다"
              />
            ) : (
              <input className="field" value={course} onChange={(e) => setCourse(e.target.value)} aria-label="선호 골프장" placeholder="희망 골프장이 있으면 적어주세요" />
            )}
          </Field>
          <Field label="요청사항 (선택)">
            <textarea aria-label="요청사항" className="field min-h-[96px]" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예: 조식 포함 희망, 부모님 동반이라 이동이 편했으면 합니다" />
          </Field>
          <div className="flex gap-3">
            <BackBtn onClick={() => goStep(1)} />
            <NextBtn onClick={() => goStep(3)} />
          </div>
          <CallEscape />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-7">
          <div className="rounded-xl border border-line bg-paper p-4" data-testid="quote-summary">
            <p className="font-bold">{product?.title ?? inquiryProduct?.title ?? "맞춤 골프투어"}</p>
            <dl className="mt-2 space-y-1 text-[15px]"><div><dt className="inline text-mute">지역: </dt><dd className="inline">{destinationLabel}</dd></div><div><dt className="inline text-mute">일정: </dt><dd className="inline">{whenLabel}</dd></div><div><dt className="inline text-mute">인원: </dt><dd className="inline">{people}명</dd></div>{inquiryProduct && <div><dt className="inline text-mute">견적 기준: </dt><dd className="inline">항공 불포함 · 현지 일정</dd></div>}{course && <div><dt className="inline text-mute">골프장: </dt><dd className="inline">{course}</dd></div>}</dl>
            {inquiryProduct?.notice && <p className="text-sm mt-3 text-mute">{inquiryProduct.notice}</p>}
            <button type="button" className="mt-2 py-2 underline text-royaldark font-semibold" onClick={() => goStep(1)}>여행 조건 수정</button>
          </div>
          <Field label="성함" htmlFor="quote-name" required>
            <input id="quote-name" required className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" autoComplete="name" />
          </Field>
          <Field label="연락처" htmlFor="quote-phone" required>
            <input id="quote-phone" required aria-invalid={!!phone && !phoneOk} className="field" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" autoComplete="tel" />
          </Field>
          <Field label="이메일 (선택)" htmlFor="quote-email">
            <input id="quote-email" aria-invalid={!!email && !emailOk} className="field" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="견적서를 받을 이메일이 있으면 적어주세요" autoComplete="email" />
          </Field>

          {!!phone && !phoneOk && <p className="text-sm text-red-700" role="alert">연락 가능한 전화번호 9~11자리를 확인해 주세요.</p>}
          {!!email && !emailOk && <p className="text-sm text-red-700" role="alert">이메일 형식을 확인해 주세요.</p>}
          <div className="rounded-xl bg-paper p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1.5 h-5 w-5 accent-[#0d4ff5]" />
              <span className="text-[15px]">
                <strong>[필수]</strong> 개인정보 수집·이용에 동의합니다.{" "}
                <button type="button" className="underline text-royal" onClick={() => setShowPrivacy(!showPrivacy)}>
                  {showPrivacy ? "접기" : "내용 보기"}
                </button>
              </span>
            </label>
            {showPrivacy && (
              <div className="mt-3 text-[13.5px] text-mute leading-relaxed border-t border-line pt-3">
                · 수집 목적: 골프투어 견적 상담 및 회신 (견적서 전달을 위한 전화·카카오톡·문자 발송 포함)
                <br />· 수집 항목: 이름, 연락처, 이메일(선택), 여행 조건(지역·날짜·인원 등)
                <br />· 보유 기간: 상담 완료 후 1년, 경과 시 지체 없이 파기
                <br />· 동의를 거부하실 수 있으나, 거부 시 견적 회신이 불가합니다.
              </div>
            )}
          </div>

          {error && <p className="text-[15px] font-semibold text-red-600" role="alert">{error}</p>}

          <div className="flex gap-3">
            <BackBtn onClick={() => goStep(1)} />
            <button type="button" className="btn btn-royal flex-1" disabled={!step3Ok || sending} onClick={submit} style={!step3Ok || sending ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
              {sending ? "전송 중…" : "무료 견적 요청하기"}
            </button>
          </div>
          <p className="text-[13.5px] text-mute text-center">{site.company.hours}</p>
          <CallEscape />
        </div>
      )}
    </div>
  );
}

/* ---------------- 소품 ---------------- */

function Field({ label, htmlFor, required, children }: { label: string; htmlFor?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-[16px] font-bold mb-2.5">
        {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : label} {required && <span className="text-royal" aria-label="필수">*</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function Choices({ value, set, items }: { value: string; set: (v: string) => void; items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((i) => (
        <button key={i} type="button" className="choice" data-on={value === i} aria-pressed={value === i} onClick={() => set(value === i ? "" : i)}>
          {i}
        </button>
      ))}
    </div>
  );
}

function NextBtn({ onClick, disabled, label = "다음" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button type="button" className="btn btn-royal w-full sm:w-auto sm:min-w-[220px]" disabled={disabled} onClick={onClick} style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
      {label} →
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="btn btn-light" onClick={onClick}>
      ← 이전
    </button>
  );
}

function CallEscape() {
  return (
    <p className="text-[15px] text-mute border-t border-line pt-4">
      입력이 어려우시면 전화 주세요.{" "}
      <a href={site.phoneHref} className="font-bold text-royaldark underline">
        {site.phone}
      </a>{" "}
      {site.company.hours}
    </p>
  );
}
