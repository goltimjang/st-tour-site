// 골프장 상세 정보(공식 홈페이지·홀수·부제·캐디) 조회 헬퍼.
// 원본은 course-details.json (웹에서 확인된 골프장만 수록, 미확인 항목은 null).
import details from "./course-details.json";

export type CourseDetail = {
  name: string;
  url: string | null;
  holes: number | null;
  shifts: string[] | null;
  noCaddie?: boolean;
  verified?: string;
};

const map = new Map<string, CourseDetail>(
  (details as CourseDetail[]).map((d) => [d.name.replace(/\s/g, ""), d])
);

export function courseDetail(name: string): CourseDetail | undefined {
  return map.get(name.replace(/\s/g, ""));
}

/** 공식 홈페이지가 확인된 곳은 그 주소, 아니면 네이버 검색 결과로 보냄 */
export function courseLink(name: string): { href: string; official: boolean } {
  const d = courseDetail(name);
  if (d?.url) return { href: d.url, official: true };
  return { href: `https://search.naver.com/search.naver?query=${encodeURIComponent(name + " 골프장")}`, official: false };
}

export const detailCount = (details as CourseDetail[]).length;
