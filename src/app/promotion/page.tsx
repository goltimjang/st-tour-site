import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/site";
import { royalcc } from "@/data/royalcc";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "로얄CC 클럽 페스티벌 2026 | 베트남 하노이 골프 페스티벌",
  description:
    "베트남 닌빈 로얄CC에서 3박 5일, 총 54홀 라운드와 5성 숙박, 총 1억원 상당 시상까지. 왕복 항공 포함 1,290,000원. 골프장·숙소·식사·선택관광까지 에스티골프투어가 진행하는 로얄CC 클럽 페스티벌 2026 상세 안내.",
  alternates: { canonical: "/promotion/" },
  openGraph: {
    images: [{ url: "/og-promotion.jpg", width: 1200, height: 630, alt: "로얄CC 클럽 페스티벌 2026" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-promotion.jpg"] },
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

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: royalcc.faq.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const crumbLd = breadcrumbLd([{ name: "로얄CC 클럽 페스티벌 2026", path: "/promotion/" }]);
const pageLd = webPageLd(
  "로얄CC 클럽 페스티벌 2026 | 베트남 하노이 골프 페스티벌",
  "/promotion/",
  "베트남 닌빈 로얄CC 3박 5일 골프 페스티벌. 총 54홀, 5성 숙박, 왕복 항공 포함 1,290,000원."
);

export default function PromotionPage() {
  const r = royalcc;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />

      {/* 히어로 */}
      <section className="relative bg-navydeep text-white overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image src="/images/royalcc.webp" alt="" fill priority sizes="100vw" className="object-cover object-center hero-bg" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(92deg, rgba(3,13,44,.9) 0%, rgba(3,13,44,.62) 55%, rgba(3,13,44,.22) 100%)" }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24 hero-anim">
          <p className="eyebrow text-gold mb-3">Vietnam Hanoi · Ninh Binh</p>
          <span className="inline-block rounded-full bg-gold text-white text-[12px] font-black px-3.5 py-1.5 mb-5">{r.recruit}</span>
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

      {/* 핵심 정보 */}
      <section className="mx-auto max-w-6xl px-5 -mt-6 relative z-10">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden bg-white border border-line shadow-soft divide-x divide-y lg:divide-y-0 divide-line">
            {[["일정", "3박 5일 · 12/13~17"], ["라운드", "총 54홀 (18홀 × 3일)"], ["숙박", "5성 리조트 · 풀빌라"], ["예약금", r.deposit]].map(([k, v]) => (
              <div key={k} className="px-5 py-4">
                <p className="eyebrow text-royal">{k}</p>
                <p className="text-[14.5px] font-bold mt-1">{v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 소개 + 포스터 */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-center">
          <Reveal>
            <p className="eyebrow text-royal mb-2">{r.intro.eyebrow}</p>
            <h2 className="headline text-2xl sm:text-3xl mb-5">{r.intro.title}</h2>
            {r.intro.lines.map((t) => (
              <p key={t} className="text-[16px] text-ink/85 leading-relaxed mb-3 max-w-2xl">{t}</p>
            ))}
            <div className="grid grid-cols-2 gap-3 mt-7 max-w-xl">
              {r.intro.facts.map(([n, d]) => (
                <div key={n} className="rounded-xl border border-line bg-paper px-4 py-3.5">
                  <p className="font-display text-golddeep text-[19px]">{n}</p>
                  <p className="text-[13.5px] text-mute mt-0.5">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(6,20,62,0.18)] border border-line mx-auto max-w-[360px]">
              <Image src={r.intro.poster} alt="로얄CC 클럽 페스티벌 2026 공식 포스터" fill sizes="360px" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 골프장 */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <Reveal>
            <p className="eyebrow text-gold mb-2">{r.course.eyebrow}</p>
            <h2 className="headline text-2xl sm:text-3xl mb-3">{r.course.title}</h2>
            <p className="text-white/75 max-w-2xl mb-9 leading-relaxed">{r.course.desc}</p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {r.course.features.map((f, i) => (
              <Reveal key={f.tag} delay={i * 80}>
                <figure className="group relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image src={f.img} alt={f.alt} fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navydeep/90 to-transparent px-4 pt-10 pb-4">
                    <span className="eyebrow text-gold">{f.tag}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="eyebrow text-gold mb-1">Course Moments</p>
            <p className="text-white/80 mb-5">낮부터 석양과 야간까지 달라지는 로얄CC의 풍경</p>
          </Reveal>
          <div className="grid grid-cols-3 gap-3 mb-12">
            {r.course.moments.map((m, i) => (
              <Reveal key={m.tag} delay={i * 80}>
                <figure className="relative aspect-[4/5] rounded-xl overflow-hidden">
                  <Image src={m.img} alt={m.alt} fill sizes="(max-width: 640px) 33vw, 360px" className="object-cover" />
                  <figcaption className="absolute left-2.5 bottom-2.5 rounded-md bg-navydeep/80 px-2 py-1 text-[11px] font-bold tracking-wide">{m.tag}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {r.course.points.map(([t, d], i) => (
              <Reveal key={t} delay={i * 60}>
                <div className="rounded-2xl bg-white/8 border border-white/12 p-6 h-full">
                  <p className="font-display text-gold text-[15px] mb-2">{String(i + 1).padStart(2, "0")}</p>
                  <p className="font-bold text-[17px] mb-1.5">{t}</p>
                  <p className="text-[14.5px] text-white/75 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <dl className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 rounded-2xl bg-white/6 border border-white/10 p-6">
              {r.course.facility.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[12.5px] font-bold text-gold mb-1">{k}</dt>
                  <dd className="text-[13.5px] text-white/80 leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* 일정표 */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <Reveal>
          <p className="eyebrow text-royal mb-2">5 Days Itinerary</p>
          <h2 className="headline text-2xl sm:text-3xl mb-2">라운드와 여행이 자연스럽게 이어지는 3박 5일</h2>
          <p className="text-mute mb-8 max-w-2xl">닌빈 로얄CC에서 총 54홀을 라운드하고, 페스티벌 시상식과 하노이 자유시간까지 여유롭게 즐기는 일정입니다.</p>
        </Reveal>
        <ol className="space-y-3 max-w-3xl">
          {r.itinerary.map((d, i) => (
            <Reveal key={d.day} delay={i * 70}>
              <li>
                <details className="group rounded-xl border border-line bg-white open:shadow-soft">
                  <summary className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-5 p-5 cursor-pointer list-none">
                    <span className="font-display text-golddeep text-[15px] shrink-0 w-36">{d.day}</span>
                    <span className="text-[15.5px] flex-1">
                      <b className="block sm:inline sm:mr-2">{d.title}</b>
                      <span className="text-ink/75">{d.plan}</span>
                    </span>
                    <span className="text-[13px] font-bold text-royal shrink-0 group-open:hidden">자세히 보기 +</span>
                    <span className="text-[13px] font-bold text-mute shrink-0 hidden group-open:inline">접기 −</span>
                  </summary>
                  <div className="border-t border-line px-5 py-4 sm:pl-[calc(9rem+1.25rem)]">
                    <ul className="space-y-1.5 text-[14.5px]">
                      {d.steps.map(([t, s]) => (
                        <li key={t + s} className="flex gap-3">
                          <span className="font-display text-golddeep w-14 shrink-0">{t}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[13px] text-mute">식사 {d.meals} · 숙박 {d.stay}</p>
                  </div>
                </details>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 숙소 */}
      <section className="bg-white border-y border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <Reveal>
            <p className="eyebrow text-royal mb-2">{r.stay.eyebrow}</p>
            <h2 className="headline text-2xl sm:text-3xl mb-3">{r.stay.title}</h2>
            <p className="text-mute max-w-2xl mb-8 leading-relaxed">{r.stay.desc}</p>
          </Reveal>
          <Reveal>
            <figure className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden mb-4">
              <Image src={r.stay.hero.img} alt={r.stay.hero.alt} fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navydeep/85 to-transparent text-white px-6 pt-12 pb-5">
                <span className="eyebrow text-gold block mb-1">{r.stay.hero.tag}</span>
                <span className="text-[14.5px]">{r.stay.hero.caption}</span>
              </figcaption>
            </figure>
          </Reveal>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {r.stay.rooms.map((m, i) => (
              <Reveal key={m.tag} delay={i * 80}>
                <figure className="relative aspect-[4/5] rounded-xl overflow-hidden">
                  <Image src={m.img} alt={m.alt} fill sizes="(max-width: 640px) 33vw, 360px" className="object-cover" />
                  <figcaption className="absolute left-2.5 bottom-2.5 rounded-md bg-navydeep/80 text-white px-2 py-1 text-[11px] font-bold tracking-wide">{m.tag}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {r.stay.points.map(([t, d], i) => (
              <Reveal key={t} delay={i * 60}>
                <div className="rounded-2xl border border-line bg-paper p-6 h-full">
                  <p className="font-bold text-[16.5px] mb-1.5">{t}</p>
                  <p className="text-[14.5px] text-mute leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 식사 */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div className="grid lg:grid-cols-[420px_1fr] gap-8 items-center">
          <Reveal>
            <figure className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-soft">
              <Image src={r.dining.img} alt={r.dining.alt} fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
            </figure>
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow text-royal mb-2">{r.dining.eyebrow}</p>
            <h2 className="headline text-2xl sm:text-3xl mb-6">{r.dining.title}</h2>
            <ul className="space-y-3">
              {r.dining.items.map(([t, d]) => (
                <li key={t} className="flex gap-4 rounded-xl border border-line bg-white p-4">
                  <span className="text-gold font-black shrink-0" aria-hidden="true">✓</span>
                  <span>
                    <b className="block text-[15.5px]">{t}</b>
                    <span className="text-[14px] text-mute">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 선택 관광 */}
      <section className="bg-white border-y border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <Reveal>
            <p className="eyebrow text-royal mb-2">{r.tours.eyebrow}</p>
            <h2 className="headline text-2xl sm:text-3xl mb-3">{r.tours.title}</h2>
            <p className="text-mute max-w-2xl mb-8 leading-relaxed">{r.tours.desc}</p>
          </Reveal>
          <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-center">
            <Reveal>
              <figure className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-soft">
                <Image src={r.tours.img} alt={r.tours.alt} fill sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
              </figure>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {r.tours.items.map(([tag, t, d, price], i) => (
                <Reveal key={t} delay={i * 60}>
                  <div className="rounded-2xl border border-line bg-paper p-5 h-full">
                    <p className="eyebrow text-royal mb-1">{tag}</p>
                    <p className="font-bold text-[16.5px] mb-1.5">{t}</p>
                    <p className="text-[14px] text-mute leading-relaxed mb-3">{d}</p>
                    <p className="font-display text-golddeep">{price}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 포함 · 불포함 · 안내 */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20 grid md:grid-cols-2 gap-6">
        <Reveal>
          <div className="rounded-2xl border border-line bg-paper p-7 h-full">
            <h2 className="font-bold text-[18px] mb-4 text-golddeep">✓ 여행 경비에 포함됩니다</h2>
            <ul className="space-y-2.5 text-[15px]">
              {r.includes.map((x) => (
                <li key={x} className="flex gap-2.5"><span className="text-gold font-black shrink-0" aria-hidden="true">·</span>{x}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="rounded-2xl border border-line bg-paper p-7 h-full">
            <h2 className="font-bold text-[18px] mb-4 text-mute">✕ 별도 비용 및 이용 안내</h2>
            <ul className="space-y-2.5 text-[15px] mb-5">
              {r.excludes.map((x) => (
                <li key={x} className="flex gap-2.5"><span className="text-mute font-black shrink-0" aria-hidden="true">·</span>{x}</li>
              ))}
            </ul>
            <dl className="grid gap-2 text-[14px] border-t border-line pt-4">
              {r.extras.map(([k, v]) => (
                <div key={k} className="flex gap-3"><dt className="w-20 shrink-0 font-bold">{k}</dt><dd className="text-ink/80">{v}</dd></div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      {/* 시상 */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <Reveal>
            <p className="eyebrow text-gold mb-2">Premium Awards</p>
            <h2 className="headline text-2xl sm:text-3xl mb-2">총 1억원 상당의 프리미엄 시상품</h2>
            <p className="text-white/75 mb-9 max-w-2xl">라운드의 즐거움에 특별한 혜택을 더합니다. 오직 로얄CC 클럽 페스티벌에서만 경험할 수 있는 시상과 추억을 준비했습니다.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {r.awardsDetail.map((g, i) => (
              <Reveal key={g.group} delay={i * 90}>
                <div className="rounded-2xl bg-white/8 border border-white/12 p-6 h-full">
                  <p className="font-display text-gold text-[18px] mb-4">{g.group}</p>
                  <ul className="space-y-3">
                    {g.rows.map(([k, v]) => (
                      <li key={k} className="flex gap-3 text-[14.5px]">
                        <span className="font-bold shrink-0 w-24">{k}</span>
                        <span className="text-white/85">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-[13px] text-white/55 mt-5">홀인원 수상자는 니어리스트 시상에서 제외됩니다. 세부 규정은 참가자에게 별도 안내합니다.</p>
        </div>
      </section>

      {/* 예약 흐름 */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <Reveal>
          <p className="eyebrow text-royal mb-2">Reservation Flow</p>
          <h2 className="headline text-2xl sm:text-3xl mb-8">상담부터 출발까지 안심하고 준비하세요</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {r.flow.map(([t, d], i) => (
            <Reveal key={t} delay={i * 70}>
              <div className="rounded-2xl border border-line bg-white p-6 h-full">
                <p className="font-display text-golddeep text-lg mb-2">{String(i + 1).padStart(2, "0")}</p>
                <p className="font-bold text-[16.5px] mb-1">{t}</p>
                <p className="text-[14px] text-mute">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="rounded-2xl bg-navy text-white p-7 sm:p-9 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="eyebrow text-gold mb-2">1차 모집 특가</p>
              <p className="mb-2">
                <span className="text-white/55 line-through mr-3">{r.priceOriginal}</span>
                <span className="font-display text-[34px] text-gold">{r.price}</span>
                <span className="text-white/75 text-[14px] ml-2">{r.priceNote}</span>
              </p>
              <p className="text-white/75 text-[14.5px]">모집 인원에 따라 조기 마감될 수 있습니다. 별도 날짜도 페스티벌 특가로 신청할 수 있으며, 해당 일정에는 시상품이 제공되지 않습니다.</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[220px]">
              <a href={site.phoneHref} className="btn btn-gold">전화 상담 {site.phone}</a>
              <a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="btn bg-white/95 text-navy font-bold hover:bg-white">밴드 문의</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Reveal>
          <p className="eyebrow text-royal mb-2">FAQ</p>
          <h2 className="headline text-2xl sm:text-3xl mb-6">참가 전 확인하세요</h2>
        </Reveal>
        <div className="space-y-2.5 max-w-3xl">
          {r.faq.map(([q, a]) => (
            <details key={q} className="group rounded-xl border border-line bg-white">
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-bold text-[15.5px]">
                {q}
                <span aria-hidden="true" className="text-royal shrink-0 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-ink/85 border-t border-line pt-4">{a}</p>
            </details>
          ))}
        </div>
        <ul className="mt-8 rounded-xl bg-paper p-5 text-[13px] text-mute space-y-1 max-w-3xl">
          {r.notices.map((n) => <li key={n}>· {n}</li>)}
        </ul>
        <p className="mt-4 text-[13px] text-mute">
          공식 페이지: <a href={r.officialUrl} target="_blank" rel="noopener noreferrer" className="underline text-royaldark">{r.officialUrl}</a>
        </p>
      </section>
    </>
  );
}
