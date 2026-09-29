import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { royalcc } from "@/data/royalcc";
import { faqs } from "@/data/faq";
import { catalogCountries } from "@/data/catalog";
import { publishedProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import QuoteSample from "@/components/QuoteSample";
import EventGallery from "@/components/EventGallery";
import HeroQuoteWidget from "@/components/HeroQuoteWidget";
import { webPageLd } from "@/data/jsonld";

export const metadata: Metadata = { title: "해외 골프여행 상품·맞춤 견적 | 에스티골프투어", description: "베트남 하노이·다낭, 태국, 일본, 중국, 괌 등 해외 골프여행 상품을 지역·출발지별로 비교하세요. 골프텔·다색골프·파크골프와 무료 맞춤 견적 상담.", alternates: { canonical: "/" } };
const homeFaqs = faqs.filter((f) => /미정|어떻게 받|비용이 드|2명이|취소/.test(f.q));
export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd("에스티골프투어 | 국내·해외 골프투어 견적 전문", "/", site.positioning)) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
    <section className="mx-auto max-w-6xl px-4 sm:px-5 pt-5 sm:pt-7 pb-8">
      <div className="relative overflow-hidden rounded-[28px] min-h-[410px] sm:min-h-[470px] bg-navy flex items-center">
        <Image src="/images/hero.jpg" alt="푸른 바다와 페어웨이가 이어진 해외 골프장 풍경" fill priority sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#031a24]/90 via-[#031a24]/65 to-[#031a24]/10" />
        <div className="relative max-w-2xl px-6 py-12 sm:px-12 text-white">
          <p className="text-sm font-semibold tracking-wide text-white/85 mb-5">에스티골프투어 · 당신의 다음 골프여행</p>
          <h1 className="headline text-[34px] sm:text-[52px] leading-tight mb-5">좋은 사람들과,<br />새로운 페어웨이로.</h1>
          <p className="text-[16px] sm:text-lg text-white/90 mb-7">가고 싶은 지역부터 마음에 드는 골프장까지.<br className="hidden sm:block" /> 상품을 골라보고, 나에게 맞는 여행을 함께 준비해요.</p>
          <div className="flex flex-wrap gap-3"><Link href="/products/" className="btn bg-white text-navy hover:bg-white/90">해외 골프상품 둘러보기 <span aria-hidden="true">→</span></Link><a href="#quick-quote" className="btn border border-white/70 text-white">맞춤 견적</a></div>
        </div>
      </div>
      <form action="/products/" className="relative mx-3 sm:mx-9 -mt-5 sm:-mt-7 bg-white rounded-2xl border border-line shadow-soft p-3 sm:p-5 flex items-center gap-3">
        <div className="flex-1 min-w-0"><label htmlFor="home-product-search" className="text-xs text-mute font-semibold block mb-1">어디에서 라운드하고 싶으세요?</label><input id="home-product-search" type="search" name="q" placeholder="지역, 골프장, 호텔 이름" className="w-full min-w-0 text-base sm:text-lg outline-offset-4 py-1" /></div><button type="submit" className="btn btn-royal !px-5 shrink-0">상품 찾기</button>
      </form>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-6 sm:py-9">
      <div className="flex justify-between items-end gap-4 mb-5"><div><p className="eyebrow text-golddeep mb-1">골프여행, 어디로 갈까요?</p><h2 className="headline text-2xl sm:text-3xl">나라별로 골라보세요</h2></div><Link href="/products/" className="text-sm font-semibold text-mute py-2 shrink-0">전체 상품 →</Link></div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-5">{catalogCountries.slice(0,6).map(c => <Link key={c.slug} href={`/products/country/${c.slug}/`} className="group text-center"><div className="relative aspect-[5/4] rounded-2xl overflow-hidden bg-white"><Image src={c.products[0].thumb} alt={`${c.name} 골프여행 상품 풍경`} fill sizes="(max-width: 640px) 30vw, 180px" className="object-cover group-hover:scale-105 transition-transform" /></div><h3 className="font-bold mt-3 text-[15px] sm:text-lg">{c.name}</h3><p className="text-xs text-mute">{c.products.length}개 상품</p></Link>)}</div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1">{catalogCountries.slice(6).map(c => <Link key={c.slug} href={`/products/country/${c.slug}/`} className="min-h-11 inline-flex items-center text-sm font-medium text-mute hover:text-royal">{c.name} →</Link>)}</div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-9 sm:py-12">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6"><div><p className="eyebrow text-golddeep mb-2">먼저 살펴보는 골프여행</p><h2 className="headline text-2xl sm:text-3xl">하노이부터, 나에게 맞는 라운드</h2></div><Link href="/products/" className="font-semibold text-royaldark py-2">전체 상품 비교하기 →</Link></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">{[...publishedProducts.filter(p => p.area?.includes("하노이") && !p.title.includes("부산")), ...publishedProducts.filter(p => ["태국", "일본"].includes(p.country))].slice(0,6).map(p => <ProductCard key={p.slug} product={p} />)}</div>
      <p className="text-xs sm:text-sm text-mute mt-5">표시 가격은 2026.09.29 조회한 1인 참고 최저가입니다. 출발일·항공·객실 및 프로모션 조건에 따라 달라지며, 예약 가능 여부와 최종금액은 상담으로 확인합니다.</p>
    </section>

    <section className="mx-auto max-w-6xl px-5 pb-12"><div className="grid sm:grid-cols-2 gap-4"><Link href="/products/?theme=파크골프" className="rounded-2xl bg-[#e8efe7] p-6 sm:p-8"><p className="text-xs font-bold text-golddeep mb-2">조금 다른 라운드의 즐거움</p><h2 className="font-bold text-2xl text-navy">파크골프 여행</h2><p className="text-sm text-mute mt-2">태국·일본·베트남 상품 살펴보기 →</p></Link><Link href="/products/" className="rounded-2xl bg-[#e9effc] p-6 sm:p-8"><p className="text-xs font-bold text-royaldark mb-2">우리 지역에서 더 가깝게</p><h2 className="font-bold text-2xl text-navy">출발지로 찾는 골프여행</h2><p className="text-sm text-mute mt-2">부산·대구·청주 등 출발 조건으로 비교 →</p></Link></div></section>

    <section className="bg-white border-y border-line">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <p className="eyebrow text-golddeep mb-2">일정이 정해진 추천 상품</p>
        <h2 className="headline text-2xl sm:text-3xl mb-6">이번 겨울, 하노이에서 함께 라운드해요</h2>
        <article className="grid lg:grid-cols-2 rounded-3xl border border-line overflow-hidden bg-paper">
          <Link href="/promotion/" className="relative block min-h-56 sm:min-h-80" aria-label="하노이 로얄CC 상품 자세히 보기"><Image src="/images/royalcc.webp" alt="베트남 닌빈 로얄CC 골프장" fill sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" /></Link>
          <div className="p-6 sm:p-8">
            <p className="text-sm font-bold text-golddeep mb-2">베트남 하노이 도착 · 닌빈 로얄CC</p>
            <h3 className="text-xl sm:text-2xl font-bold mb-3">로얄CC 클럽 페스티벌 2026</h3>
            <p className="text-[15px] mb-1">{royalcc.date}</p>
            <p className="text-[15px] text-mute mb-4">왕복 항공 · 총 54홀 · 5성 숙박 3박</p>
            <p className="text-royaldark font-bold text-3xl mb-1">{royalcc.price}</p>
            <p className="text-sm text-mute mb-4">{royalcc.priceNote}</p>
            <p className="text-sm text-ink border-t border-line pt-3 mb-5">별도 비용: {royalcc.excludes[0]} · {royalcc.excludes[1]}. 선택관광 별도.</p>
            <div className="flex flex-col sm:flex-row gap-3"><Link href="/promotion/#quote" className="btn btn-royal">이 일정 무료 견적</Link><Link href="/promotion/" className="btn btn-light">일정·포함사항 보기</Link></div>
            <p className="text-sm text-mute mt-3">예약 가능 인원과 항공편은 상담 시 확인합니다.</p>
          </div>
        </article>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
      <div><p className="eyebrow text-golddeep mb-3">상품 선택이 어려우신가요?</p><h2 className="headline text-3xl sm:text-4xl mb-5">딱 맞는 골프여행,<br />함께 찾아드릴게요.</h2><p className="text-mute mb-5">마음에 드는 상품이 없어도 괜찮아요. 지역과 대략적인 일정, 인원을 알려주시면 항공·숙박·라운드를 함께 확인해드립니다.</p><p className="text-sm text-mute">{site.company.hours}</p><a href={site.phoneHref} className="inline-flex min-h-11 items-center font-bold text-royaldark mt-4">전화 상담 {site.phone} →</a></div>
      <HeroQuoteWidget />
    </section>

    <section className="bg-white border-y border-line"><div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <h2 className="headline text-2xl sm:text-3xl mb-7">복잡한 준비, 함께 정리해요</h2>
      <ol className="grid md:grid-cols-3 gap-5">{[["여행 조건 알려주기", "지역·대략적인 일정·인원을 알려주세요. 아직 미정인 항목은 상담하며 정할 수 있습니다."], ["견적과 포함사항 확인", "항공·숙박·라운드와 별도 비용을 확인하고 원하는 조건을 조정합니다."], ["가능 여부 확인 후 예약", "티타임과 항공·숙소, 총금액과 변경·취소 조건을 확인한 뒤 예약을 진행합니다."]].map(([title, desc], i) => <li key={title} className="rounded-2xl bg-paper p-6"><p className="text-golddeep font-bold mb-2">0{i + 1}</p><h3 className="font-bold text-lg mb-2">{title}</h3><p className="text-mute text-[15px]">{desc}</p></li>)}</ol>
    </div></section>

    <section className="py-12 sm:py-16 overflow-hidden"><div className="mx-auto max-w-6xl px-5 mb-6"><p className="eyebrow text-golddeep mb-2">실제 행사 현장</p><h2 className="headline text-2xl sm:text-3xl mb-3">사진으로 보는 에스티골프투어</h2><p className="text-mute">직접 진행한 골프대회와 클럽 페스티벌 현장입니다. 사진은 옆으로 넘겨 보세요.</p></div><EventGallery /><div className="mx-auto max-w-6xl px-5 mt-6 flex flex-wrap gap-4"><Link href="/about/" className="btn btn-light">회사·운영 사례 보기</Link><a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">밴드에서 소식 보기</a></div></section>

    <section className="bg-white border-y border-line"><div className="mx-auto max-w-6xl px-5 py-12 sm:py-16 grid lg:grid-cols-2 gap-8 items-start">
      <div><p className="eyebrow text-golddeep mb-2">견적서 확인 방법</p><h2 className="headline text-2xl sm:text-3xl mb-4">금액만큼 중요한 포함사항</h2><p className="text-mute mb-5">같은 지역도 항공, 숙박, 라운드 횟수와 인원에 따라 총금액이 달라집니다. 무엇이 포함되고 별도로 필요한지 비교할 수 있게 안내합니다.</p><ul className="space-y-3 text-[16px]"><li>항공 포함 여부와 수하물 조건</li><li>객실 구성, 식사, 그린피·카트·캐디 비용</li><li>공항 이동, 현지 팁과 선택관광</li><li>견적 유효기간과 변경·취소 조건</li></ul><a href="#quick-quote" className="btn btn-royal mt-6">내 조건으로 무료 견적</a></div>
      <div className="min-w-0"><QuoteSample /></div>
    </div></section>

    <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16"><h2 className="headline text-2xl sm:text-3xl mb-6">견적을 요청하기 전에 궁금한 점</h2><div className="space-y-3">{homeFaqs.map((f) => <details key={f.q} className="rounded-xl border border-line bg-white p-5"><summary className="font-bold cursor-pointer text-[17px]">{f.q}</summary><p className="text-mute mt-3">{f.a}</p></details>)}</div><Link href="/faq/" className="inline-block mt-5 font-bold text-royaldark underline">전체 질문 보기</Link><p className="mt-6 text-sm text-mute">작성·운영: {site.name} · 정보 업데이트: {site.contentUpdated}</p></section>
    <section className="bg-navy text-white"><div className="mx-auto max-w-6xl px-5 py-12 text-center"><h2 className="headline text-2xl sm:text-3xl mb-3">아직 정해진 게 없어도 괜찮습니다</h2><p className="text-white/85 mb-6">여행 지역부터 일정까지, 함께 정리해드릴게요.</p><div className="flex flex-col sm:flex-row gap-3 justify-center"><a href="#quick-quote" className="btn btn-royal">무료 견적 받기</a><a href={site.phoneHref} className="btn bg-white text-navy">전화 상담 {site.phone}</a></div></div></section>
  </>;
}
