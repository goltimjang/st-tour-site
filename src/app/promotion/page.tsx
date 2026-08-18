import type { Metadata } from "next";
import Link from "next/link";
import { promo, site } from "@/data/site";

export const metadata: Metadata = {
  title: "프로모션 — 진행 중인 골프투어 행사",
  description:
    "에스티투어가 진행 중인 골프투어 프로모션과 시즌 추천 구성을 확인하세요. 로얄CC 클럽 페스티벌 등 직접 주관하는 골프 행사 정보를 안내합니다.",
};

const seasonal = [
  { season: "겨울 (12~2월)", title: "동남아 골프 성수기", desc: "태국·베트남·필리핀이 최적기입니다. 티타임 마감이 빠르니 가을 전에 견적을 받아두세요.", link: "/overseas" },
  { season: "봄·가을", title: "국내 + 일본 규슈·산둥", desc: "국내 전 지역이 좋은 계절. 1시간대 비행의 규슈·칭다오 단기 골프도 인기입니다.", link: "/domestic" },
  { season: "여름 (6~9월)", title: "홋카이도 · 몽골 역시즌", desc: "혹서기를 피해 서늘한 홋카이도와 몽골로. 여름 한정 상품입니다.", link: "/overseas" },
];

export default function PromotionPage() {
  return (
    <>
      <section className="bg-white border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16 hero-anim">
          <p className="eyebrow text-royal mb-3">Promotion</p>
          <h1 className="headline text-[30px] sm:text-[42px] text-navy">진행 중인 행사</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <a href={promo.url} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl overflow-hidden bg-navydeep text-white border border-line hover:shadow-xl transition-shadow">
          <div className="p-8 sm:p-12 relative overflow-hidden">
            <div aria-hidden="true" className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(800px 350px at 85% 0%, rgba(13,79,245,.5), transparent 60%), radial-gradient(500px 250px at 5% 100%, rgba(23,184,119,.22), transparent 55%)" }} />
            <div className="relative">
              <span className="inline-block rounded-full bg-gold text-white text-[12px] font-black px-3 py-1 mb-5">{promo.badge}</span>
              <h2 className="headline text-[26px] sm:text-[38px] mb-3">{promo.title}</h2>
              <p className="text-white/75 text-[16.5px] mb-1">{promo.date}</p>
              <p className="text-white/75 mb-6 max-w-2xl">{promo.desc}</p>
              <p className="mb-8">
                <span className="text-white/50 line-through mr-3 text-[17px]">{promo.priceOriginal}</span>
                <span className="font-display text-[32px] sm:text-[40px] text-gold">{promo.price}</span>
                <span className="text-white/60 text-[14px] ml-2">{promo.priceNote}</span>
              </p>
              <span className="btn btn-royal">행사 페이지에서 자세히 보기 →</span>
            </div>
          </div>
        </a>
        <p className="text-[13px] text-mute mt-3">
          본 행사는 기획여행 상품으로, 상세 일정·포함 내역·취소 규정은 행사 페이지에서 확인하실 수 있습니다. 문의 {site.phone}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="headline text-xl sm:text-2xl mb-6">시즌 추천 구성</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {seasonal.map((s) => (
            <Link key={s.title} href={s.link} className="group rounded-2xl border border-line bg-white p-7 hover:border-royal transition-colors">
              <p className="eyebrow text-golddeep mb-2">{s.season}</p>
              <p className="font-bold text-[18px] mb-2 group-hover:text-royal">{s.title}</p>
              <p className="text-[14.5px] text-mute">{s.desc}</p>
              <span className="inline-block mt-4 font-bold text-royal text-[14.5px]">견적 받기 →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
