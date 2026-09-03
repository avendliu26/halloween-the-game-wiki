import type { CategoryDefinition, CategorySlug, WikiEntity } from "@/lib/content/types";
import type { GuideRecord } from "@/lib/content/guides";

export const fixtureEntity = (overrides: Partial<WikiEntity> = {}): WikiEntity => ({
  id: "training-sword",
  slug: "training-sword",
  name: "Training Sword",
  category: "weapons",
  image: "/images/placeholders/entity.svg",
  imageAlt: "A neutral practice sword",
  summary: "A dependable item for exercising content queries.",
  tags: ["practice"],
  updatedAt: "2026-09-01",
  featured: false,
  related: [],
  infobox: { type: "Blade", rarity: "Common" },
  sections: [{ id: "overview", title: "Overview", type: "prose", body: "Fixture content." }],
  ...overrides
});

export const fixtureGuide: GuideRecord = {
  slug: "field-notes",
  frontmatter: {
    slug: "field-notes",
    title: "Field Notes",
    description: "Neutral guide content for tests.",
    updatedAt: "2026-09-01",
    tags: ["practice"],
    related: []
  },
  body: "## Preparation\nFixture guide body."
};

export const fixtureRegistry = (): Record<CategorySlug, WikiEntity[]> => ({
  weapons: [
    fixtureEntity({ id: "featured-weapon", slug: "featured-weapon", name: "Featured Weapon", featured: true }),
    fixtureEntity({ id: "fallback-weapon", slug: "fallback-weapon", name: "Fallback Weapon" })
  ],
  bosses: [
    fixtureEntity({ id: "training-boss", slug: "training-boss", name: "Training Boss", category: "bosses" }),
    fixtureEntity({ id: "featured-boss", slug: "featured-boss", name: "Featured Boss", category: "bosses", featured: true })
  ],
  skills: [fixtureEntity({ id: "training-skill", slug: "training-skill", name: "Training Skill", category: "skills" })],
  items: [fixtureEntity({ id: "training-item", slug: "training-item", name: "Training Item", category: "items" })],
  characters: [fixtureEntity({ id: "training-character", slug: "training-character", name: "Training Character", category: "characters" })],
  locations: [fixtureEntity({ id: "training-location", slug: "training-location", name: "Training Location", category: "locations" })],
  quests: [fixtureEntity({ id: "training-quest", slug: "training-quest", name: "Training Quest", category: "quests" })]
});

export const fixtureCategoryDefinition = (slug: CategorySlug = "weapons"): CategoryDefinition => ({
  slug,
  label: slug === "weapons" ? "Weapons" : "Entries",
  singularLabel: slug === "weapons" ? "Weapon" : "Entry",
  description: "Neutral category description.",
  glyph: "FX",
  cardFields: ["type", "rarity"],
  infoboxFields: [{ key: "name", label: "Name" }],
  supportedSectionIds: ["overview"]
});
