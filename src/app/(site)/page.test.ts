import { render, screen } from "@testing-library/react";
import { createElement, type ComponentType } from "react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/site-footer";
import { createGameConfig, type GameConfig } from "@/lib/config/schema";
import { fixtureGameConfig } from "@/test/fixtures/game";
import * as homePageModule from "./page";

const alternateConfig = createGameConfig({
  ...fixtureGameConfig,
  name: "The Lanterned Vale",
  shortName: "Lanterned Vale",
  wikiName: "The Lanterned Vale Archive",
  content: {
    ...fixtureGameConfig.content,
    footerDisclaimer: "The Lanterned Vale is an original fictional demonstration.",
    homepage: {
      ...fixtureGameConfig.content.homepage,
      startHereEyebrow: "New to the vale?",
      primaryAction: {
        label: "Read the Pathfinder Guide",
        reference: { kind: "guide", slug: "pathfinder-guide" }
      },
      secondaryAction: {
        label: "Browse skills",
        reference: { kind: "category", category: "skills" }
      },
      startHereLinks: [
        {
          label: "Glass Step",
          description: "Learn a fictional movement art.",
          reference: { kind: "entity", category: "skills", slug: "glass-step" }
        }
      ],
      databaseAction: {
        label: "Browse the skills archive",
        reference: { kind: "category", category: "skills" }
      },
      popularQuestions: [
        {
          label: "When should I use Glass Step?",
          reference: { kind: "guide", slug: "pathfinder-guide", anchor: "glass-step-timing" }
        }
      ]
    }
  }
});

describe("HomePage", () => {
  it("exports metadata through the shared page metadata builder", () => {
    expect(typeof homePageModule.generateMetadata).toBe("function");
  });

  it("builds absolute homepage SEO values from a fixture-controlled site URL", () => {
    const buildHomePageMetadata = (homePageModule as typeof homePageModule & {
      buildHomePageMetadata?: (config: GameConfig) => ReturnType<typeof homePageModule.generateMetadata>;
    }).buildHomePageMetadata;
    const config = createGameConfig({ ...fixtureGameConfig, siteUrl: "https://test-game.example" });
    const metadata = buildHomePageMetadata?.(config);

    expect(metadata).toMatchObject({
      title: { absolute: "Template Game Wiki" },
      alternates: { canonical: "https://test-game.example/" },
      openGraph: {
        title: "Template Game Wiki",
        description: "A neutral configuration used only by tests.",
        url: "https://test-game.example/",
        images: [{ url: "https://test-game.example/images/brand/game-hero.svg" }]
      }
    });
  });

  it("omits homepage canonical and Open Graph URL/image without a fixture site URL", () => {
    const buildHomePageMetadata = (homePageModule as typeof homePageModule & {
      buildHomePageMetadata?: (config: GameConfig) => ReturnType<typeof homePageModule.generateMetadata>;
    }).buildHomePageMetadata;
    const metadata = buildHomePageMetadata?.(createGameConfig(fixtureGameConfig));

    expect(metadata?.alternates).toBeUndefined();
    expect(metadata?.openGraph?.url).toBeUndefined();
    expect(metadata?.openGraph?.images).toBeUndefined();
  });

  it("uses the configured game name in hero artwork alt text", () => {
    expect(homePageModule.getHeroImageAlt("The Lanterned Vale")).toBe(
      "Fan-made placeholder for The Lanterned Vale; not official game artwork"
    );
  });

  it("renders non-default homepage editorial and references from config", () => {
    const HomePageContent = (
      homePageModule as typeof homePageModule & {
        HomePageContent?: ComponentType<{ config: GameConfig }>;
      }
    ).HomePageContent;

    render(HomePageContent ? createElement(HomePageContent, { config: alternateConfig }) : createElement("div"));

    expect(screen.getByText("New to the vale?")).toBeVisible();
    expect(screen.getByRole("link", { name: "Read the Pathfinder Guide" })).toHaveAttribute(
      "href",
      "/guides/pathfinder-guide"
    );
    expect(
      screen.getByRole("link", { name: "Glass Step Learn a fictional movement art." })
    ).toHaveAttribute("href", "/skills/glass-step");
    expect(screen.getByRole("link", { name: "When should I use Glass Step?" })).toHaveAttribute(
      "href",
      "/guides/pathfinder-guide#glass-step-timing"
    );
  });

  it("renders the configured footer identity and disclaimer", () => {
    render(
      createElement(SiteFooter as ComponentType<{ config: GameConfig }>, {
        config: alternateConfig
      })
    );

    expect(screen.getByText(/The Lanterned Vale Archive\./)).toBeVisible();
    expect(screen.getByText("The Lanterned Vale is an original fictional demonstration.")).toBeVisible();
  });
});
