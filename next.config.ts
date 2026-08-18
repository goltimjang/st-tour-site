import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // 임시 배포 주소 — 정식 도메인 연결 시 이 값을 도메인으로 교체하거나 삭제(사이트 기본값 사용)
    NEXT_PUBLIC_SITE_URL: "https://temporary-rushing-beryl-vfrqfbc.vercel.app",
  },
};

export default nextConfig;
