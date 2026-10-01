"use client";

import { Children, type ReactNode, useEffect, useId, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

/** Three products, with a second cycle to allow a seamless three-card desktop loop. */
export default function CountryProductCarousel({ children, label }: { children: ReactNode; label: string }) {
  const cards = Children.toArray(children);
  const count = cards.length;
  const viewportId = useId();
  const root = useRef<HTMLDivElement>(null);
  const hold = useRef({ mouse: false, focus: false, drag: false });
  const visible = useRef(false);
  const lastMove = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [selected, setSelected] = useState(0);
  const [inView, setInView] = useState<number[]>([0, 1, 2]);
  const [viewportRef, api] = useEmblaCarousel({ loop: true, align: "start", duration: 40, inViewThreshold: .5 });

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting) lastMove.current = Date.now();
    }, { threshold: .3 });
    if (root.current) observer.observe(root.current);
    return () => { media.removeEventListener("change", update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!api) return;
    const sync = () => { setSelected(api.selectedScrollSnap() % count); setInView(api.slidesInView()); };
    const down = () => { hold.current.drag = true; };
    const up = () => { hold.current.drag = false; lastMove.current = Date.now(); };
    sync();
    api.on("select", sync).on("slidesInView", sync).on("reInit", sync).on("pointerDown", down).on("pointerUp", up);
    return () => { api.off("select", sync).off("slidesInView", sync).off("reInit", sync).off("pointerDown", down).off("pointerUp", up); };
  }, [api, count]);

  useEffect(() => {
    if (!api || paused || reduced) return;
    const timer = setInterval(() => {
      if (!visible.current || document.hidden || document.querySelector("dialog[open]") || Object.values(hold.current).some(Boolean)) {
        lastMove.current = Date.now();
        return;
      }
      if (Date.now() - lastMove.current >= 5000) {
        api.scrollPrev(); // The cards move right, including at the cycle boundary.
        lastMove.current = Date.now();
      }
    }, 250);
    return () => clearInterval(timer);
  }, [api, paused, reduced]);

  const move = (right: boolean) => {
    lastMove.current = Date.now();
    if (right) api?.scrollPrev(reduced); else api?.scrollNext(reduced);
  };

  return <div ref={root} className="country-products" role="region" aria-roledescription="슬라이드" aria-label={label} data-country-carousel={label}>
    <div id={viewportId} ref={viewportRef} className={`country-products-viewport${api ? " is-ready" : ""}`} tabIndex={0} aria-label={`${label}, 좌우 방향키 또는 드래그로 이동`}
      onMouseEnter={() => { hold.current.mouse = matchMedia("(hover: hover)").matches; }}
      onMouseLeave={() => { hold.current.mouse = false; lastMove.current = Date.now(); }}
      onFocusCapture={() => { hold.current.focus = true; }}
      onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { hold.current.focus = false; lastMove.current = Date.now(); } }}
      onKeyDown={e => { if (e.target === e.currentTarget && ["ArrowLeft", "ArrowRight"].includes(e.key)) { e.preventDefault(); move(e.key === "ArrowRight"); } }}>
      <div className="country-products-track">
        {[...cards, ...cards].map((card, index) => <div key={index} className="country-products-slide" role="group" aria-roledescription="상품" aria-label={`${index % count + 1} / ${count}`} aria-hidden={!inView.includes(index)} inert={!inView.includes(index)}>{card}</div>)}
      </div>
    </div>
    <div className="country-products-controls">
      <div className="flex items-center gap-3" aria-hidden="true"><span className="country-products-position">{String(selected + 1).padStart(2, "0")}<span> / {String(count).padStart(2, "0")}</span></span><span className="country-products-dots">{cards.map((_, i) => <span key={i} className={selected === i ? "is-current" : ""} />)}</span></div>
      <div className="flex gap-2">
        {!reduced && <button type="button" className="country-products-control country-products-pause" aria-label={`${label} ${paused ? "자동 재생" : "일시 정지"}`} aria-pressed={paused} onClick={() => { setPaused(p => !p); lastMove.current = Date.now(); }}><span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>{paused ? "자동 재생" : "일시 정지"}</button>}
        <button type="button" className="country-products-control" aria-controls={viewportId} aria-label={`${label} 카드를 왼쪽으로`} onClick={() => move(false)}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m14 5-7 7 7 7" /></svg></button>
        <button type="button" className="country-products-control" aria-controls={viewportId} aria-label={`${label} 카드를 오른쪽으로`} onClick={() => move(true)}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m10 5 7 7-7 7" /></svg></button>
      </div>
    </div>
  </div>;
}
