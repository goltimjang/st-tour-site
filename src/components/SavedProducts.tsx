"use client";
import Link from "next/link";
import { publishedProducts } from "@/data/products";
import { useSavedProducts } from "@/lib/saved-products";
export default function SavedProducts() {
  const { ids, ready, toggle, error } = useSavedProducts();
  if (!ready) return <p role="status">저장한 상품을 확인하고 있습니다.</p>;
  const products = publishedProducts.filter((p) => ids.includes(p.slug));
  return <>
    <p role="status" className="text-sm text-mute mb-5">{error || `저장한 상품 ${products.length}개`}</p>
    {products.length ? <div className="grid gap-5 md:grid-cols-2">{products.map((p) => <article key={p.slug} className="rounded-2xl bg-white border border-line p-5">
      <h2 className="text-xl font-bold"><Link href={`/products/${p.slug}/`} className="text-navy underline">{p.title}</Link></h2>
      <p className="mt-3">{p.date}</p><p className="font-bold mt-2">{p.price}</p><p className="text-sm text-mute">{p.priceNote}</p>
      <p className="text-sm mt-3">별도 비용: {p.excludes?.join(" · ")}</p>
      <p className="text-sm text-mute mt-3">상품 안내 확인일: {p.updatedAt ?? p.postedAt}. 예약 가능 여부는 상담 후 확인합니다.</p>
      <div className="flex flex-wrap gap-3 mt-4"><Link href={p.quoteUrl ?? "/overseas/#quote"} className="btn btn-royal">이 상품 문의</Link><button type="button" className="choice" onClick={() => toggle(p.slug)} aria-label={`${p.title} 저장 해제`}>저장 해제</button></div>
    </article>)}</div> : <div className="rounded-2xl bg-white border border-line p-6"><h2 className="font-bold text-xl">아직 저장한 상품이 없습니다</h2><p className="mt-2 mb-5">상품 상세에서 저장하면 이 브라우저에서 다시 찾아볼 수 있습니다.</p><Link href="/products/" className="btn btn-royal">상품 둘러보기</Link></div>}
    {ids.some((id) => !publishedProducts.some((p) => p.slug === id)) && <p className="mt-5 text-sm text-mute">판매 안내가 종료되거나 삭제된 일부 상품은 표시되지 않습니다.</p>}
  </>;
}
