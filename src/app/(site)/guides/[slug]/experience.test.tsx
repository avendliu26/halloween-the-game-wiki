import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import GuidePage, { generateMetadata } from "./page";
import { getGuide } from "@/lib/content/guides";
import { MatchStart } from "@/components/wiki/match-start";
import sitemap from "@/app/sitemap";

vi.mock("@/components/ads/adsterra-banner", () => ({
  AdsterraBanner: () => null,
  ResponsiveAdsterraTop: () => null
}));

describe("first-match guide experience", () => {
  it("connects every onboarding and TOC link to the actual compiled article", async () => {
    const { container } = render(await GuidePage({ params: Promise.resolve({ slug: "how-to-play" }) }));
    const paths = screen.getByRole("navigation", { name: "Jump to your role" });
    expect(within(paths).getByRole("link", { name: /Play as a Civilian/ })).toHaveAttribute("href", "#playing-as-a-civilian");
    expect(within(paths).getByRole("link", { name: /Play as Michael Myers/ })).toHaveAttribute("href", "#playing-as-michael-myers");
    for (const link of container.querySelectorAll<HTMLAnchorElement>('.match-start a, .table-of-contents a')) {
      expect(container.querySelector(`[id="${link.hash.slice(1)}"]`), link.hash).not.toBeNull();
    }
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(new Set([...container.querySelectorAll("[id]")].map((node) => node.id)).size).toBe(container.querySelectorAll("[id]").length);
    expect(screen.getByRole("heading", { name: "Common Questions" })).toBeVisible();
    expect(screen.getByRole("img", { name: /Michael Myers and a Civilian on a Haddonfield street/ })).toBeVisible();
    expect(container.querySelectorAll(".official-video")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Sources checked" })).toBeVisible();
    const routes = new Set(sitemap().map((entry) => new URL(entry.url).pathname));
    for (const link of container.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')) {
      expect(routes.has(new URL(link.href).pathname), link.getAttribute("href")).toBe(true);
    }
  });

  it("keeps the indexed canonical and Article metadata on the existing URL", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "how-to-play" }) });
    expect(metadata.alternates).toMatchObject({ canonical: "https://halloween-thegame.wiki/guides/how-to-play" });
    const { container } = render(await GuidePage({ params: Promise.resolve({ slug: "how-to-play" }) }));
    const article = [...container.querySelectorAll('script[type="application/ld+json"]')]
      .map((script) => JSON.parse(script.textContent ?? "{}"))
      .find((entry) => entry["@type"] === "Article");
    expect(article).toMatchObject({ headline: getGuide("how-to-play")!.frontmatter.title, datePublished: "2026-09-03" });
  });

  it("renders learning paths as plain links without client state", () => {
    const html = renderToStaticMarkup(<MatchStart />);
    expect(html).toContain('href="#quick-answer"');
    expect(html).toContain('href="#playing-as-a-civilian"');
    expect(html).not.toContain("<button");
  });
});
