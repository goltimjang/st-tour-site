"use client";

import { useMemo, useState } from "react";

/**
 * 출발일·도착일 범위 선택 캘린더: 첫 클릭 = 출발일, 두 번째 클릭 = 도착일.
 * 출발일보다 앞 날짜를 누르면 출발일을 다시 잡음. 같은 날 = 당일.
 * 오늘 이전 날짜는 선택 불가. 일요일 빨강, 토요일 파랑 (한국 관례).
 */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function fmt(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function diffNights(start: string, end: string) {
  return Math.round((new Date(end + "T00:00:00").getTime() - new Date(start + "T00:00:00").getTime()) / 86400000);
}

/** "4박 5일" / "당일" 라벨 */
export function stayLabel(start: string, end: string) {
  if (!start || !end) return "";
  const n = diffNights(start, end);
  return n === 0 ? "당일" : `${n}박 ${n + 1}일`;
}

function dot(s: string) {
  return s.replace(/-/g, ". ");
}

type Props = {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
};

export default function Calendar({ start, end, onChange }: Props) {
  const today = useMemo(() => {
    const t = new Date();
    return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() };
  }, []);

  const init = start ? new Date(start + "T00:00:00") : new Date();
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

  function pick(dateStr: string) {
    if (!start || (start && end)) {
      onChange(dateStr, ""); // 새 범위 시작
    } else if (dateStr < start) {
      onChange(dateStr, ""); // 출발일보다 앞이면 출발일 재설정
    } else {
      onChange(start, dateStr); // 도착일 확정 (같은 날 = 당일)
    }
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
          const isStart = start === dateStr;
          const isEnd = end === dateStr;
          const inRange = !!start && !!end && dateStr > start && dateStr < end;
          const past = isPast(d);
          const dow = (firstDay + d - 1) % 7;
          const isToday = year === today.y && month === today.m && d === today.d;
          return (
            <div
              key={d}
              className={[
                "relative flex justify-center",
                // 범위 사이 배경 띠 (출발·도착 칸은 반쪽만)
                inRange ? "bg-royal/10" : "",
                isStart && end && start !== end ? "bg-[linear-gradient(to_right,transparent_50%,rgba(13,79,245,0.1)_50%)]" : "",
                isEnd && start !== end ? "bg-[linear-gradient(to_right,rgba(13,79,245,0.1)_50%,transparent_50%)]" : "",
              ].join(" ")}
            >
              <button
                type="button"
                disabled={past}
                onClick={() => pick(dateStr)}
                aria-label={`${year}년 ${month + 1}월 ${d}일${isStart ? " 출발일" : isEnd ? " 도착일" : ""}`}
                aria-pressed={isStart || isEnd}
                className={[
                  "h-10 w-10 rounded-full text-[14.5px] font-semibold transition-colors",
                  past ? "text-line cursor-not-allowed" : "hover:bg-royal/10",
                  isStart || isEnd ? "!bg-royal !text-white font-bold" : "",
                  !isStart && !isEnd && !past && dow === 0 ? "text-red-500" : "",
                  !isStart && !isEnd && !past && dow === 6 ? "text-royal" : "",
                  !isStart && !isEnd && isToday ? "ring-1 ring-royal/50" : "",
                ].join(" ")}
              >
                {d}
              </button>
            </div>
          );
        })}
      </div>

      {/* 선택 상태 안내 */}
      <div className="mt-3 pt-3 border-t border-line text-[14px] text-center" aria-live="polite">
        {!start && <p className="text-mute">달력에서 <b>출발일</b>을 눌러주세요</p>}
        {start && !end && (
          <p>
            출발 <b className="text-royaldark">{dot(start)}</b>
            <span className="text-mute"> · 이어서 <b>도착일</b>을 눌러주세요 (같은 날 = 당일)</span>
          </p>
        )}
        {start && end && (
          <p>
            출발 <b className="text-royaldark">{dot(start)}</b> → 도착 <b className="text-royaldark">{dot(end)}</b>
            <span className="ml-1.5 inline-block rounded-full bg-royal/10 text-royaldark font-bold px-2.5 py-0.5 text-[13px]">
              {stayLabel(start, end)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
