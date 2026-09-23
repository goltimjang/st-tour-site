import { royalcc } from "./royalcc";
// ============================================================
// 에스티골프투어 사이트 전역 설정
// [확인 필요] 표시 항목은 대표님이 실값을 주시면 이 파일만 수정하면
// 사이트 전체(푸터·회사소개·구조화 데이터)에 일괄 반영됩니다.
// ============================================================

export const site = {
  name: "에스티골프투어",
  nameEn: "ST TOUR",
  domain: "https://www.stgolftours.com", // 가비아 구매 도메인 (2026-08-18)
  phone: "010-4461-7400",
  phoneHref: "tel:010-4461-7400",
  kakaoUrl: "https://pf.kakao.com/_xachSX/chat", // 카카오톡 채널 (2026-08-18 확정)
  bandUrl: "https://www.band.us/band/95448181",
  email: "goltimjang@gmail.com", // 견적 수신 메일 (2026-08-18 확정)

  // 회사 정보: royalccfestival.com 표기 기준, 실값 확인 후 교체
  company: {
    ceo: "김철순", // 사업자등록증 확인 완료
    address: "세종특별자치시 나성로 133-9, 508호 (나성동, 세종엔에스타워1)", // 사업자등록증 기준
    since: "2018", // 사업자등록증 개업연월일 2018-09-01
    bizNo: "680-05-01265", // 사업자등록증 확인 완료
    tourismNo: "종합여행업 등록 (등록번호 [확인 필요])", // 보증보험증권상 종합여행업 확인, 등록번호는 등록증 확인 필요
    mailOrderNo: "제0000-세종-0000호", // [확인 필요] 통신판매업신고번호
    insurance: "여행업 영업보증보험 5,000만원 가입 (SGI서울보증)", // 증권번호 100-000-2026-0084-4507, 2026.02.21~2027.02.20
    hours: "평일 09:00 ~ 18:00 (견적 요청은 24시간 접수)",
  },

  // 두 가지 철칙
  promises: {
    sla: "여행 조건을 보내주시면, 함께 준비합니다.",
    slaSub: "항공·숙박·라운드와 별도 비용을 확인해 견적서로 안내합니다.",
    transparent: "조건에 맞춰 직접 설계하는 견적",
    transparentSub:
      "전국 507곳·해외 743곳 골프장 정보와 25,000팀을 보내드린 경험으로 지역·날짜·인원·예산에 맞는 일정을 짜드립니다. 포함·불포함 내역을 항목별로 명확히 적어 드립니다.",
  },

  stats: {
    courses: "507", // 문체부 등록 골프장 기준 수집 데이터
    countries: "14",
    years: "2018", // 개업연도
    teams: 25000, // 누적 송출 팀 (자체 집계, 사용자 제공)
    people: "10만", // 인원 환산 (팀당 4인 기준, 사용자 제공)
    tournaments: "10+", // 주최·주관 대회 수 (사용자 제공)
  },

  contentUpdated: "2026년 9월 23일", // 콘텐츠 최종 수정일: 내용 갱신 시 함께 갱신
  contentUpdatedISO: "2026-09-23", // 위와 항상 같은 날짜 (JSON-LD·sitemap용)
  publishedISO: "2026-08-18", // 사이트 최초 공개일

  positioning:
    "에스티골프투어에서 국내·해외 골프여행을 준비하세요. 베트남·태국·일본 등 여행 지역과 대략적인 일정, 인원에 맞춰 항공·숙박·라운드의 포함·불포함 내역을 무료 견적으로 안내합니다. 일정이 미정이어도 상담 가능합니다.",

};

export const promo = {
  title: royalcc.title, badge: royalcc.recruit, date: royalcc.date,
  desc: "닌빈 로얄CC 54홀 라운드와 5성 숙박. 왕복 항공 포함 클럽 페스티벌",
  priceOriginal: royalcc.priceOriginal, price: royalcc.price,
  priceNote: royalcc.priceNote, url: royalcc.officialUrl,
};
