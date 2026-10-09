import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GuidePage, { generateMetadata as guideMetadata } from "./guides/[slug]/page";
import { getAllGuides, getGuide } from "@/lib/content/guides";
import { getResearchPage } from "@/lib/content/pages";
import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";
import sitemap from "@/app/sitemap";

const guidePages = [
  ["patch-notes", "Halloween: The Game Patch Notes & Updates"],
  ["how-to-struggle-free", "How to Struggle Free From Michael"],
  ["how-to-respawn-as-police", "How to Respawn as Police in Halloween: The Game"],
  ["backend-authentication-error", "How to Fix the Backend Authentication Error"],
  ["how-to-call-the-police", "How to Call the Police"],
  ["how-to-escape", "How to Escape"],
  ["how-skill-checks-work", "How Skill Checks Work"],
  ["how-to-get-xp", "How to Get XP and Progress"],
  ["halloween-the-game-crashing", "Halloween: The Game Crashing"],
] as const;

const parseJsonLd = (html: string) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((match) => JSON.parse(match[1]) as Record<string, unknown>);

const expectCompleteJsonLd = (html: string, canonical: string) => {
  const blocks = parseJsonLd(html);
  expect(blocks).toHaveLength(2);
  expect(blocks.find((block) => block["@type"] === "Article")).toMatchObject({ url: canonical });

  const breadcrumb = blocks.find((block) => block["@type"] === "BreadcrumbList") as {
    itemListElement: Array<{ position: number; name: string; item: string }>;
  };
  breadcrumb.itemListElement.forEach((item, index) => {
    expect(item).toMatchObject({ position: index + 1, name: expect.any(String) });
    expect(item.name.trim()).not.toBe("");
    expect(new URL(item.item).origin).toBe("https://halloween-thegame.wiki");
  });
  expect(breadcrumb.itemListElement.at(-1)?.item).toBe(canonical);
  expect(JSON.stringify(blocks)).not.toMatch(/undefined|null/);
};

describe("launch SEO content cluster", () => {
  it("publishes the crossplay answer as a complete standalone page", async () => {
    const page = getResearchPage("crossplay");
    const html = renderToStaticMarkup(await ResearchArticle({ slug: "crossplay" }));
    const metadata = researchMetadata("crossplay");

    expect(page).toBeDefined();
    expect(metadata.title).toEqual({ absolute: "Halloween: The Game Crossplay — PS5, Xbox & PC" });
    expect(metadata.alternates?.canonical).toBe("https://halloween-thegame.wiki/crossplay");
    expect(html).toContain("<h1>Is Halloween: The Game Cross Platform?</h1>");
    expect(html).toContain("Quick Answer");
    expect(html).toContain("Patch 1.0.1 Crossplay Fix");
    expect(html).toContain("How to Turn Off Crossplay");
    expect(html).toContain("Related Pages");
    expectCompleteJsonLd(html, "https://halloween-thegame.wiki/crossplay");
  });

  it.each(guidePages)("publishes %s with a search-specific H1 and complete guide structure", async (slug, heading) => {
    const record = getGuide(slug);
    const html = renderToStaticMarkup(await GuidePage({ params: Promise.resolve({ slug }) }));
    const metadata = await guideMetadata({ params: Promise.resolve({ slug }) });

    expect(record).toBeDefined();
    expect(html).toContain(renderToStaticMarkup(<h1>{heading}</h1>));
    expect(html).toContain("Quick Answer");
    expect(html).toContain("Sources checked");
    expect(html).toContain("Related Pages");
    expect(metadata.alternates?.canonical).toBe(`https://halloween-thegame.wiki/guides/${slug}`);
    expect(metadata.description?.length).toBeGreaterThanOrEqual(140);
    expect(metadata.description?.length).toBeLessThanOrEqual(160);
    expectCompleteJsonLd(html, `https://halloween-thegame.wiki/guides/${slug}`);
  });

  it("server-renders the police Quick Answer before its interactive check", async () => {
    const html = renderToStaticMarkup(await GuidePage({
      params: Promise.resolve({ slug: "how-to-respawn-as-police" })
    }));
    const answer = "Police return is possible, not guaranteed.";
    const check = "Police Respawn Quick Check";

    expect(html).toContain(answer);
    expect(html).toContain("Choose one option in each group to get your next action.");
    expect(html.indexOf(answer)).toBeLessThan(html.indexOf(check));
  });

  it("answers the searched police-availability question without promising a respawn", async () => {
    const guide = getGuide("how-to-respawn-as-police")!;
    const html = renderToStaticMarkup(await GuidePage({
      params: Promise.resolve({ slug: "how-to-respawn-as-police" })
    }));
    expect(guide.body).toContain("### What does “Police Respawn Available” mean?");
    expect(html).toContain("is not a promise");
    expect(html).toContain("there is no verified shortcut or fixed wait");
    expect(html).toContain('href="/guides/how-to-call-the-police"');
    expect(guide.frontmatter.description).toContain("spectator minigames");
  });

  it("keeps crossplay patch context current without asserting a new platform", async () => {
    const html = renderToStaticMarkup(await ResearchArticle({ slug: "crossplay" }));
    expect(html).toContain("Patch 1.1.0");
    expect(html).not.toContain("latest patch listed");
  });

  it("keeps titles and descriptions unique across published research content", () => {
    const records = [...getAllGuides(), getResearchPage("crossplay")!];
    const titles = records.map((record) => record.frontmatter.title);
    const descriptions = records.map((record) => record.frontmatter.description);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keeps every internal link in the launch cluster on a published canonical route", () => {
    const publishedPaths = new Set(sitemap().map(({ url }) => new URL(url).pathname));
    const records = [
      ...guidePages.map(([slug]) => getGuide(slug)!),
      getGuide("how-to-play")!,
      ...["crossplay", "michael-myers", "release-date", "platforms"].map((slug) => getResearchPage(slug)!)
    ];

    for (const record of records) {
      const internalLinks = [...record.body.matchAll(/\]\((\/[^\s)#?]+)/g)]
        .map((match) => match[1])
        .filter((href) => !href.startsWith("/images/"));
      expect(internalLinks.length, record.slug).toBeGreaterThan(0);
      for (const href of internalLinks) expect(publishedPaths, `${record.slug}: ${href}`).toContain(href);
    }
  });
});
