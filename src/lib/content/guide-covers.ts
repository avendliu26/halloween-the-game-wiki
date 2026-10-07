import type { GuideFrontmatter } from "./guide-source.ts";

export const guideFallbackCovers = {
  troubleshooting: "/images/brand/guide-troubleshooting.webp",
  gameplay: "/images/brand/guide-gameplay.webp",
  police: "/images/brand/guide-police.webp",
  default: "/images/brand/guide-default.webp"
} as const;

const hasAnyTag = (tags: string[], candidates: string[]): boolean =>
  tags.some((tag) => candidates.includes(tag.toLowerCase()));

/** Returns an explicit guide image when present, otherwise a branded category cover. */
export const resolveGuideCover = (frontmatter: Pick<GuideFrontmatter, "image" | "tags">): string => {
  if (frontmatter.image) {
    return frontmatter.image;
  }

  if (hasAnyTag(frontmatter.tags, ["troubleshooting"])) {
    return guideFallbackCovers.troubleshooting;
  }

  if (hasAnyTag(frontmatter.tags, ["police"])) {
    return guideFallbackCovers.police;
  }

  if (hasAnyTag(frontmatter.tags, ["skill-checks", "gameplay"])) {
    return guideFallbackCovers.gameplay;
  }

  return guideFallbackCovers.default;
};
