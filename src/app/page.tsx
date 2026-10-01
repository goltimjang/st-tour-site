import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { faqs } from "@/data/faq";
import { catalogCountries } from "@/data/catalog";
import { publishedProducts } from "@/data/products";
import AutoCarousel from "@/components/AutoCarousel";
import FestivalProductCard from "@/components/FestivalProductCard";
import BookingImage from "@/components/BookingImage";
import { bookingCourses } from "@/data/booking-courses";
import ProductCard from "@/components/ProductCard";
import EventGallery from "@/components/EventGallery";
import CountryCarousel from "@/components/CountryCarousel";
import FestivalPopup from "@/components/FestivalPopup";
import HeroQuoteWidget from "@/components/HeroQuoteWidget";
import { webPageLd } from "@/data/jsonld";

export const metadata: Metadata = { title: "해외 골프여행 상품·맞춤 견적 | 에스티골프투어", description: "베트남 하노이·다낭, 태국, 일본, 중국, 괌 등 해외 골프여행 상품을 지역·출발지별로 비교하세요. 골프텔·다색골프·파크골프와 무료 맞춤 견적 상담.", alternates: { canonical: "/" } };
const homeFaqs = faqs.filter((f) => /미정|어떻게 받|비용이 드|2명이|취소/.test(f.q));
const featuredProducts = ["베트남", "태국", "일본", "중국", "필리핀"].flatMap(country => {
  const items = publishedProducts.filter(p => p.country === country && p.slug !== "royalcc-festival-2026");
  const best = items.find(p => !p.photoPending && !p.quoteNotice) ?? items.find(p => !p.photoPending) ?? items[0];
  return best ? [best] : [];
});
export default function Home() {
  return <>
    <FestivalPopup />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd("에스티골프투어 | 국내·해외 골프투어 견적 전문", "/", site.positioning)) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
    <section className="relative bg-navy overflow-hidden">
      <Image src="/images/hero.jpg" alt="바다와 페어웨이가 어우러진 골프장" fill priority sizes="100vw" className="object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 to-navy/30" />
      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:py-12 grid lg:grid-cols-[1fr_1.05fr] gap-7 lg:gap-14 items-center">
        <div className="text-white"><h1 className="headline text-[25px] sm:text-[40px] leading-snug mb-5">가고 싶은 나라와 골프장,<br />나만의 골프여행을 함께.</h1><p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6">국내 500여 곳·해외 {site.stats.countries}개국 골프장 정보로, 원하는 골프여행을 에스티골프투어와 준비하세요.</p><Link href="/products/" className="btn bg-white text-navy">골프여행 상품 보기</Link></div>
        <HeroQuoteWidget />
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-6 sm:py-9">
      <div className="flex justify-between items-end gap-4 mb-5"><div><p className="eyebrow text-golddeep mb-1">골프여행, 어디로 갈까요?</p><h2 className="headline text-2xl sm:text-3xl">나라별로 골라보세요</h2></div><Link href="/products/" className="text-sm font-semibold text-mute py-2 shrink-0">전체 상품 →</Link></div>
      <CountryCarousel countries={catalogCountries.map(c => ({ slug: c.slug, name: c.name, image: c.image, count: c.products.length }))} />
    </section>

    <section className="mx-auto max-w-6xl px-5 py-9 sm:py-12">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6"><div><p className="eyebrow text-golddeep mb-2">먼저 살펴보는 골프여행</p><h2 className="headline text-2xl sm:text-3xl">다섯 나라, 나에게 맞는 골프여행</h2></div><Link href="/products/" className="font-semibold text-royaldark py-2">전체 상품 비교하기 →</Link></div>
      <AutoCarousel label="추천 골프여행 상품"><FestivalProductCard />{featuredProducts.map(p => <ProductCard key={p.slug} product={p} />)}</AutoCarousel>
      <p className="text-xs sm:text-sm text-mute mt-5">로얄CC 클럽 페스티벌은 왕복 항공 포함 행사입니다. 그 외 상품은 항공 제외 기준이며, 포함사항과 최종 금액은 각 상세페이지와 견적에서 확인해주세요.</p>
    </section>

    <section className="mx-auto max-w-6xl px-5 pb-10"><Link href="/booking/fourseven-geumgang/" className="group grid sm:grid-cols-[.8fr_1fr] overflow-hidden rounded-3xl bg-[#edf3eb]"><div className="relative min-h-52 sm:min-h-64"><BookingImage src={bookingCourses[0].photos[0].src} alt={bookingCourses[0].photos[0].caption} fill sizes="(max-width: 639px) 100vw, 500px" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-6 sm:p-8 self-center"><p className="eyebrow text-[#315d42] mb-2">새롭게 만나는 할인부킹</p><h2 className="headline text-2xl sm:text-3xl">포세븐 금강CC,<br />내 날짜의 할인 금액은?</h2><p className="text-mute text-sm mt-4">일반 예약보다 부담을 낮출 수 있는 할인 혜택.<br />원하는 날짜와 희망 부를 남겨주세요.</p><span className="btn bg-[#315d42] text-white mt-5">가능 여부 · 할인 금액 문의 →</span></div></Link></section>

    <section className="mx-auto max-w-6xl px-5 pb-12"><div className="grid sm:grid-cols-2 gap-4"><Link href="/products/?theme=파크골프" className="rounded-2xl bg-[#e8efe7] p-6 sm:p-8"><p className="text-xs font-bold text-golddeep mb-2">조금 다른 라운드의 즐거움</p><h2 className="font-bold text-2xl text-navy">파크골프 여행</h2><p className="text-sm text-mute mt-2">태국·일본·베트남 상품 살펴보기 →</p></Link><Link href="/products/" className="rounded-2xl bg-[#e9effc] p-6 sm:p-8"><p className="text-xs font-bold text-royaldark mb-2">우리 지역에서 더 가깝게</p><h2 className="font-bold text-2xl text-navy">출발지로 찾는 골프여행</h2><p className="text-sm text-mute mt-2">부산·대구·청주 등 출발 조건으로 비교 →</p></Link></div></section>

    <section className="bg-white border-y border-line"><div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <h2 className="headline text-2xl sm:text-3xl mb-7">복잡한 준비, 함께 정리해요</h2>
      <ol className="grid md:grid-cols-3 gap-5">{[["여행 조건 알려주기", "지역·대략적인 일정·인원을 알려주세요. 아직 미정인 항목은 상담하며 정할 수 있습니다."], ["견적과 포함사항 확인", "항공·숙박·라운드와 별도 비용을 확인하고 원하는 조건을 조정합니다."], ["가능 여부 확인 후 예약", "티타임과 항공·숙소, 총금액과 변경·취소 조건을 확인한 뒤 예약을 진행합니다."]].map(([title, desc], i) => <li key={title} className="rounded-2xl bg-paper p-6"><p className="text-golddeep font-bold mb-2">0{i + 1}</p><h3 className="font-bold text-lg mb-2">{title}</h3><p className="text-mute text-[15px]">{desc}</p></li>)}</ol>
    </div></section>

    <section className="py-12 sm:py-16 overflow-hidden"><div className="mx-auto max-w-6xl px-5 mb-6"><p className="eyebrow text-golddeep mb-2">실제 행사 현장</p><h2 className="headline text-2xl sm:text-3xl mb-3">사진으로 보는 에스티골프투어</h2><p className="text-mute">직접 진행한 골프대회와 클럽 페스티벌 현장입니다. 사진은 자동으로 이어지며, 직접 넘겨볼 수도 있습니다.</p></div><EventGallery /><div className="mx-auto max-w-6xl px-5 mt-6 flex flex-wrap gap-4"><Link href="/about/" className="btn btn-light">회사·운영 사례 보기</Link><a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">밴드에서 소식 보기</a></div></section>

    <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16"><h2 className="headline text-2xl sm:text-3xl mb-6">견적을 요청하기 전에 궁금한 점</h2><div className="space-y-3">{homeFaqs.map((f) => <details key={f.q} className="rounded-xl border border-line bg-white p-5"><summary className="font-bold cursor-pointer text-[17px]">{f.q}</summary><p className="text-mute mt-3">{f.a}</p></details>)}</div><Link href="/faq/" className="inline-block mt-5 font-bold text-royaldark underline">전체 질문 보기</Link><p className="mt-6 text-sm text-mute">작성·운영: {site.name} · 정보 업데이트: {site.contentUpdated}</p></section>
    <section className="bg-navy text-white"><div className="mx-auto max-w-6xl px-5 py-12 text-center"><h2 className="headline text-2xl sm:text-3xl mb-3">아직 정해진 게 없어도 괜찮습니다</h2><p className="text-white/85 mb-6">여행 지역부터 일정까지, 함께 정리해드릴게요.</p><div className="flex flex-col sm:flex-row gap-3 justify-center"><a href="#quick-quote" className="btn btn-royal">무료 견적 받기</a><a href={site.phoneHref} className="btn bg-white text-navy">전화 상담 {site.phone}</a></div></div></section>
  </>;
}
