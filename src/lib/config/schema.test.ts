import { describe, expect, it } from "vitest";
import { createGameConfig } from "@/lib/config/schema";
import { fixtureGameConfig } from "@/test/fixtures/game";
import * as categoriesModule from "@/config/categories";

const editorialContent = {
  guideIndexDescription: "Field-tested routes through the Lanterned Vale.",
  gameInfoDemoNotice: {
    title: "Original demo world",
    body: "The Lanterned Vale is fictional content for this reusable template."
  },
  footerDisclaimer: "The Lanterned Vale is an original fictional demonstration.",
  homepage: {
    startHereEyebrow: "New to the vale?",
    primaryAction: {
      label: "Read the Pathfinder Guide",
      reference: { kind: "guide" as const, slug: "pathfinder-guide" }
    },
    secondaryAction: {
      label: "Browse skills",
      reference: { kind: "category" as const, category: "skills" as const }
    },
    startHereLinks: [
      {
        label: "Pathfinder Guide",
        description: "Prepare for the first crossing.",
        reference: { kind: "guide" as const, slug: "pathfinder-guide" }
      }
    ],
    databaseAction: {
      label: "Browse the skill archive",
      reference: { kind: "category" as const, category: "skills" as const }
    },
    popularQuestions: [
      {
        label: "When should I use Glass Step?",
        reference: {
          kind: "guide" as const,
          slug: "pathfinder-guide",
          anchor: "glass-step-timing"
        }
      }
    ]
  }
};

const validConfig = { ...fixtureGameConfig, content: editorialContent };

describe("createGameConfig", () => {
  it("accepts a complete reusable game configuration", () => {
    const config = createGameConfig(validConfig);

    expect(config.wikiName).toBe("Template Game Wiki");
    expect(config.content.homepage.primaryAction.reference).toEqual({
      kind: "guide",
      slug: "pathfinder-guide"
    });
  });

  it("requires unique stable IDs across the navigation tree", () => {
    expect(() => createGameConfig({ ...validConfig, navigation: [{ label: "Home", href: "/" }] })).toThrow(/id/i);
    expect(() => createGameConfig({ ...validConfig, navigation: [
      { id: "home", label: "Home", href: "/" },
      { id: "home", label: "Guides", href: "/guides" }
    ] })).toThrow(/duplicate navigation id/i);
  });

  it("keeps category labels available when the database display label changes", () => {
    const createCategoryDefinitions = (categoriesModule as typeof categoriesModule & {
      createCategoryDefinitions?: (navigation: typeof fixtureGameConfig.navigation) => unknown;
    }).createCategoryDefinitions;
    const navigation = fixtureGameConfig.navigation.map((item) =>
      item.id === "database" ? { ...item, label: "Wiki Archive" } : item
    );
    const categoryDefinitions = createCategoryDefinitions?.(navigation);

    expect((categoryDefinitions as { slug: string; label: string }[] | undefined)?.find((category) => category.slug === "weapons")?.label)
      .toBe("Weapons");
  });

  it.each([
    "https://cdn.example/logo.png",
    "//cdn.example/logo.png",
    "/images/../secret.png",
    "/images/%2e%2e/secret.png",
    "/images/https://cdn.example/logo.png",
    "/images/logo.svg?version=2",
    "/images/logo.svg#mark"
  ])("rejects unsafe local image path %s", (logoPath) => {
    expect(() => createGameConfig({ ...validConfig, logoPath })).toThrow();
  });

  it.each([
    "not-a-url",
    "javascript:alert(1)",
    "ftp://files.example/game",
    "https://user:secret@example.com/game"
  ])("rejects unsafe official/site/Steam URL %s", (url) => {
    expect(() => createGameConfig({ ...validConfig, officialWebsite: url })).toThrow();
    expect(() => createGameConfig({ ...validConfig, siteUrl: url })).toThrow();
    expect(() => createGameConfig({ ...validConfig, steamUrl: url })).toThrow();
  });

  it("accepts credential-free HTTP and HTTPS URLs", () => {
    expect(
      createGameConfig({
        ...validConfig,
        officialWebsite: "https://example.com/game",
        siteUrl: "https://wiki.example.com",
        steamUrl: "http://store.example.com/game"
      })
    ).toMatchObject({
      officialWebsite: "https://example.com/game",
      siteUrl: "https://wiki.example.com",
      steamUrl: "http://store.example.com/game"
    });
  });

  it.each(["2026-9-01", "2026-02-30", "September 1, 2026", "2026-09-01T12:00:00Z"])(
    "rejects non-ISO release date %s",
    (releaseDate) => {
      expect(() => createGameConfig({ ...validConfig, releaseDate })).toThrow();
    }
  );

  it("rejects invalid slugs in configured internal references", () => {
    expect(() =>
      createGameConfig({
        ...validConfig,
        content: {
          ...editorialContent,
          homepage: {
            ...editorialContent.homepage,
            primaryAction: {
              label: "Broken",
              reference: { kind: "guide", slug: "Broken Guide" }
            }
          }
        }
      })
    ).toThrow();
  });

  it("allows real-game configurations to omit demo notices and disclaimers", () => {
    const config = createGameConfig({
      ...validConfig,
      content: {
        ...editorialContent,
        gameInfoDemoNotice: undefined,
        footerDisclaimer: undefined
      }
    });

    expect(config.content.gameInfoDemoNotice).toBeUndefined();
    expect(config.content.footerDisclaimer).toBeUndefined();
  });
});
