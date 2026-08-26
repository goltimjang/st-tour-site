"use client";

import { useMemo, useState } from "react";
import coursesData from "@/data/golf-courses.json";
import pointsData from "@/data/course-points.json";
import KoreaMap, { type Point } from "@/components/KoreaMap";
import { courseDetail, courseLink } from "@/data/course-meta";

type Course = { name: string; sido: string; city: string; region: string; type: string | null };
const courses = coursesData as Course[];
const points = pointsData as Point[];

const REGION_ORDER = ["수도권", "강원", "충청", "호남", "영남", "제주"];
const TYPES = ["전체", "대중제", "회원제"] as const;
const SHIFTS = ["전체", "2부제", "3부제"] as const;

/** 권역별 한 줄 소개 (일반 고객이 감을 잡도록) */
const REGION_NOTE: Record<string, string> = {
  수도권: "서울에서 1~2시간. 당일 라운드와 1박 2일 모두 무난합니다.",
  강원: "산악 코스와 리조트가 많아 여름 라운드와 가족 여행에 좋습니다.",
  충청: "전국 어디서나 접근이 좋아 단체 행사가 많이 열립니다.",
  호남: "겨울에도 비교적 따뜻하고, 남해안 코스 풍경이 좋습니다.",
  영남: "부산·경남권 해안 코스와 온천 결합 일정이 인기입니다.",
  제주: "사계절 라운드가 가능하고 항공과 묶어 패키지로 갑니다.",
};

export default function CourseExplorer() {
  const [region, setRegion] = useState("전체");
  const [ctype, setCtype] = useState<(typeof TYPES)[number]>("전체");
  const [shift, setShift] = useState<(typeof SHIFTS)[number]>("전체");
  const [noCaddieOnly, setNoCaddieOnly] = useState(false);
  const [sido, setSido] = useState("전체");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(24);

  const reset = () => { setSido("전체"); setLimit(24); };

  const sidos = useMemo(() => {
    const inRegion = region === "전체" ? courses : courses.filter((c) => c.region === region);
    return ["전체", ...Array.from(new Set(inRegion.map((c) => c.sido))).sort((a, b) => a.localeCompare(b, "ko"))];
  }, [region]);

  const filtered = useMemo(() => {
    let list = courses;
    if (region !== "전체") list = list.filter((c) => c.region === region);
    if (ctype !== "전체") list = list.filter((c) => c.type === ctype);
    if (sido !== "전체") list = list.filter((c) => c.sido === sido);
    if (shift !== "전체") list = list.filter((c) => courseDetail(c.name)?.shifts?.includes(shift));
    if (noCaddieOnly) list = list.filter((c) => courseDetail(c.name)?.noCaddie);
    const term = q.trim().replace(/\s/g, "");
    if (term) list = list.filter((c) => (c.name + c.city + c.sido).replace(/\s/g, "").includes(term));
    return [...list].sort(
      (a, b) =>
        REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region) ||
        a.sido.localeCompare(b.sido, "ko") ||
        a.name.localeCompare(b.name, "ko")
    );
  }, [region, ctype, sido, shift, noCaddieOnly, q]);

  const regionCount = (r: string) => courses.filter((c) => c.region === r).length;

  /** 현재 권역·운영형태 범위에서 조건에 해당하는 골프장 수 */
  const scoped = () => {
    let base = courses;
    if (region !== "전체") base = base.filter((c) => c.region === region);
    if (ctype !== "전체") base = base.filter((c) => c.type === ctype);
    return base;
  };
  const shiftCount = (val: string) => scoped().filter((c) => courseDetail(c.name)?.shifts?.includes(val)).length;
  const noCaddieCount = scoped().filter((c) => courseDetail(c.name)?.noCaddie).length;

  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden shadow-soft">
      {/* 권역 내비게이션 + 지도 */}
      <div className="bg-navy text-white p-6 sm:p-8">
        <h3 className="headline text-[22px] sm:text-[26px] mb-1.5">전국 골프장 지도</h3>
        <p className="text-[14px] text-white/70 mb-6">
          문화체육관광부 등록 {courses.length}개 골프장. 지도에서 지역을 누르면 그 지역 골프장이 아래에 나오고,
          점을 누르면 어느 골프장인지 바로 보입니다.
        </p>

        {/* 권역 버튼: 상단 가로 배치 */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
          <button
            type="button"
            onClick={() => { setRegion("전체"); reset(); }}
            aria-pressed={region === "전체"}
            className={`rounded-xl px-2 py-3 text-center transition-colors ${
              region === "전체" ? "bg-white text-navy font-bold" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <span className="block text-[15px] font-bold leading-tight">전국</span>
            <span className="block text-[12px] opacity-70 leading-tight mt-0.5">{courses.length}곳</span>
          </button>
          {REGION_ORDER.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRegion(r); reset(); }}
              aria-pressed={region === r}
              className={`rounded-xl px-2 py-3 text-center transition-colors ${
                region === r ? "bg-gold text-navydeep font-bold" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <span className="block text-[15px] font-bold leading-tight">{r}</span>
              <span className="block text-[12px] opacity-70 leading-tight mt-0.5">{regionCount(r)}곳</span>
            </button>
          ))}
        </div>

        {region !== "전체" && REGION_NOTE[region] && (
          <p className="text-center text-[14.5px] text-white/80 mb-5 leading-relaxed">
            <b className="text-gold">{region}</b> · {REGION_NOTE[region]}
          </p>
        )}

        {/* 지도: 가운데 크게 */}
        <div className="mx-auto w-full max-w-[520px]">
          <KoreaMap points={points} region={region} onRegion={(r) => { setRegion(r); reset(); }} />
          <div className="flex items-center justify-center gap-5 text-[12.5px] text-white/70 mt-3">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#f0b429] ring-1 ring-white/60" /> 대중제
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0b1f4d] ring-1 ring-white/60" /> 회원제
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* 조건 필터 */}
        <div className="space-y-3 mb-5">
          <FilterRow label="운영 형태">
            {TYPES.map((t) => (
              <Chip key={t} on={ctype === t} onClick={() => { setCtype(t); setLimit(24); }}>
                {t === "전체" ? "전체" : t}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="부제">
            {SHIFTS.map((s) => {
              const n = s === "전체" ? null : shiftCount(s);
              return (
                <Chip key={s} on={shift === s} disabled={n === 0} onClick={() => { setShift(s); setLimit(24); }}>
                  {s}{n !== null && <span className="opacity-60 ml-1">{n}</span>}
                </Chip>
              );
            })}
          </FilterRow>
          <FilterRow label="캐디">
            <Chip on={noCaddieOnly} disabled={noCaddieCount === 0} onClick={() => { setNoCaddieOnly(!noCaddieOnly); setLimit(24); }}>
              노캐디<span className="opacity-60 ml-1">{noCaddieCount}</span>
            </Chip>
          </FilterRow>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {sidos.length > 2 && (
              <select
                className="field !w-auto !min-h-[42px] !py-1 text-[14px]"
                value={sido}
                onChange={(e) => { setSido(e.target.value); setLimit(24); }}
                aria-label="시·도 선택"
              >
                {sidos.map((s) => (
                  <option key={s} value={s}>{s === "전체" ? "시·도 전체" : s}</option>
                ))}
              </select>
            )}
            <input
              className="field flex-1 min-w-[200px] !min-h-[42px] !py-1 text-[15px]"
              value={q}
              onChange={(e) => { setQ(e.target.value); setLimit(24); }}
              placeholder="골프장 이름 검색"
              aria-label="골프장 검색"
            />
          </div>
        </div>

        {(shift !== "전체" || noCaddieOnly) && (
          <p className="text-[13px] text-mute bg-paper rounded-lg px-3.5 py-2.5 mb-3 leading-relaxed">
            부제·캐디 운영은 <b>시즌과 요일에 따라 달라집니다.</b> 여기 표시된 내용은 각 골프장 공식 안내에서 확인한 참고
            정보이며, 실제 가능 여부는 요청하신 날짜 기준으로 저희가 확인해 견적서에 담아드립니다. 찾는 골프장이 안 보이면
            요청서에 이름을 적어주세요.
          </p>
        )}

        <p className="text-[13px] text-mute mb-3">
          {region === "전체" ? "전국" : region}
          {ctype === "전체" ? "" : ` · ${ctype}`}
          {shift === "전체" ? "" : ` · ${shift}`}
          {noCaddieOnly ? " · 노캐디" : ""} · <b className="text-ink">{filtered.length}곳</b>
        </p>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-mute text-[15px]">
            조건에 맞는 골프장을 찾지 못했습니다. 조건을 줄여 보시거나, 견적 요청서에 원하는 곳을 적어주시면 저희가 찾아드립니다.
          </p>
        ) : (
          <>
            <ul className="grid md:grid-cols-2 gap-x-8 border-t border-line">
              {filtered.slice(0, limit).map((c) => {
                const d = courseDetail(c.name);
                const link = courseLink(c.name);
                return (
                  <li key={`${c.name}-${c.sido}-${c.city}`} className="flex items-center justify-between gap-3 py-3.5 border-b border-line">
                    <div className="min-w-0">
                      <p className="font-semibold text-[15.5px] truncate">{c.name}</p>
                      <p className="text-[12.5px] text-mute mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>{c.sido} {c.city}</span>
                        {c.type && (
                          <Tag tone={c.type === "회원제" ? "navy" : "gold"}>{c.type}</Tag>
                        )}
                        {d?.holes && <Tag tone="plain">{d.holes}홀</Tag>}
                        {d?.shifts?.map((s) => <Tag key={s} tone="plain">{s}</Tag>)}
                        {d?.noCaddie && <Tag tone="green">노캐디 가능</Tag>}
                      </p>
                    </div>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="choice !min-h-[38px] !px-3 text-[13px] shrink-0"
                      title={link.official ? "골프장 공식 홈페이지" : "네이버에서 이 골프장 검색"}
                    >
                      {link.official ? "공식 홈페이지" : "정보 검색"}
                    </a>
                  </li>
                );
              })}
            </ul>
            {filtered.length > limit && (
              <button type="button" className="btn btn-light w-full mt-4" onClick={() => setLimit(limit + 48)}>
                더 보기 ({filtered.length - limit}곳 남음)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- 소품 ---------------- */

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] font-bold text-mute w-[58px] shrink-0">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  on,
  onClick,
  disabled,
  children,
}: {
  on: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="choice !min-h-[38px] !px-3.5 text-[13.5px] disabled:opacity-35 disabled:cursor-not-allowed"
      data-on={on}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      title={disabled ? "이 조건으로 확인된 골프장이 아직 없습니다" : undefined}
    >
      {children}
    </button>
  );
}

function Tag({ tone, children }: { tone: "navy" | "gold" | "plain" | "green"; children: React.ReactNode }) {
  const cls =
    tone === "navy"
      ? "bg-navy/8 text-navy"
      : tone === "gold"
        ? "bg-gold/12 text-golddeep"
        : tone === "green"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-paper text-mute";
  return <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${cls}`}>{children}</span>;
}
