import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";
import { gameConfig } from "@/config/game";
import { getGuide, compileGuide } from "@/lib/content/guides";
import { getResearchPage } from "@/lib/content/pages";
import sitemap from "@/app/sitemap";

const chapters = ["prologue", "chapter-1", "chapter-2", "chapter-3", "chapter-4", "chapter-5"];
const pages = [
  ["challenges", "/challenges"],
  ["perks", "/perks"],
  ...chapters.map((chapter) => [`challenges-${chapter}`, `/challenges/${chapter}`])
];

describe("Round 2 gameplay delivery", () => {
  it.each(pages)("renders and indexes %s", async (slug, pathname) => {
    const record = getResearchPage(slug)!;
    expect(record).toBeDefined();
    expect(record.body.split(/\s+/).length).toBeGreaterThan(300);
    const html = renderToStaticMarkup(await ResearchArticle({ slug }));
    expect(html.match(/<h1[ >]/g)).toHaveLength(1);
    expect(html).toContain("application/ld+json");
    expect(html).toContain("Sources checked");
    expect(html).toContain("2026-09-13");
    expect(researchMetadata(slug).alternates?.canonical).toBe(`https://halloween-thegame.wiki${pathname}`);
    expect(sitemap().some(({ url }) => url === `https://halloween-thegame.wiki${pathname}`)).toBe(true);
    if (pathname.startsWith("/challenges/")) {
      expect(html).toContain('href="/challenges"');
      expect(html).toContain('href="/guides/challenges-not-working"');
    }
  });

  it.each(["challenges-not-working", "how-to-unlock-characters"])("compiles substantive guide %s", async (slug) => {
    const record = getGuide(slug)!;
    expect(record.body.split(/\s+/).length).toBeGreaterThan(450);
    const { content } = await compileGuide(record);
    expect(renderToStaticMarkup(content)).toContain("Sources checked");
    expect(sitemap().some(({ url }) => url.endsWith(`/guides/${slug}`))).toBe(true);
  });

  it("links every chapter from the hub and points homepage cards at canonical hubs", () => {
    const hub = getResearchPage("challenges")!;
    for (const chapter of chapters) expect(hub.body).toContain(`(/challenges/${chapter})`);
    const cards = gameConfig.content.homepage.startHereLinks;
    expect(cards.find(({ label }) => label === "Challenges")?.reference).toEqual({ kind: "page", slug: "challenges" });
    expect(cards.find(({ label }) => label === "Perks")?.reference).toEqual({ kind: "page", slug: "perks" });
  });

  it("keeps confirmed patch fixes separate from unresolved reports", () => {
    const troubleshooting = getGuide("challenges-not-working")!;
    expect(troubleshooting.body).toContain("## Officially Fixed in 1.0.2");
    expect(troubleshooting.body).toContain("## What Remains Unresolved");
    expect(getResearchPage("perks")!.body).toContain("Lethal Pitch");
    expect(getResearchPage("perks")!.body).toContain("Loomis Reinforcements");
  });
});
