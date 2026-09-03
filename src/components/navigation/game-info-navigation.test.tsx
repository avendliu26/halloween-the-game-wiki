import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
vi.mock("next/navigation", () => ({ usePathname: () => "/platforms" }));
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

it("keeps a navigable Game Info overview in the desktop submenu", () => {
  const { container } = render(<DesktopNav />);
  expect(container.querySelector('a[href="/game-info"]')).not.toBeNull();
});

it("keeps a navigable Game Info overview in the mobile submenu", () => {
  const { container } = render(<MobileNav />);
  fireEvent.click(screen.getByRole("button", { name: "Open wiki navigation" }));
  expect(container.querySelector('a[href="/game-info"]')).not.toBeNull();
});
