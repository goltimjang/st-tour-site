export type BookingCourse = {
  bookingMode?: "inquiry" | "phone"; logo?: string;
  slug: string; name: string; area: string; address: string; officialUrl: string;
  summary: string; features: { title: string; text: string }[];
  photos: { src: string; caption: string }[];
};

// Add verified courses here to generate their own enquiry pages and sitemap entries.
export const bookingCourses: BookingCourse[] = [{
  logo: "/booking/fourseven/logo.svg", slug: "fourseven-geumgang", name: "포세븐 금강CC", area: "전북 익산",
  address: "전북특별자치도 익산시 웅포면 강변로 130",
  officialUrl: "https://www.fourseven.co.kr/",
  summary: "금강 곁에서 즐기는 라운드. 원하는 날짜와 시간대의 할인부킹 조건을 확인해보세요.",
  features: [
    { title: "EAST · WEST 코스", text: "연못과 소나무, 페어웨이가 이어지는 코스에서 라운드를 준비하세요. 실제 배정 코스는 예약 시 확인합니다." },
    { title: "클럽하우스", text: "라운드 전후 여유를 나눌 수 있는 공간. 코스와 클럽하우스의 소개 이미지를 함께 살펴보세요." },
    { title: "레스토랑", text: "식사와 모임을 함께 계획할 수 있습니다. 메뉴, 이용 시간과 식사 포함 여부는 문의 시 확인해드립니다." },
  ],
  photos: [
    { src: "/booking/fourseven/1001-morning-course-4k.webp", caption: "아침 햇살이 비치는 코스 · AI 보정 이미지" },
    { src: "/booking/fourseven/1001-clubhouse-4k.webp", caption: "클럽하우스 외관 · AI 보정 이미지" },
    { src: "/booking/fourseven/1001-banquet-room-4k.webp", caption: "레스토랑·연회 공간 · AI 보정 이미지" },
    { src: "/booking/fourseven/1001-pavilion-pond-4k.webp", caption: "정자와 연못 · AI 보정 이미지" },
    { src: "/booking/fourseven/1001-course-aerial-4k.webp", caption: "코스 항공 전경 · AI 보정 이미지" },
    { src: "/booking/fourseven/1001-clubhouse-aerial-4k.webp", caption: "클럽하우스 항공 전경 · AI 보정 이미지" },
    { src: "/booking/fourseven/1001-golf-event-4k.webp", caption: "골프 행사 현장 소개 · AI 보정 이미지" },
  ],
}, {
  slug: "songnisan", name: "속리산CC", area: "충북 보은", bookingMode: "phone",
  address: "충청북도 보은군 탄부면 평각상장로 230",
  officialUrl: "https://www.clublonge.com/Club/songnisan",
  summary: "구병산 능선과 함께하는 18홀 라운드. 희망 날짜와 인원을 전화로 알려주시면 티타임과 할인 금액을 안내합니다.",
  features: [
    { title: "EAST · WEST 18홀", text: "이스트 9홀과 웨스트 9홀로 구성된 코스입니다. 구병산 능선을 배경으로 라운드를 준비하세요." },
    { title: "클럽하우스·로비", text: "라운드 전후 머무는 클럽하우스와 로비를 사진으로 살펴보세요. 시설 운영과 이용 조건은 예약 시 확인합니다." },
    { title: "전화로 한 번에 확인", text: "희망 날짜, 시간대, 인원을 알려주세요. 잔여 티타임과 그린피·카트비·캐디피 등 이용 조건을 안내합니다." },
  ],
  photos: [
    { src: "/booking/songnisan/course-ridge.webp", caption: "속리산CC 산 능선을 배경으로 한 코스 전경" },
    { src: "/booking/songnisan/clubhouse-day.webp", caption: "속리산CC 클럽하우스 주간 전경" },
    { src: "/booking/songnisan/lobby.webp", caption: "속리산CC 클럽하우스 로비" },
    { src: "/booking/songnisan/course-pond.webp", caption: "속리산CC 연못과 코스 전경" },
    { src: "/booking/songnisan/course-sunset.webp", caption: "속리산CC 해질 무렵 코스 전경" },
    { src: "/booking/songnisan/clubhouse-night.webp", caption: "속리산CC 클럽하우스 야경" },
  ],
}];
