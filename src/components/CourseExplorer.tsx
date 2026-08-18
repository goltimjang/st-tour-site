"use client";

import { useMemo, useState } from "react";
import coursesData from "@/data/golf-courses.json";

type Course = { name: string; sido: string; city: string; region: string; type: string | null };
const courses = coursesData as Course[];

const REGIONS = ["전체", "수도권", "강원", "충청", "호남", "영남", "제주"] as const;

/** 전국 504개 골프장 탐색기 — 지역 탭 + 검색 + "이 골프장으로 견적받기" */
export default function CourseExplorer({ onPick }: { onPick: (course: Course) => void }) {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("전체");
  const [sido, setSido] = useState("전체");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(30);

  const sidos = useMemo(() => {
    const inRegion = region === "전체" ? courses : courses.filter((c) => c.region === region);
    return ["전체", ...Array.from(new Set(inRegion.map((c) => c.sido)))];
  }, [region]);

  const REGION_ORDER = ["수도권", "강원", "충청", "호남", "영남", "제주"];
  const filtered = useMemo(() => {
    let list = courses;
    if (region !== "전체") list = list.filter((c) => c.region === region);
    if (sido !== "전체") list = list.filter((c) => c.sido === sido);
    const term = q.trim().replace(/\s/g, "");
    if (term) list = list.filter((c) => (c.name + c.city + c.sido).replace(/\s/g, "").includes(term));
    return [...list].sort(
      (a, b) =>
        REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region) ||
        a.sido.localeCompare(b.sido, "ko") ||
        a.name.localeCompare(b.name, "ko")
    );
  }, [region, sido, q]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-5">
        <h3 className="font-bold text-[18px]">전국 골프장 찾기</h3>
        <span className="text-[13.5px] text-mute">문화체육관광부 등록 골프장 기준 {courses.length}개</span>
      </div>

      {/* 권역 탭 */}
      <div className="flex flex-wrap gap-2 mb-3" role="tablist" aria-label="권역 선택">
        {REGIONS.map((r) => (
          <button
            key={r}
            role="tab"
            aria-selected={region === r}
            className="choice !min-h-[44px] !px-4 text-[15px]"
            data-on={region === r}
            onClick={() => {
              setRegion(r);
              setSido("전체");
              setLimit(30);
            }}
          >
            {r}
            {r !== "전체" && (
              <span className="ml-1.5 text-[12px] text-mute">{courses.filter((c) => c.region === r).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* 시도 + 검색 */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        {sidos.length > 2 && (
          <select className="field sm:!w-44" value={sido} onChange={(e) => { setSido(e.target.value); setLimit(30); }} aria-label="시·도 선택">
            {sidos.map((s) => (
              <option key={s} value={s}>{s === "전체" ? "시·도 전체" : s}</option>
            ))}
          </select>
        )}
        <input
          className="field flex-1"
          value={q}
          onChange={(e) => { setQ(e.target.value); setLimit(30); }}
          placeholder="골프장 이름으로 검색 (예: 비발디, 사우스케이프)"
          aria-label="골프장 검색"
        />
      </div>

      {/* 리스트 */}
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-mute">
          검색 결과가 없습니다. 이름이 정확하지 않아도 괜찮습니다 — 견적 요청에 적어주시면 저희가 찾아드립니다.
        </p>
      ) : (
        <>
          <ul className="divide-y divide-line border-t border-line">
            {filtered.slice(0, limit).map((c) => (
              <li key={`${c.name}-${c.sido}`} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-[15.5px] truncate">{c.name}</p>
                  <p className="text-[13px] text-mute">
                    {c.sido} {c.city}
                    {c.type && <span className="ml-2 rounded bg-paper px-1.5 py-0.5 text-[11.5px] font-bold text-mute">{c.type}</span>}
                  </p>
                </div>
                <button type="button" className="choice !min-h-[42px] !px-3.5 text-[14px] shrink-0 !text-royaldark !border-royal/40" onClick={() => onPick(c)}>
                  이 골프장으로 견적받기
                </button>
              </li>
            ))}
          </ul>
          {filtered.length > limit && (
            <button type="button" className="btn btn-light w-full mt-4" onClick={() => setLimit(limit + 50)}>
              더 보기 ({filtered.length - limit}개 남음)
            </button>
          )}
        </>
      )}
    </div>
  );
}
