import type { MetadataRoute } from "next";
import { categoryDefinitions } from "@/config/categories";
import { gameConfig } from "@/config/game";
import { getAllGuides } from "@/lib/content/guides";
import { getAllEntities } from "@/lib/content/queries";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!gameConfig.siteUrl) {
    return [];
  }

  const toUrl = (pathname: string) => new URL(pathname, gameConfig.siteUrl).toString();

  return [
    { url: toUrl("/") },
    { url: toUrl("/game-info") },
    { url: toUrl("/guides") },
    { url: toUrl("/privacy-policy") },
    { url: toUrl("/terms-of-service") },
    ...getAllGuides().map((guide) => ({
      url: toUrl(`/guides/${guide.slug}`),
      lastModified: guide.frontmatter.updatedAt
    })),
    ...categoryDefinitions.map((category) => ({ url: toUrl(`/${category.slug}`) })),
    ...getAllEntities().map((entity) => ({
      url: toUrl(`/${entity.category}/${entity.slug}`),
      ...(entity.updatedAt ? { lastModified: entity.updatedAt } : {})
    }))
  ];
}
