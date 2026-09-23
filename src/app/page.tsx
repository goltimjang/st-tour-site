import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { royalcc } from "@/data/royalcc";
import { faqs } from "@/data/faq";
import { tier1 } from "@/data/destinations";
import QuoteSample from "@/components/QuoteSample";
import EventGallery from "@/components/EventGallery";
import HeroQuoteWidget from "@/components/HeroQuoteWidget";
import { webPageLd } from "@/data/jsonld";

export const metadata: Metadata = { alternates: { canonical: "/" } };
const homeFaqs = faqs.filter((f) => /미정|어떻게 받|비용이 드|2명이|취소/.test(f.q));
export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd("에스티골프투어 | 국내·해외 골프투어 견적 전문", "/", site.positioning)) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
    <section className="mx-auto max-w-6xl px-5 pt-8 pb-12 sm:py-14">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-7 lg:gap-12 items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-golddeep mb-3">에스티골프투어 · Since {site.company.since}</p>
          <h1 className="headline text-[30px] sm:text-[44px] text-navy mb-4">골프여행,<br />어디서부터 준비할지<br className="hidden sm:block" /> 고민되시나요?</h1>
          <p className="text-[17px] text-mute max-w-xl mb-5">가고 싶은 곳과 대략적인 시기만 알려주세요.<br className="hidden sm:block" /> 항공·숙박·라운드 조건을 함께 정리해드립니다.</p>
          <div className="flex flex-wrap gap-3 mb-5"><a href="#quick-quote" className="btn btn-royal">무료 견적 받기</a><a href={site.phoneHref} className="btn btn-light">전화로 상담하기</a></div>
          <p className="text-sm text-mute mb-6">{site.company.hours}</p>
          <div className="relative hidden lg:block h-52 rounded-2xl overflow-hidden"><Image src="/images/hero.jpg" alt="해안과 페어웨이가 펼쳐진 골프장 풍경" fill priority sizes="560px" className="object-cover" /></div>
        </div>
        <HeroQuoteWidget />
      </div>
    </section>

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

    <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <p className="eyebrow text-golddeep mb-2">원하는 곳으로 맞춤 상담</p>
      <h2 className="headline text-2xl sm:text-3xl mb-3">어디로 떠나고 싶으세요?</h2>
      <p className="text-mute mb-7">아래 지역은 맞춤 견적 상담이 가능합니다. 날짜에 맞는 항공·숙소·티타임을 확인해 안내합니다.</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[{ name: "국내", href: "/domestic/", image: "/images/domestic.jpg", desc: "지역·숙박·라운드 함께 준비" }, ...[...tier1].sort((a, b) => Number(b.slug === "vietnam") - Number(a.slug === "vietnam")).map((d) => ({ name: d.name, href: `/overseas/${d.slug}/`, image: d.image!, desc: d.cities.slice(0, 2).join(" · ") }))].map((d) => <Link href={d.href} key={d.name} className="rounded-2xl bg-white border border-line overflow-hidden group"><div className="relative h-28 sm:h-40"><Image src={d.image} alt={`${d.name} 골프여행 풍경`} fill sizes="(max-width: 1024px) 50vw, 370px" className="object-cover" /></div><div className="p-4"><h3 className="font-bold text-lg group-hover:text-royal">{d.name} 골프투어</h3><p className="text-sm text-mute mt-1">{d.desc}</p><span className="inline-block mt-3 font-semibold text-royaldark text-sm">지역 안내·견적 보기 →</span></div></Link>)}
      </div>
      <p className="text-sm text-mute mt-5">국내골프투어 · 베트남골프투어 · 태국골프투어 · 일본골프투어 · 중국골프투어 · 필리핀골프투어</p>
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
