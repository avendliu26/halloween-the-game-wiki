import { gameConfig } from "@/config/game";
import type { NavigationItem } from "@/lib/config/schema";
import { type CategoryDefinition, type CategorySlug } from "@/lib/content/types";

export const createCategoryDefinitions = (navigation: readonly NavigationItem[]): readonly CategoryDefinition[] => {
  const databaseNavigation = navigation.find((item) => item.id === "database");

  const labelFor = (slug: CategorySlug): string => {
    const label = databaseNavigation?.children?.find((item) => item.id === slug)?.label;

    return label ?? slug;
  };

  const definitions: CategoryDefinition[] = [
  {
    slug: "weapons",
    label: labelFor("weapons"),
    singularLabel: "Weapon",
    description: "Browse weapons discovered throughout the game world.",
    glyph: "WP",
    cardFields: ["type", "rarity", "requirement"],
    infoboxFields: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "requirement", label: "Requirement" },
      { key: "effect", label: "Effect" },
      { key: "rarity", label: "Rarity" }
    ],
    supportedSectionIds: ["overview", "how-to-obtain", "stats", "abilities-effects", "usage-strategy", "tips", "related-content"]
  },
  {
    slug: "bosses",
    label: labelFor("bosses"),
    singularLabel: "Boss",
    description: "Explore bosses, encounters, and combat information.",
    glyph: "BS",
    cardFields: ["location", "type", "rarity"],
    infoboxFields: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "location", label: "Location" },
      { key: "effect", label: "Effect" },
      { key: "rarity", label: "Rarity" }
    ],
    supportedSectionIds: ["overview", "stats", "abilities-effects", "usage-strategy", "tips", "related-content"]
  },
  {
    slug: "skills",
    label: labelFor("skills"),
    singularLabel: "Skill",
    description: "Review combat skills, effects, and upgrade details.",
    glyph: "SK",
    cardFields: ["type", "effect", "requirement"],
    infoboxFields: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "requirement", label: "Requirement" },
      { key: "effect", label: "Effect" },
      { key: "rarity", label: "Rarity" }
    ],
    supportedSectionIds: ["overview", "stats", "abilities-effects", "usage-strategy", "tips", "related-content"]
  },
  {
    slug: "items",
    label: labelFor("items"),
    singularLabel: "Item",
    description: "Find items, consumables, materials, and useful equipment.",
    glyph: "IT",
    cardFields: ["type", "effect", "rarity"],
    infoboxFields: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "effect", label: "Effect" },
      { key: "rarity", label: "Rarity" }
    ],
    supportedSectionIds: ["overview", "how-to-obtain", "usage-strategy", "tips", "related-content"]
  },
  {
    slug: "characters",
    label: labelFor("characters"),
    singularLabel: "Character",
    description: "Meet Michael Myers, ten Standard Edition Civilians and two Deluxe additions. Explore the confirmed roster, NPC distinctions and playable roles.",
    glyph: "CH",
    cardFields: ["location", "type", "effect"],
    infoboxFields: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "location", label: "Location" },
      { key: "effect", label: "Effect" }
    ],
    supportedSectionIds: ["overview", "abilities-effects", "tips", "related-content"]
  },
  {
    slug: "locations",
    label: labelFor("locations"),
    singularLabel: "Map",
    description: "Four launch maps confirmed by the official September 1 announcement. Explore Haddonfield landmarks; detailed routes and objectives await launch.",
    glyph: "MP",
    cardFields: ["type", "location", "rarity"],
    infoboxFields: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "location", label: "Location" },
      { key: "effect", label: "Effect" },
      { key: "rarity", label: "Rarity" }
    ],
    supportedSectionIds: ["overview", "how-to-obtain", "usage-strategy", "tips", "related-content"]
  },
  {
    slug: "quests",
    label: labelFor("quests"),
    singularLabel: "Quest",
    description: "Track quests, objectives, rewards, and completion requirements.",
    glyph: "QU",
    cardFields: ["location", "requirement", "effect"],
    infoboxFields: [
      { key: "name", label: "Name" },
      { key: "location", label: "Location" },
      { key: "requirement", label: "Requirement" },
      { key: "effect", label: "Effect" },
      { key: "rarity", label: "Rarity" }
    ],
    supportedSectionIds: ["overview", "how-to-obtain", "usage-strategy", "tips", "related-content"]
  }
  ];
  return definitions.filter((definition) =>
    databaseNavigation?.children?.some((item) => item.id === definition.slug)
  );
};

export const categoryDefinitions = createCategoryDefinitions(gameConfig.navigation);

export const isCategorySlug = (value: string): value is CategorySlug =>
  categoryDefinitions.some((definition) => definition.slug === value);
