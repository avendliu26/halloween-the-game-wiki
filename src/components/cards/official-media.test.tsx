import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePageContent } from "@/app/(site)/page";
import { gameConfig } from "@/config/game";
import { GuideCard } from "./guide-card";
import { getGuide } from "@/lib/content/guides";

describe("official media presentation", () => {
  it("loads the current official trailer only after a click, without autoplay", () => {
    render(<HomePageContent config={gameConfig} />);
    expect(screen.queryByTitle("Halloween Gameplay + Release Date Trailer")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Gameplay and release date trailer poster/i })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /play halloween gameplay/i }));
    const video = screen.getByTitle("Halloween Gameplay + Release Date Trailer");
    expect(video).toHaveAttribute("src", "https://www.youtube.com/embed/715qsd1qIFg");
    expect(video).toHaveAttribute("loading", "lazy");
    expect(video).toHaveAttribute("allowfullscreen");
    expect(video).toHaveAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    expect(video.getAttribute("src")).not.toContain("autoplay");
  });
  it("shows the existing guide's locally hosted official illustration", () => {
    render(<GuideCard guide={getGuide("beginner-guide")!} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/images/characters/civilians-official.webp");
  });
});
