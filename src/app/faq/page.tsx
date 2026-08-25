import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "@/data/faq";
import { site } from "@/data/site";
import { breadcrumbLd } from "@/data/jsonld";

export const metadata: Metadata = {
  title: "자주 묻는 질문 | 골프투어 견적 안내",
  description:
    "골프투어 견적은 어떻게 받나요? 비용은 얼마인가요? 2명도 가능한가요? 에스티골프투어 골프투어 견적에 대한 자주 묻는 질문과 답변을 모았습니다.",
  alternates: { canonical: "/faq/" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: "자주 묻는 질문", path: "/faq/" }])) }}
      />
      <section className="bg-white border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16 hero-anim">
          <p className="eyebrow text-royal mb-3">FAQ</p>
          <h1 className="headline text-[30px] sm:text-[42px] text-navy">자주 묻는 질문</h1>
          <p className="text-[13px] text-mute mt-3">최종 수정일: {site.contentUpdated} · 작성: 에스티골프투어</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-line bg-white open:border-royal/50">
              <summary className="cursor-pointer list-none px-6 py-4.5 py-4 font-bold text-[16.5px] flex justify-between items-center gap-4">
                Q. {f.q}
                <span aria-hidden="true" className="text-royal shrink-0 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="px-6 pb-5 text-[15px] leading-relaxed text-ink/85 border-t border-line pt-4">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-white border border-line shadow-soft p-7 sm:p-9 text-center">
          <p className="headline text-[20px] sm:text-[24px] mb-2 text-navy">더 궁금한 점이 있으신가요?</p>
          <p className="text-mute mb-6 text-[15px]">전화 주시면 바로 답해드립니다. {site.company.hours}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={site.phoneHref} className="btn btn-royal">전화 상담 {site.phone}</a>
            <Link href="/domestic#quote" className="btn btn-light">견적 요청하기</Link>
          </div>
        </div>
      </section>
    </>
  );
}
