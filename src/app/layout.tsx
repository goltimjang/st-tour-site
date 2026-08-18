import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import { site } from "@/data/site";

// 도메인 연결 전에는 배포 URL(VERCEL_URL) 기준으로 OG 이미지 절대경로 생성
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : site.domain);

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "에스티투어 — 24시간 맞춤 골프투어 견적",
    template: "%s | 에스티투어",
  },
  description: site.positioning,
  openGraph: {
    siteName: "에스티투어",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "에스티투어 — 24시간 맞춤 골프투어 견적" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "에스티투어",
  alternateName: "ST TOUR",
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
