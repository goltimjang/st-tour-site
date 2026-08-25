import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 수집 항목·이용 목적·보유 기간 안내",
  description: "에스티골프투어 개인정보처리방침입니다. 견적 상담을 위한 개인정보의 수집 항목, 이용 목적, 보유 기간과 파기 절차를 안내합니다.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <p className="eyebrow text-royal mb-3">Privacy Policy</p>
      <h1 className="headline text-[28px] sm:text-[36px] mb-6">개인정보처리방침</h1>
      <p className="text-[15px] text-mute mb-8">시행일: 2026년 8월 18일 · 최종 수정일: {site.contentUpdated}</p>

      <div className="space-y-8 text-[15.5px] leading-relaxed">
        <div>
          <h2 className="headline text-lg mb-2">1. 수집하는 개인정보와 목적</h2>
          <p>
            에스티골프투어(이하 &quot;회사&quot;)는 골프투어 견적 상담을 위해 다음 정보를 수집합니다.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>수집 항목</strong>: 이름, 연락처(전화번호), 여행 조건(희망 지역·날짜·인원·예산 등)</li>
            <li><strong>수집 목적</strong>: 견적서 작성·전달, 상담 회신(전화·카카오톡·문자), 예약 진행</li>
            <li><strong>수집 방법</strong>: 홈페이지 견적 요청 양식, 전화·카카오톡 상담</li>
          </ul>
        </div>
        <div>
          <h2 className="headline text-lg mb-2">2. 보유 기간과 파기</h2>
          <p>
            수집된 개인정보는 <strong>상담 완료 후 1년간</strong> 보관 후 지체 없이 파기합니다. 다만 계약이 체결된 경우
            전자상거래법 등 관계 법령에 따라 계약·결제 기록을 5년간 보관합니다. 파기 시 전자 파일은 복구 불가능한
            방법으로 삭제합니다.
          </p>
        </div>
        <div>
          <h2 className="headline text-lg mb-2">3. 제3자 제공</h2>
          <p>
            회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 여행 계약 이행을 위해 필요한
            최소한의 정보(예약자명 등)를 골프장·항공사·숙박시설 등 여행 서비스 공급자에게 제공할 수 있으며, 이 경우
            계약 진행 시 별도로 안내합니다.
          </p>
        </div>
        <div>
          <h2 className="headline text-lg mb-2">4. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 요구할 수 있습니다. 요청은 대표전화
            ({site.phone})로 연락 주시면 지체 없이 처리합니다.
          </p>
        </div>
        <div>
          <h2 className="headline text-lg mb-2">5. 개인정보 보호책임자</h2>
          <p>
            보호책임자: {site.company.ceo} (대표) · 연락처: {site.phone}
            <br />
            기타 개인정보 침해에 대한 신고·상담은 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118)에 문의하실 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
