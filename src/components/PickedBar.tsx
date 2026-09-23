"use client";

import { useEffect, useState } from "react";
import { usePicked, type PickedKind } from "@/lib/picked";

/** 담은 골프장이 있을 때 화면 하단에 뜨는 바. 견적 폼으로 한 번에 넘긴다. */
export default function PickedBar({ kind }: { kind: PickedKind }) {
  const { names, toggle, clear, country } = usePicked(kind);
  const [inQuote, setInQuote] = useState(false);
  useEffect(() => {
    const quote = document.getElementById("quote");
    if (!quote) return;
    const observer = new IntersectionObserver(([e]) => setInQuote(e.isIntersecting));
    observer.observe(quote);
    return () => observer.disconnect();
  }, []);
  if (names.length === 0 || inQuote) return null;
  return (
    <div className="picked-bar fixed bottom-[calc(88px+env(safe-area-inset-bottom))] left-3 right-3 xl:bottom-4 xl:left-1/2 xl:right-auto xl:-translate-x-1/2 xl:w-[min(720px,calc(100vw-2rem))] z-40">
      <div className="rounded-2xl bg-navy text-white shadow-[0_16px_40px_rgba(3,13,44,0.4)] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-white/65 mb-1">담은 골프장 {names.length}곳</p>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {names.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggle(n)}
                className="shrink-0 rounded-full bg-white/12 hover:bg-white/22 px-3 py-1 text-[12.5px] font-semibold whitespace-nowrap"
                aria-label={`${n} 빼기`}
              >
                {n} <span aria-hidden="true" className="opacity-70">×</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={clear} className="rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white/75 hover:text-white">
            비우기
          </button>
          <a href={`/${kind}/?picked=1${country ? `&country=${encodeURIComponent(country)}` : ""}#quote`} className="btn btn-gold !min-h-[44px] !px-5 text-[14.5px]">
            이 골프장으로 견적 요청
          </a>
        </div>
      </div>
    </div>
  );
}
