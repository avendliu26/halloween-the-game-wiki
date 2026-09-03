import { describe, expect, it } from "vitest";
import { categoryDefinitions } from "@/config/categories";
import { gameConfig } from "@/config/game";
import { getAllGuides } from "@/lib/content/guides";
import { getAllEntities, resolveContentReferences } from "@/lib/content/queries";
import type { InternalReference } from "@/lib/content/types";

const referenceExists = (reference: InternalReference): boolean => {
  if (reference.kind === "category") {
    return categoryDefinitions.some((category) => category.slug === reference.category);
  }

  if (reference.kind === "entity") {
    return getAllEntities().some(
      (entity) => entity.category === reference.category && entity.slug === reference.slug
    );
  }

  return getAllGuides().some((guide) => guide.slug === reference.slug);
};

describe("template content integrity", () => {
  it("has real content for every visible database entry point", () => {
    for (const category of categoryDefinitions) {
      expect(getAllEntities().some((entity) => entity.category === category.slug)).toBe(true);
    }
  });

  it("has unique slugs inside every content namespace", () => {
    const entityKeys = getAllEntities().map((entity) => `${entity.category}/${entity.slug}`);
    expect(new Set(entityKeys).size).toBe(entityKeys.length);

    const guideSlugs = getAllGuides().map((guide) => guide.slug);
    expect(new Set(guideSlugs).size).toBe(guideSlugs.length);
  });

  it("resolves every declared related-content reference", () => {
    for (const entity of getAllEntities()) {
      expect(resolveContentReferences(entity.related)).toHaveLength(entity.related.length);
    }

    for (const guide of getAllGuides()) {
      expect(resolveContentReferences(guide.frontmatter.related)).toHaveLength(guide.frontmatter.related.length);
    }
  });

  it("resolves every configured homepage destination", () => {
    const homepage = gameConfig.content.homepage;
    const references = [
      homepage.primaryAction.reference,
      homepage.secondaryAction.reference,
      ...(homepage.tertiaryAction ? [homepage.tertiaryAction.reference] : []),
      homepage.databaseAction.reference,
      ...homepage.startHereLinks.map((item) => item.reference),
      ...homepage.popularQuestions.map((item) => item.reference)
    ];

    for (const reference of references) {
      expect(referenceExists(reference), JSON.stringify(reference)).toBe(true);
    }
  });
});
