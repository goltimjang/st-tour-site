// ============================================================
// 상품(패키지) 목록
// 새 상품을 올릴 때는 아래 배열 맨 앞에 항목 하나를 추가하면 됩니다.
// 썸네일 이미지는 1:1 정사각형으로 public/products/ 에 넣고 경로를 적어주세요.
// ============================================================

export type Product = {
  /** URL 주소가 됩니다. 영문 소문자·숫자·하이픈만 (예: royalcc-2026) */
  slug: string;
  title: string;
  /** 목록 카드에 보이는 한 줄 설명 */
  summary: string;
  /** 1:1 정사각형 썸네일 (예: /products/royalcc.jpg) */
  thumb: string;
  country: string;
  /** 국내 / 해외 */
  kind: "국내" | "해외";
  /** 예: "3박 5일" */
  duration: string;
  /** 예: "1,290,000원" — 미정이면 "견적 문의" */
  price: string;
  /** 정가 (할인 표시용, 없으면 생략) */
  priceOriginal?: string;
  priceNote?: string;
  /** 예: "2026.12.13(일) ~ 12.17(목)" */
  date?: string;
  /** 모집 상태 뱃지. 예: "1차 모집 중" */
  badge?: string;
  /** 상단에 크게 보여줄 핵심 정보 (최대 4개 권장) */
  highlights?: { label: string; value: string }[];
  /** 일정표 */
  itinerary?: { day: string; plan: string }[];
  includes?: string[];
  excludes?: string[];
  /** 자유 설명 문단 (줄바꿈은 항목을 나눠서) */
  body?: string[];
  /** 추가 이미지 (상세 페이지 하단 갤러리) */
  gallery?: string[];
  /** 노출 여부. false면 목록·상세에서 숨겨집니다 */
  published: boolean;
  /** 정렬용. 최근 날짜가 위로 옵니다 (YYYY-MM-DD) */
  postedAt: string;
};

export const products: Product[] = [
  {
    slug: "royalcc-festival-2026",
    title: "베트남 하노이 로얄CC 클럽 페스티벌 2026",
    summary: "3박 5일 54홀 라운드와 5성 숙박, 총 1억원 상당 시상. 왕복 항공 포함.",
    thumb: "/products/royalcc.jpg",
    country: "베트남",
    kind: "해외",
    duration: "3박 5일",
    price: "1,290,000원",
    priceOriginal: "1,590,000원",
    priceNote: "1인 · 2인 1실 · 왕복 항공 포함",
    date: "2026.12.13(일) ~ 12.17(목)",
    badge: "1차 모집 중",
    highlights: [
      { label: "일정", value: "3박 5일 · 12/13~17" },
      { label: "라운드", value: "총 54홀 (18홀 × 3일)" },
      { label: "숙박", value: "5성 리조트 · 풀빌라" },
      { label: "예약금", value: "1인 700,000원" },
    ],
    itinerary: [
      { day: "1일차 · 12/13(일)", plan: "인천 10:35 출발 → 하노이 13:25 도착 → 닌빈 이동 → 더 파이브 빌라스 체크인" },
      { day: "2일차 · 12/14(월)", plan: "로얄CC 18홀 라운드 (2인 1카트 · 1인 1캐디)" },
      { day: "3일차 · 12/15(화)", plan: "로얄CC 18홀 라운드 · 저녁 특별 석식 BBQ와 대회 시상식" },
      { day: "4일차 · 12/16(수)", plan: "로얄CC 18홀 라운드 → 하노이 자유시간 → 23:40 하노이 출발" },
      { day: "5일차 · 12/17(목)", plan: "05:30 인천 도착" },
    ],
    includes: [
      "왕복 항공료 · 유류할증료 · TAX",
      "5성 호텔·리조트·풀빌라 3박 (2인 1실)",
      "그린피 3회 (총 54홀)",
      "카트비 · 캐디피",
      "전 일정 한국인 가이드 · 스탭 동행",
      "그랜드볼룸 식사 · 3일차 특별 BBQ",
    ],
    excludes: ["공항 송영비 1인 US$60", "캐디팁 18홀 기준 1인 50만동", "선택관광"],
    body: [
      "베트남 닌빈 로얄CC에서 열리는 클럽 페스티벌입니다. 스트로크와 신페리오 두 방식으로 나눠 시상하며, 총 1억원 상당의 상품이 준비되어 있습니다.",
      "에스티골프투어가 직접 주관하는 행사로, 전 일정 스탭이 동행합니다.",
    ],
    published: true,
    postedAt: "2026-08-01",
  },
];

export const publishedProducts = products
  .filter((p) => p.published)
  .sort((a, b) => b.postedAt.localeCompare(a.postedAt));

export function findProduct(slug: string) {
  return publishedProducts.find((p) => p.slug === slug);
}
