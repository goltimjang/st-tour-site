"use client";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, fixedCountry }: { products: Product[]; fixedCountry?: string }) {
  const [country, setCountry] = useState(fixedCountry ?? "전체");
  const [area, setArea] = useState("전체");
  const [departure, setDeparture] = useState("전체");
  const [theme, setTheme] = useState("전체");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("추천순");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = fixedCountry ?? q.get("country") ?? "전체";
    const selectedCountry = c === "전체" || products.some(p => p.country === c) ? c : "전체";
    setCountry(selectedCountry); setQuery(q.get("q") ?? "");
    const a = q.get("area"); if (a && products.some(p => p.area === a && (selectedCountry === "전체" || p.country === selectedCountry))) setArea(a);
    const d = q.get("departure"); if (d && products.some(p => p.departure?.includes(d))) setDeparture(d);
    const t = q.get("theme"); if (t === "파크골프" || t === "골프투어") setTheme(t);
    const s = q.get("sort"); if (s === "낮은 가격순" || s === "높은 가격순") setSort(s);
    setReady(true);
  }, [fixedCountry, products]);
  useEffect(() => {
    if (!ready) return;
    const q = new URLSearchParams(window.location.search);
    for (const [key, value] of [["q", query], ["country", fixedCountry ? "전체" : country], ["area", area], ["departure", departure], ["theme", theme], ["sort", sort]]) {
      if (value && value !== "전체" && value !== "추천순") q.set(key, value); else q.delete(key);
    }
    const search = q.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${search ? "?" + search : ""}${window.location.hash}`);
  }, [ready, query, country, area, departure, theme, sort, fixedCountry]);
  const countries = ["전체", ...new Set(products.map(p => p.country))];
  const areas = [...new Set(products.filter(p => country === "전체" || country === p.country).flatMap(p => p.area ? [p.area] : []))];
  const departures = [...new Set(products.flatMap(p => p.departure?.endsWith("출발") ? p.departure.replace("출발", "").split("/") : []))];
  const norm = (s: string) => s.replace(/\s/g, "").toLowerCase();
  const list = products.filter(p => (country === "전체" || p.country === country) && (area === "전체" || p.area === area) && (theme === "전체" || (p.theme ?? "골프투어") === theme) && (departure === "전체" || p.departure?.includes(departure)) && norm(p.title + p.summary + p.country + (p.area ?? "")).includes(norm(query)));
  if (sort !== "추천순") list.sort((a,b) => (sort === "낮은 가격순" ? 1 : -1) * ((a.priceFrom ?? Number(a.price.replace(/\D/g,""))) - (b.priceFrom ?? Number(b.price.replace(/\D/g,"")))));
  const reset = () => { setCountry(fixedCountry ?? "전체"); setArea("전체"); setDeparture("전체"); setTheme("전체"); setQuery(""); setSort("추천순"); };
  return <>
    <div className="rounded-2xl border border-line bg-white p-4 sm:p-6 mb-8">
      <label htmlFor="catalog-search" className="block font-bold mb-2">어떤 골프여행을 찾으세요?</label>
      <input id="catalog-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="하노이, 오키나와, 골프장·호텔 이름 검색" className="field" />
      {!fixedCountry && <div role="group" aria-label="상품 국가" className="flex flex-wrap gap-2 mt-4">{countries.map(c => <button key={c} type="button" aria-pressed={country === c} className="choice !min-h-11 !px-3 !text-sm" data-on={country === c} onClick={() => { setCountry(c); setArea("전체"); }}>{c}</button>)}</div>}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label className="text-sm font-semibold">지역<select className="field mt-1 !text-sm" value={area} onChange={e => setArea(e.target.value)}><option>전체</option>{areas.map(a => <option key={a}>{a}</option>)}</select></label>
        <label className="text-sm font-semibold">출발지<select className="field mt-1 !text-sm" value={departure} onChange={e => setDeparture(e.target.value)}><option>전체</option>{departures.map(d => <option key={d}>{d}</option>)}</select></label>
        <label className="text-sm font-semibold">여행 종류<select className="field mt-1 !text-sm" value={theme} onChange={e => setTheme(e.target.value)}><option>전체</option><option>골프투어</option><option>파크골프</option></select></label>
        <label className="text-sm font-semibold">정렬<select className="field mt-1 !text-sm" value={sort} onChange={e => setSort(e.target.value)}><option>추천순</option><option>낮은 가격순</option><option>높은 가격순</option></select></label>
      </div>
    </div>
    <div className="flex items-center justify-between gap-3 mb-5"><p role="status" className="font-semibold">조건에 맞는 상품 <b className="text-royal">{list.length}</b>개</p><button type="button" className="min-h-11 text-sm underline text-mute" onClick={reset}>검색 조건 초기화</button></div>
    {list.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">{list.map(p => <ProductCard key={p.slug} product={p} />)}</div> : <div className="rounded-2xl bg-white border border-line p-8 text-center"><h2 className="font-bold text-xl">조건에 맞는 상품이 없습니다</h2><p className="text-mute mt-2">검색어를 줄이거나 다른 지역을 선택해보세요.</p><button className="btn btn-light mt-4" onClick={reset}>전체 상품 다시 보기</button></div>}
  </>;
}
