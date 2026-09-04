import Image from "next/image";

/**
 * 견적서 미리보기: 포함·불포함 내역이 항목별로 명확히 적힌다는 점을 보여주는 예시.
 * 구성 예시임을 명시 (실제 금액 아님). 원가·대행비 등 내부 구성은 표기하지 않는다.
 */
const included = [
  "왕복 항공 (인천 ↔ 방콕) · 유류할증료 · TAX",
  "4성 리조트 3박 (2인 1실 · 조식)",
  "그린피 · 카트 · 캐디 (3라운드)",
  "전 일정 차량 · 공항 픽업",
];
const excluded = ["캐디팁 · 개인 경비", "여행자 보험", "선택 관광"];

export default function QuoteSample() {
  return (
    <div className="relative max-w-md mx-auto lg:mx-0">
      <div className="rounded-2xl bg-white border border-line shadow-[0_24px_60px_rgba(6,20,62,0.16)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-navy">
          <Image src="/logo-black.png" alt="에스티골프투어" width={145} height={19} className="h-5 w-auto" />
          <span className="font-display text-navy text-[15px]">견 적 서</span>
        </div>

        <div className="px-6 py-5">
          <p className="text-[12.5px] text-mute mb-3">
            태국 방콕 · 3박 5일 · 4인 기준 <span className="ml-2 rounded bg-paper px-1.5 py-0.5 font-bold">1인 금액</span>
          </p>

          <p className="text-[12px] font-bold text-golddeep mb-1.5">포함 내역</p>
          <ul className="text-[14px] divide-y divide-line/70 border-y border-line/70">
            {included.map((k) => (
              <li key={k} className="py-2.5 flex gap-2">
                <span className="text-gold font-black shrink-0" aria-hidden="true">✓</span>
                <span>{k}</span>
              </li>
            ))}
          </ul>

          <p className="text-[12px] font-bold text-mute mt-4 mb-1.5">불포함 내역</p>
          <ul className="text-[13.5px] text-mute divide-y divide-line/70 border-y border-line/70">
            {excluded.map((k) => (
              <li key={k} className="py-2 flex gap-2">
                <span className="shrink-0" aria-hidden="true">·</span>
                <span>{k}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-baseline justify-between mt-5 pt-3 border-t-2 border-navy" style={{ fontVariantNumeric: "tabular-nums" }}>
            <span className="font-display text-navy text-[15px]">총 견적 금액</span>
            <span className="font-display text-navy text-[19px]">1,100,000원</span>
          </div>
          <p className="mt-2 text-[12px] text-mute">견적 유효기간 7일 · 조건 변경 시 재견적</p>

          <p className="mt-4 text-[11.5px] text-mute leading-relaxed">
            ※ 구성 예시입니다. 실제 견적서는 고객님의 날짜·지역·인원에 맞춰 작성되며, 시즌에 따라 금액이 달라집니다.
          </p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute -right-3 -top-3 rotate-12 rounded-full border-2 border-gold text-golddeep bg-white/95 px-3 py-2 text-[11px] font-black shadow-soft"
      >
        포함내역 명시
      </div>
    </div>
  );
}
