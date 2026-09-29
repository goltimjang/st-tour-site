import { publishedProducts } from "./products";

export const catalogCountries = [
  { slug: "vietnam", name: "베트남", intro: "하노이·하이퐁의 골프텔부터 다낭 다색골프, 나트랑 리조트 여행까지. 라운드에 집중할지 관광을 함께할지 먼저 골라보세요." },
  { slug: "thailand", name: "태국", intro: "방콕·파타야·치앙마이의 골프텔과 다색골프를 모았습니다. 숙소 위치와 이동 방식, 라운드 횟수를 비교해 여행을 준비하세요." },
  { slug: "japan", name: "일본", intro: "미야자키·가고시마·오키나와·고베 등 지역별 골프여행입니다. 골프텔, 시내 호텔, 온천 결합 일정과 부산 출발 선박 파크골프를 살펴보세요." },
  { slug: "china", name: "중국", intro: "칭다오·옌타이·웨이하이부터 샤먼·하이난·광저우까지. 골프장 내 숙박과 여러 코스를 도는 다색골프를 구분해 비교할 수 있습니다." },
  { slug: "philippines", name: "필리핀", intro: "클락 레이크우드CC와 로알센트럴CC 골프텔, 시내 호텔을 이용하는 다색골프입니다. 출발 공항과 라운드 조건에 맞춰 골라보세요." },
  { slug: "guam-saipan", name: "괌·사이판", intro: "괌 파인이스트·레오팔레스와 사이판 코럴오션 등 리조트 골프를 모았습니다. 함께 여행하는 인원과 숙박 취향에 맞춰 상담하세요." },
  { slug: "malaysia", name: "말레이시아", intro: "코타키나발루 보르네오CC 골프텔을 살펴보세요. 라운드 횟수와 식사, 객실 조건을 희망 출발일 기준으로 확인해드립니다." },
  { slug: "laos", name: "라오스", intro: "비엔티안 레이크뷰·롱비엔 등 여러 코스와 시내 호텔을 조합한 골프여행입니다. 출발 공항과 숙소, 관광 포함 여부를 비교하세요." },
  { slug: "indonesia", name: "인도네시아", intro: "바탐 팜스프링스 골프텔과 다색골프, 9일 라운드 일정을 모았습니다. 숙박 등급과 식사, 이동 조건을 확인해보세요." },
  { slug: "usa", name: "하와이·미국", intro: "하와이 오아후와 4개 섬 크루즈, 미서부 페블비치·라스베가스 골프여행입니다. 항공 불포함 상품은 항공권 비용을 별도로 확인하세요." },
  { slug: "scotland", name: "스코틀랜드", intro: "세인트앤드루스 중심 골프여행과 2027 디오픈 참관 일정을 살펴보세요. 코스와 티타임, 대회 관람 및 항공 조건은 예약 전 확인이 필요합니다." },
  { slug: "turkiye", name: "튀르키예", intro: "안탈리아 레그넘 카리야 리조트에 머무는 골프여행입니다. 항공 불포함 상품으로, 항공권과 현지 일정의 전체 비용을 함께 확인해드립니다." },
  { slug: "mexico", name: "멕시코", intro: "로스카보스 다색골프를 살펴보세요. 출발편에 따른 전체 여행 기간과 라운드 코스, 차량 및 숙박 조건을 상담으로 확정합니다." },
].map(c => ({ ...c, products: publishedProducts.filter(p => p.country === c.name) }));
export const countryHref = (name: string) => `/products/country/${catalogCountries.find(c => c.name === name)?.slug ?? "vietnam"}/`;
