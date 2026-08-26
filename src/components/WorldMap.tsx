"use client";

import { useMemo, useState } from "react";
import worldMaps from "@/data/world-maps.json";
import type { CountryMeta } from "@/data/overseas-meta";

export type OverseasCourse = {
  country: string;
  area: string;
  name: string;
  nameEn?: string | null;
  city?: string | null;
  holes?: number | null;
  lat: number;
  lng: number;
  url?: string | null;
  note?: string | null;
};

type MapEntry = { viewBox: number[]; proj: { lng0: number; lat1: number; cos: number; unit: number }; d: string };
const maps = worldMaps as Record<string, MapEntry>;

export function hasMap(slug: string) {
  return Boolean(maps[slug]);
}

/** 국가 지도 + 골프장 핀. 국가마다 다른 색 테마를 받는다. */
export default function WorldMap({
  country,
  meta,
  courses,
  area,
  onArea,
}: {
  country: string;
  meta: CountryMeta;
  courses: OverseasCourse[];
  area: string;
  onArea: (a: string) => void;
}) {
  const [active, setActive] = useState<OverseasCourse | null>(null);
  const entry = maps[country];

  const pins = useMemo(() => {
    if (!entry) return [];
    const { lng0, lat1, cos, unit } = entry.proj;
    return courses.map((c) => ({
      ...c,
      x: (c.lng - lng0) * cos * unit,
      y: (lat1 - c.lat) * unit,
    }));
  }, [entry, courses]);

  if (!entry) return null;
  const [VW, VH] = entry.viewBox;
  const t = meta.theme;

  return (
    <div className="relative">
      <svg
        viewBox={`-18 -18 ${VW + 36} ${VH + 36}`}
        className="w-full h-auto max-h-[760px] select-none"
        role="img"
        aria-label={`${meta.name} 골프장 분포 지도`}
      >
        <path d={entry.d} fill={t.land} fillOpacity={0.9} stroke="#ffffff" strokeWidth={1.6} strokeOpacity={0.6} />

        {pins.map((p) => {
          const dim = area !== "전체" && p.area !== area;
          const isActive = active?.name === p.name;
          return (
            <circle
              key={`${p.name}-${p.area}`}
              cx={p.x}
              cy={p.y}
              r={isActive ? 9 : 5.4}
              fill={isActive ? "#ffffff" : t.pin}
              fillOpacity={dim ? 0.2 : 1}
              stroke={isActive ? t.active : "#ffffff"}
              strokeWidth={isActive ? 3.4 : 1.4}
              strokeOpacity={dim ? 0.25 : 0.95}
              className="cursor-pointer transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setActive(isActive ? null : p);
                if (!isActive) onArea(p.area);
              }}
            >
              <title>{`${p.name} (${p.area})`}</title>
            </circle>
          );
        })}
      </svg>

      {active && (
        <div className="absolute left-0 right-0 bottom-0 sm:left-auto sm:right-0 sm:w-[268px] rounded-xl bg-white shadow-[0_14px_36px_rgba(3,13,44,0.35)] p-4">
          <button
            type="button"
            className="absolute top-2 right-3 text-mute hover:text-ink text-[19px] leading-none"
            onClick={() => setActive(null)}
            aria-label="닫기"
          >
            ×
          </button>
          <p className="font-bold text-[15px] pr-5 text-ink leading-snug">{active.name}</p>
          <p className="text-[12.5px] text-mute mt-1">
            {active.area}
            {active.city && active.city !== active.area ? ` · ${active.city}` : ""}
            {active.holes ? ` · ${active.holes}홀` : ""}
          </p>
          {active.note && <p className="text-[13px] text-ink/75 mt-2 leading-relaxed">{active.note}</p>}
          {active.url && (
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center rounded-lg border border-line px-3 py-2 text-[13px] font-bold text-royaldark hover:border-royal"
            >
              공식 홈페이지 열기
            </a>
          )}
        </div>
      )}
    </div>
  );
}
