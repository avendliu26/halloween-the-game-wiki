import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlatformCompatibilityChooser } from "@/components/wiki/platform-compatibility-chooser";

const choose = (platform: string) => {
  fireEvent.click(screen.getByRole("radio", { name: platform }));
};

describe("PlatformCompatibilityChooser", () => {
  it("uses native keyboard-operable controls and an atomic live status", () => {
    render(<PlatformCompatibilityChooser />);

    expect(screen.getByRole("group", { name: "Choose your platform" })).toBeVisible();
    expect(screen.getAllByRole("radio")).toHaveLength(7);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("status")).toHaveAttribute("aria-atomic", "true");
    expect(screen.getByText(/Select one of the seven devices/)).toBeVisible();
  });

  it("links PS5 directly and separates PS Plus, offline play, and cross-progression", () => {
    render(<PlatformCompatibilityChooser />);
    choose("PlayStation 5");

    const result = screen.getByRole("status");
    expect(within(result).getByText("Available")).toBeVisible();
    expect(within(result).getByText(/one-player offline play/i)).toBeVisible();
    expect(within(result).getByText(/PS Plus is required for online play/i)).toBeVisible();
    expect(within(result).getByText(/does not say the game is included with PS Plus/i)).toBeVisible();
    expect(within(result).getByText(/Crossplay does not confirm cross-progression/i)).toBeVisible();
    expect(within(result).getByRole("link", { name: "View on PlayStation Store" })).toHaveAttribute(
      "href",
      "https://store.playstation.com/en-us/concept/10014718/"
    );
  });

  it("links Xbox Series X|S directly without implying Game Pass inclusion or a PC copy", () => {
    render(<PlatformCompatibilityChooser />);
    choose("Xbox Series X|S");

    const result = screen.getByRole("status");
    expect(within(result).getByText(/qualifying Game Pass subscription/i)).toBeVisible();
    expect(within(result).getByText(/does not say the game itself is included in Game Pass/i)).toBeVisible();
    expect(within(result).getByText(/does not establish that an Xbox console purchase grants a Windows PC copy/i)).toBeVisible();
    expect(within(result).getByRole("link", { name: "View on Xbox Store" })).toHaveAttribute(
      "href",
      "https://www.xbox.com/en-US/games/store/halloween-the-game/9nl5n20r06dv"
    );
  });

  it("offers only the verified Windows PC stores", () => {
    render(<PlatformCompatibilityChooser />);
    choose("Windows PC");

    const purchaseOptions = within(screen.getByRole("status")).getByRole("navigation", {
      name: "Official Windows PC purchase options"
    });
    expect(within(purchaseOptions).getByRole("link", { name: "View on Steam" })).toHaveAttribute(
      "href",
      "https://store.steampowered.com/app/3219630/Halloween_The_Game/"
    );
    expect(within(purchaseOptions).getByRole("link", { name: "View on Epic Games Store" })).toHaveAttribute(
      "href",
      "https://store.epicgames.com/p/halloween-f3e2dd?lang=en-US"
    );
  });

  it.each([
    "PlayStation 4",
    "Xbox One",
    "macOS",
    "Nintendo Switch"
  ])("bounds the unsupported result for %s", (platform) => {
    render(<PlatformCompatibilityChooser />);
    choose(platform);

    const result = screen.getByRole("status");
    expect(within(result).getByText("No official native version listed")).toBeVisible();
    expect(within(result).getByText(new RegExp(`No official native ${platform.replace("PlayStation 4", "PS4")} version is listed`, "i"))).toBeVisible();
    expect(within(result).getByRole("link", { name: "Review the official platform list" })).toHaveAttribute(
      "href",
      "https://halloweengame.com/news/the-locations-of-halloween-the-game/"
    );
    expect(within(result).queryByRole("navigation")).not.toBeInTheDocument();
    expect(within(result).queryByText(/Crossplay, not cross-progression/i)).not.toBeInTheDocument();
  });
});
