export type BookingCourse = {
  slug: string; name: string; area: string; address: string; officialUrl: string;
  summary: string; features: { title: string; text: string }[];
  photos: { src: string; caption: string }[];
};

// Add verified courses here to generate their own enquiry pages and sitemap entries.
export const bookingCourses: BookingCourse[] = [{
  slug: "fourseven-geumgang", name: "포세븐 금강CC", area: "전북 익산",
  address: "전북특별자치도 익산시 웅포면 강변로 130",
  officialUrl: "https://www.fourseven.co.kr/",
  summary: "금강 곁에서 즐기는 라운드. 원하는 날짜와 시간대의 할인부킹 조건을 확인해보세요.",
  features: [
    { title: "EAST · WEST 코스", text: "연못과 소나무, 페어웨이가 이어지는 코스에서 라운드를 준비하세요. 실제 배정 코스는 예약 시 확인합니다." },
    { title: "클럽하우스", text: "라운드 전후 여유를 나눌 수 있는 공간. 코스와 클럽하우스의 실제 모습을 사진으로 확인하세요." },
    { title: "레스토랑", text: "식사와 모임을 함께 계획할 수 있습니다. 메뉴, 이용 시간과 식사 포함 여부는 문의 시 확인해드립니다." },
  ],
  photos: [
    { src: "/booking/fourseven/course.webp", caption: "포세븐 금강CC · 공식 홈페이지 코스 사진" },
    { src: "/booking/fourseven/clubhouse.jpg", caption: "포세븐 금강CC 클럽하우스 외관" },
    { src: "/booking/fourseven/dining.webp", caption: "레스토랑 · 2024년 대회 준비 당시 사진, 현재 배치와 다를 수 있습니다" },
    { src: "/booking/fourseven/course-2.webp", caption: "포세븐 금강CC · 공식 홈페이지 코스 전경" },
  ],
}];
