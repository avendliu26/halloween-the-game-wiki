import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryFilter } from "@/components/wiki/category-filter";
import { fixtureCategoryDefinition, fixtureEntity } from "@/test/fixtures/content";

const entries = [
  fixtureEntity({ id: "comet-spear", slug: "comet-spear", name: "Comet Spear", tags: ["reach"] }),
  fixtureEntity({ id: "training-sword", slug: "training-sword", name: "Training Sword", tags: ["practice"] })
];

describe("CategoryFilter", () => {
  it("filters by name and resets to all entries", () => {
    render(<CategoryFilter category="weapons" entries={entries} definition={fixtureCategoryDefinition()} />);

    fireEvent.change(screen.getByRole("searchbox", { name: /filter weapons/i }), { target: { value: "comet" } });

    expect(screen.getByText("Comet Spear")).toBeVisible();
    expect(screen.queryByText("Training Sword")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /reset filters/i }));

    expect(screen.getByText("Training Sword")).toBeVisible();
  });

  it("shows an explicit empty result", () => {
    render(<CategoryFilter category="weapons" entries={entries} definition={fixtureCategoryDefinition()} />);

    fireEvent.change(screen.getByRole("searchbox", { name: /filter weapons/i }), { target: { value: "not-found" } });

    expect(screen.getByText(/no weapons match/i)).toBeVisible();
  });

  it("uses configured category labels for accessible search controls", () => {
    render(<CategoryFilter category="locations" entries={[]} definition={{ ...fixtureCategoryDefinition("locations"), label: "Maps", singularLabel: "Map" }} />);
    expect(screen.getByRole("searchbox", { name: "Filter Maps" })).toBeVisible();
    expect(screen.getByText(/no maps match/i)).toBeVisible();
  });
});
