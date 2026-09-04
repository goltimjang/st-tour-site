import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { site, promo } from "@/data/site";
import { overseasPrices, domesticPrices, priceDisclaimer } from "@/data/prices";
import { faqs } from "@/data/faq";
import Reveal from "@/components/Reveal";
import HeroVideo from "@/components/HeroVideo";
import Counter from "@/components/Counter";
import PosterShelf from "@/components/PosterShelf";
import QuoteSample from "@/components/QuoteSample";
import EventGallery from "@/components/EventGallery";
import ChatDemo from "@/components/ChatDemo";
import { webPageLd } from "@/data/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const pageLd = webPageLd("에스티골프투어 | 국내·해외 골프투어 견적 전문", "/", site.positioning);

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      {/* ---------- 히어로 (사진 + 진입 애니메이션) ---------- */}
      {/* LCP 이미지(비디오 포스터) 선로딩: React가 head로 호이스팅 */}
      <link rel="preload" as="image" href="/images/hero.jpg" fetchPriority="high" />
      <section className="relative bg-navydeep text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <HeroVideo src="/videos/hero.mp4" poster="/images/hero.jpg" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(88deg, rgba(3,13,44,.86) 0%, rgba(3,13,44,.62) 42%, rgba(3,13,44,.18) 78%, rgba(3,13,44,.05) 100%)",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-36">
          <div className="hero-anim max-w-2xl">
            <h1 className="headline text-[36px] sm:text-[56px] mb-5 drop-shadow-lg">
              전국 어디든, 세계 어디든
              <br />
              골프투어 견적은 에스티골프투어
            </h1>
            <p className="text-[17px] sm:text-[19px] text-white/85 max-w-xl mb-9 drop-shadow">
              전국 {site.stats.courses}개 골프장과 해외 {site.stats.countries}개국 골프장 중에서 가고 싶은 곳을 정해 보세요.
              나머지는 저희가 준비합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <Link href="/domestic#quote" className="btn btn-royal flex-1 shadow-lg shadow-royal/30">국내 견적 요청</Link>
              <Link href="/overseas#quote" className="btn flex-1 bg-white/95 text-navy font-bold hover:bg-white">해외 견적 요청</Link>
              <a href={site.phoneHref} className="btn btn-gold flex-1 backdrop-blur-sm bg-navydeep/30">전화 상담</a>
            </div>
            <p className="mt-5 text-[14px] text-white/70">견적은 무료입니다 · 하루 안에 회신드립니다 · 종합여행업 등록 여행사</p>
          </div>
        </div>
      </section>

      {/* ---------- 프로모션 카드 (사진 배경) ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Reveal>
          <p className="eyebrow text-golddeep mb-2">Promotion</p>
          <h2 className="headline text-2xl sm:text-3xl mb-7">진행 중인 행사</h2>
        </Reveal>
        <Reveal delay={100}>
          <Link
            href="/promotion"
            className="group card-lift block rounded-3xl overflow-hidden text-white shadow-soft relative"
          >
            <div className="img-zoom absolute inset-0" aria-hidden="true">
              <Image src="/images/royalcc.webp" alt="" fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover" />
            </div>
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{ background: "linear-gradient(92deg, rgba(3,13,44,.88) 0%, rgba(3,13,44,.6) 55%, rgba(3,13,44,.15) 100%)" }}
            />
            <div className="relative p-8 sm:p-12 max-w-2xl">
              <span className="inline-block rounded-full bg-amber text-navydeep text-[12px] font-black px-3.5 py-1.5 mb-5">
                {promo.badge}
              </span>
              <h3 className="headline text-[24px] sm:text-[34px] mb-2 drop-shadow">
                베트남 하노이 로얄CC
                <br />
                클럽 페스티벌 2026
              </h3>
              <p className="text-white/85 mb-1">{promo.date}</p>
              <p className="text-white/80 mb-6">{promo.desc}</p>
              <p className="mb-7">
                <span className="text-white/55 line-through mr-3">{promo.priceOriginal}</span>
                <span className="font-display text-[30px] sm:text-[38px] text-amber drop-shadow">{promo.price}</span>
                <span className="text-white/70 text-[14px] ml-2">{promo.priceNote}</span>
              </p>
              <span className="inline-flex items-center gap-2 font-bold text-white/95 border-b-2 border-amber pb-1 group-hover:text-amber transition-colors">
                자세히 보기 <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* ---------- 국내/해외 진입 (사진 카드) ---------- */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              href: "/domestic",
              img: "/images/domestic.jpg",
              eyebrow: "Domestic",
              title: "국내 골프투어",
              desc: `전국 ${site.stats.courses}개 골프장에서 지역을 고르고 원하는 골프장을 지정하세요. 티타임·숙박·이동까지 한 번에 견적드립니다.`,
              cta: "지역 고르고 견적받기 →",
              delay: 0,
            },
            {
              href: "/overseas",
              img: "/images/overseas.jpg",
              eyebrow: "Overseas",
              title: "해외 골프투어",
              desc: `일본·태국·베트남부터 ${site.stats.countries}개국까지. 항공·숙박·라운드·차량을 묶어 예산에 맞는 일정을 설계해 드립니다.`,
              cta: "국가 고르고 견적받기 →",
              delay: 120,
            },
          ].map((c) => (
            <Reveal key={c.href} delay={c.delay}>
              <Link href={c.href} className="group card-lift block rounded-3xl overflow-hidden border border-line bg-white shadow-soft">
                <div className="img-zoom relative h-52 sm:h-60">
                  <Image src={c.img} alt={`${c.title} 지도`} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover object-center" />
                </div>
                <div className="p-7 sm:p-8">
                  <p className="eyebrow text-royal mb-2">{c.eyebrow}</p>
                  <h3 className="headline text-[23px] sm:text-[26px] mb-3">{c.title}</h3>
                  <p className="text-mute text-[15px] mb-4">{c.desc}</p>
                  <span className="font-bold text-royal group-hover:underline">{c.cta}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- 이용 방법 ---------- */}
      <section className="bg-white border-y border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow text-royal mb-2">How It Works</p>
            <h2 className="headline text-2xl sm:text-3xl mb-9">이렇게 진행됩니다</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ["01", "조건 입력 (30초)", "지역과 날짜, 인원만 고르면 됩니다."],
              ["02", "24시간 내 견적서", "요청을 확인한 뒤 하루 안에 견적서를 보내드립니다."],
              ["03", "일정 조정", "포함 내역을 확인하고 숙소·라운드·이동을 원하는 대로 조정합니다."],
              ["04", "확정 · 예약", "일정이 정해지면 계약금 입금과 함께 티타임을 잡아드립니다."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 90}>
                <div className="card-lift rounded-2xl border border-line bg-paper p-6 h-full">
                  <p className="font-display text-golddeep text-lg mb-2">{n}</p>
                  <p className="font-bold text-[17px] mb-1.5">{t}</p>
                  <p className="text-[14.5px] text-mute">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 견적 방식: 견적서 샘플 + 상담 예시 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20 overflow-hidden">
        <Reveal>
          <p className="eyebrow text-royal mb-2">How We Quote</p>
          <h2 className="headline text-2xl sm:text-3xl mb-3">견적서, 이렇게 보내드립니다</h2>
          <p className="text-mute mb-10 max-w-2xl">
            총액만 던지지 않습니다. 무엇이 포함되고 무엇이 빠지는지 항목별로 적고, 조건에 맞춰 숙소·라운드·이동을
            조정해 드립니다. 받아보시면 바로 비교하고 결정하실 수 있습니다.
          </p>
        </Reveal>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <Reveal><QuoteSample /></Reveal>
          <Reveal delay={120}><ChatDemo /></Reveal>
        </div>
      </section>

      {/* ---------- 가격 범위 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Reveal>
          <p className="eyebrow text-royal mb-2">Price Guide</p>
          <h2 className="headline text-2xl sm:text-3xl mb-3">골프투어, 대략 얼마면 갈까요?</h2>
          <p className="text-mute mb-8 max-w-2xl">
            미리 감을 잡으실 수 있게 시장 통상 범위를 보여드립니다. 1인 기준이며, 정확한 금액은 조건에 맞춘 견적서로 알려드립니다.
          </p>
        </Reveal>
        <div className="grid lg:grid-cols-2 gap-6">
          <Reveal><PriceCard title="해외 골프투어" rows={overseasPrices.slice(0, 6)} more="/overseas" /></Reveal>
          <Reveal delay={120}><PriceCard title="국내 골프투어" rows={domesticPrices} more="/domestic" /></Reveal>
        </div>
        <p className="text-[13.5px] text-mute mt-5 max-w-3xl">{priceDisclaimer}</p>
      </section>

      {/* ---------- 실적 · 신뢰 (25,000팀 + 포스터 진열대) ---------- */}
      <section className="bg-white border-y border-line overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow text-royal mb-2">Track Record</p>
            <h2 className="headline text-2xl sm:text-3xl mb-3">
              누적 <span className="text-golddeep"><Counter to={25000} suffix="팀" /></span>이
              에스티골프투어와 함께했습니다
            </h2>
            <p className="text-mute mb-10 max-w-2xl">
              국내와 해외로 골프투어를 보내드리고, 대회와 페스티벌을 직접 주최·주관해 온 기록입니다.
            </p>
          </Reveal>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-12 max-w-3xl">
            {[
              [<Counter key="c" to={25000} suffix="팀" />, "누적 국내·해외 송출"],
              [`${site.stats.people} 명`, "함께한 골퍼 (인원 환산)"],
              [`${site.stats.tournaments}회`, "대회·페스티벌 주최·주관"],
            ].map(([n, t], i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="border-l-2 border-gold pl-4 sm:pl-5">
                  <p className="font-display text-[20px] sm:text-[27px] text-golddeep mb-0.5">{n}</p>
                  <p className="text-[13px] sm:text-[14.5px] text-mute font-semibold">{t}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="font-bold text-[17px] mb-1">에스티골프투어가 만든 대회들</p>
            <p className="text-[14px] text-mute mb-2">포스터를 누르면 크게 보실 수 있습니다</p>
          </Reveal>
          <Reveal delay={100}>
            <PosterShelf />
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                에스티골프투어 밴드 커뮤니티 →
              </a>
              <Link href="/about" className="btn btn-light">회사소개 보기</Link>
            </div>
          </Reveal>
          <p className="text-[12.5px] text-mute mt-6">누적 팀 수는 에스티골프투어 자체 집계 기준입니다.</p>
        </div>
      </section>

      {/* ---------- 행사 현장 ---------- */}
      <section className="bg-paper border-b border-line overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-16 sm:pt-20 pb-4">
          <Reveal>
            <p className="eyebrow text-royal mb-2">On The Course</p>
            <h2 className="headline text-2xl sm:text-3xl mb-3">대회 현장의 에스티골프투어</h2>
            <p className="text-mute max-w-2xl">
              ST Tour 아마추어 대회부터 더힐 클럽 페스티벌까지, 저희가 직접 만든 대회의 실제 현장입니다.
            </p>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <div className="pb-14 sm:pb-16"><EventGallery /></div>
        </Reveal>
      </section>

      {/* ---------- FAQ 미리보기 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Reveal>
          <p className="eyebrow text-royal mb-2">FAQ</p>
          <h2 className="headline text-2xl sm:text-3xl mb-8">자주 묻는 질문</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-5">
          {faqs.slice(0, 4).map((f, i) => (
            <Reveal key={f.q} delay={i * 80}>
              <div className="card-lift rounded-2xl border border-line bg-white p-6 h-full shadow-soft">
                <p className="font-bold text-[16.5px] mb-2">Q. {f.q}</p>
                <p className="text-[14.5px] text-mute line-clamp-3">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Link href="/faq" className="inline-block mt-7 font-bold text-royal hover:underline">
          전체 질문 보기 →
        </Link>
      </section>

      {/* ---------- 마지막 CTA (사진 배경) ---------- */}
      <section className="relative bg-navydeep text-white overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image src="/images/thailand.webp" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,20,62,.62) 0%, rgba(13,79,245,.5) 100%)" }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-20 text-center">
          <Reveal>
            <h2 className="headline text-[26px] sm:text-[38px] mb-3">견적은 무료, 연락은 24시간 안에.</h2>
            <p className="text-white/80 mb-9">지금 조건을 보내주시면 내일 이 시간 전에 견적서를 받아보실 수 있습니다.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
              <Link href="/domestic#quote" className="btn btn-royal flex-1 shadow-lg shadow-royal/30">국내 견적 요청</Link>
              <Link href="/overseas#quote" className="btn flex-1 bg-white/95 text-navy font-bold hover:bg-white">해외 견적 요청</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function PriceCard({ title, rows, more }: { title: string; rows: { dest: string; from: string; range: string }[]; more: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden shadow-soft h-full">
      <div className="px-6 py-4 border-b border-line flex items-center justify-between">
        <p className="font-bold text-[17px]">{title}</p>
        <Link href={more} className="text-[14px] font-bold text-royal hover:underline">전체 보기 →</Link>
      </div>
      <ul>
        {rows.map((r) => (
          <li key={r.dest} className="px-6 py-3.5 border-b border-line last:border-0 flex items-baseline justify-between gap-3">
            <span className="text-[15px] font-semibold">{r.dest}</span>
            <span className="text-right shrink-0">
              <span className="font-display text-royaldark text-[17px]">{r.from}</span>
              <span className="hidden sm:inline text-[12.5px] text-mute ml-2">{r.range}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
