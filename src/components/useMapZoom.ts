"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ViewBox = { x: number; y: number; w: number; h: number };

const MIN_SCALE = 1;
const MAX_SCALE = 8;

/**
 * SVG 지도 확대·이동 훅.
 * 마우스 휠(커서 위치 기준 확대), 드래그 이동, 터치 핀치까지 지원한다.
 * base는 원본 viewBox이고, 배율은 base.w / view.w 로 계산된다.
 */
export function useMapZoom(base: ViewBox) {
  const ref = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<ViewBox>(base);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const moved = useRef(false);
  const pinch = useRef<{ dist: number; w: number } | null>(null);

  // 국가를 바꾸는 등 원본이 달라지면 확대 상태를 초기화
  useEffect(() => {
    setView(base);
  }, [base.x, base.y, base.w, base.h]); // eslint-disable-line react-hooks/exhaustive-deps

  const scale = base.w / view.w;

  /** 화면 좌표를 현재 viewBox 좌표로 변환 */
  const toSvg = useCallback(
    (clientX: number, clientY: number, v: ViewBox) => {
      const el = ref.current;
      const r = el?.getBoundingClientRect();
      // 화면에 아직 그려지지 않아 크기가 0이면 중앙 기준으로 처리 (NaN 방지)
      if (!r || r.width === 0 || r.height === 0) return { x: v.x + v.w / 2, y: v.y + v.h / 2 };
      return {
        x: v.x + ((clientX - r.left) / r.width) * v.w,
        y: v.y + ((clientY - r.top) / r.height) * v.h,
      };
    },
    []
  );

  /** 특정 지점을 고정한 채 배율 변경 */
  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      setView((v) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, (base.w / v.w) * factor));
        const w = base.w / next;
        const h = base.h / next;
        const p = toSvg(clientX, clientY, v);
        const rx = (p.x - v.x) / v.w;
        const ry = (p.y - v.y) / v.h;
        return clamp({ x: p.x - rx * w, y: p.y - ry * h, w, h }, base);
      });
    },
    [base, toSvg]
  );

  // 휠 확대는 passive:false 리스너가 필요해 직접 등록한다 (페이지 스크롤 방지)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.18 : 1 / 1.18);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "touch") return;
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    moved.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const dx = ((e.clientX - d.x) / r.width) * view.w;
    const dy = ((e.clientY - d.y) / r.height) * view.h;
    if (Math.abs(e.clientX - d.x) > 3 || Math.abs(e.clientY - d.y) > 3) moved.current = true;
    setView((v) => clamp({ ...v, x: d.vx - dx, y: d.vy - dy }, base));
  };

  const endDrag = () => {
    drag.current = null;
  };

  // 터치: 두 손가락 핀치 확대, 한 손가락 이동
  const onTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2) {
      pinch.current = { dist: touchDist(e), w: view.w };
    } else if (e.touches.length === 1 && scale > 1) {
      drag.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, vx: view.x, vy: view.y };
    }
  };

  const onTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2 && pinch.current) {
      e.preventDefault();
      const d = touchDist(e);
      const ratio = pinch.current.dist / d;
      const w = Math.min(base.w, Math.max(base.w / MAX_SCALE, pinch.current.w * ratio));
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      setView((v) => {
        const p = toSvg(cx, cy, v);
        const rx = (p.x - v.x) / v.w;
        const ry = (p.y - v.y) / v.h;
        const h = (w / base.w) * base.h;
        return clamp({ x: p.x - rx * w, y: p.y - ry * h, w, h }, base);
      });
    } else if (e.touches.length === 1 && drag.current) {
      const el = ref.current;
      if (!el) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const d = drag.current;
      const dx = ((e.touches[0].clientX - d.x) / r.width) * view.w;
      const dy = ((e.touches[0].clientY - d.y) / r.height) * view.h;
      setView((v) => clamp({ ...v, x: d.vx - dx, y: d.vy - dy }, base));
    }
  };

  const onTouchEnd = () => {
    pinch.current = null;
    drag.current = null;
  };

  const zoomBy = (factor: number) => {
    const r = ref.current?.getBoundingClientRect();
    zoomAt((r?.left ?? 0) + (r?.width ?? 0) / 2, (r?.top ?? 0) + (r?.height ?? 0) / 2, factor);
  };

  return {
    ref,
    view,
    scale,
    /** 드래그로 화면을 옮긴 직후인지 (클릭과 구분하기 위함) */
    didDrag: () => moved.current,
    reset: () => setView(base),
    zoomIn: () => zoomBy(1.5),
    zoomOut: () => zoomBy(1 / 1.5),
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}

function touchDist(e: React.TouchEvent) {
  const dx = e.touches[0].clientX - e.touches[1].clientX;
  const dy = e.touches[0].clientY - e.touches[1].clientY;
  return Math.hypot(dx, dy);
}

/** 확대된 화면이 원본 밖으로 나가지 않도록 가둔다 */
function clamp(v: ViewBox, base: ViewBox): ViewBox {
  const w = Math.min(v.w, base.w);
  const h = Math.min(v.h, base.h);
  return {
    w,
    h,
    x: Math.min(Math.max(v.x, base.x), base.x + base.w - w),
    y: Math.min(Math.max(v.y, base.y), base.y + base.h - h),
  };
}
