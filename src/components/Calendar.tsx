"use client";

import { useMemo, useState } from "react";

/**
 * 출발일 선택 캘린더: 연·월 이동 + 날짜 클릭 선택.
 * 오늘 이전 날짜는 선택 불가. 일요일 빨강, 토요일 파랑 (한국 관례).
 */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function fmt(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function Calendar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = useMemo(() => {
    const t = new Date();
    return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() };
  }, []);

  const init = value ? new Date(value + "T00:00:00") : new Date();
  const [year, setYear] = useState(init.getFullYear());
  const [month, setMonth] = useState(init.getMonth());

  const canGoPrev = year > today.y || (year === today.y && month > today.m);

  function move(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    if (y < today.y || (y === today.y && m < today.m)) return;
    setYear(y);
    setMonth(m);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isPast = (d: number) =>
    year < today.y || (year === today.y && month < today.m) || (year === today.y && month === today.m && d < today.d);

  return (
    <div className="rounded-xl border border-line bg-white p-4 max-w-[360px]">
      {/* 연월 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={!canGoPrev}
          className="h-10 w-10 rounded-lg border border-line text-[18px] font-bold hover:border-royal disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="이전 달"
        >
          ‹
        </button>
        <p className="font-bold text-[17px]" aria-live="polite">
          {year}년 {month + 1}월
        </p>
        <button
          type="button"
          onClick={() => move(1)}
          className="h-10 w-10 rounded-lg border border-line text-[18px] font-bold hover:border-royal"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={`text-center text-[12.5px] font-bold py-1 ${i === 0 ? "text-red-500" : i === 6 ? "text-royal" : "text-mute"}`}>
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />;
          const dateStr = fmt(year, month, d);
          const selected = value === dateStr;
          const past = isPast(d);
          const dow = (firstDay + d - 1) % 7;
          const isToday = year === today.y && month === today.m && d === today.d;
          return (
            <button
              key={d}
              type="button"
              disabled={past}
              onClick={() => onChange(dateStr)}
              aria-label={`${year}년 ${month + 1}월 ${d}일${selected ? " 선택됨" : ""}`}
              aria-pressed={selected}
              className={[
                "mx-auto h-10 w-10 rounded-full text-[14.5px] font-semibold transition-colors",
                past ? "text-line cursor-not-allowed" : "hover:bg-royal/10",
                selected ? "!bg-royal !text-white font-bold" : "",
                !selected && !past && dow === 0 ? "text-red-500" : "",
                !selected && !past && dow === 6 ? "text-royal" : "",
                !selected && isToday ? "ring-1 ring-royal/50" : "",
              ].join(" ")}
            >
              {d}
            </button>
          );
        })}
      </div>

      {value && (
        <p className="mt-3 pt-3 border-t border-line text-[14px] text-center">
          출발일: <b className="text-royaldark">{value.replace(/-/g, ". ")}</b>
        </p>
      )}
    </div>
  );
}
