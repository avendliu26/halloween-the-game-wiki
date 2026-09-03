import type { MetadataRoute } from "next";
import { gameConfig } from "@/config/game";

export default function robots(): MetadataRoute.Robots {
  const sitemap = gameConfig.siteUrl ? new URL("/sitemap.xml", gameConfig.siteUrl).toString() : undefined;

  return {
    rules: { userAgent: "*", allow: "/" },
    ...(sitemap ? { sitemap } : {})
  };
}
