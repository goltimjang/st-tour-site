"use client";

import { useEffect, useRef } from "react";

/**
 * 히어로 배경 영상 — 자동재생·무음·루프.
 * prefers-reduced-motion 사용자에게는 재생하지 않고 포스터(정지 이미지)만 보여줌.
 */
export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }
    // 일부 브라우저에서 autoplay가 막히면 조용히 포스터로 남음
    v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
