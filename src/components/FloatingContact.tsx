import { site } from "@/data/site";

/**
 * 모바일 우측 하단 고정 연락 버튼: 전화 · 카카오톡 · 밴드.
 * 데스크톱(lg 이상)은 헤더에 전화 버튼이 있어 숨긴다.
 */
export default function FloatingContact() {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2.5 lg:hidden" aria-label="빠른 연락">
      <a
        href={site.bandUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="네이버 밴드로 이동"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#21c531] text-white shadow-[0_8px_22px_rgba(0,0,0,0.22)] active:scale-95"
      >
        <span className="font-display text-[15px] font-black leading-none">BAND</span>
      </a>
      <a
        href={site.kakaoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오톡 상담"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#FEE500] text-[#191919] shadow-[0_8px_22px_rgba(0,0,0,0.22)] active:scale-95"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.87 5.33 4.68 6.75l-.98 3.63c-.09.32.27.58.55.4l4.3-2.86c.47.05.95.08 1.45.08 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
        </svg>
      </a>
      <a
        href={site.phoneHref}
        aria-label={`전화 상담 ${site.phone}`}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-royal text-white shadow-[0_8px_22px_rgba(13,79,245,0.35)] active:scale-95"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
        </svg>
      </a>
    </div>
  );
}
