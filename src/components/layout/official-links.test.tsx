import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";
import { PageSummaryCards } from "../wiki/page-summary-cards";
import GameInfoPage from "@/app/(site)/game-info/page";

const safeExternal = (link: HTMLElement, href: string) => {
  expect(link).toHaveAttribute("href", href);
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
};

describe("official external entry points", () => {
  it("makes the community page discoverable from Game Info", () => {
    render(<GameInfoPage />);
    expect(screen.getByRole("link", { name: "Community" })).toHaveAttribute("href", "/community");
  });

  it("offers the official Discord on the community page using the existing button style", async () => {
    const { default: CommunityPage } = await import("@/app/(site)/community/page");
    render(<CommunityPage />);
    const link = screen.getByRole("link", { name: "Join Official Discord" });
    safeExternal(link, "https://discord.gg/halloweenthegame");
    expect(link).toHaveClass("button", "button--primary");
  });
  it("reuses the footer list for website and Discord without duplicating Steam", () => {
    render(<SiteFooter />);
    const links = within(screen.getByRole("list", { name: "External links" }));
    safeExternal(links.getByRole("link", { name: "Official Website" }), "https://halloweengame.com/");
    safeExternal(links.getByRole("link", { name: "Official Discord" }), "https://discord.gg/halloweenthegame");
    expect(links.getAllByRole("link", { name: /Steam/ })).toHaveLength(1);
  });

  it("offers exactly three non-Steam stores in the platform summary", () => {
    render(<PageSummaryCards slug="platforms" />);
    for (const [name, href] of [
      ["PlayStation", "https://store.playstation.com/en-us/concept/10014718/"],
      ["Xbox", "https://www.xbox.com/en-US/games/store/halloween/9nl5n20r06dv"],
      ["Epic Games", "https://store.epicgames.com/p/halloween-f3e2dd?lang=en-US"]
    ]) safeExternal(screen.getByRole("link", { name }), href);
    expect(screen.queryByRole("link", { name: /Steam/ })).not.toBeInTheDocument();
  });

  it("keeps editions lightweight by linking to the shared store entry point", () => {
    render(<PageSummaryCards slug="editions" />);
    expect(screen.getByRole("link", { name: "Platform stores" })).toHaveAttribute("href", "/platforms#official-stores");
    expect(screen.queryByRole("link", { name: "Xbox" })).not.toBeInTheDocument();
  });
});
