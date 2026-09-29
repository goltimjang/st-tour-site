import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

export default function ProductCard({ product: p }: { product: Product }) {
  return <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg">
    <Link href={`/products/${p.slug}/`} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden="true">
      <Image src={p.thumb} alt="" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 370px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-navy shadow-sm">{p.theme ?? "에스티 추천"}</span>
      {p.title.includes("항공 불포함") && <span className="absolute bottom-3 left-3 rounded bg-navy/90 px-2 py-1 text-xs text-white">항공 별도</span>}
    </Link>
    <div className="flex flex-1 flex-col p-5">
      <p className="text-xs font-semibold text-royaldark mb-2">{p.country} · {p.area ?? "하노이·닌빈"} · {p.duration}</p>
      <h3 className="text-[18px] font-bold leading-snug text-navy"><Link href={`/products/${p.slug}/`} className="block hover:text-royal">{p.title}</Link></h3>
      <p className="mt-3 text-sm text-mute line-clamp-2">{p.summary}</p>
      <p className="mt-3 text-xs text-mute">{p.departure ?? p.date}</p>
      <div className="mt-auto pt-5">
        <p className="text-xs text-mute">{p.provider ? "1인 참고 최저가" : "1인 상품가"}</p>
        <p className="text-[25px] font-bold tracking-tight text-navy">{p.price}</p>
        {p.priceNote?.includes("프로모션") && <p className="text-xs text-mute mt-1">프로모션 적용 조건 별도 확인</p>}
        <Link href={`/products/${p.slug}/`} className="mt-4 flex min-h-11 items-center justify-between border-t border-line pt-3 text-sm font-bold text-royaldark">일정·상품 안내 보기 <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </article>;
}
