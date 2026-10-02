import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeMotion } from "./home-motion";
import Link from "next/link";

afterEach(() => vi.unstubAllGlobals());

const content = <section className="home-section"><h2>Gameplay help</h2><Link href="/guides">Read guides</Link></section>;

describe("homepage motion enhancement", () => {
  it("keeps content readable when observer support is missing", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<HomeMotion>{content}</HomeMotion>);
    expect(screen.getByRole("heading", { name: "Gameplay help" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Read guides" })).toHaveAttribute("href", "/guides");
  });

  it("does not observe sections on mobile or with reduced motion", () => {
    const observer = vi.fn();
    vi.stubGlobal("IntersectionObserver", observer);
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    render(<HomeMotion>{content}</HomeMotion>);
    expect(observer).not.toHaveBeenCalled();
    expect(screen.getByRole("heading")).toBeVisible();
  });

  it("reveals once on entry and clears motion when the preference changes", () => {
    let callback!: IntersectionObserverCallback;
    let change!: () => void;
    const observe = vi.fn(), unobserve = vi.fn(), disconnect = vi.fn();
    const preference = { matches: true, addEventListener: vi.fn((_type, listener) => { change = listener; }), removeEventListener: vi.fn() };
    vi.stubGlobal("matchMedia", vi.fn(() => preference));
    vi.stubGlobal("IntersectionObserver", class {
      constructor(listener: IntersectionObserverCallback) { callback = listener; }
      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    });
    const { container, unmount } = render(<HomeMotion>{content}</HomeMotion>);
    const section = container.querySelector("section")!;
    const entry = (isIntersecting: boolean): IntersectionObserverEntry => ({
      target: section, isIntersecting, time: 0, rootBounds: null,
      boundingClientRect: section.getBoundingClientRect(),
      intersectionRect: section.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0
    });
    expect(section).not.toHaveClass("home-section--revealed");
    expect(screen.getByRole("heading")).toBeVisible();
    expect(observe).toHaveBeenCalledWith(section);
    act(() => callback([entry(false)], {} as IntersectionObserver));
    expect(section).not.toHaveClass("home-section--revealed");
    act(() => callback([entry(true)], {} as IntersectionObserver));
    expect(section).toHaveClass("home-section--revealed");
    expect(unobserve).toHaveBeenCalledWith(section);
    preference.matches = false;
    act(() => change());
    expect(section).not.toHaveClass("home-section--revealed");
    expect(disconnect).toHaveBeenCalled();
    unmount();
    expect(preference.removeEventListener).toHaveBeenCalledWith("change", change);
  });
});
