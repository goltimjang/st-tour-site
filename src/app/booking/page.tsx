import type { Metadata } from "next";
import BookingImage from "@/components/BookingImage";
import { site } from "@/data/site";
import Link from "next/link";
import { bookingCourses } from "@/data/booking-courses";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
export const metadata: Metadata = { title: "할인부킹 | 포세븐 금강CC·속리산CC 예약 안내", description: "포세븐 금강CC·속리산CC 할인부킹. 골프장별 문의 또는 전화 예약으로 티타임과 할인 금액을 확인하세요.", alternates: { canonical: "/booking/" } };
export default function BookingPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd("할인부킹", "/booking/", metadata.description as string)) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: "할인부킹", path: "/booking/" }])) }} />
    <section className="bg-[#edf3eb]"><div className="max-w-6xl mx-auto px-5 py-12 sm:py-16"><p className="eyebrow text-[#315d42] mb-3">에스티골프투어 할인부킹</p><h1 className="headline text-3xl sm:text-5xl leading-tight">같은 골프장, 더 알뜰하게.<br />예약 전 할인 금액부터 확인하세요.</h1><p className="text-mute mt-5 max-w-xl">원하는 날짜와 시간대를 알려주세요. 일반 예약보다 부담을 낮출 수 있는 할인부킹 조건을 확인해 안내드립니다.</p><p className="text-sm text-mute mt-3">금액은 문의 후 안내 · 날짜·시간대별 할인 적용 및 잔여 티타임 확인 필요</p></div></section>
    <section className="max-w-6xl mx-auto px-5 py-10 sm:py-14"><h2 className="headline text-2xl mb-6">지금 문의할 수 있는 골프장</h2><div className="grid gap-6">{bookingCourses.map(c => <article key={c.slug} className="grid md:grid-cols-2 overflow-hidden rounded-3xl border border-line bg-white"><Link href={`/booking/${c.slug}/`} className="relative aspect-[16/10]"><BookingImage src={c.photos[0].src} alt={c.photos[0].caption} fill priority sizes="(max-width: 768px) 100vw, 560px" className="object-cover" /><span className="absolute top-5 left-5 rounded-full bg-white px-4 py-2 text-sm font-bold">{c.area}</span></Link><div className="p-6 sm:p-10 self-center"><p className="eyebrow text-royaldark mb-3">에스티 할인부킹</p><h3 className="headline text-3xl">{c.name}</h3><p className="text-mute my-4">{c.summary}</p><p className="text-lg font-bold">할인 금액 문의</p>{c.bookingMode === "phone" ? <div className="flex flex-wrap gap-3 mt-6"><a href={site.phoneHref} className="btn btn-royal">전화로 예약하기</a><Link href={`/booking/${c.slug}/`} className="btn btn-light">코스·시설 보기</Link></div> : <Link href={`/booking/${c.slug}/#quote`} className="btn btn-royal mt-6">날짜 선택 · 할인 금액 받기 →</Link>}</div></article>)}</div><p className="text-sm text-mute mt-5">포세븐 금강CC는 문의 접수로, 속리산CC는 전화 예약으로 안내합니다. 예약 조건을 확인한 뒤 담당자의 확정 안내를 받아주세요.</p></section>
  </>;
}
