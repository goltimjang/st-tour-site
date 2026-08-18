import type { NextConfig } from "next";

// GitHub Pages 정적 호스팅 구성 — 커스텀 도메인 www.stgolftours.com
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
