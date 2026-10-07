import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CategoryPage, { generateMetadata as categoryMetadata } from "./[category]/page";
import EntityPage, { generateMetadata as entityMetadata } from "./[category]/[slug]/page";
import GuidePage, { generateMetadata as guideMetadata } from "./guides/[slug]/page";
import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";

describe("researched content in existing layouts", () => {
  it("keeps the map database and exposes the researched map comparison", async () => {
    const params = Promise.resolve({ category: "locations" });
    const html = renderToStaticMarkup(await CategoryPage({ params }));
    expect(html).toContain("category-page");
    expect(html).toContain("Landmarks, not fixed escape routes");
    expect(html).toContain("https://halloweengame.com/news/the-locations-of-halloween-the-game/");
    expect((await categoryMetadata({ params })).title).toEqual({ absolute: "Halloween: The Game Maps — All Four Launch Locations" });
  });
  it("keeps Michael's infobox while exposing sourced ability explanations", async () => {
    const params = Promise.resolve({ category: "characters", slug: "michael-myers" });
    const html = renderToStaticMarkup(await EntityPage({ params }));
    expect(html).toContain("wiki-detail-layout");
    expect(html).toContain("Killer Sense and Stalk");
    expect(html).toContain("Michael Myers Abilities");
    expect(html).toContain("Published");
    expect((await entityMetadata({ params })).title).toEqual({ absolute: "Michael Myers Abilities & Stalk — Halloween: The Game" });
  });
  it("does not append the brand twice to a researched guide title", async () => {
    const params = Promise.resolve({ slug: "how-to-play" });
    const meta = await guideMetadata({ params });
    expect(meta.title).toEqual({ absolute: "How to Play Halloween: The Game — Gameplay Basics" });
    const html = renderToStaticMarkup(await GuidePage({ params }));
    expect(html).toContain("Published");
    expect(html).toContain("Residents are part of the objective");
    expect(html).toContain("/guides/how-to-respawn-as-police");
    expect(html).toContain("/guides/how-to-escape");
    expect(html).toContain("/guides/how-skill-checks-work");
    expect(html).toContain("/crossplay");
  });

  it("updates launch timing and separates platform intent from crossplay", async () => {
    const releaseHtml = renderToStaticMarkup(await ResearchArticle({ slug: "release-date" }));
    const platformHtml = renderToStaticMarkup(await ResearchArticle({ slug: "platforms" }));

    expect(researchMetadata("release-date").title).toEqual({
      absolute: "Halloween: The Game Release Date — Out Now"
    });
    expect(releaseHtml).toContain("September 8, 2026, at 9 AM PT");
    expect(releaseHtml).toContain("Launch Updates");
    expect(platformHtml).toContain('href="/crossplay"');
    expect(platformHtml).not.toContain("keeping a separate detailed crossplay page unpublished");
  });
  it("answers gameplay before media while retaining the video poster and social image", async () => {
    const params = Promise.resolve({ slug: "how-to-play" });
    const doc = document.createElement("div");
    doc.innerHTML = renderToStaticMarkup(await GuidePage({ params }));
    const body = doc.querySelector(".guide-article-page__body")!;
    const firstParagraph = body.querySelector("p")!;
    expect(firstParagraph.textContent).toMatch(/one of four Civilians in 1v4 multiplayer/);
    expect(firstParagraph.textContent).toMatch(/gather escape items, call police/);
    expect(firstParagraph.compareDocumentPosition(body.querySelector("img")!) & 4).toBe(4);
    expect(body.querySelectorAll('img[src="/images/characters/michael-myers-official.webp"]')).toHaveLength(1);
    expect(body.querySelector('a[href="/locations"]')).not.toBeNull();
    const meta = await guideMetadata({ params });
    expect(meta.alternates?.canonical).toBe("https://halloween-thegame.wiki/guides/how-to-play");
    expect(meta.openGraph?.images).toEqual([{ url: "https://halloween-thegame.wiki/images/characters/michael-myers-official.webp" }]);
  });

  it("answers platform, crossplay and PS4 intents before the platform cards", async () => {
    const doc = document.createElement("div");
    doc.innerHTML = renderToStaticMarkup(await ResearchArticle({ slug: "platforms" }));
    const summary = doc.querySelector(".page-summary")!;
    expect(summary.firstElementChild?.textContent).toMatch(/PS5, Xbox Series X\|S and Windows PC.*with crossplay/);
    expect(summary.firstElementChild?.textContent).toContain("No PS4 version is announced");
    expect(doc.querySelector('a[href="/crossplay#cross-progression-and-cross-save"]')).not.toBeNull();
    expect(doc.textContent).toContain("No cross-progression or cross-save policy");
    expect(doc.textContent).toContain("October 6, 2026 disc release, which has now happened");
    const meta = researchMetadata("platforms");
    expect(meta.title).toEqual({ absolute: "Halloween: The Game Crossplay & Platforms: PS5, Xbox, PC, PS4?" });
    expect(meta.alternates?.canonical).toBe("https://halloween-thegame.wiki/platforms");
  });

});
