import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePageContent } from "@/app/(site)/page";
import { gameConfig } from "@/config/game";
import { GuideCard } from "./guide-card";
import { getGuide } from "@/lib/content/guides";

describe("official media presentation", () => {
  it("embeds only the verified official trailer without autoplay", () => {
    render(<HomePageContent config={gameConfig} />);
    const video = screen.getByTitle("Halloween: The Game — Official Announce Trailer");
    expect(video).toHaveAttribute("src", "https://www.youtube.com/embed/sv3QNjz1mYg");
    expect(video).toHaveAttribute("loading", "lazy");
    expect(video).toHaveAttribute("allowfullscreen");
    expect(video).toHaveAttribute("referrerpolicy", "strict-origin-when-cross-origin");
  });
  it("shows the existing guide's locally hosted official illustration", () => {
    render(<GuideCard guide={getGuide("beginner-guide")!} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/images/characters/civilians-official.webp");
  });
});
