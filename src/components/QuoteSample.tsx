import Image from "next/image";

/**
 * 견적서 미리보기: "대행비 공개"를 눈으로 보여주는 핵심 신뢰 장치.
 * 구성 예시임을 명시 (실제 금액 아님).
 */
const rows = [
  ["왕복 항공 (인천 ↔ 방콕)", "380,000"],
  ["숙박 3박 (4성 리조트 · 2인 1실)", "210,000"],
  ["그린피 · 카트 · 캐디 (3라운드)", "330,000"],
  ["차량 · 공항 픽업 (전 일정)", "80,000"],
];

export default function QuoteSample() {
  return (
    <div className="relative max-w-md mx-auto lg:mx-0">
      <div className="rounded-2xl bg-white border border-line shadow-[0_24px_60px_rgba(6,20,62,0.16)] overflow-hidden">
        {/* 문서 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-navy">
          <Image src="/logo-black.png" alt="에스티골프투어" width={110} height={19} className="h-5 w-auto" />
          <span className="font-display text-navy text-[15px]">견 적 서</span>
        </div>

        <div className="px-6 py-5">
          <p className="text-[12.5px] text-mute mb-3">
            태국 방콕 · 3박 5일 · 4인 기준 <span className="ml-2 rounded bg-paper px-1.5 py-0.5 font-bold">1인 금액</span>
          </p>
          <table className="w-full text-[14px]" style={{ fontVariantNumeric: "tabular-nums" }}>
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="border-b border-line/70">
                  <td className="py-2.5 pr-2">{k}</td>
                  <td className="py-2.5 text-right font-semibold whitespace-nowrap">{v}원</td>
                </tr>
              ))}
              <tr className="border-b border-line/70">
                <td className="py-2.5 text-mute">원가 합계</td>
                <td className="py-2.5 text-right font-semibold text-mute whitespace-nowrap">1,000,000원</td>
              </tr>
              <tr className="border-b-2 border-navy">
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-1.5 font-bold text-golddeep">
                    에스티골프투어 대행비
                    <span className="rounded-full bg-gold/15 text-golddeep text-[10.5px] font-black px-2 py-0.5">공개</span>
                  </span>
                </td>
                <td className="py-2.5 text-right font-bold text-golddeep whitespace-nowrap">100,000원</td>
              </tr>
              <tr>
                <td className="pt-3 font-display text-navy text-[15px]">총 견적 금액</td>
                <td className="pt-3 text-right font-display text-navy text-[19px] whitespace-nowrap">1,100,000원</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-[11.5px] text-mute leading-relaxed">
            ※ 구성 예시입니다. 실제 견적서는 고객님의 날짜·지역·인원에 맞춰 작성되며, 시즌에 따라 금액이 달라집니다.
            견적 유효기간과 포함·불포함 내역이 함께 표기됩니다.
          </p>
        </div>
      </div>
      {/* 도장 느낌 스탬프 */}
      <div
        aria-hidden="true"
        className="absolute -right-3 -top-3 rotate-12 rounded-full border-2 border-gold text-golddeep bg-white/95 px-3 py-2 text-[11px] font-black shadow-soft"
      >
        원가 공개
      </div>
    </div>
  );
}
