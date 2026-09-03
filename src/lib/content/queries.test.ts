import { describe, expect, it } from "vitest";
import { isCategorySlug } from "@/config/categories";
import * as queryModule from "@/lib/content/queries";
import { validateEntityCollection } from "@/lib/content/registry";
import { categorySlugs, ContentReferenceSchema, WikiEntitySchema, WikiSectionSchema } from "@/lib/content/types";
import { fixtureCategoryDefinition, fixtureEntity, fixtureGuide, fixtureRegistry } from "@/test/fixtures/content";

describe("entity content queries", () => {
  const createContentQueries = (queryModule as typeof queryModule & {
    createContentQueries?: (input: {
      entityRegistry: ReturnType<typeof fixtureRegistry>;
      getGuide: (slug: string) => typeof fixtureGuide | undefined;
    }) => {
      getCategoryEntries: (category: "weapons" | "bosses" | "skills" | "items" | "characters" | "locations" | "quests") => ReturnType<typeof fixtureRegistry>["weapons"];
      getEntity: (category: "weapons" | "bosses" | "skills" | "items" | "characters" | "locations" | "quests", slug: string) => ReturnType<typeof fixtureRegistry>["weapons"][number] | undefined;
      getFeaturedEntities: (limit: number) => ReturnType<typeof fixtureRegistry>["weapons"];
      resolveEntityReferences: (references: Parameters<typeof queryModule.resolveEntityReferences>[0]) => ReturnType<typeof fixtureRegistry>["weapons"];
      resolveContentReferences: (references: Parameters<typeof queryModule.resolveContentReferences>[0]) => ReturnType<typeof queryModule.resolveContentReferences>;
    };
  }).createContentQueries;
  const registry = fixtureRegistry();
  const queries = createContentQueries?.({
    entityRegistry: registry,
    getGuide: (slug) => (slug === fixtureGuide.slug ? fixtureGuide : undefined)
  });
  const weaponDefinition = fixtureCategoryDefinition();
  const fixtureWeapon = fixtureEntity();
  it("registers exactly the seven initial database categories", () => {
    expect(categorySlugs).toEqual([
      "weapons",
      "bosses",
      "skills",
      "items",
      "characters",
      "locations",
      "quests"
    ]);
    expect(isCategorySlug("maps")).toBe(false);
  });

  it("loads the required weapon detail route from validated JSON", () => {
    const weapon = queries?.getEntity("weapons", "featured-weapon");
    expect(weapon?.name).toBe("Featured Weapon");
    expect(weapon?.category).toBe("weapons");
  });

  it("returns category entries without leaking entries from another category", () => {
    expect(queries?.getCategoryEntries("bosses").every((item) => item.category === "bosses")).toBe(true);
  });

  it("returns a bounded featured set with deterministic fallback entries", () => {
    expect(queries?.getFeaturedEntities(4)).toHaveLength(4);
    expect(queries?.getFeaturedEntities(4).every((item) => item.featured || item.slug.length > 0)).toBe(true);
  });

  it("keeps featured registry order before appending non-featured fallbacks", () => {
    expect(queries?.getFeaturedEntities(4).map((item) => item.slug)).toEqual([
      "featured-weapon",
      "featured-boss",
      "fallback-weapon",
      "training-boss"
    ]);
  });

  it("resolves known entity references and skips missing references", () => {
    const result = queries?.resolveEntityReferences([
      { kind: "entity", category: "locations", slug: "training-location" },
      { kind: "entity", category: "locations", slug: "missing-place" }
    ]);
    expect(result?.map((item) => item.slug)).toEqual(["training-location"]);
  });

  it("resolves entities and guides into ordered presentation records", () => {
    const result = queries?.resolveContentReferences([
      { kind: "guide", slug: "field-notes" },
      { kind: "entity", category: "weapons", slug: "featured-weapon" },
      { kind: "guide", slug: "missing-guide" }
    ]);

    expect(result).toEqual([
      {
        kind: "guide",
        slug: "field-notes",
        title: "Field Notes",
        summary: "Neutral guide content for tests.",
        href: "/guides/field-notes",
        image: undefined
      },
      {
        kind: "entity",
        slug: "featured-weapon",
        title: "Featured Weapon",
        summary: "A dependable item for exercising content queries.",
        href: "/weapons/featured-weapon",
        image: "/images/placeholders/entity.svg"
      }
    ]);
  });

  it("rejects unknown top-level and nested source fields", () => {
    const unknownTopLevel = WikiEntitySchema.safeParse({ ...fixtureWeapon, feautred: true });
    const unknownNested = WikiEntitySchema.safeParse({
      ...fixtureWeapon,
      sections: [{ ...fixtureWeapon.sections[0], unexpected: "typo" }, ...fixtureWeapon.sections.slice(1)]
    });

    expect(unknownTopLevel.success).toBe(false);
    expect(unknownNested.success).toBe(false);
  });

  it.each([
    { id: "overview", title: "Overview", type: "prose", body: "Text", items: ["Wrong payload"] },
    { id: "tips", title: "Tips", type: "list", items: ["Text"], stats: [{ label: "Wrong", value: "1" }] },
    { id: "stats", title: "Stats", type: "stats", stats: [{ label: "Power", value: "12" }], body: "Wrong payload" },
    { id: "overview", title: "Overview", type: "prose" },
    { id: "tips", title: "Tips", type: "list" },
    { id: "stats", title: "Stats", type: "stats" }
  ])("rejects missing or irrelevant discriminated section payloads", (section) => {
    expect(WikiSectionSchema.safeParse(section).success).toBe(false);
  });

  it.each([
    { ...fixtureEntity(), slug: "Training Sword" },
    { ...fixtureEntity(), slug: "training_sword" },
    { ...fixtureEntity(), slug: "-training-sword" },
    { ...fixtureEntity(), slug: "training-sword-" }
  ])("rejects invalid entity slug $slug", (entity) => {
    expect(WikiEntitySchema.safeParse(entity).success).toBe(false);
  });

  it.each(["2026-9-01", "2026-02-30", "2026-09-01T12:00:00Z"])(
    "rejects invalid entity update date %s",
    (updatedAt) => {
      expect(
        WikiEntitySchema.safeParse({ ...fixtureEntity(), updatedAt }).success
      ).toBe(false);
    }
  );

  it.each([
    "https://cdn.example/entity.png",
    "//cdn.example/entity.png",
    "/images/../entity.png",
    "/images/%2e%2e/entity.png",
    "/images/https://cdn.example/entity.png",
    "/images/entity.png?large=true",
    "/images/entity.png#preview"
  ])("rejects unsafe entity image path %s", (image) => {
    expect(WikiEntitySchema.safeParse({ ...fixtureEntity(), image }).success).toBe(false);
  });

  it("rejects invalid entity and guide reference slugs", () => {
    expect(
      ContentReferenceSchema.safeParse({ kind: "entity", category: "weapons", slug: "Training Sword" }).success
    ).toBe(false);
    expect(ContentReferenceSchema.safeParse({ kind: "guide", slug: "Beginner_Guide" }).success).toBe(false);
  });

  it.each([
    [{ kind: "category" as const, category: "skills" as const }, "/skills"],
    [
      { kind: "entity" as const, category: "weapons" as const, slug: "glass-sabre" },
      "/weapons/glass-sabre"
    ],
    [
      { kind: "guide" as const, slug: "pathfinder-guide", anchor: "glass-step-timing" },
      "/guides/pathfinder-guide#glass-step-timing"
    ]
  ])("resolves configured internal reference %# through one helper", (reference, expectedHref) => {
    const resolveInternalHref = (
      queryModule as typeof queryModule & {
        resolveInternalHref?: (input: typeof reference) => string;
      }
    ).resolveInternalHref;

    expect(resolveInternalHref?.(reference)).toBe(expectedHref);
  });

  it("rejects duplicate entity IDs within a category", () => {
    const entity = fixtureEntity();
    const duplicateId = { ...entity, slug: "second-blade" };

    expect(() => validateEntityCollection("weapons", [entity, duplicateId], weaponDefinition)).toThrow(
      /duplicate entity id/i
    );
  });

  it("rejects duplicate entity slugs within a category", () => {
    const entity = fixtureEntity();
    const duplicateSlug = { ...entity, id: "second-blade" };

    expect(() => validateEntityCollection("weapons", [entity, duplicateSlug], weaponDefinition)).toThrow(
      /duplicate entity slug/i
    );
  });

  it("rejects entity sections unsupported by the category registry", () => {
    const entity = fixtureEntity();
    const unsupported = {
      ...entity,
      sections: [
        ...entity.sections,
        { id: "developer-notes", title: "Developer Notes", type: "prose" as const, body: "Not registered." }
      ]
    };

    expect(() => validateEntityCollection("weapons", [unsupported], weaponDefinition)).toThrow(
      /unsupported section.*developer-notes/i
    );
  });

  it("rejects duplicate section IDs within an entity", () => {
    const entity = fixtureEntity();
    const duplicateSection = { ...entity, sections: [...entity.sections, entity.sections[0]] };

    expect(() => validateEntityCollection("weapons", [duplicateSection], weaponDefinition)).toThrow(
      /duplicate section id.*overview/i
    );
  });
});
