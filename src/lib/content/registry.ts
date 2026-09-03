import { z } from "zod";
import bossesSource from "@/data/bosses.json";
import charactersSource from "@/data/characters.json";
import itemsSource from "@/data/items.json";
import locationsSource from "@/data/locations.json";
import questsSource from "@/data/quests.json";
import skillsSource from "@/data/skills.json";
import weaponsSource from "@/data/weapons.json";
import { categoryDefinitions } from "@/config/categories";
import {
  categorySlugs,
  type CategoryDefinition,
  type CategorySlug,
  type WikiEntity,
  WikiEntitySchema
} from "@/lib/content/types";

const sourceRegistry: Record<CategorySlug, unknown> = {
  weapons: weaponsSource,
  bosses: bossesSource,
  skills: skillsSource,
  items: itemsSource,
  characters: charactersSource,
  locations: locationsSource,
  quests: questsSource
};

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

export const entityRegistry: Record<CategorySlug, WikiEntity[]> = Object.fromEntries(
  categorySlugs.map((category) => {
    const definition = categoryDefinitions.find((candidate) => candidate.slug === category);

    if (!definition) {
      const source = sourceRegistry[category];
      if (!Array.isArray(source) || source.length !== 0) {
        throw new Error(`Hidden category "${category}" must have an empty content source`);
      }
      return [category, []];
    }

    return [category, validateEntityCollection(category, sourceRegistry[category], definition)];
  })
) as Record<CategorySlug, WikiEntity[]>;
