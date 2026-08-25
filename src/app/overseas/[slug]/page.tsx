import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { tier1 } from "@/data/destinations";
import { site } from "@/data/site";
import QuoteForm from "@/components/QuoteForm";

// 국가 페이지: T1 5개국만 정적 생성 (얇은 페이지 양산 방지)
export function generateStaticParams() {
  return tier1.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = tier1.find((x) => x.slug === slug);
  if (!d) return {};
  return {
    title: `${d.name} 골프투어 견적 | 시즌·가격 안내`,
    description: `${d.name} 골프투어를 맞춤 견적으로. ${d.cities.join(", ")} 지역, 성수기 ${d.season}, ${d.priceFrom ?? ""} 항공·숙박·라운드 포함 구성을 24시간 안에 견적드립니다.`,
    alternates: { canonical: `/overseas/${slug}/` },
  };
}

/** 화면에 보이는 Q&A와 동일한 내용으로 FAQPage 마크업 생성 (AEO) */
function buildFaqs(d: (typeof tier1)[number]) {
  return [
    {
      q: `${d.name} 골프투어 비용은 얼마인가요?`,
      a: `${d.priceRange ? `1인 기준 ${d.priceRange} 수준이 시장 통상 범위입니다(왕복 항공 포함).` : "구성에 따라 달라 견적으로 안내드립니다."} 시즌·항공·숙박 등급에 따라 달라지며, 에스티골프투어 견적서에는 골프장·숙박·항공 원가와 대행비가 분리 표기되어 어디에 얼마가 쓰이는지 직접 확인하실 수 있습니다.`,
    },
    {
      q: `${d.name} 골프여행은 언제 가는 게 좋은가요?`,
      a: `${d.name}의 추천 시즌은 ${d.season}입니다. 성수기에는 티타임과 항공이 빨리 마감되므로 출발 2~3개월 전 견적을 권합니다. 주요 지역은 ${d.cities.join(", ")}이며, 처음이시라면 조건에 맞는 지역부터 추천해 드립니다.`,
    },
    {
      q: `${d.name} 골프투어에는 무엇이 포함되나요?`,
      a: `기본 구성은 왕복 항공, 숙박, 그린피, 카트·캐디, 공항 픽업과 라운드 이동 차량입니다. 식사·가이드 포함 여부는 상품에 따라 다르며 견적서에 항목별로 명시합니다. 항공권이 이미 있으시면 현지 일정만으로도 견적을 드립니다.`,
    },
  ];
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = tier1.find((x) => x.slug === slug);
  if (!d) notFound();

  const faqs = buildFaqs(d);
  const others = tier1.filter((x) => x.slug !== slug);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `${site.domain}/` },
      { "@type": "ListItem", position: 2, name: "해외 골프투어", item: `${site.domain}/overseas/` },
      { "@type": "ListItem", position: 3, name: `${d.name} 골프투어`, item: `${site.domain}/overseas/${slug}/` },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="relative bg-navy text-white overflow-hidden">
        {d.image && (
          <div className="absolute inset-0" aria-hidden="true">
            <Image src={d.image} alt="" fill priority sizes="100vw" className="object-cover hero-bg" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(3,13,44,.9) 0%, rgba(3,13,44,.62) 50%, rgba(3,13,44,.25) 100%)" }} />
          </div>
        )}
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20 hero-anim">
          <nav className="text-[13px] text-white/70 mb-4" aria-label="현재 위치">
            <Link href="/overseas/" className="hover:text-white">해외 골프투어</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{d.name}</span>
          </nav>
          <p className="eyebrow text-sky mb-3">{d.slug.replace(/-/g, " ")} Golf Tour</p>
          <h1 className="headline text-[30px] sm:text-[42px] mb-4">{d.name} 골프투어</h1>
          <p className="text-white/75 max-w-2xl text-[16.5px]">{d.blurb}</p>
          <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/15 border border-white/15 rounded-lg overflow-hidden max-w-3xl">
            {[
              ["주요 지역", d.cities.slice(0, 3).join(" · ")],
              ["추천 시즌", d.season],
              ["비행시간", d.flight],
              ["가격", d.priceFrom ?? "견적 문의"],
            ].map(([k, v]) => (
              <div key={k} className="bg-navydeep/75 backdrop-blur-sm px-4 py-3.5">
                <p className="eyebrow text-sky">{k}</p>
                <p className="text-[14px] font-bold mt-1">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14 grid lg:grid-cols-2 gap-6 items-start">
        <div id="quote" className="scroll-mt-24">
          <QuoteForm type="overseas" key={d.slug} prefillCountry={d.name} />
        </div>
        <div className="space-y-5">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-line bg-white p-6 sm:p-7">
              <h2 className="font-bold text-[18px] mb-3">{f.q}</h2>
              <p className="text-[15px] leading-relaxed">{f.a}</p>
            </div>
          ))}
          <p className="text-[12.5px] text-mute px-1">최종 수정일: {site.contentUpdated} · 작성: 에스티골프투어</p>
        </div>
      </section>

      {/* 지역별 안내 (SEO 콘텐츠) */}
      {d.areas && (
        <section className="bg-white border-y border-line">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <h2 className="headline text-xl sm:text-2xl mb-2">{d.name} 골프투어, 어디로 갈까요?</h2>
            <p className="text-mute text-[15px] mb-7 max-w-2xl">
              같은 {d.name}이라도 지역마다 코스 성격과 일정 구성이 다릅니다. 조건에 맞는 지역을 함께 골라드립니다.
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              {d.areas.map((a) => (
                <div key={a.name} className="rounded-2xl border border-line bg-paper p-6">
                  <h3 className="font-bold text-[17px] mb-2">{a.name}</h3>
                  <p className="text-[14.5px] leading-relaxed text-ink/85">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 다른 목적지 상호 링크 */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="headline text-xl sm:text-2xl mb-5">다른 인기 목적지</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((o) => (
            <Link key={o.slug} href={`/overseas/${o.slug}/`} className="group card-lift rounded-2xl border border-line overflow-hidden bg-white">
              {o.image && (
                <div className="img-zoom relative h-24">
                  <Image src={o.image} alt={`${o.name} 골프장`} fill sizes="270px" className="object-cover" />
                </div>
              )}
              <div className="p-3.5">
                <p className="font-bold text-[15.5px] group-hover:text-royal">{o.name} 골프투어</p>
                {o.priceFrom && <p className="font-display text-royaldark text-[14px] mt-0.5">{o.priceFrom}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
