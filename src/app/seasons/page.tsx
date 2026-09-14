import type { Metadata } from "next";
import Link from "next/link";
import { seasons } from "@/data/seasons";
import { breadcrumbLd, webPageLd } from "@/data/jsonld";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "시즌별 골프여행 추천 | 월별로 어디가 좋을까",
  description:
    "1월부터 12월까지 달마다 라운드하기 좋은 국내 지역과 해외 골프 여행지를 정리했습니다. 건기와 성수기를 기준으로 언제 어디로 갈지 고르세요.",
  alternates: { canonical: "/seasons/" },
};

const crumbLd = breadcrumbLd([{ name: "시즌별 추천", path: "/seasons/" }]);
const pageLd = webPageLd("시즌별 골프여행 추천 | 월별로 어디가 좋을까", "/seasons/", "월별 국내·해외 골프 여행지 추천.");

const MONTH_NAMES = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export default function SeasonsPage() {
  const thisMonth = new Date().getMonth() + 1;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />

      <section className="bg-white border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16 hero-anim">
          <p className="eyebrow text-royal mb-3">Season Guide</p>
          <h1 className="headline text-[30px] sm:text-[42px] text-navy mb-4">시즌별 골프여행 추천</h1>
          <p className="text-mute text-[16.5px] max-w-2xl leading-relaxed">
            출발하고 싶은 달을 고르면 그 시기에 라운드하기 좋은 곳을 국내와 해외로 나눠 보여드립니다.
            건기와 성수기 기준으로 정리했고, 세부 날씨는 출발 전에 다시 확인해 드립니다.
          </p>
          <nav className="mt-7 grid grid-cols-6 sm:grid-cols-12 gap-1.5" aria-label="월 선택">
            {MONTH_NAMES.map((m, i) => (
              <a
                key={m}
                href={`#m${i + 1}`}
                className={`rounded-lg py-2.5 text-center text-[14px] font-bold transition-colors ${
                  i + 1 === thisMonth ? "bg-royal text-white" : "bg-paper text-ink hover:bg-line/70"
                }`}
              >
                {m}
              </a>
            ))}
          </nav>
          <p className="text-[12.5px] text-mute mt-2">파란색이 이번 달입니다.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14 space-y-6">
        {seasons.map((s) => (
          <Reveal key={s.month}>
            <article id={`m${s.month}`} className="scroll-mt-24 rounded-2xl border border-line bg-white shadow-soft overflow-hidden">
              <div className={`px-6 sm:px-8 py-6 ${s.month === thisMonth ? "bg-royal text-white" : "bg-navy text-white"}`}>
                <p className="font-display text-[13px] tracking-widest opacity-75 mb-1">{MONTH_NAMES[s.month - 1]}{s.month === thisMonth ? " · 이번 달" : ""}</p>
                <h2 className="headline text-[21px] sm:text-[25px] mb-2">{s.title}</h2>
                <p className="text-[14.5px] leading-relaxed opacity-85 max-w-3xl">{s.summary}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 px-6 sm:px-8 py-6">
                <PickList title="해외 추천" items={s.overseas} />
                <PickList title="국내 추천" items={s.domestic} />
              </div>
            </article>
          </Reveal>
        ))}

        <div className="rounded-2xl bg-paper p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <p className="text-[15.5px] leading-relaxed">
            가고 싶은 달과 지역이 정해졌나요? <b>날짜와 인원만 알려주시면</b> 그 시기 요금으로 견적을 드립니다.
          </p>
          <div className="flex gap-3 shrink-0">
            <Link href="/domestic#quote" className="btn btn-royal !min-h-[46px] !px-5 text-[15px]">국내 견적</Link>
            <Link href="/overseas#quote" className="btn btn-light !min-h-[46px] !px-5 text-[15px]">해외 견적</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PickList({ title, items }: { title: string; items: { name: string; href: string; why: string }[] }) {
  return (
    <div>
      <p className="text-[12.5px] font-black tracking-wide text-mute mb-3">{title}</p>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it.name + it.why}>
            <Link href={it.href} className="group flex items-start gap-3 rounded-xl border border-line px-4 py-3 hover:border-royal transition-colors">
              <span className="font-bold text-[15.5px] text-ink group-hover:text-royal shrink-0 w-[92px]">{it.name}</span>
              <span className="text-[14px] text-mute leading-relaxed">{it.why}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
