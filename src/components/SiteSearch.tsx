"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { countryBySlug } from "@/data/overseas-meta";
import { publishedProducts } from "@/data/products";

type Kr = { name: string; sido: string; city: string; region: string };
type Ov = { country: string; area: string; name: string; nameEn?: string | null; city?: string | null };
const PAGES = [
  { label: "포세븐 금강CC 할인부킹", href: "/booking/fourseven-geumgang/", keys: "할인 부킹 예약 금강 클럽디 포세븐 포스븐 익산" },
  { label: "골프투어 판매 상품", href: "/products/", keys: "패키지 상품 일정" },
  ...[["vietnam", "베트남", "하노이 닌빈 다낭"], ["thailand", "태국", "방콕 파타야"], ["japan", "일본", "후쿠오카 규슈 오키나와"], ["china", "중국", "칭다오 웨이하이"], ["philippines", "필리핀", "클락 마닐라"]].map(([slug, name, keys]) => ({ label: `${name} 골프여행 안내·맞춤 상담`, href: `/overseas/${slug}/`, keys })),
  { label: "국내 골프투어 견적", href: "/domestic/#quote", keys: "국내 견적 투어" },
  { label: "해외 골프투어 견적", href: "/overseas/#quote", keys: "해외 견적 투어" },
  { label: "시즌별 추천 여행지", href: "/seasons/", keys: "시즌 계절 월별 추천 언제" },
  { label: "자주 묻는 질문", href: "/faq/", keys: "질문 faq 취소 환불 결제" },
];
const norm = (s: string) => s.replace(/\s/g, "").toLowerCase();

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [kr, setKr] = useState<Kr[] | null>(null);
  const [ov, setOv] = useState<Ov[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = () => { setOpen(false); setQ(""); };

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current!;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal(); // Top layer: background is inert and keyboard focus stays in the dialog.
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open || (kr && ov)) return;
    let active = true;
    setLoadError(false);
    Promise.all([import("@/data/golf-courses.json"), import("@/data/overseas-courses.json")])
      .then(([a, b]) => { if (active) { setKr(a.default as Kr[]); setOv(b.default as Ov[]); } })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [open, kr, ov, attempt]);

  const term = norm(q);
  const krHits = term && kr ? kr.filter((c) => norm(c.name + c.sido + c.city).includes(term)).slice(0, 8) : [];
  const ovHits = term && ov ? ov.filter((c) => norm(c.name + (c.nameEn ?? "") + c.area + (c.city ?? "") + (countryBySlug[c.country]?.name ?? "")).includes(term)).slice(0, 8) : [];
  const prodHits = term ? publishedProducts.filter((p) => norm(p.title + p.country + p.summary).includes(term)).slice(0, 4) : publishedProducts.slice(0, 4);
  const pageHits = term ? PAGES.filter((p) => norm(p.label + p.keys).includes(term)).slice(0, 4) : PAGES.slice(0, 3);
  const none = term && kr && ov && !krHits.length && !ovHits.length && !prodHits.length && !pageHits.length;

  return <>
    <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-paper" aria-label="사이트 검색" aria-haspopup="dialog" aria-expanded={open}>
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
    </button>
    <dialog ref={dialogRef} className="site-search-dialog" aria-label="검색" onKeyDown={(e) => {
      if (e.key !== "Tab") return;
      const elements = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), [tabindex="0"]')).filter((el) => el.getClientRects().length > 0);
      const first = elements[0], last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }} onCancel={(e) => { e.preventDefault(); close(); }} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="flex max-h-[calc(100dvh-32px)] flex-col bg-white rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-b border-line shrink-0">
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="상품, 여행지, 골프장 찾기" className="min-w-0 w-full py-4 text-[17px]" aria-label="검색어" />
          <button type="button" onClick={close} className="min-h-11 px-2 text-[15px] font-bold shrink-0">닫기</button>
        </div>
        <div className="overflow-y-auto overscroll-contain p-3">
          {prodHits.length > 0 && <Group title="판매 상품">{prodHits.map((p) => <Item key={p.slug} href={`/products/${p.slug}/`} title={p.title} sub={`${p.date ?? p.duration} · ${p.price} · ${p.priceNote ?? "조건별 안내"}`} note="예약 가능 여부는 상담 후 확인" onGo={close} />)}</Group>}
          {pageHits.length > 0 && <Group title="여행지 안내·맞춤 상담">{pageHits.map((p) => <Item key={p.href} href={p.href} title={p.label} onGo={close} />)}</Group>}
          {term && (!kr || !ov) && !loadError && <p role="status" className="p-3 text-sm text-mute">골프장 정보를 불러오는 중입니다.</p>}
          {loadError && <div role="status" className="p-3 text-sm"><p>골프장 정보를 불러오지 못했습니다. 상품·여행지 안내는 이용할 수 있습니다.</p><button type="button" className="min-h-11 underline text-royaldark" onClick={() => setAttempt((n) => n + 1)}>다시 불러오기</button></div>}
          {none && <div className="p-3"><p className="font-bold">검색 결과가 없습니다</p><p className="text-sm text-mute mt-2">찾으시는 지역이나 골프장을 알려주시면 가능한 조건을 확인해 드립니다.</p><Link onClick={close} href="/overseas/?flexible=1#quote" className="btn btn-royal mt-3">맞춤 여행 문의</Link></div>}
          {krHits.length > 0 && <Group title="국내 골프장 정보">{krHits.map((c) => <Item key={`${c.name}-${c.city}`} href={`/domestic/?q=${encodeURIComponent(c.name)}#courses`} title={c.name} sub={`${c.sido} ${c.city}`} onGo={close} />)}</Group>}
          {ovHits.length > 0 && <Group title="해외 골프장 정보">{ovHits.map((c) => <Item key={`${c.country}-${c.name}`} href={`/overseas/?country=${c.country}&q=${encodeURIComponent(c.name)}#courses`} title={c.name} sub={`${countryBySlug[c.country]?.name ?? c.country} · ${c.area}`} onGo={close} />)}</Group>}
          {(krHits.length > 0 || ovHits.length > 0) && <p className="p-3 text-sm text-mute">골프장 정보 목록입니다. 판매 상품이나 확보된 티타임을 뜻하지 않습니다.</p>}
        </div>
      </div>
    </dialog>
  </>;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mb-4"><h2 className="px-3 py-2 text-sm font-bold text-mute">{title}</h2><ul>{children}</ul></section>;
}
function Item({ href, title, sub, note, onGo }: { href: string; title: string; sub?: string; note?: string; onGo: () => void }) {
  return <li><Link href={href} onClick={onGo} className="flex flex-col gap-1 rounded-xl px-3 py-3 hover:bg-paper min-h-12"><span className="font-bold text-[16px] text-ink">{title}</span>{sub && <span className="text-sm text-mute">{sub}</span>}{note && <span className="text-sm text-royaldark">{note}</span>}</Link></li>;
}
