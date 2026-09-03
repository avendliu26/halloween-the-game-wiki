import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const configFixture = vi.hoisted(() => ({
  siteUrl: undefined as string | undefined,
  navigation: [
    { id: "home", label: "Home", href: "/" },
    { id: "guides", label: "Guides", href: "/guides" },
    {
      id: "database",
      label: "Database",
      href: "/weapons",
      children: [
        { id: "weapons", label: "Weapons", href: "/weapons" },
        { id: "bosses", label: "Bosses", href: "/bosses" },
        { id: "skills", label: "Skills", href: "/skills" },
        { id: "items", label: "Items", href: "/items" },
        { id: "characters", label: "Characters", href: "/characters" },
        { id: "locations", label: "Locations", href: "/locations" },
        { id: "quests", label: "Quests", href: "/quests" }
      ]
    },
    { id: "game-info", label: "Game Info", href: "/game-info" }
  ]
}));

const guideFixture = vi.hoisted(() => ({
  slug: "field-notes",
  frontmatter: {
    slug: "field-notes",
    title: "Field Notes",
    description: "Neutral guide content for a page test.",
    updatedAt: "2026-09-01",
    publishedAt: "2026-08-28",
    author: "Template Author",
    image: "/images/placeholders/entity.svg",
    imageAlt: "A neutral guide illustration",
    tags: ["practice"],
    related: [{ kind: "guide", slug: "field-notes" }]
  },
  body: "## Preparation\nFixture guide body."
}));

vi.mock("@/config/game", () => ({ gameConfig: configFixture }));

vi.mock("@/lib/content/guides", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content/guides")>();
  return { ...actual, getGuide: (slug: string) => slug === guideFixture.slug ? guideFixture : undefined };
});

import GuidePage, { generateMetadata } from "./page";

describe("GuidePage", () => {
  it("omits absolute metadata URLs when the fixture has no site URL", async () => {
    configFixture.siteUrl = undefined;
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "field-notes" }) });

    expect(metadata.openGraph).toMatchObject({ type: "article" });
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.openGraph?.url).toBeUndefined();
  });

  it("feeds the configured guide image into metadata when the fixture has a site URL", async () => {
    configFixture.siteUrl = "https://test-game.example";

    await expect(generateMetadata({ params: Promise.resolve({ slug: "field-notes" }) })).resolves.toMatchObject({
      authors: [{ name: "Template Author" }],
      openGraph: {
        type: "article",
        publishedTime: "2026-08-28",
        modifiedTime: "2026-09-01",
        authors: ["Template Author"],
        images: [{ url: "https://test-game.example/images/placeholders/entity.svg" }]
      }
    });
  });

  it("renders the optional guide image and complete Article JSON-LD", async () => {
    configFixture.siteUrl = "https://test-game.example";
    const page = await GuidePage({ params: Promise.resolve({ slug: "field-notes" }) });
    const { container } = render(page);
    const jsonLd = [...container.querySelectorAll('script[type="application/ld+json"]')]
      .map((script) => JSON.parse(script.textContent ?? "{}") as Record<string, unknown>)
      .find((entry) => entry["@type"] === "Article");

    expect(
      screen.getByRole("img", { name: "A neutral guide illustration" })
    ).toHaveAttribute("src", "/images/placeholders/entity.svg");
    expect(jsonLd).toMatchObject({
      headline: "Field Notes",
      datePublished: "2026-08-28",
      dateModified: "2026-09-01",
      author: { "@type": "Person", name: "Template Author" },
      image: "https://test-game.example/images/placeholders/entity.svg"
    });
    expect(screen.getByRole("heading", { name: "Related Content" })).toBeVisible();
  });
});
