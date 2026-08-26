"use client";

import { useMemo, useState } from "react";
import coursesData from "@/data/golf-courses.json";
import { courseDetail, courseLink } from "@/data/course-meta";

type Course = { name: string; sido: string; city: string; region: string; type: string | null };
const courses = coursesData as Course[];

const REGION_ORDER = ["수도권", "강원", "충청", "호남", "영남", "제주"];
const TYPES = ["전체", "대중제", "회원제"] as const;
const SHIFTS = ["전체", "2부제", "3부제"] as const;
const CADDIES = ["전체", "캐디", "노캐디"] as const;

/** 권역별 한 줄 소개 (일반 고객이 감을 잡도록) */
const REGION_NOTE: Record<string, string> = {
  수도권: "서울에서 1~2시간. 당일 라운드와 1박 2일 모두 무난합니다.",
  강원: "산악 코스와 리조트가 많아 여름 라운드와 가족 여행에 좋습니다.",
  충청: "전국 어디서나 접근이 좋아 단체 행사가 많이 열립니다.",
  호남: "겨울에도 비교적 따뜻하고, 남해안 코스 풍경이 좋습니다.",
  영남: "부산·경남권 해안 코스와 온천 결합 일정이 인기입니다.",
  제주: "사계절 라운드가 가능하고 항공과 묶어 패키지로 갑니다.",
};

export default function CourseExplorer({ onPick }: { onPick: (course: Course) => void }) {
  const [region, setRegion] = useState("전체");
  const [ctype, setCtype] = useState<(typeof TYPES)[number]>("전체");
  const [shift, setShift] = useState<(typeof SHIFTS)[number]>("전체");
  const [caddie, setCaddie] = useState<(typeof CADDIES)[number]>("전체");
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
    if (caddie !== "전체") list = list.filter((c) => courseDetail(c.name)?.caddie?.includes(caddie));
    const term = q.trim().replace(/\s/g, "");
    if (term) list = list.filter((c) => (c.name + c.city + c.sido).replace(/\s/g, "").includes(term));
    return [...list].sort(
      (a, b) =>
        REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region) ||
        a.sido.localeCompare(b.sido, "ko") ||
        a.name.localeCompare(b.name, "ko")
    );
  }, [region, ctype, sido, shift, caddie, q]);

  const regionCount = (r: string) => courses.filter((c) => c.region === r).length;
  const conditionOn = shift !== "전체" || caddie !== "전체";

  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden shadow-soft">
      {/* 권역 내비게이션 */}
      <div className="bg-navy text-white p-6 sm:p-8">
        <h3 className="headline text-[22px] sm:text-[26px] mb-1.5">전국 골프장 지도</h3>
        <p className="text-[14px] text-white/70 mb-5">
          문화체육관광부 등록 {courses.length}개 골프장. 가고 싶은 권역을 누르면 그 지역 골프장이 아래에 나옵니다.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => { setRegion("전체"); reset(); }}
            aria-pressed={region === "전체"}
            className={`rounded-xl px-3 py-3 text-center transition-colors ${
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
              className={`rounded-xl px-3 py-3 text-center transition-colors ${
                region === r ? "bg-gold text-navydeep font-bold" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <span className="block text-[15px] font-bold leading-tight">{r}</span>
              <span className="block text-[12px] opacity-70 leading-tight mt-0.5">{regionCount(r)}곳</span>
            </button>
          ))}
        </div>
        {region !== "전체" && REGION_NOTE[region] && (
          <p className="mt-4 text-[14px] text-white/80 border-t border-white/15 pt-4">{REGION_NOTE[region]}</p>
        )}
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
            {SHIFTS.map((s) => (
              <Chip key={s} on={shift === s} onClick={() => { setShift(s); setLimit(24); }}>
                {s}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="캐디">
            {CADDIES.map((c) => (
              <Chip key={c} on={caddie === c} onClick={() => { setCaddie(c); setLimit(24); }}>
                {c}
              </Chip>
            ))}
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

        {conditionOn && (
          <p className="text-[13px] text-mute bg-paper rounded-lg px-3.5 py-2.5 mb-3">
            부제·캐디 정보는 확인된 골프장만 표시됩니다. 찾는 곳이 안 보이면 견적 요청서에 이름을 적어주세요. 조건 가능 여부를 확인해 드립니다.
          </p>
        )}

        <p className="text-[13px] text-mute mb-3">
          {region === "전체" ? "전국" : region}
          {ctype === "전체" ? "" : ` · ${ctype}`}
          {shift === "전체" ? "" : ` · ${shift}`}
          {caddie === "전체" ? "" : ` · ${caddie}`} · <b className="text-ink">{filtered.length}곳</b>
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
                        {d?.caddie?.map((s) => <Tag key={s} tone="plain">{s}</Tag>)}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="choice !min-h-[38px] !px-3 text-[13px]"
                        title={link.official ? "골프장 공식 홈페이지" : "네이버에서 이 골프장 검색"}
                      >
                        {link.official ? "공식 홈페이지" : "정보 검색"}
                      </a>
                      <button
                        type="button"
                        className="choice !min-h-[38px] !px-3 text-[13px] !text-royaldark !border-royal/40"
                        onClick={() => onPick(c)}
                      >
                        견적받기
                      </button>
                    </div>
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

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className="choice !min-h-[38px] !px-3.5 text-[13.5px]" data-on={on} onClick={onClick} aria-pressed={on}>
      {children}
    </button>
  );
}

function Tag({ tone, children }: { tone: "navy" | "gold" | "plain"; children: React.ReactNode }) {
  const cls =
    tone === "navy" ? "bg-navy/8 text-navy" : tone === "gold" ? "bg-gold/12 text-golddeep" : "bg-paper text-mute";
  return <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${cls}`}>{children}</span>;
}
