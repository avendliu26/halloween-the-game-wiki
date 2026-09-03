import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CategoryPage, { generateMetadata as categoryMetadata } from "./[category]/page";
import EntityPage, { generateMetadata as entityMetadata } from "./[category]/[slug]/page";
import GuidePage, { generateMetadata as guideMetadata } from "./guides/[slug]/page";

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
    expect(html).toContain("Published");
    expect((await entityMetadata({ params })).title).toEqual({ absolute: "Halloween: The Game Michael Myers — Abilities & Role" });
  });
  it("does not append the brand twice to a researched guide title", async () => {
    const params = Promise.resolve({ slug: "how-to-play" });
    const meta = await guideMetadata({ params });
    expect(meta.title).toEqual({ absolute: "Halloween: The Game How to Play — Roles & Objectives" });
    const html = renderToStaticMarkup(await GuidePage({ params }));
    expect(html).toContain("Published");
    expect(html).toContain("Rescue residents, not just yourself");
  });
});
