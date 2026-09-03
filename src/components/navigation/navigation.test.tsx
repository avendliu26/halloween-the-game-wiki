import { fireEvent, render, screen } from "@testing-library/react";
import { createElement, type ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { createGameConfig, type GameConfig } from "@/lib/config/schema";
import { fixtureGameConfig } from "@/test/fixtures/game";

const route = vi.hoisted(() => ({ pathname: "/weapons" }));

vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

const navigationConfig = createGameConfig({
  ...fixtureGameConfig,
  navigation: fixtureGameConfig.navigation.map((item) => item.id === "database" ? { ...item, label: "Wiki Archive" } : item)
});

const renderDesktopNav = () => render(createElement(DesktopNav as ComponentType<{ config?: GameConfig }>, { config: navigationConfig }));
const renderMobileNav = () => render(createElement(MobileNav as ComponentType<{ config?: GameConfig }>, { config: navigationConfig }));

describe("Wiki navigation", () => {
  it("marks a renamed database section active for a category route", () => {
    route.pathname = "/weapons";
    renderDesktopNav();

    expect(screen.getByText("Wiki Archive").closest("summary")).toHaveAttribute("aria-current", "page");
  });

  it("marks Guides active for a guide article route", () => {
    route.pathname = "/guides/field-notes";
    renderDesktopNav();

    expect(screen.getByRole("link", { name: "Guides" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("opens and closes the mobile menu accessibly", () => {
    renderMobileNav();
    const trigger = screen.getByRole("button", { name: /open wiki navigation/i });

    fireEvent.click(trigger);
    expect(screen.getByRole("navigation", { name: /mobile/i })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /close wiki navigation/i }));
    expect(screen.queryByRole("navigation", { name: /mobile/i })).not.toBeInTheDocument();
  });

  it("closes the mobile menu when Escape is pressed", () => {
    renderMobileNav();
    fireEvent.click(screen.getByRole("button", { name: /open wiki navigation/i }));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("navigation", { name: /mobile/i })).not.toBeInTheDocument();
  });

  it("closes the mobile menu after selecting a nested navigation link", () => {
    renderMobileNav();
    fireEvent.click(screen.getByRole("button", { name: /open wiki navigation/i }));
    fireEvent.click(screen.getByText("Wiki Archive"));

    const weaponsLink = screen.getByRole("link", { name: "Weapons" });
    weaponsLink.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(weaponsLink);

    expect(screen.queryByRole("navigation", { name: /mobile/i })).not.toBeInTheDocument();
  });
});
