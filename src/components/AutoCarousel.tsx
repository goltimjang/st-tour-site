"use client";
import { Children, type ReactNode, useCallback, useEffect, useRef, useState } from "react";

/** Native touch scrolling, no duplicate focusable cards, one shared timer per rail. */
export default function AutoCarousel({ children, label, variant = "cards", onDark = false }: { children: ReactNode; label: string; variant?: "cards" | "photos" | "posters"; onDark?: boolean }) {
  const rail = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const hold = useRef({ mouse: false, focus: false, touch: false });
  const visible = useRef(false);
  const lastInteraction = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const count = Children.count(children);
  const move = useCallback((direction: number) => {
    const el = rail.current;
    if (!el || el.scrollWidth <= el.clientWidth + 2) return;
    const step = (el.firstElementChild?.getBoundingClientRect().width ?? 300) + 20;
    const end = el.scrollWidth - el.clientWidth;
    const left = direction > 0 && el.scrollLeft >= end - 3 ? 0 : direction < 0 && el.scrollLeft < 3 ? end : Math.min(end, Math.max(0, el.scrollLeft + step * direction));
    el.scrollTo({ left, behavior: reduced ? "instant" : "smooth" });
  }, [reduced]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update(); media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; }, { threshold: .15 });
    if (root.current) observer.observe(root.current);
    return () => { media.removeEventListener("change", update); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (paused || reduced || count < 2) return;
    const timer = setInterval(() => {
      if (visible.current && !document.hidden && !document.querySelector("dialog[open]") && !Object.values(hold.current).some(Boolean) && Date.now() - lastInteraction.current > 4500) move(1);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused, reduced, count, move]);
  const manual = (direction: number) => { lastInteraction.current = Date.now(); move(direction); };
  const control = `h-11 rounded-full border px-4 text-sm font-semibold ${onDark ? "border-white/30 text-white hover:bg-white/10" : "border-line bg-white text-navy hover:bg-paper"}`;
  return <div ref={root} className="min-w-0" aria-roledescription="슬라이드" aria-label={label}>
    <div ref={rail} className={`auto-rail auto-rail-${variant} no-scrollbar`} tabIndex={0} role="region" aria-label={`${label}, 좌우로 넘겨 보기`}
      onMouseEnter={() => { hold.current.mouse = matchMedia("(hover: hover)").matches; }} onMouseLeave={() => { hold.current.mouse = false; }}
      onFocusCapture={() => { hold.current.focus = true; }} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) hold.current.focus = false; }}
      onTouchStart={() => { hold.current.touch = true; }} onTouchEnd={() => { hold.current.touch = false; lastInteraction.current = Date.now(); }} onTouchCancel={() => { hold.current.touch = false; }}
      onWheel={() => { lastInteraction.current = Date.now(); }}
      onKeyDown={e => { if (e.target === e.currentTarget && ["ArrowLeft", "ArrowRight"].includes(e.key)) { e.preventDefault(); manual(e.key === "ArrowRight" ? 1 : -1); } }}>
      {Children.map(children, (child, i) => <div className="auto-rail-item" role="group" aria-label={`${i + 1} / ${count}`}>{child}</div>)}
    </div>
    {count > 1 && <div className="mt-4 flex justify-end gap-2">
      <button type="button" className={control} aria-label={`${label} 이전`} onClick={() => manual(-1)}>‹</button>
      {!reduced && <button type="button" className={control} aria-label={`${label} ${paused ? "자동 재생" : "일시 정지"}`} aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? "자동 재생" : "일시 정지"}</button>}
      <button type="button" className={control} aria-label={`${label} 다음`} onClick={() => manual(1)}>›</button>
    </div>}
  </div>;
}
