import type { Metadata } from "next";
import { site } from "@/data/site";
import { webPageLd } from "@/data/jsonld";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 수집 항목·이용 목적·보유 기간 안내",
  description: "에스티골프투어 개인정보처리방침입니다. 견적 상담을 위한 개인정보의 수집 항목, 이용 목적, 보유 기간과 파기 절차를 안내합니다.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  const pageLd = webPageLd("개인정보처리방침", "/privacy/", "에스티골프투어 개인정보처리방침. 수집 항목, 이용 목적, 보유 기간과 파기 절차 안내.");
  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <p className="eyebrow text-royal mb-3">Privacy Policy</p>
      <h1 className="headline text-[28px] sm:text-[36px] mb-6">개인정보처리방침</h1>
      <p className="text-[15px] text-mute mb-8">시행일: 2026년 10월 11일 · 최종 수정일: {site.contentUpdated}</p>

      <div className="space-y-8 text-[15.5px] leading-relaxed">
        <div>
          <h2 className="headline text-lg mb-2">1. 수집하는 개인정보와 목적</h2>
          <p>
            에스티골프투어(이하 &quot;회사&quot;)는 골프투어 견적 및 할인부킹 상담을 위해 다음 정보를 수집합니다.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>수집 항목</strong>: 이름, 연락처(전화번호), 이메일(선택), 여행·부킹 조건(희망 지역·골프장·날짜·부·인원·팀 수·예산 등)</li>
            <li><strong>수집 목적</strong>: 견적서 작성·전달, 상담 회신(전화·카카오톡·문자), 예약 진행</li>
            <li><strong>수집 방법</strong>: 홈페이지 견적 요청 양식, 전화·카카오톡 상담</li>
          </ul>
        </div>
        <div>
          <h2 className="headline text-lg mb-2">2. 보유 기간과 파기</h2>
          <p>
            수집된 개인정보는 <strong>최종 상담 또는 접수일로부터 1년간</strong> 보관 후 지체 없이 파기합니다. 다만 계약이 체결된 경우
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
        <div id="quote-processing" className="scroll-mt-24">
          <h2 className="headline text-lg mb-2">4. 온라인 접수 처리위탁 및 국외 처리·보관</h2>
          <p>온라인 문의는 에스티투어가 운영하는 접수함에 먼저 저장합니다. 메일이나 알림톡이 도착하지 않더라도 접수번호가 표시되면 저장된 문의를 담당자가 확인할 수 있습니다. 접수 알림은 예약 확정이나 광고성 메시지가 아닙니다.</p>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl bg-paper p-4">
              <h3 className="font-bold">Cloudflare, Inc. · 접수 서버·저장소·접수 보호</h3>
              <p className="mt-2">처리 항목: 이름, 전화번호, 선택 이메일, 여행·부킹 조건, 요청사항, 동의 기록, 접수번호·시각, 상담 기록. 접수 보호를 위해 IP 주소와 브라우저·기기 정보도 처리됩니다. 회사 접수 DB에는 원본 IP 대신 짧게 유지되는 해시값을 사용합니다.</p>
              <p className="mt-2">처리 국가·위치: 미국 및 Cloudflare의 글로벌 서비스 운영 국가. 접수 DB는 아시아·태평양 지역으로 설정되어 있으나 대한민국 내 처리·보관만을 보장하는 설정은 아닙니다. 네트워크·보안 정보는 미국·유럽경제지역 등을 포함한 글로벌 네트워크에서 처리될 수 있습니다.</p>
              <p className="mt-2">이전 시점·방법: 접수 보호 확인과 요청 전송 시 암호화된 인터넷 연결로 전달합니다. 이용 목적: 접수 저장, 담당자 상담, 비정상 접수 방지, 장애 복구. 보관 기간: 회사의 위 보유 기간을 적용하며 복구용 이력은 현재 서비스 설정에서 최대 7일간 추가로 남을 수 있습니다.</p>
              <p className="mt-2">문의: privacyquestions@cloudflare.com · <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="underline">Cloudflare 개인정보 및 국외 처리 안내</a></p>
            </div>
            <div className="rounded-xl bg-paper p-4">
              <h3 className="font-bold">Plus Five Five, Inc. (Resend) · 담당자 메일 알림</h3>
              <p className="mt-2">처리 항목: 접수번호, 알림 시각, 관리자 접수함 주소, 회사 수신 메일 주소. 자동 접수 알림에는 고객 이름·연락처·여행 조건을 넣지 않습니다. 미국 사업자의 서비스이며 메일 발송 리전은 일본(도쿄)으로 설정되어 있습니다. 전송·운영 과정에서 미국 및 일본에서 처리될 수 있습니다.</p>
              <p className="mt-2">이전 시점·방법: 문의 저장 후 암호화된 연결로 전달합니다. 목적: 담당자에게 새 접수 사실 알림. 메일·로그 보관: 현재 요금제의 서비스 기준 30일. 문의: support@resend.com · <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">Resend 개인정보 안내</a></p>
            </div>
            <div className="rounded-xl bg-paper p-4">
              <h3 className="font-bold">솔라피 주식회사 · 주식회사 카카오 · 접수 알림톡</h3>
              <p className="mt-2">처리 국가: 대한민국. 처리 항목: 수신 전화번호, 접수번호, 접수 안내 메시지와 발송 결과. 목적·시점: 골프여행 문의 저장 후 고객에게 접수 사실을 안내하기 위해 암호화된 연결로 전달합니다. SOLAPI 발송 이력은 발송일로부터 1년간 보관됩니다. 카카오톡 미이용·수신 제한·서비스 오류 등으로 알림이 도착하지 않을 수 있습니다. 할인부킹은 전용 템플릿 승인 전까지 자동 알림톡 없이 담당자가 직접 안내합니다.</p>
              <p className="mt-2"><a href="https://solapi.com/guides/privacy" target="_blank" rel="noopener noreferrer" className="underline">SOLAPI 개인정보 안내 및 문의</a> · <a href="https://www.kakao.com/policy/privacy" target="_blank" rel="noopener noreferrer" className="underline">카카오 개인정보 안내</a></p>
            </div>
          </div>
          <p className="mt-4">위 접수 처리위탁·보관은 고객이 요청한 견적 상담 및 계약 체결·이행을 위해 이용합니다. 온라인 처리 또는 국외 이전을 원하지 않으면 양식을 제출하지 않고 <a href={`tel:${site.phone}`} className="underline">{site.phone}</a>으로 전화 상담을 요청할 수 있습니다. 열람·정정·삭제·처리정지 및 국외 이전 중단 요청은 같은 연락처 또는 {site.email}로 접수합니다. 온라인 처리를 거부하면 홈페이지 자동 접수 기능은 이용할 수 없으며, 전화 상담은 가능합니다.</p>
          <p className="mt-3">관리자 접수함은 지정된 담당자만 인증 후 열람합니다. 개인정보를 광고 분석 이벤트에 넣지 않으며, 법령상 보관 의무가 있는 자료는 해당 목적에 필요한 범위에서만 관리합니다. 기존 Formspree 접수 자료는 새 서버로 자동 이관하지 않고, 종전 안내에 따른 보관·삭제 요청을 처리합니다.</p>
        </div>
        <div>
          <h2 className="headline text-lg mb-2">5. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 요구할 수 있습니다. 요청은 대표전화
            ({site.phone})로 연락 주시면 지체 없이 처리합니다.
          </p>
        </div>
        <div>
          <h2 className="headline text-lg mb-2">6. 개인정보 보호책임자</h2>
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
