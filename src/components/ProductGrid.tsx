"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import Reveal from "@/components/Reveal";

/** 상품 목록: 국내/해외 탭 + 국가 칩으로 거른다. 상품이 적을 때는 탭을 감춘다. */
export default function ProductGrid({ products }: { products: Product[] }) {
  const [kind, setKind] = useState<"전체" | "국내" | "해외">("전체");
  const [country, setCountry] = useState("전체");

  const countries = useMemo(() => {
    const base = kind === "전체" ? products : products.filter((p) => p.kind === kind);
    return ["전체", ...Array.from(new Set(base.map((p) => p.country)))];
  }, [products, kind]);

  const list = products.filter((p) => (kind === "전체" || p.kind === kind) && (country === "전체" || p.country === country));
  const showFilter = products.length >= 4;

  return (
    <>
      {showFilter && (
        <div className="mb-7 space-y-3">
          <div className="flex gap-2">
            {(["전체", "국내", "해외"] as const).map((k) => (
              <button key={k} type="button" className="choice !min-h-[42px] !px-4 text-[14.5px]" data-on={kind === k} onClick={() => { setKind(k); setCountry("전체"); }}>
                {k}
                <span className="opacity-60 ml-1.5 text-[12.5px]">{k === "전체" ? products.length : products.filter((p) => p.kind === k).length}</span>
              </button>
            ))}
          </div>
          {countries.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {countries.map((c) => (
                <button key={c} type="button" className="choice !min-h-[36px] !px-3 text-[13px]" data-on={country === c} onClick={() => setCountry(c)}>{c}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {list.length === 0 ? (
        <p className="py-10 text-center text-mute">이 조건의 상품은 아직 없습니다. 견적을 요청하시면 조건에 맞게 짜드립니다.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link href={`/products/${p.slug}`} className="group card-lift block rounded-2xl overflow-hidden border border-line bg-white shadow-soft h-full">
                {/* 1:1 정사각형 썸네일 */}
                <div className="img-zoom relative aspect-square">
                  <Image src={p.thumb} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" className="object-cover" />
                  {p.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-gold text-navydeep text-[12px] font-black px-3 py-1.5">{p.badge}</span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[12.5px] text-mute mb-1.5">
                    {p.kind} · {p.country}{p.duration ? ` · ${p.duration}` : ""}
                  </p>
                  <h2 className="font-bold text-[17px] leading-snug mb-2 group-hover:text-royal">{p.title}</h2>
                  <p className="text-[14px] text-mute leading-relaxed mb-3 line-clamp-2">{p.summary}</p>
                  <p>
                    {p.priceOriginal && <span className="text-mute/70 line-through mr-2 text-[14px]">{p.priceOriginal}</span>}
                    <span className="font-display text-[22px] text-royaldark">{p.price}</span>
                  </p>
                  {p.date && <p className="text-[12.5px] text-mute mt-1.5">{p.date}</p>}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
