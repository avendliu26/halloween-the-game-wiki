import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getResearchPage, standalonePages } from "./pages";
import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";

describe("researched fact-page delivery", () => {
  it("does not resolve missing or traversal slugs", () => {
    expect(getResearchPage("crossplay")).toBeUndefined();
    expect(getResearchPage("../guides/how-to-play")).toBeUndefined();
  });
  it.each([
    ["release-date", "/release-date", "Release"],
    ["editions", "/editions", "Edition"],
    ["physical-editions", "/physical-editions", "Edition"],
    ["platforms", "/platforms", "Platform"],
    ["system-requirements", "/system-requirements", "Platform"]
  ])("renders %s as its own type with sources and dates", async (slug, pathname, type) => {
    expect(standalonePages.find((page) => page.slug === slug)?.pathname).toBe(pathname);
    const page = getResearchPage(slug)!;
    const html = renderToStaticMarkup(await ResearchArticle({ slug }));
    expect(html).toContain(`preview-card__eyebrow">${type}`);
    expect(html).toContain("Published");
    expect(html).toContain("Updated");
    expect(html).toContain("Sources checked");
    expect(html).toContain("Related Pages");
    const metadata = researchMetadata(slug);
    expect(metadata.title).toEqual({ absolute: page.frontmatter.title });
    expect(metadata.description!.length).toBeGreaterThanOrEqual(140);
    expect(metadata.description!.length).toBeLessThanOrEqual(160);
    expect(page.frontmatter.title.length).toBeLessThanOrEqual(60);
    expect(html.match(/<h1[ >]/g)).toHaveLength(1);
  });
});
