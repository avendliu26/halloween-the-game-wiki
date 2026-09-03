import { validateEntityCollection } from "./entity-validation.ts";
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
  type CategorySlug,
  type WikiEntity
} from "@/lib/content/types";

export { validateEntityCollection } from "./entity-validation.ts";

const sourceRegistry: Record<CategorySlug, unknown> = {
  weapons: weaponsSource,
  bosses: bossesSource,
  skills: skillsSource,
  items: itemsSource,
  characters: charactersSource,
  locations: locationsSource,
  quests: questsSource
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
