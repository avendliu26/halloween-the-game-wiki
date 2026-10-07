import { render, screen } from "@testing-library/react";
import { createElement, type ComponentType } from "react";
import { describe, expect, it } from "vitest";
import { CategoryCard } from "@/components/cards/category-card";
import { EntityCard } from "@/components/cards/entity-card";
import { GuideCard } from "@/components/cards/guide-card";
import { fixtureCategoryDefinition, fixtureEntity } from "@/test/fixtures/content";
import type { CategoryDefinition, CategorySlug } from "@/lib/content/types";

describe("Wiki preview cards", () => {
  it("omits missing card fields instead of rendering undefined and uses the display category label", () => {
    render(<EntityCard category={{ ...fixtureCategoryDefinition("locations"), label: "Maps", cardFields: ["rarity", "type"] }} entity={fixtureEntity({ category: "locations", infobox: { type: "Launch map" } })} />);
    expect(screen.queryByText("undefined")).not.toBeInTheDocument();
    expect(screen.queryByText("Rarity")).not.toBeInTheDocument();
    expect(screen.getByText("Launch map")).toBeVisible();
    expect(screen.getByText("Maps")).toBeVisible();
  });
  it("uses a fixture-supplied renamed category label without changing its route or count", () => {
    const FixtureCategoryCard = CategoryCard as ComponentType<{
      category: CategorySlug;
      count: number;
      definition?: CategoryDefinition;
    }>;
    render(
      createElement(FixtureCategoryCard, {
        category: "weapons",
        count: 3,
        definition: { ...fixtureCategoryDefinition(), label: "Arms" }
      })
    );

    expect(screen.getByRole("link", { name: /browse arms/i })).toHaveAttribute("href", "/weapons");
    expect(screen.getByText("3 entries")).toBeVisible();
  });

  it("renders an entity detail link and local image", () => {
    const category = fixtureCategoryDefinition();

    render(
      <EntityCard
        category={category}
        entity={{
          id: "training-sword",
          slug: "training-sword",
          name: "Training Sword",
          category: "weapons",
          image: "/images/placeholders/entity.svg",
          imageAlt: "Abstract demo blade",
          summary: "A fictional weapon.",
          tags: ["sword"],
          infobox: {},
          sections: [],
          related: []
        }}
      />
    );

    expect(screen.getByRole("link", { name: /training sword/i })).toHaveAttribute("href", "/weapons/training-sword");
    expect(screen.getByRole("img")).toHaveAttribute("src", "/images/placeholders/entity.svg");
  });

  it("renders compact metadata from the supplied category cardFields", () => {
    const baseCategory = fixtureCategoryDefinition();
    const entity = {
      id: "glass-sabre",
      slug: "glass-sabre",
      name: "Glass Sabre",
      category: "weapons" as const,
      image: "/images/placeholders/entity.svg",
      imageAlt: "Abstract glass sabre",
      summary: "A fictional weapon.",
      tags: ["sword"],
      infobox: { type: "Blade", rarity: "Mythic", location: "Old Causeway" },
      sections: [],
      related: []
    };
    const { rerender } = render(
      <EntityCard category={{ ...baseCategory, cardFields: ["rarity"] }} entity={entity} />
    );

    expect(screen.getByText("Mythic")).toBeVisible();
    expect(screen.queryByText("Blade")).not.toBeInTheDocument();
    expect(screen.queryByText("Old Causeway")).not.toBeInTheDocument();

    rerender(<EntityCard category={{ ...baseCategory, cardFields: ["location"] }} entity={entity} />);

    expect(screen.getByText("Old Causeway")).toBeVisible();
    expect(screen.queryByText("Mythic")).not.toBeInTheDocument();
  });

  it("shows a guide's formatted update date and tags", () => {
    render(
      <GuideCard
        guide={{
          slug: "field-notes",
          body: "",
          frontmatter: {
            slug: "field-notes",
            title: "Field Notes",
            description: "Start safely.",
            updatedAt: "2026-09-01",
            tags: ["beginner", "combat"],
            related: []
          }
        }}
      />
    );

    expect(screen.getByRole("link", { name: /field notes/i })).toHaveAttribute("href", "/guides/field-notes");
    expect(screen.getByText("Updated Sep 1, 2026")).toBeVisible();
    expect(screen.getByText("combat")).toBeVisible();
  });
});
