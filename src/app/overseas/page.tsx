import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { tier1, tier2, tier3 } from "@/data/destinations";
import { overseasPrices, priceDisclaimer } from "@/data/prices";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "해외 골프투어 견적 — 일본·태국·베트남 등 14개국",
  description:
    "일본, 태국, 베트남, 필리핀, 중국 등 14개국 해외 골프투어를 항공·숙박·라운드·차량까지 묶어 24시간 안에 맞춤 견적으로 보내드립니다. 대행비까지 공개된 정직한 견적.",
  alternates: { canonical: "/overseas/" },
};

export default function OverseasPage() {
  return (
    <>
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
            항공·숙박·그린피·차량을 묶어 예산에 맞게 설계합니다. 국가만 정해도 되고, 어디가 좋을지 몰라도 됩니다 —
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
            <h2 className="font-bold text-[18px] mb-4">인기 목적지</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {tier1.map((d) => (
                <Link key={d.slug} href={`/overseas/${d.slug}`} className="group card-lift rounded-2xl border border-line overflow-hidden bg-white">
                  {d.image && (
                    <div className="img-zoom relative h-28">
                      <Image src={d.image} alt={`${d.name} 골프장`} fill sizes="280px" className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-bold text-[16.5px] group-hover:text-royal">{d.name}</p>
                    <p className="text-[13px] text-mute mt-0.5">{d.cities.slice(0, 3).join(" · ")}</p>
                    {d.priceFrom && <p className="font-display text-royaldark mt-1.5">{d.priceFrom}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-7">
            <h2 className="font-bold text-[16px] mb-3">이런 곳도 진행합니다</h2>
            <p className="text-[14.5px] text-mute leading-relaxed">
              {[...tier2, ...tier3].map((d) => d.name).join(" · ")}
              <br />
              <span className="text-[13.5px]">— B2B 네트워크로 전 지역 대응 가능합니다. 원하는 곳을 요청사항에 적어주세요.</span>
            </p>
          </div>
        </div>
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
    </>
  );
}
