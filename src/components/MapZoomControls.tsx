"use client";

/** 지도 확대·축소·초기화 버튼 (마우스 휠·드래그와 함께 쓰는 보조 조작) */
export default function MapZoomControls({
  zoom,
}: {
  zoom: { scale: number; zoomIn: () => void; zoomOut: () => void; reset: () => void };
}) {
  const zoomed = zoom.scale > 1.02;
  return (
    <div className="absolute right-2 top-2 flex flex-col gap-1.5">
      <Btn onClick={zoom.zoomIn} label="확대">＋</Btn>
      <Btn onClick={zoom.zoomOut} label="축소" disabled={!zoomed}>－</Btn>
      {zoomed && (
        <button
          type="button"
          onClick={zoom.reset}
          className="rounded-lg bg-white/95 text-navy text-[11px] font-bold px-2 py-1.5 shadow hover:bg-white"
          aria-label="지도 원래 크기로"
        >
          전체
        </button>
      )}
      {zoomed && (
        <span className="rounded-lg bg-navydeep/70 text-white text-[11px] font-bold px-2 py-1 text-center">
          {zoom.scale.toFixed(1)}배
        </span>
      )}
    </div>
  );
}

function Btn({
  onClick,
  label,
  disabled,
  children,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="h-9 w-9 rounded-lg bg-white/95 text-navy text-[17px] font-bold shadow hover:bg-white disabled:opacity-35 disabled:cursor-not-allowed leading-none"
    >
      {children}
    </button>
  );
}
