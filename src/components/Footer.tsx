import Link from "next/link";
import { site } from "@/data/site";

export default function Footer() {
  const c = site.company;
  return (
    <footer className="bg-navydeep text-white/70 text-[13.5px] leading-relaxed">
      <div className="mx-auto max-w-6xl px-5 py-12 pb-28 lg:pb-12">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          <div className="max-w-xl">
            <p className="font-display text-white text-lg mb-3">에스티투어 <span className="eyebrow text-sky ml-1">ST TOUR</span></p>
            <p className="mb-4">{site.positioning}</p>
            <div className="flex gap-4">
              <a href={site.phoneHref} className="text-gold font-bold hover:underline">전화 {site.phone}</a>
              <a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="text-sky font-bold hover:underline">네이버 밴드</a>
              {site.kakaoUrl && (
                <a href={site.kakaoUrl} target="_blank" rel="noopener noreferrer" className="text-sky font-bold hover:underline">카카오톡 상담</a>
              )}
            </div>
          </div>
          <div>
            <p className="eyebrow text-sky mb-3">Company</p>
            <ul className="space-y-1">
              <li>상호 에스티투어(ST TOUR) · 대표 {c.ceo}</li>
              <li>{c.address}</li>
              <li>사업자등록번호 {c.bizNo}</li>
              <li>관광사업자등록번호 {c.tourismNo}</li>
              <li>통신판매업신고 {c.mailOrderNo}</li>
              <li>{c.insurance}</li>
              <li>상담시간 {c.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/terms" className="hover:text-white">이용약관 · 취소환불 규정</Link>
          <Link href="/privacy" className="font-bold hover:text-white">개인정보처리방침</Link>
          <span className="ml-auto">© {new Date().getFullYear()} ST TOUR. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
