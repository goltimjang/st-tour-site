"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { destinations } from "@/data/destinations";

type Props = {
  type: "domestic" | "overseas";
  /** 골프장 리스트에서 "이 골프장으로 견적받기"로 진입 시 미리 채움 */
  prefillCourse?: string;
  prefillRegion?: string;
  /** 국가 페이지에서 진입 시 국가 미리 선택 */
  prefillCountry?: string;
};

const REGIONS = ["수도권", "강원", "충청", "호남", "영남", "제주"];
const PEOPLE_MIN = 1;
const BUDGETS_DOM = ["30만원 이하", "30~50만원", "50~80만원", "80만원 이상", "상담하며 정할게요"];
const BUDGETS_OVS = ["60만원 이하", "60~100만원", "100~150만원", "150만원 이상", "상담하며 정할게요"];

export default function QuoteForm({ type, prefillCourse, prefillRegion, prefillCountry }: Props) {
  const isDom = type === "domestic";

  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [regions, setRegions] = useState<string[]>(prefillRegion ? [prefillRegion] : []);
  const [country, setCountry] = useState(prefillCountry ?? "");
  const [dateMode, setDateMode] = useState<"date" | "flexible">("date");
  const [date, setDate] = useState("");
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
  const [channel, setChannel] = useState("전화");
  const [agree, setAgree] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const whenLabel = dateMode === "date" ? date : flexTime;
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
      기간: duration || "미정",
      라운드수: rounds || "미정",
      ...(isDom ? { 숙박: lodging || "미정" } : { 항공: flight || "미정", 숙박수준: lodging || "미정" }),
      예산: budget || "미정",
      선호골프장: course || "없음(추천 요청)",
      요청사항: memo || "-",
      이름: name,
      연락처: phone,
      연락채널: channel,
    };
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          <strong className="text-royaldark">{deadline} 전에</strong> {channel}로 견적서를 보내드립니다.
        </p>
        <div className="mt-5 rounded-xl bg-paper p-5 text-[15px] leading-relaxed">
          <p className="font-bold mb-1">접수 내용</p>
          <p>
            {isDom ? `국내 · ${regions.join(", ")}` : `해외 · ${country}`} · {whenLabel} · {people}명
            {course ? ` · ${course}` : ""}
          </p>
        </div>
        <p className="mt-5 text-[15px] text-mute">
          급하시면 지금 바로 연락 주세요 — 대표 직통 {site.phone}
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
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-10">
      {/* 진행률 */}
      <div className="flex items-center justify-between mb-7">
        <p className="eyebrow text-royal">
          Step {step} / 3 — {step === 1 ? "어디로, 언제, 몇 분?" : step === 2 ? "어떻게 즐기실까요?" : "어디로 보내드릴까요?"}
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

          <Field label={isDom ? "희망 날짜" : "희망 출발일"} required>
            <div className="flex flex-wrap gap-2.5 mb-3">
              <button type="button" className="choice" data-on={dateMode === "date"} onClick={() => setDateMode("date")}>날짜를 정했어요</button>
              <button type="button" className="choice" data-on={dateMode === "flexible"} onClick={() => setDateMode("flexible")}>시기만 정했어요</button>
            </div>
            {dateMode === "date" ? (
              <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} aria-label="희망 날짜 선택" />
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
              <span className="text-[14px] text-mute">2명도, 40명도 좋습니다</span>
            </div>
          </Field>

          <NextBtn disabled={!step1Ok} onClick={() => setStep(2)} />
          <CallEscape />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-7">
          <Field label="여행 기간">
            <Choices value={duration} set={setDuration} items={isDom ? ["당일", "1박 2일", "2박 3일", "3박 이상"] : ["2박 3일", "3박 4일", "3박 5일", "4박 이상"]} />
          </Field>
          <Field label="라운드 수">
            <Choices value={rounds} set={setRounds} items={isDom ? ["1회 (18홀)", "2회 (36홀)", "3회 (54홀)", "상담 후 결정"] : ["2회", "3회 (54홀)", "4회 이상", "상담 후 결정"]} />
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
            <input className="field" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="예: 비발디파크CC / 없으면 비워두세요 — 저희가 추천해 드립니다" />
          </Field>
          <Field label="요청사항 (선택)">
            <textarea className="field min-h-[96px]" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예: 조식 포함 희망, 부모님 동반이라 이동이 편했으면 합니다" />
          </Field>
          <div className="flex gap-3">
            <BackBtn onClick={() => setStep(1)} />
            <NextBtn onClick={() => setStep(3)} label="다음 — 연락처 입력" />
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
          <Field label="견적서를 어디로 보내드릴까요?" required>
            <Choices value={channel} set={setChannel} items={["전화", "카카오톡", "문자"]} />
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
            <BackBtn onClick={() => setStep(2)} />
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
      입력이 어려우시면 전화 주세요 —{" "}
      <a href={site.phoneHref} className="font-bold text-royaldark underline">
        {site.phone}
      </a>{" "}
      (똑같이 24시간 안에 견적을 드립니다)
    </p>
  );
}
