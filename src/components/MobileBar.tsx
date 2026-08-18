import Link from "next/link";
import { site } from "@/data/site";

/** 모바일 하단 고정 바 — 전화 · 카톡 · 견적 3버튼 */
export default function MobileBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-navydeep/95 backdrop-blur border-t border-white/15 grid grid-cols-3 text-center">
      <a href={site.phoneHref} className="py-3.5 text-[15px] font-bold text-gold active:bg-white/5">
        전화 상담
      </a>
      <a
        href={site.kakaoUrl || site.phoneHref}
        target={site.kakaoUrl ? "_blank" : undefined}
        rel={site.kakaoUrl ? "noopener noreferrer" : undefined}
        className="py-3.5 text-[15px] font-bold text-white border-x border-white/15 active:bg-white/5"
      >
        카카오톡
      </a>
      <Link href="/domestic#quote" className="py-3.5 text-[15px] font-bold text-white bg-royal active:bg-royalhover">
        견적 요청
      </Link>
    </div>
  );
}
