import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createGameConfig } from "@/lib/config/schema";
import { fixtureGameConfig } from "@/test/fixtures/game";
import { createCategoryDefinitions } from "@/config/categories";
import { SiteFooter } from "@/components/layout/site-footer";
import { HomePageContent, buildHomePageMetadata } from "./page";

const extendedConfig = () => createGameConfig({
  ...fixtureGameConfig,
  metadata: { title: "Archive SEO", description: "Archive description", keywords: "archive" },
  discordUrl: "https://discord.gg/test-server",
  youtubeUrl: "https://www.youtube.com/watch?v=test-video",
  content: {
    ...fixtureGameConfig.content,
    footer: { aboutTitle: "About this archive", about: "Independent fan-made archive.", description: "Archive overview.", playGame: "Visit the game" },
    homepage: {
      ...fixtureGameConfig.content.homepage,
      meta: { title: "Custom homepage SEO", description: "Custom homepage description" },
      hero: { eyebrow: "Fan-made archive", title: "Archive title", description: "An independent guide.", stats: ["Four maps"] },
      startHereTitle: "Choose your path",
      tertiaryAction: { label: "Learn the rules", reference: { kind: "guide", slug: "how-to-play" } },
      aboutGame: { title: "About the game", paragraphs: ["Verified game overview."], stats: [{ label: "Maps", value: "4" }], cta: "All guides" },
      finalCta: { title: "Ready to begin?", description: "Read the confirmed facts.", primary: "Begin now", secondary: "Visit the game" }
    }
  }
});

describe("phase one configuration consumers", () => {
  it("uses homepage-specific SEO without inventing a canonical host", () => {
    const metadata = buildHomePageMetadata(extendedConfig());
    expect(metadata.title).toEqual({ absolute: "Custom homepage SEO" });
    expect(metadata.openGraph).toMatchObject({ title: "Custom homepage SEO", description: "Custom homepage description" });
    expect(metadata.alternates).toBeUndefined();
  });

  it("renders supplied hero facts, third action, overview and final CTA", () => {
    render(<HomePageContent config={extendedConfig()} />);
    expect(screen.getByRole("heading", { level: 1, name: "Archive title" })).toBeVisible();
    expect(screen.getByText("Four maps")).toBeVisible();
    expect(screen.getByRole("link", { name: "Learn the rules" })).toHaveAttribute("href", "/guides/how-to-play");
    expect(screen.getByRole("heading", { name: "Choose your path" })).toBeVisible();
    expect(screen.getByText("Verified game overview.")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Ready to begin?" })).toBeVisible();
  });

  it("renders configured official channels and legal links in the footer", () => {
    render(<SiteFooter config={extendedConfig()} />);
    expect(screen.getByText("Independent fan-made archive.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Official Discord" })).toHaveAttribute("href", "https://discord.gg/test-server");
    expect(screen.getByRole("link", { name: "Official YouTube" })).toHaveAttribute("href", "https://www.youtube.com/watch?v=test-video");
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy-policy");
    expect(screen.getByRole("link", { name: "Terms of Service" })).toHaveAttribute("href", "/terms-of-service");
  });

  it("only exposes configured database categories and their configured labels", () => {
    const categories = createCategoryDefinitions([{ id: "database", label: "Explore", href: "/locations", children: [
      { id: "characters", label: "Characters", href: "/characters" },
      { id: "locations", label: "Maps", href: "/locations" }
    ] }]);
    expect(categories.map(({ slug, label }) => ({ slug, label }))).toEqual([
      { slug: "characters", label: "Characters" }, { slug: "locations", label: "Maps" }
    ]);
  });
});
