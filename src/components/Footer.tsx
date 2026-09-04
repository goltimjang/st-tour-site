import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";

/** 밝은 푸터: 흰 배경 + 얇은 상단 보더 */
export default function Footer() {
  const c = site.company;
  return (
    <footer className="bg-white border-t border-line text-[13.5px] leading-relaxed text-mute">
      <div className="mx-auto max-w-6xl px-5 py-14 pb-32 lg:pb-14">
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          <div className="max-w-xl">
            <p className="mb-4">
              <Image src="/logo.png" alt="에스티골프투어" width={214} height={28} className="h-7 w-auto" />
            </p>
            <p className="mb-4">{site.positioning}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a href={site.phoneHref} className="text-royal font-bold hover:underline">전화 {site.phone}</a>
              <a href={site.bandUrl} target="_blank" rel="noopener noreferrer" className="text-golddeep font-bold hover:underline">네이버 밴드</a>
              {site.kakaoUrl && (
                <a href={site.kakaoUrl} target="_blank" rel="noopener noreferrer" className="text-golddeep font-bold hover:underline">카카오톡 상담</a>
              )}
            </div>
          </div>
          <div>
            <p className="eyebrow text-royal mb-3">Company</p>
            <ul className="space-y-1">
              <li>상호 에스티투어(ST TOUR) · 대표 {c.ceo}</li>
              <li>{c.address}</li>
              <li>사업자등록번호 {c.bizNo}</li>
              <li>{c.insurance}</li>
              <li>상담시간 {c.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-line flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/terms" className="hover:text-navy">이용약관 · 취소환불 규정</Link>
          <Link href="/privacy" className="font-bold hover:text-navy">개인정보처리방침</Link>
          <span className="ml-auto">© {new Date().getFullYear()} ST TOUR. All rights reserved.</span>
        </div>
        <div className="mt-7 flex items-center gap-3">
          <Image src="/images/sgi.png" alt="SGI 서울보증" width={101} height={28} className="h-7 w-auto" />
          <span className="text-[12.5px]">여행업 영업보증보험 5,000만원 가입 · SGI서울보증</span>
        </div>
      </div>
    </footer>
  );
}
