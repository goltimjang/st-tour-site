import Link from "next/link";
import { site } from "@/data/site";

/** 모바일 하단 고정 바: 밝은 플로팅 카드 스타일 */
export default function MobileBar() {
  return (
    <div className="fixed bottom-3 inset-x-3 z-50 lg:hidden rounded-2xl bg-white/95 backdrop-blur-md border border-white shadow-[0_10px_34px_rgba(6,20,62,0.16)] grid grid-cols-3 text-center overflow-hidden">
      <a href={site.phoneHref} className="py-3.5 text-[15px] font-bold text-golddeep active:bg-paper">
        전화 상담
      </a>
      <a
        href={site.kakaoUrl || site.phoneHref}
        target={site.kakaoUrl ? "_blank" : undefined}
        rel={site.kakaoUrl ? "noopener noreferrer" : undefined}
        className="py-3.5 text-[15px] font-bold text-ink border-x border-line active:bg-paper"
      >
        카카오톡
      </a>
      <Link href="/domestic#quote" className="py-3.5 text-[15px] font-bold text-white bg-royal active:bg-royalhover">
        견적 요청
      </Link>
    </div>
  );
}
