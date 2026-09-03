import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WikiDetailLayout } from "@/components/wiki/wiki-detail-layout";
import { fixtureCategoryDefinition, fixtureEntity } from "@/test/fixtures/content";

describe("WikiDetailLayout", () => {
  it("renders ordered infobox fields and structured sections", () => {
    const entity = fixtureEntity({
      name: "Training Sword",
      sections: [
        { id: "overview", title: "Overview", type: "prose", body: "Fixture content." },
        { id: "how-to-obtain", title: "How to Obtain", type: "prose", body: "Fixture content." }
      ]
    });
    const category = { ...fixtureCategoryDefinition(), infoboxFields: [{ key: "rarity", label: "Rarity" }] };

    render(<WikiDetailLayout category={category} entity={entity} related={[]} />);

    expect(screen.getByRole("heading", { level: 1, name: "Training Sword" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "How to Obtain" })).toBeVisible();
    expect(screen.getByRole("link", { name: "How to Obtain" })).toHaveAttribute("href", "#section-how-to-obtain");
    expect(screen.getByText("Rarity")).toBeVisible();
  });

  it("does not render labels for null infobox values", () => {
    const entity = {
      ...fixtureEntity({ name: "Training Sword" }),
      infobox: { name: "Training Sword", rarity: null }
    };
    const category = { ...fixtureCategoryDefinition(), infoboxFields: [{ key: "rarity", label: "Rarity" }] };

    render(<WikiDetailLayout category={category} entity={entity} related={[]} />);

    expect(screen.queryByText("Rarity")).not.toBeInTheDocument();
  });
});
