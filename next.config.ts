import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OG·사이트맵 절대경로는 src/data/site.ts의 domain(www.stgolftours.com)을 기본 사용.
  // 필요 시 NEXT_PUBLIC_SITE_URL 환경변수로 재정의 가능.
};

export default nextConfig;
