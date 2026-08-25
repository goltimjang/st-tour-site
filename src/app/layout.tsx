import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import { site } from "@/data/site";

// OG·사이트맵 절대경로 기준 도메인 (기본: site.domain)
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.domain;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "에스티골프투어 — 국내·해외 골프투어 견적 전문",
    template: "%s | 에스티골프투어",
  },
  description: site.positioning,
  openGraph: {
    siteName: "에스티골프투어",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "에스티골프투어 — 24시간 맞춤 골프투어 견적" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
  verification: {
    // 네이버 서치어드바이저 소유확인 (2026-08-18)
    other: {
      "naver-site-verification": "6d065cc51d57c136bd5a8d0e4d2f827913ef8d93",
    },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "에스티골프투어",
  alternateName: ["에스티투어", "ST TOUR", "에스티골프투어"],
  url: site.domain,
  telephone: "+82-10-4461-7400",
  address: {
    "@type": "PostalAddress",
    addressCountry: "KR",
    addressRegion: "세종특별자치시",
    streetAddress: site.company.address,
  },
  description: site.positioning,
  areaServed: ["대한민국", "일본", "태국", "베트남", "필리핀", "중국", "대만", "말레이시아", "괌", "사이판"],
  foundingDate: site.company.since,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fastly.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}
