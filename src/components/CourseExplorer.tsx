"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import coursesData from "@/data/golf-courses.json";

type Course = { name: string; sido: string; city: string; region: string; type: string | null };
const courses = coursesData as Course[];

const REGIONS = ["전체", "수도권", "강원", "충청", "호남", "영남", "제주"] as const;
const TYPES = ["전체", "대중제", "회원제"] as const;
const REGION_ORDER = ["수도권", "강원", "충청", "호남", "영남", "제주"];

/** 전국 골프장 찾기: 지도 + 권역·운영형태 필터 + 리스트 */
export default function CourseExplorer({ onPick }: { onPick: (course: Course) => void }) {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("전체");
  const [ctype, setCtype] = useState<(typeof TYPES)[number]>("전체");
  const [sido, setSido] = useState("전체");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(24);

  const sidos = useMemo(() => {
    const inRegion = region === "전체" ? courses : courses.filter((c) => c.region === region);
    return ["전체", ...Array.from(new Set(inRegion.map((c) => c.sido))).sort((a, b) => a.localeCompare(b, "ko"))];
  }, [region]);

  const filtered = useMemo(() => {
    let list = courses;
    if (region !== "전체") list = list.filter((c) => c.region === region);
    if (ctype !== "전체") list = list.filter((c) => c.type === ctype);
    if (sido !== "전체") list = list.filter((c) => c.sido === sido);
    const term = q.trim().replace(/\s/g, "");
    if (term) list = list.filter((c) => (c.name + c.city + c.sido).replace(/\s/g, "").includes(term));
    return [...list].sort(
      (a, b) =>
        REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region) ||
        a.sido.localeCompare(b.sido, "ko") ||
        a.name.localeCompare(b.name, "ko")
    );
  }, [region, ctype, sido, q]);

  const regionCount = (r: string) => courses.filter((c) => c.region === r).length;

  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden shadow-soft">
      {/* 지도 헤더 */}
      <div className="grid md:grid-cols-2 items-stretch border-b border-line">
        <div className="relative min-h-[240px] bg-[#f7f3e8]">
          <Image src="/images/map-korea.jpg" alt="전국 골프장 지도" fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
        </div>
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <h3 className="headline text-[22px] sm:text-[25px] mb-1.5">전국 골프장 찾기</h3>
          <p className="text-[14px] text-mute mb-5">
            문화체육관광부 등록 골프장 {courses.length}개 · 권역을 누르면 해당 지역 골프장이 아래에 나옵니다
          </p>
          <div className="grid grid-cols-3 gap-2">
            {REGION_ORDER.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRegion(region === r ? "전체" : (r as (typeof REGIONS)[number])); setSido("전체"); setLimit(24); }}
                className="choice !min-h-[52px] flex-col !gap-0"
                data-on={region === r}
              >
                <span className="text-[15px] font-bold leading-tight">{r}</span>
                <span className="text-[12px] text-mute leading-tight">{regionCount(r)}곳</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* 운영형태 + 시도 + 검색 */}
        <div className="flex flex-wrap gap-2.5 mb-4">
          {TYPES.map((t) => (
            <button key={t} type="button" className="choice !min-h-[42px] !px-4 text-[14px]" data-on={ctype === t} onClick={() => { setCtype(t); setLimit(24); }}>
              {t === "전체" ? "전체 보기" : t}
            </button>
          ))}
          {sidos.length > 2 && (
            <select className="field !w-auto !min-h-[42px] !py-1 text-[14px]" value={sido} onChange={(e) => { setSido(e.target.value); setLimit(24); }} aria-label="시·도 선택">
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

        <p className="text-[13px] text-mute mb-3">
          {region === "전체" ? "전국" : region} {ctype === "전체" ? "" : `· ${ctype}`} · {filtered.length}개
        </p>

        {/* 리스트 (2열) */}
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-mute">
            검색 결과가 없습니다. 이름이 정확하지 않아도 괜찮습니다. 견적 요청서에 적어주시면 저희가 찾아드립니다.
          </p>
        ) : (
          <>
            <ul className="grid md:grid-cols-2 gap-x-8 border-t border-line">
              {filtered.slice(0, limit).map((c) => (
                <li key={`${c.name}-${c.sido}`} className="flex items-center justify-between gap-3 py-3 border-b border-line">
                  <div className="min-w-0">
                    <p className="font-semibold text-[15px] truncate">{c.name}</p>
                    <p className="text-[12.5px] text-mute">
                      {c.sido} {c.city}
                      {c.type && (
                        <span className={`ml-2 rounded px-1.5 py-0.5 text-[11px] font-bold ${c.type === "회원제" ? "bg-navy/8 text-navy" : "bg-gold/12 text-golddeep"}`}>
                          {c.type}
                        </span>
                      )}
                    </p>
                  </div>
                  <button type="button" className="choice !min-h-[38px] !px-3 text-[13px] shrink-0 !text-royaldark !border-royal/40" onClick={() => onPick(c)}>
                    견적받기
                  </button>
                </li>
              ))}
            </ul>
            {filtered.length > limit && (
              <button type="button" className="btn btn-light w-full mt-4" onClick={() => setLimit(limit + 48)}>
                더 보기 ({filtered.length - limit}개 남음)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
