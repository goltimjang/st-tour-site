import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "회사소개 — 세종 골프투어 전문 여행사",
  description:
    "에스티투어(ST TOUR)는 세종시의 종합여행업 등록 골프투어 전문 여행사입니다. 국내·해외 맞춤 골프투어, 골프부킹, 골프대회 행사를 전문으로 하며 영업보증보험을 갖추고 있습니다.",
};

export default function AboutPage() {
  const c = site.company;
  return (
    <>
      <section className="bg-white border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16 hero-anim">
          <p className="eyebrow text-royal mb-3">About ST TOUR</p>
          <h1 className="headline text-[30px] sm:text-[42px] mb-4 text-navy">에스티투어를 소개합니다</h1>
          <p className="text-mute max-w-2xl text-[16.5px]">{site.positioning}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            ["맞춤 골프투어", "정해진 상품에 고객을 맞추지 않습니다. 고객의 날짜·지역·예산에 맞춰 국내외 골프장과 일정을 새로 설계합니다."],
            ["골프부킹", "전국 500여 개 골프장 네트워크로 원하는 날짜의 티타임을 찾아드립니다. 주말·성수기 부킹도 상담하세요."],
            ["골프대회 · 행사", "동호회 월례회부터 600팀 규모 클럽 페스티벌까지 — 조편성, 시상식, 연회를 포함한 행사 전체를 대행합니다."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-line bg-white p-7">
              <p className="font-bold text-[18px] mb-2">{t}</p>
              <p className="text-[14.5px] text-mute">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="headline text-xl sm:text-2xl mb-5">진행 방식</h2>
        <ol className="space-y-3 mb-12 max-w-2xl">
          {[
            "홈페이지·전화·카카오톡으로 여행 조건을 보내주세요. (견적 무료)",
            "24시간 안에 견적서가 도착합니다 — 골프장·숙박·항공 원가와 대행비가 분리 표기됩니다.",
            "조건을 조정하며 일정을 확정합니다. 견적서는 발행 후 7일간 유효합니다.",
            "계약금 입금 시 티타임과 좌석을 확보하고, 출발 전 최종 일정표를 드립니다.",
          ].map((s, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-line bg-white p-5">
              <span className="font-display text-golddeep text-lg shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15.5px]">{s}</span>
            </li>
          ))}
        </ol>

        <h2 className="headline text-xl sm:text-2xl mb-5">회사 정보</h2>
        <div className="rounded-2xl border border-line bg-white overflow-x-auto mb-8">
          <table className="w-full text-[15px]">
            <tbody>
              {[
                ["상호", `에스티투어 (ST TOUR)`],
                ["대표", c.ceo],
                ["소재지", c.address],
                ["설립", `${c.since}년`],
                ["사업자등록번호", c.bizNo],
                ["관광사업자등록번호", c.tourismNo],
                ["통신판매업신고", c.mailOrderNo],
                ["보증보험", c.insurance],
                ["대표전화", site.phone],
                ["상담시간", c.hours],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-line last:border-0">
                  <th className="px-5 py-3 text-left font-bold w-44 bg-paper whitespace-nowrap">{k}</th>
                  <td className="px-5 py-3">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a href={site.phoneHref} className="btn btn-royal">전화 상담 {site.phone}</a>
          <a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">밴드 커뮤니티 보기</a>
          <Link href="/domestic#quote" className="btn btn-light">견적 요청하기</Link>
        </div>
      </section>
    </>
  );
}
