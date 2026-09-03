import { z } from "zod";
import { type CategoryDefinition, type CategorySlug, type WikiEntity, WikiEntitySchema } from "./types.ts";

const EntityCollectionSchema = z.array(WikiEntitySchema);

export const validateEntityCollection = (
  category: CategorySlug,
  source: unknown,
  definition: CategoryDefinition
): WikiEntity[] => {
  const result = EntityCollectionSchema.safeParse(source);

  if (!result.success) {
    throw new Error(`Invalid content source for category "${category}": ${result.error.message}`);
  }

  const mismatchedEntity = result.data.find((entity) => entity.category !== category);

  if (mismatchedEntity) {
    throw new Error(`Invalid content source for category "${category}": entity "${mismatchedEntity.slug}" has category "${mismatchedEntity.category}"`);
  }

  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const entity of result.data) {
    if (ids.has(entity.id)) {
      throw new Error(`Invalid content source for category "${category}": duplicate entity id "${entity.id}"`);
    }
    ids.add(entity.id);

    if (slugs.has(entity.slug)) {
      throw new Error(`Invalid content source for category "${category}": duplicate entity slug "${entity.slug}"`);
    }
    slugs.add(entity.slug);

    const sectionIds = new Set<string>();

    for (const section of entity.sections) {
      if (sectionIds.has(section.id)) {
        throw new Error(
          `Invalid content source for category "${category}": entity "${entity.slug}" has duplicate section id "${section.id}"`
        );
      }
      sectionIds.add(section.id);

      if (!definition.supportedSectionIds.includes(section.id)) {
        throw new Error(
          `Invalid content source for category "${category}": entity "${entity.slug}" has unsupported section "${section.id}"`
        );
      }
    }
  }

  return result.data;
};
