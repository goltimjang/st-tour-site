import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { site } from "@/data/site";

// GEO 전략: 주요 AI 크롤러를 명시적으로 허용 (네이버 블로그와 달리
// 자사 사이트는 ChatGPT·Perplexity 인용의 유일한 자산)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/band"] },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Yeti", allow: "/" }, // 네이버 검색로봇
    ],
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
