import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import PosterShelf from "@/components/PosterShelf";
import EventGallery from "@/components/EventGallery";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "회사소개 | 세종 골프투어 전문 여행사",
  description:
    "에스티골프투어(ST TOUR)는 세종시의 종합여행업 등록 골프투어 전문 여행사입니다. 국내·해외 맞춤 골프투어, 골프부킹, 골프대회 행사를 전문으로 하며 영업보증보험을 갖추고 있습니다.",
  alternates: { canonical: "/about/" },
};

const crumbLd = breadcrumbLd([{ name: "회사소개", path: "/about/" }]);
const pageLd = webPageLd("회사소개 | 세종 골프투어 전문 여행사", "/about/", site.positioning);

export default function AboutPage() {
  const c = site.company;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      {/* 헤더 */}
      <section className="bg-white border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16 hero-anim">
          <p className="eyebrow text-royal mb-3">About ST TOUR</p>
          <h1 className="headline text-[30px] sm:text-[42px] mb-4 text-navy">에스티골프투어를 소개합니다</h1>
          <p className="text-mute max-w-2xl text-[16.5px]">{site.positioning}</p>
        </div>
      </section>

      {/* 하는 일 */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {[
            ["맞춤 골프투어", "정해진 상품에 고객을 맞추지 않습니다. 날짜와 지역, 예산에 맞춰 일정을 새로 설계합니다."],
            ["골프부킹", "전국 500여 개 골프장 네트워크로 원하는 날짜의 티타임을 찾아드립니다."],
            ["골프대회 · 행사", "동호회 월례회부터 600팀 규모 페스티벌까지, 행사 전체를 대행합니다."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-line bg-white p-7 shadow-soft">
              <p className="font-bold text-[18px] mb-2">{t}</p>
              <p className="text-[14.5px] text-mute">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="headline text-xl sm:text-2xl mb-5">진행 방식</h2>
        <ol className="space-y-3 mb-4 max-w-2xl">
          {[
            "홈페이지·전화·카카오톡으로 여행 조건을 보내주세요. 견적은 무료입니다.",
            "하루 안에 견적서가 도착합니다. 총액과 포함·불포함 내역이 항목별로 명확히 적혀 있습니다.",
            "조건을 조정하며 일정을 확정합니다. 견적서는 발행 후 7일간 유효합니다.",
            "계약금 입금과 함께 티타임과 좌석을 확보하고, 출발 전 최종 일정표를 드립니다.",
          ].map((s, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-line bg-white p-5">
              <span className="font-display text-golddeep text-lg shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15.5px]">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 실적 숫자 */}
      <section className="bg-white border-y border-line">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <p className="eyebrow text-royal mb-2">Track Record</p>
            <h2 className="headline text-2xl sm:text-3xl mb-8">숫자로 보는 에스티골프투어</h2>
          </Reveal>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl">
            {[
              [<Counter key="c" to={25000} suffix="팀" />, "누적 국내·해외 송출"],
              [`${site.stats.people} 명`, "함께한 골퍼 (인원 환산)"],
              [`${site.stats.tournaments}회`, "대회·페스티벌 주최·주관"],
            ].map(([n, t], i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="border-l-2 border-gold pl-4 sm:pl-5">
                  <p className="font-display text-[22px] sm:text-[28px] text-golddeep mb-0.5">{n}</p>
                  <p className="text-[13px] sm:text-[14.5px] text-mute font-semibold">{t}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-[12.5px] text-mute mt-5">누적 팀 수는 에스티골프투어 자체 집계 기준입니다.</p>
        </div>
      </section>

      {/* 직접 만든 대회들: 다크 밴드 (포스터) */}
      <section className="bg-navydeep text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-2">
          <Reveal>
            <p className="eyebrow text-sky mb-2">Tournaments</p>
            <h2 className="headline text-2xl sm:text-3xl mb-3">직접 만든 대회들</h2>
            <p className="text-white/70 max-w-2xl">
              하노이 월드 스크린골프 페스티벌, 더힐 클럽 페스티벌, 세종 챔피언십. 에스티골프투어가 주최하고 주관한 대회의 공식 포스터입니다.
            </p>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <div className="pb-14"><PosterShelf onDark /></div>
        </Reveal>
      </section>

      {/* 현장 스케치: 라이트 (사진) */}
      <section className="bg-paper overflow-hidden border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-4">
          <Reveal>
            <p className="eyebrow text-royal mb-2">On Site</p>
            <h2 className="headline text-2xl sm:text-3xl mb-3">현장 스케치</h2>
            <p className="text-mute max-w-2xl">포스터 속 대회들이 실제로 열린 날의 기록입니다.</p>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <div className="pb-14"><EventGallery /></div>
        </Reveal>
      </section>

      {/* 회사 정보 */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="headline text-xl sm:text-2xl mb-5">회사 정보</h2>
        <div className="rounded-2xl border border-line bg-white overflow-x-auto mb-8">
          <table className="w-full text-[15px]">
            <tbody>
              {[
                ["상호", `에스티투어 (ST TOUR) · 브랜드명 에스티골프투어`],
                ["대표", c.ceo],
                ["소재지", c.address],
                ["설립", `${c.since}년`],
                ["사업자등록번호", c.bizNo],
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
