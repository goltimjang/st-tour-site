"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { countryBySlug } from "@/data/overseas-meta";
import { publishedProducts } from "@/data/products";

/**
 * 헤더 통합 검색. 열릴 때만 골프장 데이터를 불러와 첫 화면 용량을 아낀다.
 * 결과는 국내 골프장 / 해외 골프장 / 상품 세 묶음으로 보여준다.
 */
type Kr = { name: string; sido: string; city: string; region: string };
type Ov = { country: string; area: string; name: string; nameEn?: string | null; city?: string | null };

const PAGES = [
  { label: "국내 골프투어 견적", href: "/domestic#quote", keys: "국내 견적 투어" },
  { label: "해외 골프투어 견적", href: "/overseas#quote", keys: "해외 견적 투어" },
  { label: "전국 골프장 지도", href: "/domestic#courses", keys: "국내 골프장 지도 전국" },
  { label: "해외 골프장 지도", href: "/overseas#courses", keys: "해외 골프장 지도 세계" },
  { label: "시즌별 추천 여행지", href: "/seasons", keys: "시즌 계절 월별 추천 언제" },
  { label: "프로모션 · 로얄CC 페스티벌", href: "/promotion", keys: "프로모션 대회 페스티벌 로얄" },
  { label: "자주 묻는 질문", href: "/faq", keys: "질문 faq 취소 환불 결제" },
];

function norm(s: string) {
  return s.replace(/\s/g, "").toLowerCase();
}

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [kr, setKr] = useState<Kr[] | null>(null);
  const [ov, setOv] = useState<Ov[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (!kr) {
      import("@/data/golf-courses.json").then((m) => setKr(m.default as Kr[]));
      import("@/data/overseas-courses.json").then((m) => setOv(m.default as Ov[]));
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, kr]);

  const term = norm(q);
  const krHits = term.length >= 1 && kr ? kr.filter((c) => norm(c.name + c.sido + c.city).includes(term)).slice(0, 8) : [];
  const ovHits = term.length >= 1 && ov
    ? ov.filter((c) => norm(c.name + (c.nameEn ?? "") + c.area + (c.city ?? "") + (countryBySlug[c.country]?.name ?? "")).includes(term)).slice(0, 8)
    : [];
  const prodHits = term ? publishedProducts.filter((p) => norm(p.title + p.country + p.summary).includes(term)).slice(0, 4) : [];
  const pageHits = term ? PAGES.filter((p) => norm(p.label + p.keys).includes(term)).slice(0, 4) : PAGES.slice(0, 5);
  const none = term && krHits.length + ovHits.length + prodHits.length + pageHits.length === 0;
  const close = () => { setOpen(false); setQ(""); };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-paper transition-colors"
        aria-label="사이트 검색"
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-navydeep/55 backdrop-blur-sm p-3 sm:p-6 sm:pt-[8vh]" onClick={close} role="dialog" aria-modal="true" aria-label="검색">
          <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white shadow-[0_24px_60px_rgba(3,13,44,0.45)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 sm:px-5 border-b border-line">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-mute shrink-0" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="골프장 이름, 지역, 나라, 상품으로 찾기"
                className="w-full py-4 text-[17px] outline-none placeholder:text-mute/70"
                aria-label="검색어"
              />
              <button type="button" onClick={close} className="text-[13px] font-bold text-mute hover:text-ink shrink-0">닫기</button>
            </div>

            <div className="max-h-[62vh] overflow-y-auto p-2 sm:p-3">
              {term && !kr && <p className="px-3 py-4 text-[14px] text-mute">골프장 목록을 불러오는 중입니다.</p>}
              {none && kr && (
                <div className="px-3 py-6 text-center">
                  <p className="text-[15px] font-bold mb-1">검색 결과가 없습니다</p>
                  <p className="text-[13.5px] text-mute">견적 요청서에 이름을 적어주시면 저희가 직접 확인해 드립니다.</p>
                </div>
              )}

              {krHits.length > 0 && (
                <Group title="국내 골프장" more={{ href: `/domestic?q=${encodeURIComponent(q)}#courses`, label: "지도에서 더 보기" }} onGo={close}>
                  {krHits.map((c) => (
                    <Item key={`${c.name}-${c.city}`} href={`/domestic?q=${encodeURIComponent(c.name)}#courses`} title={c.name} sub={`${c.sido} ${c.city} · ${c.region}`} onGo={close} />
                  ))}
                </Group>
              )}
              {ovHits.length > 0 && (
                <Group title="해외 골프장" onGo={close}>
                  {ovHits.map((c) => (
                    <Item
                      key={`${c.country}-${c.name}`}
                      href={`/overseas?country=${c.country}&q=${encodeURIComponent(c.name)}#courses`}
                      title={c.name}
                      sub={`${countryBySlug[c.country]?.flag ?? ""} ${countryBySlug[c.country]?.name ?? c.country} · ${c.area}`}
                      onGo={close}
                    />
                  ))}
                </Group>
              )}
              {prodHits.length > 0 && (
                <Group title="상품" onGo={close}>
                  {prodHits.map((p) => (
                    <Item key={p.slug} href={`/products/${p.slug}`} title={p.title} sub={`${p.kind} · ${p.country} · ${p.duration}`} onGo={close} />
                  ))}
                </Group>
              )}
              {pageHits.length > 0 && (
                <Group title={term ? "페이지" : "바로 가기"} onGo={close}>
                  {pageHits.map((p) => <Item key={p.href} href={p.href} title={p.label} onGo={close} />)}
                </Group>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Group({ title, children, more, onGo }: { title: string; children: React.ReactNode; more?: { href: string; label: string }; onGo: () => void }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <p className="text-[12px] font-black tracking-wide text-mute uppercase">{title}</p>
        {more && <Link href={more.href} onClick={onGo} className="text-[12.5px] font-bold text-royal hover:underline">{more.label}</Link>}
      </div>
      <ul>{children}</ul>
    </div>
  );
}

function Item({ href, title, sub, onGo }: { href: string; title: string; sub?: string; onGo: () => void }) {
  return (
    <li>
      <Link href={href} onClick={onGo} className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-paper">
        <span className="font-semibold text-[15px] text-ink">{title}</span>
        {sub && <span className="text-[12.5px] text-mute shrink-0 text-right">{sub}</span>}
      </Link>
    </li>
  );
}
