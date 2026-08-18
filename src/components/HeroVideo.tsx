"use client";

import { useEffect, useRef } from "react";

/**
 * 히어로 배경 영상 — 데스크톱(768px+)에서만 로드·재생.
 * 모바일과 prefers-reduced-motion 환경은 포스터(정지 이미지)만 보여줘
 * 6.8MB 영상 다운로드를 건너뜀 (모바일 데이터·LCP 절약).
 */
export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduced || !desktop) return; // src 미설정 → 영상 다운로드 자체를 안 함
    v.src = src;
    v.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
