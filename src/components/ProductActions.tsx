"use client";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/data/site";
import { useSavedProducts } from "@/lib/saved-products";

export default function ProductActions({ slug, title }: { slug: string; title: string }) {
  const { ids, ready, toggle, error } = useSavedProducts();
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState(false);
  const url = `${site.domain}/products/${slug}/`;
  async function copy() {
    try { await navigator.clipboard.writeText(url); setMessage("상품 링크를 복사했습니다. 동행자에게 전달해 주세요."); setFallback(false); }
    catch { setFallback(true); setMessage("아래 링크를 선택해 복사해 주세요."); }
  }
  async function share() {
    if (!navigator.share) { await copy(); return; }
    try { await navigator.share({ title, url }); }
    catch (e) { if (!(e instanceof DOMException && e.name === "AbortError")) await copy(); }
  }
  return <div className="mt-5 border-t border-line pt-4">
    <div className="flex flex-wrap gap-2">
      <button type="button" className="choice !min-h-11 !px-4" disabled={!ready} aria-pressed={ids.includes(slug)} onClick={() => toggle(slug)}>{ids.includes(slug) ? "저장됨 · 해제" : "상품 저장"}</button>
      <button type="button" className="choice !min-h-11 !px-4" onClick={copy}>링크 복사</button>
      <button type="button" className="choice !min-h-11 !px-4" onClick={share}>동행자와 공유</button>
    </div>
    <p role="status" className="text-sm text-mute mt-2">{error || message}</p>
    {fallback && <input aria-label="공유할 상품 링크" className="field mt-2" value={url} readOnly onFocus={(e) => e.target.select()} />}
    <Link href="/saved/" className="inline-block py-2 text-sm text-royaldark underline">저장한 상품 보기</Link>
    <p className="text-sm text-mute">저장은 현재 브라우저에만 보관됩니다. 예약이나 재고 확보가 아닙니다.</p>
  </div>;
}
