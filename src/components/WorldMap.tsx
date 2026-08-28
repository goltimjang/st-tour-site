"use client";

import { useMemo, useState } from "react";
import worldMaps from "@/data/world-maps.json";
import worldAreas from "@/data/world-areas.json";
import type { CountryMeta } from "@/data/overseas-meta";
import { useMapZoom } from "@/components/useMapZoom";
import MapZoomControls from "@/components/MapZoomControls";

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
const areaPaths = worldAreas as Record<string, Record<string, string>>;

/** 공식 홈페이지가 없는 골프장은 구글 검색으로 안내 (영문명이 있으면 더 정확) */
export function searchUrl(c: { name: string; nameEn?: string | null }) {
  const q = c.nameEn ? `${c.nameEn} golf` : `${c.name} 골프장`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

/**
 * 지도를 띄울지 판단.
 * 가로로 지나치게 긴 나라(말레이시아처럼 반도와 보르네오가 멀리 떨어진 경우)는
 * 지도로 그리면 핀이 알아볼 수 없이 작아져 목록으로 대신한다.
 */
export function hasMap(slug: string) {
  const m = maps[slug];
  if (!m) return false;
  const [w, h] = m.viewBox;
  return w / h <= 1.8;
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
  const vb = entry ? entry.viewBox : [100, 100];
  const zoom = useMapZoom({ x: -18, y: -18, w: vb[0] + 36, h: vb[1] + 36 });
  const v = zoom.view;

  const pins = useMemo(() => {
    if (!entry) return [];
    const { lng0, lat1, cos, unit } = entry.proj;
    // 좌표가 확인된 골프장만 지도에 표시 (미확인 항목은 아래 목록에만 나온다)
    return courses
      .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng))
      .map((c) => ({ ...c, x: (c.lng - lng0) * cos * unit, y: (lat1 - c.lat) * unit }));
  }, [entry, courses]);

  if (!entry) return null;
  const [VW, VH] = entry.viewBox;
  const t = meta.theme;

  return (
    <div className="relative">
      <svg
        ref={zoom.ref}
        viewBox={`${v.x} ${v.y} ${v.w} ${v.h}`}
        className={`w-full h-auto max-h-[760px] select-none touch-none ${zoom.scale > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
        role="img"
        aria-label={`${meta.name} 골프장 분포 지도`}
        {...zoom.handlers}
      >
        {/* 국가 전체 윤곽 */}
        <path
          d={entry.d}
          fill={area === "전체" ? t.land : t.landDim}
          fillOpacity={area === "전체" ? 0.9 : 0.75}
          stroke="#ffffff"
          strokeWidth={1.6}
          strokeOpacity={0.5}
        />

        {/* 지역 영역: 클릭해서 고르고, 선택하면 색으로 구분 */}
        {Object.entries(areaPaths[country] ?? {}).map(([a, d]) => {
          const on = area === a;
          return (
            <path
              key={a}
              d={d}
              onClick={() => { if (zoom.didDrag()) return; onArea(on ? "전체" : a); }}
              className="cursor-pointer transition-all duration-200"
              fill={on ? t.active : t.land}
              fillOpacity={on ? 0.95 : area === "전체" ? 0.55 : 0.25}
              stroke="#ffffff"
              strokeWidth={on ? 2 : 1}
              strokeOpacity={on ? 0.9 : 0.45}
            >
              <title>{`${a} 골프장 보기`}</title>
            </path>
          );
        })}

        {pins.map((p) => {
          const dim = area !== "전체" && p.area !== area;
          const isActive = active?.name === p.name;
          return (
            <circle
              key={`${p.name}-${p.area}`}
              cx={p.x}
              cy={p.y}
              r={(isActive ? 9 : 5.4) / Math.max(1, zoom.scale * 0.72)}
              fill={isActive ? "#ffffff" : t.pin}
              fillOpacity={dim ? 0.2 : 1}
              stroke={isActive ? t.active : "#ffffff"}
              strokeWidth={(isActive ? 3.4 : 1.4) / Math.max(1, zoom.scale * 0.72)}
              strokeOpacity={dim ? 0.25 : 0.95}
              className="cursor-pointer transition-all"
              onClick={(e) => {
                e.stopPropagation();
                if (zoom.didDrag()) return;
                setActive(isActive ? null : p);
                if (!isActive) onArea(p.area);
              }}
            >
              <title>{`${p.name} (${p.area})`}</title>
            </circle>
          );
        })}
      </svg>

      <MapZoomControls zoom={zoom} />

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
          <a
            href={active.url ?? searchUrl(active)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center rounded-lg border border-line px-3 py-2 text-[13px] font-bold text-royaldark hover:border-royal"
          >
            {active.url ? "공식 홈페이지 열기" : "골프장 정보 검색"}
          </a>
        </div>
      )}
    </div>
  );
}
