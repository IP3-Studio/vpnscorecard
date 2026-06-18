import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/load";

const BASE = "https://www.vpnscorecard.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/recommend", "/compare", "/methodology", "/about", "/disclaimer"];
  const pages = staticPages.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.6,
  }));
  const vpns = getAllSlugs().map((slug) => ({
    url: `${BASE}/vpn/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...pages, ...vpns];
}
