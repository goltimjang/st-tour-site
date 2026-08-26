"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import coursesData from "@/data/overseas-courses.json";

type OverseasCourse = {
  country: string;
  area: string;
  name: string;
  nameEn?: string | null;
  city?: string | null;
  holes?: number | null;
  url?: string | null;
  note?: string | null;
};

const courses = coursesData as OverseasCourse[];

const COUNTRIES = [
  { slug: "japan", name: "일본", flight: "1시간 20분~", season: "규슈·오키나와는 겨울, 홋카이도는 여름" },
  { slug: "vietnam", name: "베트남", flight: "4시간 30분~", season: "11~4월 (다낭은 2~8월)" },
  { slug: "thailand", name: "태국", flight: "5시간 30분~", season: "11~2월 건기" },
  { slug: "china", name: "중국", flight: "1시간 30분~", season: "산둥 4~11월, 하이난 겨울" },
  { slug: "philippines", name: "필리핀", flight: "4시간~", season: "11~5월 건기" },
];

/** 해외 골프장 지도: 국가 → 지역 → 골프장. 국내 지도와 같은 조작 방식. */
export default function OverseasExplorer() {
  const [country, setCountry] = useState(COUNTRIES[0].slug);
  const [area, setArea] = useState("전체");
  const [q, setQ] = useState("");

  const areas = useMemo(() => {
    const inCountry = courses.filter((c) => c.country === country);
    return ["전체", ...Array.from(new Set(inCountry.map((c) => c.area)))];
  }, [country]);

  const filtered = useMemo(() => {
    const term = q.trim().replace(/\s/g, "").toLowerCase();
    let list = term ? courses : courses.filter((c) => c.country === country);
    if (!term && area !== "전체") list = list.filter((c) => c.area === area);
    if (term) {
      list = list.filter((c) =>
        (c.name + (c.nameEn ?? "") + (c.city ?? "") + c.area).replace(/\s/g, "").toLowerCase().includes(term)
      );
    }
    return list;
  }, [country, area, q]);

  const countryCount = (slug: string) => courses.filter((c) => c.country === slug).length;
  const current = COUNTRIES.find((c) => c.slug === country)!;

  if (courses.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden shadow-soft">
      {/* 국가 내비게이션 */}
      <div className="bg-navy text-white p-6 sm:p-8">
        <h3 className="headline text-[22px] sm:text-[26px] mb-1.5">해외 골프장 지도</h3>
        <p className="text-[14px] text-white/70 mb-5">
          국가를 누르면 지역별 골프장이 나옵니다. 마음에 드는 곳을 견적 요청서에 적어주시면 그 코스로 일정을 짜드립니다.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {COUNTRIES.filter((c) => countryCount(c.slug) > 0).map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => { setCountry(c.slug); setArea("전체"); setQ(""); }}
              aria-pressed={country === c.slug}
              className={`rounded-xl px-3 py-3 text-center transition-colors ${
                country === c.slug ? "bg-gold text-navydeep font-bold" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <span className="block text-[15px] font-bold leading-tight">{c.name}</span>
              <span className="block text-[12px] opacity-70 leading-tight mt-0.5">{countryCount(c.slug)}곳</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-[13.5px] text-white/80 border-t border-white/15 pt-4">
          비행 {current.flight} · 추천 시즌 {current.season}
        </p>
      </div>

      <div className="p-5 sm:p-7">
        {/* 지역 필터 + 검색 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {areas.map((a) => (
            <button
              key={a}
              type="button"
              className="choice !min-h-[38px] !px-3.5 text-[13.5px]"
              data-on={!q && area === a}
              onClick={() => { setArea(a); setQ(""); }}
            >
              {a}
            </button>
          ))}
        </div>
        <input
          className="field !min-h-[42px] !py-1 text-[15px] mb-4"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="골프장 이름으로 전체 국가에서 찾기"
          aria-label="해외 골프장 검색"
        />

        <p className="text-[13px] text-mute mb-3">
          {q ? "검색 결과" : `${current.name}${area === "전체" ? "" : ` · ${area}`}`} · <b className="text-ink">{filtered.length}곳</b>
        </p>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-mute text-[15px]">
            찾는 골프장이 없나요? 견적 요청서에 이름을 적어주시면 현지 네트워크로 확인해 드립니다.
          </p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-x-8 border-t border-line">
            {filtered.map((c) => (
              <li key={`${c.country}-${c.name}`} className="flex items-start justify-between gap-3 py-3.5 border-b border-line">
                <div className="min-w-0">
                  <p className="font-semibold text-[15.5px]">{c.name}</p>
                  <p className="text-[12.5px] text-mute mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>{c.area}{c.city && c.city !== c.area ? ` · ${c.city}` : ""}</span>
                    {c.holes && <span className="rounded bg-paper px-1.5 py-0.5 text-[11px] font-bold">{c.holes}홀</span>}
                  </p>
                  {c.note && <p className="text-[13px] text-mute mt-1">{c.note}</p>}
                </div>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="choice !min-h-[36px] !px-3 text-[12.5px] shrink-0"
                  >
                    공식 홈페이지
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 rounded-xl bg-paper p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-[14.5px]">
            가고 싶은 코스를 정하셨나요? <b>견적 요청서 요청사항에 골프장 이름</b>을 적어주세요.
          </p>
          <Link href="/overseas#quote" className="btn btn-royal shrink-0 !min-h-[44px] !px-5 text-[14.5px]">
            견적 요청하기
          </Link>
        </div>
      </div>
    </div>
  );
}
