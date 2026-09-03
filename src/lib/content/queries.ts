import { entityRegistry } from "@/lib/content/registry";
import { getGuide, type GuideRecord } from "@/lib/content/guides";
import {
  categorySlugs,
  type CategorySlug,
  type ContentReference,
  type InternalReference,
  type WikiEntity
} from "@/lib/content/types";

type ResolvedContentBase = {
  slug: string;
  title: string;
  summary: string;
  href: string;
};

export type ResolvedContent =
  | (ResolvedContentBase & { kind: "entity"; image: string })
  | (ResolvedContentBase & { kind: "guide"; image: undefined });

export const resolveInternalHref = (reference: InternalReference): string => {
  const pathname =
    reference.kind === "category"
      ? `/${reference.category}`
      : reference.kind === "entity"
        ? `/${reference.category}/${reference.slug}`
        : reference.kind === "page" ? `/${reference.slug}` : `/guides/${reference.slug}`;
  const anchor = reference.kind === "category" ? undefined : reference.anchor;

  return anchor ? `${pathname}#${anchor}` : pathname;
};

type ContentQueryDependencies = {
  entityRegistry: Record<CategorySlug, WikiEntity[]>;
  getGuide: (slug: string) => GuideRecord | undefined;
};

export const createContentQueries = ({ entityRegistry: registry, getGuide: findGuide }: ContentQueryDependencies) => {
  const getCategoryEntries = (category: CategorySlug): WikiEntity[] => registry[category];

  const getAllEntities = (): WikiEntity[] => categorySlugs.flatMap((category) => registry[category]);

  const getEntity = (category: CategorySlug, slug: string): WikiEntity | undefined =>
    getCategoryEntries(category).find((entity) => entity.slug === slug);

  const getFeaturedEntities = (limit: number): WikiEntity[] => {
    if (!Number.isFinite(limit) || limit <= 0) {
      return [];
    }

    const boundedLimit = Math.floor(limit);
    const allEntities = getAllEntities();
    const featured = allEntities.filter((entity) => entity.featured);

    if (featured.length >= boundedLimit) {
      return featured.slice(0, boundedLimit);
    }

    return [
      ...featured,
      ...allEntities.filter((entity) => !entity.featured).slice(0, boundedLimit - featured.length)
    ];
  };

  const resolveEntityReferences = (references: ContentReference[]): WikiEntity[] =>
    references.flatMap((reference) => {
      if (reference.kind !== "entity") {
        return [];
      }

      const entity = getEntity(reference.category, reference.slug);
      return entity ? [entity] : [];
    });

  const resolveContentReferences = (references: ContentReference[]): ResolvedContent[] =>
    references.flatMap<ResolvedContent>((reference) => {
      if (reference.kind === "entity") {
        const entity = getEntity(reference.category, reference.slug);

        return entity
          ? [
              {
                kind: "entity",
                slug: entity.slug,
                title: entity.name,
                summary: entity.summary,
                href: `/${entity.category}/${entity.slug}`,
                image: entity.image
              }
            ]
          : [];
      }

      const guide = findGuide(reference.slug);

      return guide
        ? [
            {
              kind: "guide",
              slug: guide.slug,
              title: guide.frontmatter.title,
              summary: guide.frontmatter.description,
              href: `/guides/${guide.slug}`,
              image: undefined
            }
          ]
        : [];
    });

  return {
    getCategoryEntries,
    getAllEntities,
    getEntity,
    getFeaturedEntities,
    resolveEntityReferences,
    resolveContentReferences
  };
};

const contentQueries = createContentQueries({ entityRegistry, getGuide });

export const getCategoryEntries = contentQueries.getCategoryEntries;
export const getAllEntities = contentQueries.getAllEntities;
export const getEntity = contentQueries.getEntity;
export const getFeaturedEntities = contentQueries.getFeaturedEntities;
export const resolveEntityReferences = contentQueries.resolveEntityReferences;
export const resolveContentReferences = contentQueries.resolveContentReferences;
