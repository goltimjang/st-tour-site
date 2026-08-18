import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { site } from "@/data/site";
import { tier1 } from "@/data/destinations";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.domain;
  const now = new Date();
  const pages = ["", "/domestic", "/overseas", "/promotion", "/about", "/faq", "/terms", "/privacy"];
  return [
    ...pages.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : p === "/domestic" || p === "/overseas" ? 0.9 : 0.6,
    })),
    ...tier1.map((d) => ({
      url: `${base}/overseas/${d.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
