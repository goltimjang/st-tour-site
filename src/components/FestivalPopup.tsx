"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
const KEY = "st-festival-popup-2026";
export default function FestivalPopup() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [hideToday, setHideToday] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  function dismiss() {
    try {
      sessionStorage.setItem(KEY, "closed");
      if (hideToday) localStorage.setItem(KEY, new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }));
    } catch { /* Closing is always available, including private browsing. */ }
    dialog.current?.close();
    previousFocus.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (Date.now() > Date.parse("2026-12-17T23:59:59+09:00")) return;
    try {
      if (sessionStorage.getItem(KEY) || localStorage.getItem(KEY) === new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" })) return;
    } catch {}
    previousFocus.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    return () => { dialog.current?.close(); };
  }, []);
  return <dialog ref={dialog} className="festival-dialog" aria-labelledby="festival-popup-title" onCancel={e => { e.preventDefault(); dismiss(); }} onClick={e => { if (e.target === e.currentTarget) dismiss(); }}>
    <div className="festival-popup-content">
      <div className="flex items-center justify-between gap-3 px-4 py-1"><h2 id="festival-popup-title" className="font-bold text-sm">로얄CC 클럽 페스티벌 2026</h2><button type="button" autoFocus onClick={dismiss} className="min-h-11 min-w-11 font-bold text-sm" aria-label="페스티벌 팝업 닫기">닫기 ×</button></div>
      <Image src="/promotion/royalcc/festival-popup-2026.webp" alt="로얄CC 클럽 페스티벌 2026 안내 포스터. 12월 13일부터 17일까지 3박 5일, 1차 프로모션 129만원. 왕복 항공·숙박·54홀 라운드 포함. 상세 조건은 행사 페이지에서 확인하세요." width={1200} height={1697} className="festival-popup-poster" sizes="(max-width: 480px) 92vw, 420px" />
      <div className="px-4 pt-3 pb-2"><Link href="/promotion/" onClick={dismiss} className="btn btn-royal w-full">페스티벌 상세 보기</Link><label className="min-h-11 flex items-center gap-2 text-xs text-mute cursor-pointer"><input type="checkbox" checked={hideToday} onChange={e => setHideToday(e.target.checked)} className="h-4 w-4 accent-[#0d4ff5]" />오늘 하루 보지 않기</label></div>
    </div>
  </dialog>;
}
