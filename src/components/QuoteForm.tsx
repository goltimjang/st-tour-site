"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { destinations } from "@/data/destinations";
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
};

const REGIONS = ["수도권", "강원", "충청", "호남", "영남", "제주"];

// 1단계에서 고른 국가명 -> 해외 골프장 데이터의 국가 슬러그
const COUNTRY_SLUG: Record<string, string> = {
  일본: "japan", 태국: "thailand", 베트남: "vietnam", 중국: "china", 필리핀: "philippines",
  대만: "taiwan", 말레이시아: "malaysia", "괌·사이판": "guam", 인도네시아: "indonesia",
  라오스: "laos", 몽골: "mongolia", "하와이·미국": "usa", "호주·뉴질랜드": "australia",
};

type KrCourse = { name: string; sido: string; city: string; region: string; type: string | null };
type OvCourse = { country: string; area: string; name: string; city?: string | null; holes?: number | null };
const PEOPLE_MIN = 1;
const BUDGETS_DOM = ["30만원 이하", "30~50만원", "50~80만원", "80만원 이상", "상담하며 정할게요"];
const BUDGETS_OVS = ["60만원 이하", "60~100만원", "100~150만원", "150만원 이상", "상담하며 정할게요"];

export default function QuoteForm({ type, prefillCourse, prefillRegion, prefillCountry }: Props) {
  const isDom = type === "domestic";

  const boxRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);

  /** 단계를 바꾸면 폼 상단이 화면에 오도록 맞춘다 (긴 폼에서 엉뚱한 위치로 가는 것 방지) */
  function goStep(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      const el = boxRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 90; // 고정 헤더 여유
      window.scrollTo({ top, behavior: "smooth" });
    });
  }
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [regions, setRegions] = useState<string[]>(prefillRegion ? [prefillRegion] : []);
  const [country, setCountry] = useState(prefillCountry ?? "");
  const [dateMode, setDateMode] = useState<"date" | "flexible">("date");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [flexTime, setFlexTime] = useState("");
  const [people, setPeople] = useState(4);

  // Step 2
  const [duration, setDuration] = useState("");
  const [rounds, setRounds] = useState("");
  const [lodging, setLodging] = useState(""); // 국내: 숙박 필요 여부 / 해외: 숙박 수준
  const [flight, setFlight] = useState("");
  const [budget, setBudget] = useState("");
  const [course, setCourse] = useState(prefillCourse ?? "");
  const [memo, setMemo] = useState("");

  // Step 3
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // 달력 선택 시 "○박 ○일" 자동 계산 (출발·도착 모두 선택해야 완성)
  const stay = stayLabel(dateStart, dateEnd);
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
    dateMode === "date"
      ? dateStart && dateEnd
        ? `${dateStart.replace(/-/g, ". ")} 출발 ~ ${dateEnd.replace(/-/g, ". ")} 도착 (${stay})`
        : ""
      : flexTime;
  const step1Ok = isDom
    ? regions.length > 0 && whenLabel && people >= PEOPLE_MIN
    : country && whenLabel && people >= PEOPLE_MIN;
  const step3Ok = name.trim().length >= 1 && phone.replace(/\D/g, "").length >= 9 && agree;

  const deadline = useMemo(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return d.toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "numeric", minute: "2-digit" });
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleRegion(r: string) {
    setRegions((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  async function submit() {
    setSending(true);
    setError("");
    const payload = {
      type: isDom ? "국내 골프투어" : "해외 골프투어",
      지역: isDom ? regions.join(", ") : country,
      희망시기: whenLabel,
      인원: `${people}명`,
      기간: stay || duration || "미정",
      "1일 라운드": rounds || "미정",
      ...(isDom ? { 숙박: lodging || "미정" } : { 항공: flight || "미정", 숙박수준: lodging || "미정" }),
      예산: budget || "미정",
      선호골프장: course || "없음(추천 요청)",
      요청사항: memo || "-",
      이름: name,
      연락처: phone,
    };
    // 정적 호스팅(GitHub Pages): FormSubmit 릴레이로 운영자 메일 전달.
    // 해시 엔드포인트 사용: 소스에 이메일이 노출되지 않아 스팸봇 수집 방지 (goltimjang@gmail.com 수신)
    const subject = `[에스티골프투어 견적] ${payload.type} · ${payload["지역"]} · ${name}님 (${people}명)`;
    try {
      const res = await fetch("https://formsubmit.co/ajax/dea690313c66c8f0af9faeae39e6b6dc", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          ...payload,
          접수시각: new Date().toLocaleString("ko-KR"),
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setDone(true);
      window.scrollTo({ top: 0 });
    } catch {
      setError(`전송 중 문제가 생겼습니다. 잠시 후 다시 시도하시거나, 지금 바로 전화(${site.phone})로 문의해 주세요.`);
    } finally {
      setSending(false);
    }
  }

  /* ---------------- 완료 화면 ---------------- */
  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-white p-7 sm:p-10">
        <p className="eyebrow text-golddeep">Request Received</p>
        <h3 className="headline text-2xl sm:text-3xl mt-2 mb-4">견적 요청이 접수되었습니다</h3>
        <p className="text-[17px]">
          지금부터 24시간 카운트가 시작됩니다.
          <br />
          <strong className="text-royaldark">{deadline} 전에</strong> 남겨주신 연락처로 견적서를 보내드립니다.
        </p>
        <div className="mt-5 rounded-xl bg-paper p-5 text-[15px] leading-relaxed">
          <p className="font-bold mb-1">접수 내용</p>
          <p>
            {isDom ? `국내 · ${regions.join(", ")}` : `해외 · ${country}`} · {whenLabel} · {people}명
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
    <div ref={boxRef} className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 sm:p-10">
      {/* 진행률 */}
      <div className="flex items-center justify-between mb-7">
        <p className="eyebrow text-royal">
          Step {step} / 3 · {step === 1 ? "어디로, 언제, 몇 분?" : step === 2 ? "어떻게 즐기실까요?" : "연락처를 남겨주세요"}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? "bg-royal" : "bg-line"}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-7">
          <Field label={isDom ? "희망 지역 (복수 선택 가능)" : "희망 국가"} required>
            {isDom ? (
              <div className="flex flex-wrap gap-2.5">
                {REGIONS.map((r) => (
                  <button key={r} type="button" className="choice" data-on={regions.includes(r)} onClick={() => toggleRegion(r)}>
                    {r}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {destinations.filter((d) => d.tier === 1).map((d) => (
                  <button key={d.slug} type="button" className="choice" data-on={country === d.name} onClick={() => setCountry(d.name)}>
                    {d.name}
                  </button>
                ))}
                <select
                  className="field !w-auto"
                  value={destinations.some((d) => d.tier !== 1 && d.name === country) ? country : ""}
                  onChange={(e) => e.target.value && setCountry(e.target.value)}
                  aria-label="그 외 국가 선택"
                >
                  <option value="">그 외 지역…</option>
                  {destinations.filter((d) => d.tier !== 1).map((d) => (
                    <option key={d.slug} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <button type="button" className="choice" data-on={country === "추천 받고 싶어요"} onClick={() => setCountry("추천 받고 싶어요")}>
                  잘 모르겠어요, 추천해 주세요
                </button>
              </div>
            )}
          </Field>

          <Field label="희망 일정 (출발일 → 도착일)" required>
            <div className="flex flex-wrap gap-2.5 mb-3">
              <button type="button" className="choice" data-on={dateMode === "date"} onClick={() => setDateMode("date")}>날짜를 정했어요</button>
              <button type="button" className="choice" data-on={dateMode === "flexible"} onClick={() => setDateMode("flexible")}>시기만 정했어요</button>
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
                  <button key={t} type="button" className="choice" data-on={flexTime === t} onClick={() => setFlexTime(t)}>{t}</button>
                ))}
              </div>
            )}
          </Field>

          <Field label="인원" required>
            <div className="flex items-center gap-4">
              <button type="button" className="choice !min-w-[52px] text-xl" onClick={() => setPeople(Math.max(PEOPLE_MIN, people - 1))} aria-label="인원 줄이기">−</button>
              <span className="text-2xl font-display w-16 text-center" aria-live="polite">{people}명</span>
              <button type="button" className="choice !min-w-[52px] text-xl" onClick={() => setPeople(people + 1)} aria-label="인원 늘리기">+</button>
            </div>
          </Field>

          <NextBtn disabled={!step1Ok} onClick={() => goStep(2)} />
          <CallEscape />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-7">
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
                <Choices value={flight} set={setFlight} items={["항공 포함", "항공 불포함 (직접 예약)", "미정"]} />
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
                placeholder={isDom ? "예: 비발디파크CC / 비워두셔도 됩니다. 저희가 추천해 드립니다" : "예: 다낭 몽고메리 링스 / 비워두셔도 됩니다. 저희가 추천해 드립니다"}
              />
            ) : (
              <input className="field" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="예: 앙코르 골프 리조트 / 없으면 비워두세요. 저희가 추천해 드립니다" />
            )}
          </Field>
          <Field label="요청사항 (선택)">
            <textarea className="field min-h-[96px]" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예: 조식 포함 희망, 부모님 동반이라 이동이 편했으면 합니다" />
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
          <Field label="성함" required>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" autoComplete="name" />
          </Field>
          <Field label="연락처" required>
            <input className="field" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" autoComplete="tel" />
          </Field>

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
                <br />· 수집 항목: 이름, 연락처, 여행 조건(지역·날짜·인원 등)
                <br />· 보유 기간: 상담 완료 후 1년, 경과 시 지체 없이 파기
                <br />· 동의를 거부하실 수 있으나, 거부 시 견적 회신이 불가합니다.
              </div>
            )}
          </div>

          {error && <p className="text-[15px] font-semibold text-red-600" role="alert">{error}</p>}

          <div className="flex gap-3">
            <BackBtn onClick={() => goStep(2)} />
            <button type="button" className="btn btn-royal flex-1" disabled={!step3Ok || sending} onClick={submit} style={!step3Ok || sending ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
              {sending ? "전송 중…" : "무료 견적 요청하기"}
            </button>
          </div>
          <p className="text-[13.5px] text-mute text-center">견적은 무료이며, 요청 후 24시간 안에 견적서가 도착합니다.</p>
          <CallEscape />
        </div>
      )}
    </div>
  );
}

/* ---------------- 소품 ---------------- */

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[16px] font-bold mb-2.5">
        {label} {required && <span className="text-royal" aria-label="필수">*</span>}
      </p>
      {children}
    </div>
  );
}

function Choices({ value, set, items }: { value: string; set: (v: string) => void; items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((i) => (
        <button key={i} type="button" className="choice" data-on={value === i} onClick={() => set(value === i ? "" : i)}>
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
      (똑같이 24시간 안에 견적을 드립니다)
    </p>
  );
}
