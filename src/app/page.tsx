import Link from "next/link";
import { site, promo } from "@/data/site";
import { overseasPrices, domesticPrices, priceDisclaimer } from "@/data/prices";
import { faqs } from "@/data/faq";

export default function Home() {
  return (
    <>
      {/* ---------- 히어로 (정적) ---------- */}
      <section className="relative bg-navydeep text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(1100px 500px at 80% -10%, rgba(13,79,245,.45), transparent 60%), radial-gradient(900px 420px at 10% 110%, rgba(217,173,74,.18), transparent 55%), linear-gradient(180deg, #030d2c 0%, #06143e 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="eyebrow text-sky mb-4">Custom Golf Tour · Since {site.company.since}</p>
          <h1 className="headline text-[34px] sm:text-[52px] mb-5">
            24시간 안에,
            <br />
            견적서가 도착합니다.
          </h1>
          <p className="text-[17px] sm:text-[19px] text-white/75 max-w-xl mb-9">
            원하는 날짜만 알려주세요. 골프장은 저희가 찾겠습니다.
            <br className="hidden sm:block" />
            국내 전국 {site.stats.courses}개 골프장 · 해외 {site.stats.countries}개국, 대행비까지 공개된 정직한 견적.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <Link href="/domestic#quote" className="btn btn-royal flex-1">국내 견적 요청</Link>
            <Link href="/overseas#quote" className="btn btn-outline flex-1">해외 견적 요청</Link>
            <a href={site.phoneHref} className="btn btn-gold flex-1">전화 상담</a>
          </div>
        </div>

        {/* 철칙 정보 그리드 */}
        <div className="relative border-t border-white/10 bg-navydeep/80">
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

      {/* ---------- 프로모션 카드 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="eyebrow text-golddeep mb-2">Promotion</p>
        <h2 className="headline text-2xl sm:text-3xl mb-6">진행 중인 행사</h2>
        <a
          href={promo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl overflow-hidden border border-line bg-navy text-white hover:shadow-xl transition-shadow"
        >
          <div className="p-7 sm:p-10 relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-50"
              style={{ background: "radial-gradient(700px 300px at 90% 0%, rgba(13,79,245,.5), transparent 60%)" }}
            />
            <div className="relative">
              <span className="inline-block rounded-full bg-gold text-navydeep text-[12px] font-black px-3 py-1 mb-4">
                {promo.badge}
              </span>
              <h3 className="headline text-[24px] sm:text-[32px] mb-2">{promo.title}</h3>
              <p className="text-white/75 mb-1">{promo.date}</p>
              <p className="text-white/75 mb-5 max-w-2xl">{promo.desc}</p>
              <p className="mb-6">
                <span className="text-white/50 line-through mr-3">{promo.priceOriginal}</span>
                <span className="font-display text-[28px] sm:text-[34px] text-gold">{promo.price}</span>
                <span className="text-white/60 text-[14px] ml-2">{promo.priceNote}</span>
              </p>
              <span className="inline-flex items-center gap-2 font-bold text-sky group-hover:text-white">
                자세히 보기 <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </a>
      </section>

      {/* ---------- 국내/해외 진입 ---------- */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid md:grid-cols-2 gap-5">
          <Link href="/domestic" className="group rounded-2xl border border-line bg-white p-8 sm:p-10 hover:border-royal transition-colors">
            <p className="eyebrow text-royal mb-2">Domestic</p>
            <h3 className="headline text-[24px] sm:text-[28px] mb-3">국내 골프투어</h3>
            <p className="text-mute mb-5">
              전국 {site.stats.courses}개 골프장에서 지역을 고르고 원하는 골프장을 지정하세요. 티타임·숙박·이동까지 한 번에 견적드립니다.
            </p>
            <span className="font-bold text-royal group-hover:underline">지역 고르고 견적받기 →</span>
          </Link>
          <Link href="/overseas" className="group rounded-2xl border border-line bg-white p-8 sm:p-10 hover:border-royal transition-colors">
            <p className="eyebrow text-royal mb-2">Overseas</p>
            <h3 className="headline text-[24px] sm:text-[28px] mb-3">해외 골프투어</h3>
            <p className="text-mute mb-5">
              일본·태국·베트남부터 {site.stats.countries}개국까지. 항공·숙박·라운드·차량을 묶어 예산에 맞는 일정을 설계해 드립니다.
            </p>
            <span className="font-bold text-royal group-hover:underline">국가 고르고 견적받기 →</span>
          </Link>
        </div>
      </section>

      {/* ---------- 이용 방법 ---------- */}
      <section className="bg-white border-y border-line">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="eyebrow text-royal mb-2">How It Works</p>
          <h2 className="headline text-2xl sm:text-3xl mb-8">이렇게 진행됩니다</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ["01", "조건 입력 (1분)", "지역·날짜·인원만 고르면 끝. 골프장을 몰라도 됩니다."],
              ["02", "24시간 내 견적서", "밤을 새워서라도 24시간 안에 견적서를 보내드립니다."],
              ["03", "원가 공개 확인", "골프장·숙박·항공 원가와 대행비가 분리된 견적서를 직접 확인하세요."],
              ["04", "확정 · 예약", "일정 확정 후 계약금 입금 시 티타임을 확보해 드립니다."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-xl border border-line p-6">
                <p className="font-display text-gold text-lg mb-2">{n}</p>
                <p className="font-bold text-[17px] mb-1.5">{t}</p>
                <p className="text-[14.5px] text-mute">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 가격 범위 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="eyebrow text-royal mb-2">Price Guide</p>
        <h2 className="headline text-2xl sm:text-3xl mb-3">골프투어, 대략 얼마면 갈까요?</h2>
        <p className="text-mute mb-7 max-w-2xl">
          숨기지 않고 미리 보여드립니다. 1인 기준 시장 통상 범위이며, 정확한 금액은 견적서에서 원가와 대행비로 나눠 확인하실 수 있습니다.
        </p>
        <div className="grid lg:grid-cols-2 gap-5">
          <PriceCard title="해외 골프투어" rows={overseasPrices.slice(0, 6)} more="/overseas" />
          <PriceCard title="국내 골프투어" rows={domesticPrices} more="/domestic" />
        </div>
        <p className="text-[13.5px] text-mute mt-4 max-w-3xl">{priceDisclaimer}</p>
      </section>

      {/* ---------- 신뢰 ---------- */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="eyebrow text-sky mb-2">Why ST TOUR</p>
          <h2 className="headline text-2xl sm:text-3xl mb-8">10년의 골프투어 경험이 당신의 일정을 설계합니다</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              [`${site.stats.years}년`, "국내·해외 골프투어 전문 운영", "세종에서 10년, 골프투어·골프부킹·골프대회를 전문으로 해왔습니다."],
              ["600팀", "클럽 페스티벌 직접 주관 경험", "더힐 클럽 페스티벌 등 대형 골프 행사를 직접 기획·운영합니다."],
              ["등록 여행업체", "보증보험 가입 완료", "관광사업자 등록과 보증보험을 갖춘 정식 여행사입니다."],
            ].map(([n, t, d]) => (
              <div key={t as string} className="border-l-2 border-gold pl-5">
                <p className="font-display text-[26px] text-gold mb-1">{n}</p>
                <p className="font-bold mb-1.5">{t}</p>
                <p className="text-[14.5px] text-white/70">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              에스티투어 밴드 커뮤니티 →
            </a>
            <Link href="/about" className="btn btn-outline">회사소개 보기</Link>
          </div>
        </div>
      </section>

      {/* ---------- FAQ 미리보기 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="eyebrow text-royal mb-2">FAQ</p>
        <h2 className="headline text-2xl sm:text-3xl mb-7">자주 묻는 질문</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.slice(0, 4).map((f) => (
            <div key={f.q} className="rounded-xl border border-line bg-white p-6">
              <p className="font-bold text-[16.5px] mb-2">Q. {f.q}</p>
              <p className="text-[14.5px] text-mute line-clamp-3">{f.a}</p>
            </div>
          ))}
        </div>
        <Link href="/faq" className="inline-block mt-6 font-bold text-royal hover:underline">
          전체 질문 보기 →
        </Link>
      </section>

      {/* ---------- 마지막 CTA ---------- */}
      <section className="bg-navydeep text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h2 className="headline text-[26px] sm:text-[36px] mb-3">견적은 무료, 연락은 24시간 안에.</h2>
          <p className="text-white/70 mb-8">지금 조건을 보내주시면 내일 이 시간 전에 견적서를 받아보실 수 있습니다.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
            <Link href="/domestic#quote" className="btn btn-royal flex-1">국내 견적 요청</Link>
            <Link href="/overseas#quote" className="btn btn-outline flex-1">해외 견적 요청</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PriceCard({ title, rows, more }: { title: string; rows: { dest: string; from: string; range: string }[]; more: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden">
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
