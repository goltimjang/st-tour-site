"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import eventsData from "@/data/events.json";

export default function EventGallery() {
  const rail = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  function move(direction: number) {
    const el = rail.current!;
    const distance = (el.firstElementChild?.getBoundingClientRect().width ?? 360) + 16;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 3;
    const atStart = el.scrollLeft < 3;
    const left = direction > 0 && atEnd ? 0 : direction < 0 && atStart ? el.scrollWidth : el.scrollLeft + distance * direction;
    el.scrollTo({ left, behavior: reduced ? "instant" : "smooth" });
  }
  useEffect(() => {
    if (paused || interacting || reduced) return;
    const timer = setInterval(() => {
      if (!document.hidden && !document.querySelector("dialog[open]")) move(1);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused, interacting, reduced]);
  return <div className="mx-auto max-w-6xl px-5" onMouseEnter={() => { if (matchMedia("(hover: hover)").matches) setInteracting(true); }} onMouseLeave={() => setInteracting(false)} onFocusCapture={e => setInteracting(rail.current?.contains(e.target as Node) ?? false)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setInteracting(false); }}>
    <div ref={rail} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2" tabIndex={0} role="region" aria-label="실제 대회 현장 사진, 좌우로 넘겨 보기" onTouchStart={() => setInteracting(true)} onTouchEnd={() => setInteracting(false)} onTouchCancel={() => setInteracting(false)}>
      {eventsData.map(p => <figure key={p.src} className="shrink-0 snap-start w-[260px] sm:w-[360px] rounded-2xl overflow-hidden border border-line bg-white"><Image src={p.src} alt={`${p.caption} 현장 사진`} width={360} height={240} className="w-full h-[190px] sm:h-[240px] object-cover" sizes="(max-width: 640px) 260px, 360px" /><figcaption className="p-4 text-sm font-semibold">{p.caption}</figcaption></figure>)}
    </div>
    <div className="mt-3 flex justify-end gap-2">
      <button type="button" className="h-11 w-11 rounded-full border border-line bg-white text-xl" aria-label="이전 행사 사진" onClick={() => move(-1)}>‹</button>
      {!reduced && <button type="button" className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold" aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? "자동 재생" : "일시 정지"}</button>}
      <button type="button" className="h-11 w-11 rounded-full border border-line bg-white text-xl" aria-label="다음 행사 사진" onClick={() => move(1)}>›</button>
    </div>
  </div>;
}
