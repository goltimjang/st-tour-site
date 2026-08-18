import Link from "next/link";
import Image from "next/image";
import { site, promo } from "@/data/site";
import { overseasPrices, domesticPrices, priceDisclaimer } from "@/data/prices";
import { faqs } from "@/data/faq";
import Reveal from "@/components/Reveal";
import HeroVideo from "@/components/HeroVideo";

export default function Home() {
  return (
    <>
      {/* ---------- 히어로 (사진 + 진입 애니메이션) ---------- */}
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
            <p className="eyebrow text-sky mb-4">Custom Golf Tour · Since {site.company.since}</p>
            <h1 className="headline text-[36px] sm:text-[56px] mb-5 drop-shadow-lg">
              24시간 안에,
              <br />
              견적서가 도착합니다.
            </h1>
            <p className="text-[17px] sm:text-[19px] text-white/85 max-w-xl mb-9 drop-shadow">
              원하는 날짜만 알려주세요. 골프장은 저희가 찾겠습니다.
              <br className="hidden sm:block" />
              국내 전국 {site.stats.courses}개 골프장 · 해외 {site.stats.countries}개국, 대행비까지 공개된 정직한 견적.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <Link href="/domestic#quote" className="btn btn-royal flex-1 shadow-lg shadow-royal/30">국내 견적 요청</Link>
              <Link href="/overseas#quote" className="btn flex-1 bg-white/95 text-navy font-bold hover:bg-white">해외 견적 요청</Link>
              <a href={site.phoneHref} className="btn btn-gold flex-1 backdrop-blur-sm bg-navydeep/30">전화 상담</a>
            </div>
          </div>
        </div>

        {/* 철칙 정보 그리드 */}
        <div className="relative border-t border-white/15 bg-navydeep/70 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-5 grid grid-cols-2 lg:grid-cols-4">
            {[
              ["Promise 01", "24시간 내 견적서 회신"],
              ["Promise 02", "대행비 공개 · 투명 견적"],
              ["Coverage", `국내 골프장 ${site.stats.courses}개`],
              ["Overseas", `해외 ${site.stats.countries}개국 상담`],
            ].map(([k, v]) => (
              <div key={k} className="py-5 px-2 lg:px-4 border-l first:border-l-0 border-white/10">
                <p className="eyebrow text-sky">{k}</p>
                <p className="text-[14px] sm:text-[15px] font-bold mt-1">{v}</p>
              </div>
            ))}
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
          <a
            href={promo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group card-lift block rounded-3xl overflow-hidden text-white shadow-soft relative"
          >
            <div className="img-zoom absolute inset-0" aria-hidden="true">
              <Image src="/images/royalcc.jpg" alt="" fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover" />
            </div>
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{ background: "linear-gradient(92deg, rgba(3,13,44,.88) 0%, rgba(3,13,44,.6) 55%, rgba(3,13,44,.15) 100%)" }}
            />
            <div className="relative p-8 sm:p-12 max-w-2xl">
              <span className="inline-block rounded-full bg-gold text-navydeep text-[12px] font-black px-3.5 py-1.5 mb-5">
                {promo.badge}
              </span>
              <h3 className="headline text-[24px] sm:text-[34px] mb-2 drop-shadow">{promo.title}</h3>
              <p className="text-white/85 mb-1">{promo.date}</p>
              <p className="text-white/80 mb-6">{promo.desc}</p>
              <p className="mb-7">
                <span className="text-white/55 line-through mr-3">{promo.priceOriginal}</span>
                <span className="font-display text-[30px] sm:text-[38px] text-gold drop-shadow">{promo.price}</span>
                <span className="text-white/70 text-[14px] ml-2">{promo.priceNote}</span>
              </p>
              <span className="inline-flex items-center gap-2 font-bold text-white bg-royal rounded-lg px-5 py-3 group-hover:bg-royalhover transition-colors">
                자세히 보기 <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
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
              img: "/images/vietnam.jpg",
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
                  <Image src={c.img} alt={`${c.title} 대표 이미지`} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
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
              ["01", "조건 입력 (1분)", "지역·날짜·인원만 고르면 끝. 골프장을 몰라도 됩니다."],
              ["02", "24시간 내 견적서", "밤을 새워서라도 24시간 안에 견적서를 보내드립니다."],
              ["03", "원가 공개 확인", "골프장·숙박·항공 원가와 대행비가 분리된 견적서를 직접 확인하세요."],
              ["04", "확정 · 예약", "일정 확정 후 계약금 입금 시 티타임을 확보해 드립니다."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 90}>
                <div className="card-lift rounded-2xl border border-line bg-paper p-6 h-full">
                  <p className="font-display text-gold text-lg mb-2">{n}</p>
                  <p className="font-bold text-[17px] mb-1.5">{t}</p>
                  <p className="text-[14.5px] text-mute">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 가격 범위 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Reveal>
          <p className="eyebrow text-royal mb-2">Price Guide</p>
          <h2 className="headline text-2xl sm:text-3xl mb-3">골프투어, 대략 얼마면 갈까요?</h2>
          <p className="text-mute mb-8 max-w-2xl">
            숨기지 않고 미리 보여드립니다. 1인 기준 시장 통상 범위이며, 정확한 금액은 견적서에서 원가와 대행비로 나눠 확인하실 수 있습니다.
          </p>
        </Reveal>
        <div className="grid lg:grid-cols-2 gap-6">
          <Reveal><PriceCard title="해외 골프투어" rows={overseasPrices.slice(0, 6)} more="/overseas" /></Reveal>
          <Reveal delay={120}><PriceCard title="국내 골프투어" rows={domesticPrices} more="/domestic" /></Reveal>
        </div>
        <p className="text-[13.5px] text-mute mt-5 max-w-3xl">{priceDisclaimer}</p>
      </section>

      {/* ---------- 신뢰 ---------- */}
      <section className="bg-navy text-white relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(900px 400px at 90% -10%, rgba(13,79,245,.5), transparent 60%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow text-sky mb-2">Why ST TOUR</p>
            <h2 className="headline text-2xl sm:text-3xl mb-9">에스티투어가 다른 이유</h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              ["종합여행업", "등록 여행사 · 보증보험 완비", "관광진흥법에 따른 종합여행업 등록과 영업보증보험 5,000만원(SGI서울보증)을 갖춘 정식 여행사입니다."],
              ["600팀", "클럽 페스티벌 직접 주관", "더힐 클럽 페스티벌 등 대형 골프 행사를 직접 기획·운영하는 행사 전문 여행사입니다."],
              ["24시간", "견적 회신 철칙", "밤을 새워서라도 24시간 안에, 대행비까지 공개된 견적서를 보내드립니다."],
            ].map(([n, t, d], i) => (
              <Reveal key={t as string} delay={i * 100}>
                <div className="border-l-2 border-gold pl-5">
                  <p className="font-display text-[26px] text-gold mb-1">{n}</p>
                  <p className="font-bold mb-1.5">{t}</p>
                  <p className="text-[14.5px] text-white/70">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                에스티투어 밴드 커뮤니티 →
              </a>
              <Link href="/about" className="btn btn-outline">회사소개 보기</Link>
            </div>
          </Reveal>
        </div>
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
          <Image src="/images/thailand.jpg" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-navydeep/80" />
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
