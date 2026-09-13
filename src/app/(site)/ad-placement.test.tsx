import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GuidePage from "./guides/[slug]/page";
import { HomePageContent } from "./page";
import GameInfoPage from "./game-info/page";
import { gameConfig } from "@/config/game";

describe("ad placement", () => {
  it("reserves top and long-article rectangle slots without server-side ad scripts", async () => {
    const html = renderToStaticMarkup(await GuidePage({ params: Promise.resolve({ slug: "how-to-play" }) }));

    expect(html).toContain('data-adsterra-size="728x90"');
    expect(html).toContain('data-adsterra-size="320x50"');
    expect(html).toContain('data-adsterra-size="300x250"');
    expect(html).not.toContain("highrevenueformat.com");
  });

  it("does not add advertising slots to the homepage", () => {
    const html = renderToStaticMarkup(<HomePageContent config={gameConfig} />);

    expect(html).not.toContain("adsterra");
    expect(html).not.toContain("highrevenueformat.com");
  });

  it("supports the game-info hub without emitting third-party scripts in SSR", () => {
    const html = renderToStaticMarkup(<GameInfoPage />);

    expect(html).toContain('data-adsterra-size="728x90"');
    expect(html).toContain('data-adsterra-size="320x50"');
    expect(html).not.toContain("highrevenueformat.com");
  });
});
