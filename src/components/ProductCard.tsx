import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
export default function ProductCard({ product: p }: { product: Product }) {
  return <article className="product-card group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white hover:shadow-lg">
    <Link href={`/products/${p.slug}/`} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden="true">
      {p.photoPending ? <div className="absolute inset-0 flex items-center justify-center bg-slate-50 px-5 text-center text-base font-semibold text-mute">골프장 사진 확인 중</div> : <Image src={p.thumb} alt="" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 370px" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
      <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-navy">{p.theme ?? "에스티 추천"}</span>
    </Link>
    <div className="flex flex-1 flex-col p-5">
      {!p.photoPending && p.thumbCaption && <p className="mb-2 text-xs leading-relaxed text-mute">{p.thumbCaption}</p>}
      <p className="text-xs font-semibold text-royaldark mb-2">{p.country} · {p.area ?? "하노이·닌빈"}</p>
      <h3 className="text-[18px] font-bold leading-snug text-navy"><Link href={`/products/${p.slug}/`} className="block hover:text-royal">{p.title}</Link></h3>
      <p className="mt-3 text-sm text-mute">{p.duration} · 출발일 선택</p>
      <div className="mt-auto pt-5">
        <p className="text-xs text-mute">{p.quoteNotice ? "현지 구성 가능 여부 먼저 상담" : p.priceFrom ? "항공 제외 · 1인 참고가" : "항공 제외 · 현지 일정"}</p>
        <p className="text-[23px] font-bold tracking-tight text-navy">{p.price}</p>
        <Link href={`/products/${p.slug}/#quote`} className="product-quote-link mt-4 flex min-h-11 items-center justify-between border-t border-line pt-3 text-sm font-bold text-royaldark">출발일 선택 · 견적 요청 <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </article>;
}
