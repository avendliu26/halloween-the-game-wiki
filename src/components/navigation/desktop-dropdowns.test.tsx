import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DesktopNav } from "./desktop-nav";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const setup = () => {
  const { container } = render(<><DesktopNav /><button>Outside navigation</button></>);
  const explore = screen.getByText("Explore");
  const gameInfo = screen.getByText("Game Info");
  const openMenus = () => container.querySelectorAll("details[open]");
  return { explore, gameInfo, openMenus };
};

describe("desktop dropdown interactions", () => {
  it.each([false, true])("switches exclusively in either direction (reverse: %s)", (reverse) => {
    const { explore, gameInfo, openMenus } = setup();
    const [first, second] = reverse ? [gameInfo, explore] : [explore, gameInfo];
    fireEvent.click(first);
    expect(first.closest("details")).toHaveAttribute("open");
    fireEvent.click(second);
    expect(first.closest("details")).not.toHaveAttribute("open");
    expect(second.closest("details")).toHaveAttribute("open");
    expect(openMenus()).toHaveLength(1);
  });

  it("closes when the pointer is pressed outside navigation, but not inside a panel", () => {
    const { explore, openMenus } = setup();
    fireEvent.click(explore);
    fireEvent.pointerDown(screen.getByRole("list", { name: "Explore categories" }));
    expect(openMenus()).toHaveLength(1);
    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside navigation" }));
    expect(openMenus()).toHaveLength(0);
  });

  it("closes on Escape and returns keyboard focus to the open trigger", () => {
    const { gameInfo, openMenus } = setup();
    fireEvent.click(gameInfo);
    screen.getByRole("link", { name: "Platforms" }).focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(openMenus()).toHaveLength(0);
    expect(gameInfo).toHaveFocus();
  });

  it("keeps rapid switching and mouse movement from creating competing open states", () => {
    const { explore, gameInfo, openMenus } = setup();
    for (let index = 0; index < 20; index += 1) {
      const current = index % 2 ? gameInfo : explore;
      fireEvent.click(current);
      fireEvent.mouseLeave(current.closest("details")!);
      fireEvent.mouseEnter(index % 2 ? explore : gameInfo);
      expect(openMenus()).toHaveLength(1);
      expect(current.closest("details")).toHaveAttribute("open");
    }
    fireEvent.click(gameInfo);
    expect(openMenus()).toHaveLength(0);
  });

  it("closes after choosing a navigation destination", () => {
    const { gameInfo, openMenus } = setup();
    fireEvent.click(gameInfo);
    const destination = screen.getByRole("link", { name: "Platforms" });
    destination.addEventListener("click", event => event.preventDefault());
    fireEvent.click(destination);
    expect(openMenus()).toHaveLength(0);
  });
});
