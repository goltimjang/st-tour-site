// JSON-LD 공용 헬퍼: 검색엔진·AI 크롤러가 읽는 구조화 데이터
import { site } from "./site";

/** 페이지 경로 → BreadcrumbList (홈은 자동 포함) */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "홈", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.domain}${it.path}`,
    })),
  };
}
