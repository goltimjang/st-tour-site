"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Country = { slug: string; name: string; image: string; count: number };
export default function CountryCarousel({ countries }: { countries: Country[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const el = rail.current!;
    const update = () => setEdges({ start: el.scrollLeft < 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); el.removeEventListener("scroll", update); };
  }, []);
  function move(direction: number) {
    const el = rail.current!;
    el.scrollBy({ left: direction * el.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <div className="country-carousel relative">
    <div ref={rail} className="country-rail no-scrollbar" role="region" aria-label="나라별 골프여행" tabIndex={0} onKeyDown={e => { if (e.target !== e.currentTarget) return; if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); move(e.key === "ArrowRight" ? 1 : -1); } }}>
      {countries.map(c => <Link key={c.slug} href={`/products/country/${c.slug}/`} className="group min-w-0 text-center snap-start"><div className="relative aspect-[5/4] rounded-2xl overflow-hidden bg-white"><Image src={c.image} alt={`${c.name} 지역 소개용 AI 이미지, 실제 상품 시설 아님`} fill sizes="(max-width: 639px) 38vw, (max-width: 1023px) 25vw, 180px" className="object-cover motion-safe:group-hover:scale-105 transition-transform" /></div><h3 className="font-bold mt-3 text-[15px] sm:text-lg">{c.name}</h3><p className="text-xs text-mute">{c.count}개 상품</p></Link>)}
    </div>
    <button type="button" aria-label="이전 국가 보기" disabled={edges.start} onClick={() => move(-1)} className={`country-arrow left-0 -translate-x-1/3 ${edges.start ? "invisible" : ""}`}>‹</button>
    <button type="button" aria-label="다음 국가 보기" disabled={edges.end} onClick={() => move(1)} className={`country-arrow right-0 translate-x-1/3 ${edges.end ? "invisible" : ""}`}>›</button>
  </div>;
}
