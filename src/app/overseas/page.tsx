import type { Metadata } from "next";
import Image from "next/image";
import { tier2, tier3 } from "@/data/destinations";
import { overseasPrices, priceDisclaimer } from "@/data/prices";
import QuoteForm from "@/components/QuoteForm";
import OverseasExplorer from "@/components/OverseasExplorer";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "해외 골프투어 견적 | 일본·태국·베트남 등 14개국",
  description:
    "일본, 태국, 베트남, 필리핀, 중국 등 14개국 해외 골프투어를 항공·숙박·라운드·차량까지 묶어 24시간 안에 맞춤 견적으로 보내드립니다. 포함 내역이 명확한 조건 맞춤 견적.",
  alternates: { canonical: "/overseas/" },
};

const crumbLd = breadcrumbLd([{ name: "해외 골프투어", path: "/overseas/" }]);
const pageLd = webPageLd("해외 골프투어 견적 | 일본·태국·베트남 등 14개국", "/overseas/", "항공·숙박·그린피·차량을 묶은 해외 골프투어 맞춤 견적을 24시간 안에 보내드립니다.");

const overseasFaqs = [
  {
    q: "해외 골프투어 비용은 얼마부터 가능한가요?",
    a: "국가와 시즌, 숙박 수준에 따라 다릅니다. 아래 가격 안내표가 실제 여행사 게시가를 조사한 통상 범위이며, 인원·날짜·숙박 수준을 보내주시면 24시간 안에 항공·숙박·그린피가 포함된 정확한 견적서를 보내드립니다.",
  },
  {
    q: "항공권을 직접 예약해도 되나요?",
    a: "네, 항공 불포함 견적도 가능합니다. 마일리지나 저가 항공을 직접 예약하시고, 현지 골프장·숙박·차량만 저희가 준비해 드릴 수 있습니다. 견적 요청 시 '항공 불포함'을 선택하시면 됩니다.",
  },
  {
    q: "어느 나라로 가야 할지 모르겠어요. 추천해 주시나요?",
    a: "네, 시기와 예산을 알려주시면 그 조건에 맞는 국가를 골라 비교 견적으로 안내해 드립니다. 예를 들어 겨울에는 동남아, 봄·가을에는 일본이 라운드하기 좋은 식으로 시즌에 맞춰 추천해 드립니다.",
  },
  {
    q: "동호회나 회사 단체 해외 골프투어도 진행하나요?",
    a: "네, 소그룹부터 동호회·기업 단체까지 견적드립니다. 단체 조편성과 현지 시상 행사까지 대행한 경험이 있으며, 인원과 희망 시기를 보내주시면 단체 조건으로 안내해 드립니다.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: overseasFaqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function OverseasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image src="/images/overseas.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(3,13,44,.9) 0%, rgba(3,13,44,.65) 50%, rgba(3,13,44,.3) 100%)" }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20 hero-anim">
          <p className="eyebrow text-sky mb-3">Overseas Golf Tour</p>
          <h1 className="headline text-[30px] sm:text-[42px] mb-4">
            일본부터 동남아까지,
            <br className="sm:hidden" /> 골프여행의 모든 일정을 한 번에.
          </h1>
          <p className="text-white/75 max-w-2xl text-[16.5px]">
            항공·숙박·그린피·차량을 묶어 예산에 맞게 설계합니다. 국가만 정해도 되고, 어디가 좋을지 몰라도 됩니다.
            시기와 인원을 보내주시면 <strong className="text-gold">24시간 안에</strong> 견적서를 보내드립니다.
          </p>
        </div>
        <div className="relative h-2" aria-hidden="true" />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14 grid lg:grid-cols-2 gap-6 items-start">
        <div id="quote" className="scroll-mt-24">
          <QuoteForm type="overseas" />
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-7">
            <h2 className="font-bold text-[16px] mb-3">이런 곳도 진행합니다</h2>
            <p className="text-[14.5px] text-mute leading-relaxed">
              {[...tier2, ...tier3].map((d) => d.name).join(" · ")}
              <br />
              <span className="text-[13.5px]">B2B 네트워크로 전 지역 대응 가능합니다. 원하는 곳을 요청사항에 적어주세요.</span>
            </p>
          </div>
        </div>
      </section>

      <section id="courses" className="mx-auto max-w-6xl px-5 pb-16 scroll-mt-24">
        <OverseasExplorer />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="headline text-xl sm:text-2xl mb-4">해외 골프투어 가격 안내</h2>
        <div className="rounded-2xl border border-line bg-white overflow-x-auto">
          <table className="w-full text-[15px]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-5 py-3 font-bold">목적지</th>
                <th className="px-5 py-3 font-bold whitespace-nowrap">가격</th>
                <th className="px-5 py-3 font-bold">통상 범위 (1인 · 항공 포함 · 3박5일 내외)</th>
              </tr>
            </thead>
            <tbody>
              {overseasPrices.map((r) => (
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
        <h2 className="headline text-xl sm:text-2xl mb-5">해외 골프투어, 자주 묻는 질문</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {overseasFaqs.map((f) => (
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
