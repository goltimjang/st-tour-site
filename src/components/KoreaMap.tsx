"use client";

import { useMemo, useState } from "react";
import mapData from "@/data/korea-map.json";
import { courseLink } from "@/data/course-meta";

export type Point = {
  name: string;
  sido: string;
  city: string;
  region: string;
  type: string | null;
  lng: number;
  lat: number;
};

type MapData = {
  viewBox: number[];
  proj: { lng0: number; lat1: number; cos: number; unit: number };
  paths: Record<string, string>;
};
const map: MapData = mapData;
const [VW, VH] = map.viewBox;

/** korea-map.json 생성 시와 동일한 투영 (위도 보정 등거리 원통) */
function project(lng: number, lat: number) {
  const { lng0, lat1, cos, unit } = map.proj;
  return { x: (lng - lng0) * cos * unit, y: (lat1 - lat) * unit };
}

const REGION_ORDER = ["수도권", "강원", "충청", "호남", "영남", "제주"];

export default function KoreaMap({
  points,
  region,
  onRegion,
}: {
  points: Point[];
  region: string;
  onRegion: (r: string) => void;
}) {
  const [active, setActive] = useState<Point | null>(null);

  const pins = useMemo(
    () => points.map((p) => ({ ...p, ...project(p.lng, p.lat) })),
    [points]
  );

  const link = active ? courseLink(active.name) : null;

  return (
    <div className="relative">
      <svg
        viewBox={`-14 -14 ${VW + 28} ${VH + 28}`}
        className="w-full h-auto max-h-[560px] select-none"
        role="img"
        aria-label="전국 골프장 분포 지도"
      >
        {REGION_ORDER.map((r) => {
          const on = region === r;
          const dim = region !== "전체" && !on;
          return (
            <path
              key={r}
              d={map.paths[r]}
              onClick={() => onRegion(on ? "전체" : r)}
              className="cursor-pointer transition-all duration-200"
              fill={on ? "#2f6bff" : dim ? "#33436b" : "#8fa6cf"}
              fillOpacity={dim ? 0.55 : 0.92}
              stroke="#ffffff"
              strokeWidth={on ? 2.2 : 1.4}
              strokeOpacity={dim ? 0.35 : 0.9}
            >
              <title>{`${r} 골프장 보기`}</title>
            </path>
          );
        })}

        {pins.map((p) => {
          const dim = region !== "전체" && p.region !== region;
          const isActive = active?.name === p.name;
          return (
            <circle
              key={`${p.name}-${p.city}`}
              cx={p.x}
              cy={p.y}
              r={isActive ? 6.5 : 3.4}
              fill={isActive ? "#ffffff" : p.type === "회원제" ? "#0b1f4d" : "#f0b429"}
              fillOpacity={dim ? 0.16 : 1}
              stroke={isActive ? "#0d4ff5" : "#ffffff"}
              strokeWidth={isActive ? 3 : 1}
              strokeOpacity={dim ? 0.2 : 0.95}
              className="cursor-pointer transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setActive(isActive ? null : p);
              }}
            >
              <title>{`${p.name} (${p.sido} ${p.city})`}</title>
            </circle>
          );
        })}
      </svg>

      {active && (
        <div className="absolute left-0 right-0 bottom-0 sm:left-auto sm:right-0 sm:w-[260px] rounded-xl bg-white shadow-[0_14px_36px_rgba(3,13,44,0.35)] p-4">
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
            {active.sido} {active.city}
            {active.type ? ` · ${active.type}` : ""}
          </p>
          {link && (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center rounded-lg border border-line px-3 py-2 text-[13px] font-bold text-royaldark hover:border-royal"
            >
              {link.official ? "공식 홈페이지 열기" : "골프장 정보 검색"}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
