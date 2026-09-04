import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { site } from "@/data/site";

// OG·사이트맵 절대경로 기준 도메인 (기본: site.domain)
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.domain;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "에스티골프투어 | 국내·해외 골프투어 견적 전문",
    template: "%s | 에스티골프투어",
  },
  description: site.positioning,
  openGraph: {
    siteName: "에스티골프투어",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "에스티골프투어 24시간 맞춤 골프투어 견적" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
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
  "@id": `${site.domain}/#organization`,
  name: "에스티골프투어",
  alternateName: ["에스티투어", "ST TOUR", "에스티골프투어"],
  url: site.domain,
  logo: `${site.domain}/logo-black.png`,
  image: `${site.domain}/og.jpg`,
  telephone: "+82-10-4461-7400",
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressCountry: "KR",
    addressRegion: "세종특별자치시",
    streetAddress: site.company.address,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: "+82-10-4461-7400",
    availableLanguage: "Korean",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [site.kakaoUrl, site.bandUrl],
  description: site.positioning,
  knowsAbout: ["골프투어", "골프여행", "골프 패키지", "골프장 부킹", "골프대회 운영"],
  areaServed: ["대한민국", "일본", "태국", "베트남", "필리핀", "중국", "대만", "말레이시아", "괌", "사이판"],
  foundingDate: site.company.since,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.domain}/#website`,
  name: "에스티골프투어",
  alternateName: "ST TOUR",
  url: site.domain,
  inLanguage: "ko",
  publisher: { "@id": `${site.domain}/#organization` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fastly.jsdelivr.net" crossOrigin="anonymous" />
        {/* 폰트 CSS 비동기 로드: 렌더링 차단 방지 (로드 전엔 시스템 폰트로 먼저 그림) */}
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css';document.head.appendChild(l);})()",
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
