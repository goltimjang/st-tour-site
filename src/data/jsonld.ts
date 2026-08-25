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

/** 페이지별 WebPage 스키마: 발행·수정일과 발행 주체(E-E-A-T 신호) 포함 */
export function webPageLd(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.domain}${path}#webpage`,
    url: `${site.domain}${path}`,
    name,
    description,
    inLanguage: "ko",
    isPartOf: { "@id": `${site.domain}/#website` },
    about: { "@id": `${site.domain}/#organization` },
    publisher: { "@id": `${site.domain}/#organization` },
    datePublished: site.publishedISO,
    dateModified: site.contentUpdatedISO,
  };
}
