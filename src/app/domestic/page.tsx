import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/site";
import { domesticPrices, priceDisclaimer } from "@/data/prices";
import DomesticClient from "./DomesticClient";
import { breadcrumbLd } from "@/data/jsonld";

export const metadata: Metadata = {
  title: "국내 골프투어 견적 | 전국 골프장 맞춤 패키지",
  description:
    "전국 500여 개 골프장에서 지역과 골프장을 고르면 24시간 안에 맞춤 견적서를 보내드립니다. 티타임·숙박·이동까지 한 번에, 대행비까지 공개된 정직한 국내 골프투어 견적.",
  alternates: { canonical: "/domestic/" },
};

const domesticFaqs = [
  {
    q: "주말 티타임도 구해주시나요?",
    a: "네, 주말·연휴 부킹도 상담합니다. 전국 골프장 네트워크로 해당 날짜의 티타임 확보 가능 여부를 확인해 24시간 안에 알려드립니다. 주말은 자리가 빨리 마감되니 2~3주 전에 요청하시는 것이 좋습니다.",
  },
  {
    q: "2명이서도 국내 골프투어 견적을 받을 수 있나요?",
    a: "네, 부부·친구 2인 여행도 견적드립니다. 골프장에 따라 2인 플레이 가능 여부와 요금 조건이 다르므로, 조건에 맞는 골프장을 골라 안내해 드립니다.",
  },
  {
    q: "숙박 없이 라운드만 예약할 수도 있나요?",
    a: "네, 가능합니다. 당일 라운드 부킹부터 숙박 포함 1박 2일·2박 3일 패키지까지 원하는 형태로 견적드립니다. 견적 요청 시 '라운드만'을 선택하시면 됩니다.",
  },
  {
    q: "동호회·회사 단체도 진행하나요?",
    a: "네, 단체 골프투어와 골프대회 행사를 전문으로 합니다. 조편성, 시상식, 식사·연회까지 행사 전체를 대행하며, 인원과 날짜를 보내주시면 단체 조건으로 견적드립니다.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: domesticFaqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const crumbLd = breadcrumbLd([{ name: "국내 골프투어", path: "/domestic/" }]);

export default function DomesticPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image src="/images/domestic.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(3,13,44,.9) 0%, rgba(3,13,44,.65) 50%, rgba(3,13,44,.3) 100%)" }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20 hero-anim">
          <p className="eyebrow text-sky mb-3">Domestic Golf Tour</p>
          <h1 className="headline text-[30px] sm:text-[42px] mb-4">
            전국 {site.stats.courses}개 골프장,
            <br className="sm:hidden" /> 원하는 곳으로 모십니다.
          </h1>
          <p className="text-white/75 max-w-2xl text-[16.5px]">
            지역만 골라도 되고, 골프장을 콕 집어도 됩니다. 1박 2일 골프여행부터 동호회·기업 단체 행사까지.
            조건을 보내주시면 <strong className="text-gold">24시간 안에</strong> 티타임·숙박·이동이 포함된 견적서를 보내드립니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        <DomesticClient />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="headline text-xl sm:text-2xl mb-4">국내 골프투어 가격 안내</h2>
        <div className="rounded-2xl border border-line bg-white overflow-x-auto">
          <table className="w-full text-[15px]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-5 py-3 font-bold">구성</th>
                <th className="px-5 py-3 font-bold whitespace-nowrap">가격</th>
                <th className="px-5 py-3 font-bold">통상 범위</th>
              </tr>
            </thead>
            <tbody>
              {domesticPrices.map((r) => (
                <tr key={r.dest} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-semibold">{r.dest}</td>
                  <td className="px-5 py-3 font-display text-royaldark whitespace-nowrap">{r.from}</td>
                  <td className="px-5 py-3 text-mute">
                    {r.range}
                    {r.note ? ` · ${r.note}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[13.5px] text-mute mt-3 max-w-3xl">{priceDisclaimer}</p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="headline text-xl sm:text-2xl mb-5">국내 골프투어, 자주 묻는 질문</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {domesticFaqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-line bg-white p-6">
              <h3 className="font-bold text-[16.5px] mb-2">{f.q}</h3>
              <p className="text-[14.5px] text-mute leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="text-[12.5px] text-mute mt-4">최종 수정일: {site.contentUpdated} · 작성: 에스티골프투어</p>
      </section>
    </>
  );
}
