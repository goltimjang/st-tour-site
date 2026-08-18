import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "밴드 멤버 안내",
  description: "에스티투어 밴드 멤버를 위한 안내 페이지입니다. 밴드 공지에서 보신 행사·견적을 이곳에서 바로 신청하세요.",
  alternates: { canonical: "/band/" },
  robots: { index: false }, // 밴드 유입 전용 랜딩 — 검색 색인 불필요
};

export default function BandPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <p className="eyebrow text-royal mb-3">For Band Members</p>
      <h1 className="headline text-[28px] sm:text-[38px] mb-4">밴드에서 오셨군요, 반갑습니다!</h1>
      <p className="text-[16.5px] text-mute mb-8">
        에스티투어 밴드 공지에서 보신 행사와 골프투어 견적을 이 홈페이지에서 바로 신청하실 수 있습니다.
        밴드 멤버임을 요청사항에 적어주시면 상담 시 참고해 드립니다.
      </p>
      <div className="space-y-4">
        <Link href="/promotion" className="block rounded-2xl border border-line bg-white p-6 hover:border-royal transition-colors">
          <p className="font-bold text-[17px] mb-1">진행 중인 행사 보기 →</p>
          <p className="text-[14.5px] text-mute">로얄CC 클럽 페스티벌 등 밴드 공지 행사 정보</p>
        </Link>
        <Link href="/domestic#quote" className="block rounded-2xl border border-line bg-white p-6 hover:border-royal transition-colors">
          <p className="font-bold text-[17px] mb-1">국내 골프투어 견적 받기 →</p>
          <p className="text-[14.5px] text-mute">전국 골프장 부킹 · 1박2일 패키지 · 단체 행사</p>
        </Link>
        <Link href="/overseas#quote" className="block rounded-2xl border border-line bg-white p-6 hover:border-royal transition-colors">
          <p className="font-bold text-[17px] mb-1">해외 골프투어 견적 받기 →</p>
          <p className="text-[14.5px] text-mute">일본 · 태국 · 베트남 등 14개국, 24시간 내 견적</p>
        </Link>
      </div>
      <p className="mt-8 text-[15px]">
        급하시면 대표 직통으로 연락 주세요 —{" "}
        <a href={site.phoneHref} className="font-bold text-royaldark underline">{site.phone}</a>
      </p>
    </section>
  );
}
