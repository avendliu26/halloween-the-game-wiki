import { fireEvent, render, screen } from "@testing-library/react";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
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
    const trigger = screen.getByRole("button", { name: /^wiki navigation$/i });

    fireEvent.click(trigger);
    expect(screen.getByRole("navigation", { name: /mobile/i })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /^wiki navigation$/i }));
    expect(screen.getByRole("navigation", { name: /mobile/i })).not.toBeVisible();
  });

  it("closes the mobile menu when Escape is pressed", () => {
    renderMobileNav();
    fireEvent.click(screen.getByRole("button", { name: /^wiki navigation$/i }));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByRole("navigation", { name: /mobile/i })).not.toBeVisible();
    expect(screen.getByRole("button", { name: "Wiki navigation" })).toHaveFocus();
  });

  it("renders the mobile links inside native details before JavaScript runs", () => {
    const html = renderToStaticMarkup(<MobileNav config={navigationConfig} />);
    const document = new DOMParser().parseFromString(html, "text/html");
    const menu = document.querySelector("details.mobile-nav");
    expect(menu?.hasAttribute("open")).toBe(false);
    expect(menu?.querySelector("summary")).not.toBeNull();
    expect(menu?.querySelector('a[href="/guides"]')).not.toBeNull();
  });

  it("shows the current nested route and closes on an outside pointer", () => {
    route.pathname = "/weapons/training-sword";
    renderMobileNav();
    fireEvent.click(screen.getByRole("button", { name: "Wiki navigation" }));
    const current = screen.getByRole("link", { name: "Weapons" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toBeVisible();
    fireEvent.pointerDown(document.body);
    expect(screen.getByRole("navigation", { name: /mobile/i })).not.toBeVisible();
  });

  it("closes the mobile menu after selecting a nested navigation link", () => {
    route.pathname = "/guides/field-notes";
    renderMobileNav();
    fireEvent.click(screen.getByRole("button", { name: /^wiki navigation$/i }));
    fireEvent.click(screen.getByText("Wiki Archive"));

    const weaponsLink = screen.getByRole("link", { name: "Weapons" });
    weaponsLink.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(weaponsLink);

    expect(screen.getByRole("navigation", { name: /mobile/i })).not.toBeVisible();
  });
});
