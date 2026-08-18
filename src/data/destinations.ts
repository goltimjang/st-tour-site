// 해외 목적지 — 한국 여행사 취급이 확인된 14개국 (2026-08 조사)
// tier 1: 국가 페이지 제공 / tier 2: 섹션 노출 / tier 3: 폼 선택지

export type Destination = {
  slug: string;
  name: string;
  tier: 1 | 2 | 3;
  cities: string[];
  season: string;
  flight: string;
  image?: string;
  priceFrom?: string; // 경쟁사 실게시가 조사 기반 하한 (연 1회 검수)
  priceRange?: string;
  blurb?: string;
};

export const destinations: Destination[] = [
  {
    slug: "thailand",
    image: "/images/thailand.jpg",
    name: "태국",
    tier: 1,
    cities: ["방콕", "파타야", "치앙마이", "후아힌", "푸껫"],
    season: "11월 ~ 2월 (건기 · 한국 겨울 시즌)",
    flight: "인천 → 방콕 약 5시간 30분",
    priceFrom: "39만원~",
    priceRange: "방콕·파타야 3박5일 통상 52만~110만원, 치앙마이 51만원~",
    blurb:
      "한국 골퍼가 가장 많이 찾는 겨울 골프 1번지입니다. 방콕·파타야는 골프장 선택지가 가장 넓고, 치앙마이는 선선한 날씨와 산악 코스, 후아힌은 조용한 휴양형 라운드에 좋습니다. 캐디 서비스 수준이 높고 골프텔부터 5성 리조트까지 예산에 맞춘 구성이 자유롭습니다.",
  },
  {
    slug: "vietnam",
    image: "/images/vietnam.jpg",
    name: "베트남",
    tier: 1,
    cities: ["다낭", "하노이", "나트랑", "호치민", "푸꾸옥"],
    season: "11월 ~ 4월 (남부 건기 · 다낭은 2~8월)",
    flight: "인천 → 다낭·하노이 약 4시간 30분",
    priceFrom: "69만원~",
    priceRange: "다낭·나트랑 3박5일 통상 78만~135만원, 하노이 78만원~",
    blurb:
      "비행시간 대비 코스 퀄리티가 가장 좋은 목적지로 꼽힙니다. 다낭은 해안 명문 코스와 리조트, 하노이는 한적한 내륙 코스, 나트랑은 휴양 결합형에 강합니다. 에스티투어가 로얄CC 클럽 페스티벌을 직접 운영하는 지역이라 현지 네트워크가 가장 두텁습니다.",
  },
  {
    slug: "japan",
    image: "/images/japan.jpg",
    name: "일본",
    tier: 1,
    cities: ["규슈(후쿠오카·가고시마)", "오키나와", "홋카이도", "오사카", "도쿄 근교"],
    season: "규슈·오키나와 11~3월 · 홋카이도 6~9월",
    flight: "인천 → 후쿠오카 약 1시간 20분",
    priceFrom: "72만원~",
    priceRange: "규슈 2~3박 통상 80만~130만원, 홋카이도 79만원~",
    blurb:
      "짧은 비행시간과 정갈한 코스 관리로 시니어·부부 여행에 특히 좋습니다. 겨울엔 규슈·오키나와, 여름엔 홋카이도로 사계절 대응이 가능하고, 온천·미식과 결합한 일정 구성이 강점입니다. 렌터카 자유 골프 구성도 가능합니다.",
  },
  {
    slug: "china",
    image: "/images/china.jpg",
    name: "중국",
    tier: 1,
    cities: ["칭다오", "웨이하이", "옌타이", "하이난", "쿤밍"],
    season: "산둥 4~6월·9~11월 · 하이난 11~3월",
    flight: "인천 → 칭다오·웨이하이 약 1시간 30분",
    priceFrom: "29만원~",
    priceRange: "산둥권 2박3일~3박4일 통상 35만~70만원",
    blurb:
      "가성비가 가장 좋은 목적지입니다. 산둥권(칭다오·웨이하이·옌타이)은 1시간대 비행에 그린피가 저렴해 짧은 일정의 단체·동호회 행사에 최적이고, 겨울엔 하이난·쿤밍이 대안이 됩니다. 최근 수요가 가장 빠르게 회복 중인 지역입니다.",
  },
  {
    slug: "philippines",
    image: "/images/philippines.jpg",
    name: "필리핀",
    tier: 1,
    cities: ["클락", "마닐라", "세부"],
    season: "12월 ~ 5월 (건기)",
    flight: "인천 → 클락·마닐라 약 4시간",
    priceFrom: "29만원~",
    priceRange: "클락 3박5일 통상 43만~125만원, 마닐라·세부 39만원~",
    blurb:
      "클락은 경제특구 안에 골프텔과 코스가 모여 있어 이동이 짧고 무제한 라운드 상품이 발달해 있습니다. '많이 치고 오는' 실속 골프여행의 대표 목적지로, 2인 소규모 출발 상품도 찾기 쉽습니다.",
  },
  // ---- Tier 2 ----
  { slug: "taiwan", name: "대만", tier: 2, cities: ["타이베이", "가오슝"], season: "10월 ~ 4월", flight: "약 2시간 30분", priceFrom: "114만원~" },
  { slug: "malaysia", name: "말레이시아", tier: 2, cities: ["코타키나발루", "쿠알라룸푸르"], season: "11월 ~ 2월 수요 집중", flight: "약 5~6시간 30분" },
  { slug: "guam-saipan", name: "괌·사이판", tier: 2, cities: ["괌", "사이판"], season: "12월 ~ 6월 (건기)", flight: "약 4시간", priceFrom: "124만원~" },
  // ---- Tier 3 ----
  { slug: "indonesia", name: "인도네시아", tier: 3, cities: ["자카르타"], season: "5월 ~ 9월 (건기)", flight: "약 7시간" },
  { slug: "cambodia", name: "캄보디아", tier: 3, cities: ["씨엠립", "프놈펜"], season: "11월 ~ 4월", flight: "약 5시간 30분" },
  { slug: "laos", name: "라오스", tier: 3, cities: ["비엔티안"], season: "11월 ~ 3월", flight: "약 5시간 30분" },
  { slug: "mongolia", name: "몽골", tier: 3, cities: ["울란바토르"], season: "5월 ~ 9월 (여름 역시즌)", flight: "약 3시간 30분" },
  { slug: "hawaii-usa", name: "하와이·미국", tier: 3, cities: ["호놀룰루", "LA"], season: "연중", flight: "약 8~11시간" },
  { slug: "australia-nz", name: "호주·뉴질랜드", tier: 3, cities: ["시드니", "골드코스트", "오클랜드"], season: "11월 ~ 3월 (남반구 여름)", flight: "약 10~12시간" },
];

export const tier1 = destinations.filter((d) => d.tier === 1);
export const tier2 = destinations.filter((d) => d.tier === 2);
export const tier3 = destinations.filter((d) => d.tier === 3);
