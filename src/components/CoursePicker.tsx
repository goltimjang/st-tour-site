"use client";

import { useMemo, useState } from "react";
import coursesData from "@/data/golf-courses.json";

type Course = { name: string; sido: string; city: string; region: string; type: string | null };
const courses = coursesData as Course[];
const REGION_ORDER = ["수도권", "강원", "충청", "호남", "영남", "제주"];

/**
 * 견적 폼의 선호 골프장 선택기.
 * 권역을 누르면 그 지역 골프장 목록이 펼쳐지고, 클릭으로 담는다 (복수 선택).
 * 직접 입력도 함께 지원해 목록에 없는 곳도 요청할 수 있게 한다.
 */
export default function CoursePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(REGION_ORDER[0]);
  const [q, setQ] = useState("");

  const picked = value.split(",").map((s) => s.trim()).filter(Boolean);

  const list = useMemo(() => {
    const term = q.trim().replace(/\s/g, "");
    let l = term ? courses : courses.filter((c) => c.region === region);
    if (term) l = l.filter((c) => (c.name + c.city + c.sido).replace(/\s/g, "").includes(term));
    return [...l].sort((a, b) => a.sido.localeCompare(b.sido, "ko") || a.name.localeCompare(b.name, "ko")).slice(0, 80);
  }, [region, q]);

  function toggle(name: string) {
    const next = picked.includes(name) ? picked.filter((p) => p !== name) : [...picked, name];
    onChange(next.join(", "));
  }

  return (
    <div className="space-y-2.5">
      <input
        className="field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="예: 비발디파크CC / 비워두셔도 됩니다. 저희가 추천해 드립니다"
      />

      <button
        type="button"
        className="choice !min-h-[42px] !px-4 text-[14px] w-full sm:w-auto"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? "목록 닫기" : "지역별 골프장 목록에서 고르기"}
      </button>

      {picked.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {picked.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggle(p)}
              className="rounded-full bg-royal/10 text-royaldark text-[13px] font-semibold px-3 py-1.5 hover:bg-royal/20"
              aria-label={`${p} 선택 해제`}
            >
              {p} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="rounded-xl border border-line bg-paper p-3.5">
          {/* 권역 내비게이션 */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {REGION_ORDER.map((r) => (
              <button
                key={r}
                type="button"
                className="choice !min-h-[36px] !px-3 text-[13px]"
                data-on={!q && region === r}
                onClick={() => { setRegion(r); setQ(""); }}
              >
                {r}
              </button>
            ))}
          </div>

          <input
            className="field !min-h-[40px] !py-1 text-[14px] mb-3"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="골프장 이름으로 바로 찾기"
            aria-label="골프장 이름 검색"
          />

          <div className="max-h-[260px] overflow-y-auto rounded-lg bg-white border border-line">
            {list.length === 0 ? (
              <p className="p-4 text-[14px] text-mute text-center">
                찾는 골프장이 없으면 위 칸에 직접 적어주세요.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {list.map((c) => {
                  const on = picked.includes(c.name);
                  return (
                    <li key={`${c.name}-${c.city}`}>
                      <button
                        type="button"
                        onClick={() => toggle(c.name)}
                        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-paper ${on ? "bg-royal/5" : ""}`}
                        aria-pressed={on}
                      >
                        <span className="min-w-0">
                          <span className="block font-semibold text-[14.5px] truncate">{c.name}</span>
                          <span className="block text-[12px] text-mute">{c.sido} {c.city}{c.type ? ` · ${c.type}` : ""}</span>
                        </span>
                        <span className={`shrink-0 text-[13px] font-bold ${on ? "text-royal" : "text-mute"}`}>
                          {on ? "선택됨" : "담기"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <p className="text-[12.5px] text-mute mt-2.5">
            {q ? "검색 결과" : `${region} 골프장`} · 여러 곳을 담으면 비교 견적으로 보내드립니다.
          </p>
        </div>
      )}
    </div>
  );
}
