import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdsterraBanner, ResponsiveAdsterraTop, adsterraBannerConfig, isProductionAdHost } from "./adsterra-banner";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AdsterraBanner", () => {
  it.each([
    ["728x90", 728, 90, "bdf6453086827d9b072bf382a560dab5"],
    ["300x250", 300, 250, "aa4fc7d693f25332cf75e2bb9980809d"],
    ["320x50", 320, 50, "004f3509d8c4048f86d20e1eb0fb5555"]
  ] as const)("keeps the %s slot dimensioned before its iframe loads", (size, width, height, key) => {
    const { container } = render(<AdsterraBanner size={size} />);
    const slot = container.firstElementChild;

    expect(slot).toHaveAttribute("data-adsterra-size", size);
    expect(slot).toHaveAttribute("aria-label", "Advertisement");
    expect(slot).toHaveStyle({ minHeight: `${height}px` });
    expect(adsterraBannerConfig[size]).toMatchObject({ width, height, key });
  });

  it("loads one isolated iframe only on the formal production host", async () => {
    vi.stubGlobal("location", { hostname: "halloween-thegame.wiki" });
    const { container, unmount } = render(<AdsterraBanner size="728x90" />);

    await waitFor(() => expect(container.querySelector("iframe")).not.toBeNull());
    const iframe = container.querySelector("iframe")!;
    expect(iframe).toHaveAttribute("width", "728");
    expect(iframe).toHaveAttribute("height", "90");
    expect(iframe).toHaveAttribute("sandbox", "allow-scripts");
    expect(iframe.srcdoc).toContain("bdf6453086827d9b072bf382a560dab5");
    expect(iframe.srcdoc).toContain("https://www.highrevenueformat.com/bdf6453086827d9b072bf382a560dab5/invoke.js");
    expect(container.querySelectorAll("iframe")).toHaveLength(1);

    unmount();
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("does not create an ad iframe on localhost or preview hosts", async () => {
    vi.stubGlobal("location", { hostname: "localhost" });
    const { container } = render(<AdsterraBanner size="300x250" />);

    await waitFor(() => expect(container.firstElementChild).toHaveAttribute("data-adsterra-enabled", "false"));
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("keeps multiple slots isolated so each invoke script receives its own key", async () => {
    vi.stubGlobal("location", { hostname: "halloween-thegame.wiki" });
    const { container } = render(<>
      <AdsterraBanner size="728x90" />
      <AdsterraBanner size="300x250" />
    </>);

    await waitFor(() => expect(container.querySelectorAll("iframe")).toHaveLength(2));
    const frameDocuments = Array.from(container.querySelectorAll("iframe"), (iframe) => iframe.srcdoc);
    expect(frameDocuments[0]).toContain(adsterraBannerConfig["728x90"].key);
    expect(frameDocuments[1]).toContain(adsterraBannerConfig["300x250"].key);
  });
});

describe("responsive ad slots", () => {
  it("uses the mobile size below the desktop breakpoint without loading both scripts", async () => {
    vi.stubGlobal("location", { hostname: "halloween-thegame.wiki" });
    vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    const { container } = render(<ResponsiveAdsterraTop />);

    await waitFor(() => expect(container.querySelectorAll("iframe")).toHaveLength(1));
    expect(container.querySelector('iframe[width="320"][height="50"]')).not.toBeNull();
    expect(container.querySelector('iframe[width="728"]')).toBeNull();
  });
});

describe("production ad gating", () => {
  it("accepts only the formal production hostname", () => {
    expect(isProductionAdHost("halloween-thegame.wiki")).toBe(true);
    expect(isProductionAdHost("www.halloween-thegame.wiki")).toBe(false);
    expect(isProductionAdHost("halloween-the-game-wiki.vercel.app")).toBe(false);
    expect(isProductionAdHost("localhost")).toBe(false);
  });
});
