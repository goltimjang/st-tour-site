import type { Metadata } from "next";
import { site } from "@/data/site";
import { domesticPrices, priceDisclaimer } from "@/data/prices";
import DomesticClient from "./DomesticClient";

export const metadata: Metadata = {
  title: "국내 골프투어 견적 — 전국 골프장 맞춤 패키지",
  description:
    "전국 500여 개 골프장에서 지역과 골프장을 고르면 24시간 안에 맞춤 견적서를 보내드립니다. 티타임·숙박·이동까지 한 번에, 대행비까지 공개된 정직한 국내 골프투어 견적.",
};

export default function DomesticPage() {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
          <p className="eyebrow text-sky mb-3">Domestic Golf Tour</p>
          <h1 className="headline text-[30px] sm:text-[42px] mb-4">
            전국 {site.stats.courses}개 골프장,
            <br className="sm:hidden" /> 원하는 곳으로 모십니다.
          </h1>
          <p className="text-white/75 max-w-2xl text-[16.5px]">
            지역만 골라도 되고, 골프장을 콕 집어도 됩니다. 1박 2일 골프여행부터 동호회·기업 단체 행사까지 —
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
    </>
  );
}
