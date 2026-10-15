import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const guidesFixture = vi.hoisted(() => [
  {
    slug: "how-to-respawn-as-police",
    body: "",
    frontmatter: {
      slug: "how-to-respawn-as-police",
      title: "How to Respawn as Police",
      description: "First card in the index.",
      updatedAt: "2026-09-01",
      image: "/images/official/michael-lurking-pv2.webp",
      imageAlt: "Michael Myers watching police vehicles on a dark Haddonfield street",
      tags: ["police"],
      related: []
    }
  },
  {
    slug: "beginner-guide",
    body: "",
    frontmatter: {
      slug: "beginner-guide",
      title: "Beginner Guide",
      description: "Second card in the index.",
      updatedAt: "2026-09-02",
      image: "/images/characters/civilians-official.webp",
      imageAlt: "Five playable Civilians in the official Heroes of Haddonfield character lineup",
      tags: ["beginner"],
      related: []
    }
  }
]);

vi.mock("@/lib/content/guides", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content/guides")>();
  return { ...actual, getAllGuides: () => guidesFixture };
});

import GuidesPage from "./page";

describe("GuidesPage image loading", () => {
  it("marks only the first guide card image eager/high priority and keeps the rest lazy", () => {
    render(<GuidesPage />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);

    expect(images[0]).toHaveAttribute("src", "/images/official/michael-lurking-pv2.webp");
    expect(images[0]).toHaveAttribute("loading", "eager");
    expect(images[0]).toHaveAttribute("fetchpriority", "high");

    expect(images[1]).toHaveAttribute("src", "/images/characters/civilians-card.webp");
    expect(images[1]).toHaveAttribute("loading", "lazy");
    expect(images[1]).not.toHaveAttribute("fetchpriority");
  });
});
