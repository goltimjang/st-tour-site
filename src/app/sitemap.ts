import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { site } from "@/data/site";
import { tier1 } from "@/data/destinations";
import { publishedProducts } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.domain;
  const now = new Date(site.contentUpdatedISO + "T00:00:00+09:00");
  const pages = ["/", "/domestic/", "/overseas/", "/products/", "/promotion/", "/about/", "/faq/", "/terms/", "/privacy/"];
  return [
    ...pages.map((p) => ({
      url: `${base}${p}`.replace(/([^:])\/\//g, "$1/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1 : p === "/domestic/" || p === "/overseas/" ? 0.9 : 0.6,
    })),
    ...publishedProducts.map((p) => ({
      url: `${base}/products/${p.slug}/`,
      lastModified: new Date(p.postedAt + "T00:00:00+09:00"),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tier1.map((d) => ({
      url: `${base}/overseas/${d.slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
