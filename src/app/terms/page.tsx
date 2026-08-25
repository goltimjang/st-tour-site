import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "이용약관 · 취소환불 규정",
  description: "에스티골프투어 여행계약의 취소·환불 규정 안내. 공정거래위원회 국내·국외여행 표준약관과 소비자분쟁해결기준을 따릅니다.",
  alternates: { canonical: "/terms/" },
};

const overseas = [
  ["여행 개시 30일 전까지", "계약금 전액 환급"],
  ["29일 ~ 20일 전", "여행요금의 10% 공제"],
  ["19일 ~ 10일 전", "여행요금의 15% 공제"],
  ["9일 ~ 8일 전", "여행요금의 20% 공제"],
  ["7일 ~ 1일 전", "여행요금의 30% 공제"],
  ["여행 당일", "여행요금의 50% 공제"],
];

const domestic = [
  ["여행 개시 5일 전까지", "전액 환급"],
  ["4일 ~ 2일 전", "요금의 10% 공제"],
  ["1일 전", "요금의 20% 공제"],
  ["당일 취소 · 무통보 불참", "요금의 30% 공제"],
];

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <p className="eyebrow text-royal mb-3">Terms &amp; Cancellation</p>
      <h1 className="headline text-[28px] sm:text-[36px] mb-2">이용약관 · 취소환불 규정</h1>
      <p className="text-[13px] text-mute mb-6">최종 수정일: {site.contentUpdated}</p>
      <p className="text-[15.5px] mb-8">
        에스티골프투어의 여행계약은 공정거래위원회 <strong>국내여행 표준약관 · 국외여행 표준약관</strong>과{" "}
        <strong>소비자분쟁해결기준</strong>(공정거래위원회 고시)을 기본으로 합니다. 아래 규정은 여행자 사정에 의한
        취소 시 기준이며, 계약 시 상세 약관을 함께 안내해 드립니다.
      </p>

      <h2 className="headline text-xl mb-3">해외 골프투어 취소 규정</h2>
      <RuleTable rows={overseas} />

      <h2 className="headline text-xl mb-3 mt-10">국내 골프투어 취소 규정 (숙박여행 기준)</h2>
      <RuleTable rows={domestic} />
      <p className="text-[14px] text-mute mt-2">당일여행 상품은 3일 전까지 통보 시 전액 환급되며, 이후 동일 비율이 적용됩니다.</p>

      <h2 className="headline text-xl mb-3 mt-10">특별약관 (계약 시 별도 동의)</h2>
      <ul className="list-disc pl-5 space-y-2 text-[15.5px]">
        <li><strong>항공권 발권 후</strong> 취소 시 항공사 환불 위약금·취소수수료 실비가 추가 공제될 수 있습니다 (증빙 제시).</li>
        <li><strong>티타임 확정 후</strong> 취소 시 골프장 위약 규정(통상 주말 4일 전·주중 3일 전 이후 위약금 발생)에 따른 실비가 추가 공제될 수 있습니다 (증빙 제시).</li>
        <li>성수기·명절 연휴·전세기 상품은 별도 취소료 기준이 적용될 수 있으며, 해당 상품은 예약 단계에서 미리 고지하고 동의를 받습니다.</li>
        <li>특별약관은 표준약관보다 우선 적용되며, 계약 체결 시 서면(전자문서 포함)으로 설명드리고 별도 확인을 받습니다.</li>
      </ul>

      <h2 className="headline text-xl mb-3 mt-10">위약금 없는 취소</h2>
      <p className="text-[15.5px]">
        천재지변, 전란, 정부 명령, 운송·숙박기관의 파업 등으로 여행 목적을 달성할 수 없는 경우 계약금을 환급합니다.
        1급 감염병 관련 행정명령·입국금지 등으로 계약 이행이 불가능한 경우 위약금 없이 계약금을 환급합니다.
      </p>

      <h2 className="headline text-xl mb-3 mt-10">환불 처리</h2>
      <p className="text-[15.5px]">
        환불은 취소 확정일로부터 영업일 기준 7일 이내에 결제하신 수단으로 환급해 드립니다. 실비 공제 시에는
        항공사·골프장 등 공급자의 수수료 부과 증빙을 제시합니다.
      </p>

      <p className="mt-10 text-[13.5px] text-mute border-t border-line pt-5">
        본 규정에 정하지 않은 사항은 국내·국외여행 표준약관 및 소비자분쟁해결기준에 따릅니다. 문의: {site.phone}
      </p>
    </section>
  );
}

function RuleTable({ rows }: { rows: string[][] }) {
  return (
    <div className="rounded-xl border border-line bg-white overflow-x-auto">
      <table className="w-full text-[15px]">
        <thead>
          <tr className="border-b border-line bg-paper text-left">
            <th className="px-5 py-3 font-bold">취소 통보 시점</th>
            <th className="px-5 py-3 font-bold">기준</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-line last:border-0">
              <td className="px-5 py-3">{k}</td>
              <td className="px-5 py-3 font-semibold">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
