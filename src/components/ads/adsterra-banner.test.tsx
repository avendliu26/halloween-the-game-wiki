import { act, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdsterraBanner, ResponsiveAdsterraTop, adsterraBannerConfig, isProductionAdHost } from "./adsterra-banner";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function report(frame: HTMLIFrameElement, state: string, source: MessageEventSource | null = frame.contentWindow) {
  act(() => window.dispatchEvent(new MessageEvent("message", {
    source,
    origin: "null",
    data: { type: "adsterra-slot-status", state }
  })));
}

describe("ad slot lifecycle", () => {
  it.each(["728x90", "320x50", "300x250"] as const)("preserves loading and filled %s ads, but collapses failed ads", (size) => {
    vi.stubGlobal("location", { hostname: "halloween-thegame.wiki" });
    vi.useFakeTimers();
    const { container } = render(<AdsterraBanner size={size} />);
    const slot = container.firstElementChild!;
    const frame = container.querySelector("iframe")!;
    expect(slot).toHaveAttribute("data-adsterra-state", "loading");
    act(() => vi.advanceTimersByTime(120_000));
    // Lazy iframes must not time out before their srcdoc actually executes.
    expect(slot).toHaveAttribute("data-adsterra-state", "loading");
    report(frame, "failed");
    expect(slot).toHaveAttribute("data-adsterra-state", "failed");
    expect(slot).toHaveStyle({ minHeight: "0px" });
    expect(container.querySelector("iframe")).toBe(frame);
    report(frame, "filled");
    expect(slot).toHaveAttribute("data-adsterra-state", "filled");
    expect(slot).toHaveStyle({ minHeight: `${adsterraBannerConfig[size].height}px` });
    report(frame, "failed");
    expect(slot).toHaveAttribute("data-adsterra-state", "filled");
  });

  it("ignores unrelated, malformed and stale frame messages", () => {
    vi.stubGlobal("location", { hostname: "halloween-thegame.wiki" });
    const { container, rerender } = render(<AdsterraBanner size="728x90" />);
    const oldFrame = container.querySelector("iframe")!;
    const oldSource = oldFrame.contentWindow;
    report(oldFrame, "failed", window);
    report(oldFrame, "unknown");
    expect(container.firstElementChild).toHaveAttribute("data-adsterra-state", "loading");
    rerender(<AdsterraBanner size="320x50" />);
    report(oldFrame, "failed", oldSource);
    expect(container.firstElementChild).toHaveAttribute("data-adsterra-state", "loading");
  });
});

// Execute the actual generated inline monitor against a real DOM. Only layout
// (not implemented by jsdom) and the external ad-network response are controlled.
function frameHarness() {
  vi.stubGlobal("location", { hostname: "halloween-thegame.wiki" });
  vi.useFakeTimers();
  const { container } = render(<AdsterraBanner size="728x90" />);
  const doc = document.implementation.createHTMLDocument();
  doc.documentElement.innerHTML = container.querySelector("iframe")!.srcdoc;
  const messages = vi.spyOn(window, "postMessage").mockImplementation(() => {});
  for (const script of doc.querySelectorAll("script:not([src])")) {
    new Function("window", "document", script.textContent!)(window, doc);
  }
  const invoke = doc.querySelector("script[src]")!;
  return { doc, invoke, messages };
}

describe("srcdoc fill detection", () => {
  it("gives an empty successful script a full grace period, not a timer from mount", () => {
    const { invoke, messages } = frameHarness();
    vi.advanceTimersByTime(120_000);
    expect(messages).not.toHaveBeenCalled();
    invoke.dispatchEvent(new Event("load"));
    vi.advanceTimersByTime(59_999);
    expect(messages).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(messages).toHaveBeenLastCalledWith({ type: "adsterra-slot-status", state: "failed" }, "https://halloween-thegame.wiki");
  });

  it("reports a blocked invoke script with no creative as failed", () => {
    const { invoke, messages } = frameHarness();
    invoke.dispatchEvent(new Event("error"));
    expect(messages).toHaveBeenLastCalledWith({ type: "adsterra-slot-status", state: "failed" }, "https://halloween-thegame.wiki");
  });

  it("does not mistake a blank iframe or a tracking pixel for a creative", () => {
    const { doc, invoke, messages } = frameHarness();
    doc.body.insertAdjacentHTML("beforeend", '<iframe src="about:blank"></iframe><img width="1" height="1" src="https://example.test/pixel">');
    invoke.dispatchEvent(new Event("load"));
    vi.advanceTimersByTime(60_000);
    expect(messages).toHaveBeenLastCalledWith({ type: "adsterra-slot-status", state: "failed" }, "https://halloween-thegame.wiki");
  });

  it("recovers when a real image finishes after no-fill, and never retracts success", () => {
    const { doc, invoke, messages } = frameHarness();
    invoke.dispatchEvent(new Event("load"));
    vi.advanceTimersByTime(60_000);
    const creative = doc.createElement("img");
    creative.src = "https://example.test/banner.png";
    Object.defineProperties(creative, { complete: { value: true }, naturalWidth: { value: 728 }, naturalHeight: { value: 90 } });
    creative.getBoundingClientRect = () => ({ width: 728, height: 90, top: 0, left: 0, bottom: 90, right: 728, x: 0, y: 0, toJSON() {} });
    doc.body.appendChild(creative);
    creative.dispatchEvent(new Event("load"));
    expect(messages).toHaveBeenLastCalledWith({ type: "adsterra-slot-status", state: "filled" }, "https://halloween-thegame.wiki");
    invoke.dispatchEvent(new Event("error"));
    vi.advanceTimersByTime(120_000);
    expect(messages).toHaveBeenLastCalledWith({ type: "adsterra-slot-status", state: "filled" }, "https://halloween-thegame.wiki");
  });

  it("preserves a potentially valid cross-origin creative even before its load event", () => {
    const { doc, invoke, messages } = frameHarness();
    const creative = doc.createElement("iframe");
    creative.src = "https://example.test/ad";
    creative.getBoundingClientRect = () => ({ width: 728, height: 90, top: 0, left: 0, bottom: 90, right: 728, x: 0, y: 0, toJSON() {} });
    doc.body.appendChild(creative);
    invoke.dispatchEvent(new Event("load"));
    vi.advanceTimersByTime(60_000);
    expect(messages).not.toHaveBeenCalled();
  });

  it("does not classify script text inside an empty wrapper as visible ad copy", () => {
    const { doc, invoke, messages } = frameHarness();
    const wrapper = doc.createElement("div");
    wrapper.innerHTML = '<script>/* network bootstrap only */</script>';
    wrapper.getBoundingClientRect = () => ({ width: 728, height: 90, top: 0, left: 0, bottom: 90, right: 728, x: 0, y: 0, toJSON() {} });
    doc.body.appendChild(wrapper);
    invoke.dispatchEvent(new Event("load"));
    vi.advanceTimersByTime(60_000);
    expect(messages).toHaveBeenLastCalledWith({ type: "adsterra-slot-status", state: "failed" }, "https://halloween-thegame.wiki");
  });
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
