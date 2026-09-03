import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { createElement } from "react";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { buildArticleJsonLd, buildVideoGameJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type StaticMetadataFactory = () => ReturnType<typeof buildPageMetadata>;

describe("SEO builders", () => {
  it("omits canonical when no production site URL is configured", () => {
    const metadata = buildPageMetadata({
      title: "Weapons",
      description: "Weapon database",
      pathname: "/weapons",
      siteUrl: undefined,
      image: "/images/weapons.jpg"
    });

    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph?.images).toBeUndefined();
  });

  it("creates canonical and Open Graph URL from an explicit site URL", () => {
    const metadata = buildPageMetadata({
      title: "Weapons",
      description: "Weapon database",
      pathname: "/weapons",
      siteUrl: "https://wiki.example",
    });

    expect(metadata.alternates?.canonical).toBe("https://wiki.example/weapons");
    expect(metadata.openGraph?.url).toBe("https://wiki.example/weapons");
  });

  it("does not invent unavailable VideoGame or Article properties", () => {
    const game = buildVideoGameJsonLd({
      name: "Template Game",
      description: "Neutral test content",
      platforms: ["PC"],
    });
    const article = buildArticleJsonLd({
      title: "Guide",
      description: "Demo",
      updatedAt: "2026-09-01",
      pathname: "/guides/demo",
    });

    expect(game).not.toHaveProperty("datePublished");
    expect(article).not.toHaveProperty("author");
    expect(article).not.toHaveProperty("url");
  });

  it("escapes script-terminating characters in JSON-LD", () => {
    const { container } = render(createElement(JsonLdScript, { data: { description: "</script><p>Unsafe" } }));

    expect(container.querySelector("script")?.innerHTML).toContain("\\u003c/script>");
  });

  it("gives guides and game information their own metadata", async () => {
    const guidesPage = await import("@/app/(site)/guides/page") as { generateMetadata: StaticMetadataFactory };
    const gameInfoPage = await import("@/app/(site)/game-info/page") as { generateMetadata: StaticMetadataFactory };

    expect(guidesPage.generateMetadata()).toMatchObject({ title: "Guides", description: expect.any(String) });
    expect(gameInfoPage.generateMetadata()).toMatchObject({ title: "Game Info", description: expect.any(String) });
  });
});
