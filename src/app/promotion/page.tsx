import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/site";
import { royalcc } from "@/data/royalcc";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "로얄CC 클럽 페스티벌 2026 | 베트남 하노이 골프 페스티벌",
  description:
    "베트남 닌빈 로얄CC에서 3박 5일, 총 54홀 라운드와 5성 숙박, 총 1억원 상당 시상까지. 왕복 항공 포함 1,290,000원. 에스티골프투어가 진행하는 로얄CC 클럽 페스티벌 2026 상세 안내.",
  alternates: { canonical: "/promotion/" },
  openGraph: {
    images: [{ url: "/og-promotion.jpg", width: 1200, height: 630, alt: "로얄CC 클럽 페스티벌 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-promotion.jpg"],
  },
};

// 페스티벌 Event 구조화 데이터 (royalccfestival.com 공식 게재 정보 기준)
const eventLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: royalcc.title,
  description:
    "베트남 닌빈 로얄CC에서 열리는 3박 5일 골프 페스티벌. 총 54홀 라운드, 5성 숙박, 총 1억원 상당 시상. 왕복 항공 포함.",
  startDate: "2026-12-13",
  endDate: "2026-12-17",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  image: `${site.domain}/og-promotion.jpg`,
  location: {
    "@type": "Place",
    name: "로얄CC (Royal Golf Course)",
    address: { "@type": "PostalAddress", addressLocality: "닌빈", addressCountry: "VN" },
  },
  offers: {
    "@type": "Offer",
    price: 1290000,
    priceCurrency: "KRW",
    url: `${site.domain}/promotion/`,
    availability: "https://schema.org/InStock",
    description: "1인 기준 · 2인 1실 · 왕복 항공 포함",
  },
  organizer: { "@id": `${site.domain}/#organization` },
};

const crumbLd = breadcrumbLd([{ name: "로얄CC 클럽 페스티벌 2026", path: "/promotion/" }]);
const pageLd = webPageLd("로얄CC 클럽 페스티벌 2026 | 베트남 하노이 골프 페스티벌", "/promotion/", "베트남 닌빈 로얄CC 3박 5일 골프 페스티벌. 총 54홀, 5성 숙박, 왕복 항공 포함 1,290,000원.");

export default function PromotionPage() {
  const r = royalcc;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      {/* 히어로 */}
      <section className="relative bg-navydeep text-white overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image src="/images/royalcc.webp" alt="" fill priority sizes="100vw" className="object-cover hero-bg" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(92deg, rgba(3,13,44,.88) 0%, rgba(3,13,44,.6) 55%, rgba(3,13,44,.2) 100%)" }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24 hero-anim">
          <span className="inline-block rounded-full bg-gold text-white text-[12px] font-black px-3.5 py-1.5 mb-5">
            {r.recruit}
          </span>
          <h1 className="headline text-[30px] sm:text-[46px] mb-3 drop-shadow max-w-3xl">{r.title}</h1>
          <p className="text-white/85 text-[16.5px] mb-1">{r.venue}</p>
          <p className="text-white/85 text-[16.5px] mb-6">{r.date} · {r.format}</p>
          <p className="mb-8">
            <span className="text-white/55 line-through mr-3 text-[17px]">{r.priceOriginal}</span>
            <span className="font-display text-[34px] sm:text-[42px] text-gold drop-shadow">{r.price}</span>
            <span className="text-white/75 text-[14px] ml-2">{r.priceNote}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <a href={site.phoneHref} className="btn btn-royal flex-1 shadow-lg shadow-royal/30">전화 신청 {site.phone}</a>
            <a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="btn flex-1 bg-white/95 text-navy font-bold hover:bg-white">밴드에서 문의</a>
          </div>
        </div>
      </section>

      {/* 핵심 정보 그리드 */}
      <section className="mx-auto max-w-6xl px-5 -mt-6 relative z-10">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden bg-white border border-line shadow-soft divide-x divide-y lg:divide-y-0 divide-line">
            {[
              ["일정", "3박 5일 · 12/13~17"],
              ["라운드", "총 54홀 (18홀 × 3일)"],
              ["숙박", "5성 리조트 · 풀빌라"],
              ["예약금", r.deposit],
            ].map(([k, v]) => (
              <div key={k} className="px-5 py-4">
                <p className="eyebrow text-royal">{k}</p>
                <p className="text-[14.5px] font-bold mt-1">{v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 일정표 */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <Reveal>
          <p className="eyebrow text-royal mb-2">Itinerary</p>
          <h2 className="headline text-2xl sm:text-3xl mb-7">5일의 일정</h2>
        </Reveal>
        <ol className="space-y-3 max-w-3xl">
          {r.itinerary.map((d, i) => (
            <Reveal key={d.day} delay={i * 70}>
              <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-5 rounded-xl border border-line bg-white p-5">
                <span className="font-display text-golddeep text-[15px] shrink-0 w-36">{d.day}</span>
                <span className="text-[15.5px]">{d.plan}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 포함/불포함 */}
      <section className="bg-white border-y border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="rounded-2xl border border-line bg-paper p-7 h-full">
              <h2 className="font-bold text-[18px] mb-4 text-golddeep">✓ 포함 사항</h2>
              <ul className="space-y-2.5 text-[15px]">
                {r.includes.map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <span className="text-gold font-black shrink-0" aria-hidden="true">·</span>{x}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-2xl border border-line bg-paper p-7 h-full">
              <h2 className="font-bold text-[18px] mb-4 text-mute">✕ 불포함 사항</h2>
              <ul className="space-y-2.5 text-[15px]">
                {r.excludes.map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <span className="text-mute font-black shrink-0" aria-hidden="true">·</span>{x}
                  </li>
                ))}
              </ul>
              <p className="text-[13px] text-mute mt-4">현지 지불 항목은 환율에 따라 원화 기준 금액이 달라질 수 있습니다.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 시상 */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <Reveal>
          <p className="eyebrow text-royal mb-2">Awards</p>
          <h2 className="headline text-2xl sm:text-3xl mb-2">{r.awards.headline}</h2>
          <p className="text-mute mb-7">스트로크와 신페리오 두 방식으로 나눠 시상합니다.</p>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-5">
          {r.awards.items.map((a, i) => (
            <Reveal key={a} delay={i * 90}>
              <div className="card-lift rounded-2xl border border-line bg-white p-6 h-full shadow-soft">
                <p className="font-display text-golddeep text-lg mb-2">{String(i + 1).padStart(2, "0")}</p>
                <p className="text-[15px]">{a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 신청 안내 + CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Reveal>
          <div className="rounded-2xl border border-line bg-white shadow-soft p-7 sm:p-10">
            <h2 className="headline text-xl sm:text-2xl mb-4">신청 방법</h2>
            <ol className="space-y-2 text-[15.5px] mb-6 list-decimal pl-5">
              <li>전화({site.phone}) 또는 밴드로 참가 의사를 알려주세요. {r.recruit}</li>
              <li>{r.deposit} 입금 시 참가가 확정됩니다.</li>
              <li>출발 전 최종 일정표와 준비물 안내를 보내드립니다.</li>
            </ol>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={site.phoneHref} className="btn btn-royal">전화 신청 {site.phone}</a>
              <a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">밴드에서 문의</a>
              <a href={r.officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">행사 전용 페이지 →</a>
            </div>
            <p className="text-[12.5px] text-mute mt-6">
              본 상품은 기획여행입니다. 여행업 등록 정보와 보증보험 내용은 페이지 하단과 회사소개에서 확인하실 수 있으며,
              취소·환불은 이용약관의 기획여행 특별약관 기준을 따릅니다. 일정·구성은 현지 사정에 따라 일부 변경될 수 있습니다.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
