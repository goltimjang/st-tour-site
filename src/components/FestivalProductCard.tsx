import Image from "next/image";
import Link from "next/link";
import { royalcc } from "@/data/royalcc";
export default function FestivalProductCard() {
  return <article className="product-card group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white hover:shadow-lg">
    <Link href="/promotion/" className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden="true"><Image src="/promotion/royalcc/course-signature-110.webp" alt="" fill sizes="(max-width: 639px) 85vw, 370px" className="object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-navy">에스티 클럽 페스티벌</span></Link>
    <div className="flex flex-1 flex-col p-5"><p className="mb-2 text-xs text-mute">로얄CC 시그니처 코스</p><p className="text-xs font-semibold text-royaldark mb-2">베트남 · 하노이·닌빈</p><h3 className="text-[18px] font-bold leading-snug text-navy"><Link href="/promotion/" className="block hover:text-royal">로얄CC 클럽 페스티벌 2026</Link></h3><p className="mt-3 text-sm text-mute">2026.12.13 ~ 12.17 · {royalcc.duration}</p><div className="mt-auto pt-5"><p className="text-xs text-mute">왕복 항공 포함 · 행사 상품</p><p className="text-[23px] font-bold tracking-tight text-navy">참가 금액 문의</p><Link href="/promotion/" className="product-quote-link mt-4 flex min-h-11 items-center justify-between border-t border-line pt-3 text-sm font-bold text-royaldark">행사 일정 · 참가 문의 <span aria-hidden="true">→</span></Link></div></div>
  </article>;
}
