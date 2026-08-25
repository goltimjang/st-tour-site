// 에스티투어가 주최·주관·협찬한 실제 대회 포스터 (드라이브 폴더 원본 확인 완료)

export type Poster = { src: string; title: string; sub: string };

export const posters: Poster[] = [
  {
    src: "/posters/thehill.webp",
    title: "더힐 클럽 페스티벌 2026",
    sub: "더힐 컨트리클럽 · 신페리오",
  },
  {
    src: "/posters/hanoi.webp",
    title: "하노이 월드 스크린골프 페스티벌 2026",
    sub: "주최 에스티투어",
  },
  {
    src: "/posters/sejong.webp",
    title: "세종 스크린골프 챔피언십",
    sub: "1,000만원 상당 시상 · 협찬 에스티투어",
  },
  {
    src: "/posters/honors.webp",
    title: "아너스 스크린골프 상금대회",
    sub: "총 현금 1,000만원",
  },
  {
    src: "/posters/chungin.webp",
    title: "제2회 청인 아마추어 골프 상금대회",
    sub: "클럽디금강CC · 총 상금 1,500만원",
  },
];
