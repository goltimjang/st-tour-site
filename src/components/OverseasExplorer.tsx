"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import coursesData from "@/data/overseas-courses.json";
import { countries, countryBySlug } from "@/data/overseas-meta";
import WorldMap, { hasMap, type OverseasCourse } from "@/components/WorldMap";

const all = coursesData as OverseasCourse[];

/** 마지막 글자에 받침이 있는지 (은/는, 이/가 조사 처리용) */
function hasBatchim(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}

/** 해외 골프장 지도: 국가 선택 → 국가 지도에 핀 → 지역별 목록 */
export default function OverseasExplorer() {
  const available = useMemo(
    () => countries.filter((c) => all.some((x) => x.country === c.slug)),
    []
  );
  const [country, setCountry] = useState(available[0]?.slug ?? "japan");
  const [area, setArea] = useState("전체");
  const [q, setQ] = useState("");

  const meta = countryBySlug[country];
  const inCountry = useMemo(() => all.filter((c) => c.country === country), [country]);
  const areas = useMemo(() => ["전체", ...Array.from(new Set(inCountry.map((c) => c.area)))], [inCountry]);

  const listed = useMemo(() => {
    const term = q.trim().replace(/\s/g, "").toLowerCase();
    if (term) {
      return all.filter((c) =>
        (c.name + (c.nameEn ?? "") + (c.city ?? "") + c.area).replace(/\s/g, "").toLowerCase().includes(term)
      );
    }
    return area === "전체" ? inCountry : inCountry.filter((c) => c.area === area);
  }, [inCountry, area, q]);

  if (available.length === 0 || !meta) return null;
  const t = meta.theme;
  const areaCount = (a: string) => (a === "전체" ? inCountry.length : inCountry.filter((c) => c.area === a).length);

  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden shadow-soft">
      {/* 국가 밴드 (국가마다 다른 색) */}
      <div className="text-white p-6 sm:p-8 transition-colors duration-300" style={{ backgroundColor: t.band }}>
        <h3 className="headline text-[22px] sm:text-[26px] mb-1.5">해외 골프장 지도</h3>
        <p className="text-[14px] text-white/70 mb-6">
          국가를 고르면 그 나라 지도에 골프장이 표시됩니다. 지도의 점을 누르면 어떤 코스인지 바로 볼 수 있습니다.
        </p>

        {/* 국가 선택 */}
        <div className="flex flex-wrap gap-2 mb-7">
          {available.map((c) => {
            const on = c.slug === country;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => { setCountry(c.slug); setArea("전체"); setQ(""); }}
                aria-pressed={on}
                className={`rounded-xl px-4 py-2.5 text-[14.5px] font-bold transition-colors ${
                  on ? "text-navydeep" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                style={on ? { backgroundColor: c.theme.active } : undefined}
              >
                <span className="mr-1.5" aria-hidden="true">{c.flag}</span>
                {c.name}
                <span className="ml-1.5 opacity-70 font-semibold">
                  {all.filter((x) => x.country === c.slug).length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-[minmax(0,440px)_1fr] gap-7 md:gap-10 items-start">
          <div className="mx-auto w-full max-w-[440px] md:mx-0">
            {hasMap(country) && inCountry.some((c) => Number.isFinite(c.lat)) ? (
              <WorldMap country={country} meta={meta} courses={inCountry} area={area} onArea={setArea} />
            ) : (
              <div className="rounded-xl bg-white/10 p-6">
                <p className="text-[14.5px] text-white/85 leading-relaxed mb-4">
                  {meta.name}{hasBatchim(meta.name) ? "은" : "는"} 지역이 멀리 떨어져 있어 지역별 목록으로 보여드립니다.
                </p>
                <ul className="space-y-2.5">
                  {areas
                    .filter((a) => a !== "전체")
                    .map((a) => (
                      <li key={a}>
                        <button
                          type="button"
                          onClick={() => { setArea(a); setQ(""); }}
                          className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-[14.5px] font-semibold transition-colors ${
                            area === a ? "text-navydeep" : "bg-white/10 hover:bg-white/20 text-white"
                          }`}
                          style={area === a ? { backgroundColor: t.accent } : undefined}
                        >
                          <span>{a}</span>
                          <span className="opacity-70 text-[13px]">{areaCount(a)}곳</span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            {/* 국가 소개 */}
            <div className="rounded-xl bg-white/10 p-5 mb-5">
              <p className="text-[15.5px] leading-relaxed">{meta.blurb}</p>
              <p className="text-[13.5px] text-white/70 mt-2.5">
                {meta.flight} · 추천 시즌 {meta.season}
              </p>
            </div>

            {/* 지역 선택 */}
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => {
                const on = !q && area === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => { setArea(a); setQ(""); }}
                    aria-pressed={on}
                    className={`rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                      on ? "text-navydeep" : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                    style={on ? { backgroundColor: t.accent } : undefined}
                  >
                    {a}
                    <span className="ml-1.5 opacity-65 text-[12px]">{areaCount(a)}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[12.5px] text-white/60 mt-4">
              지도의 점을 누르면 해당 지역이 자동으로 선택됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 목록 */}
      <div className="p-5 sm:p-7">
        <input
          className="field !min-h-[42px] !py-1 text-[15px] mb-4"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="골프장 이름으로 전체 국가에서 찾기"
          aria-label="해외 골프장 검색"
        />

        <p className="text-[13px] text-mute mb-3">
          {q ? "검색 결과" : `${meta.name}${area === "전체" ? "" : ` · ${area}`}`} ·{" "}
          <b className="text-ink">{listed.length}곳</b>
        </p>

        {listed.length === 0 ? (
          <p className="py-8 text-center text-mute text-[15px]">
            찾는 골프장이 없나요? 견적 요청서에 이름을 적어주시면 현지 네트워크로 확인해 드립니다.
          </p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-x-8 border-t border-line">
            {listed.map((c) => (
              <li key={`${c.country}-${c.name}`} className="flex items-start justify-between gap-3 py-3.5 border-b border-line">
                <div className="min-w-0">
                  <p className="font-semibold text-[15.5px]">{c.name}</p>
                  <p className="text-[12.5px] text-mute mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    {q && <span className="font-bold" style={{ color: countryBySlug[c.country]?.theme.band }}>
                      {countryBySlug[c.country]?.name}
                    </span>}
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
