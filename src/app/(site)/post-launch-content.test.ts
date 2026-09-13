import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { gameConfig } from "@/config/game";
import { getGuide } from "@/lib/content/guides";
import { getResearchPage } from "@/lib/content/pages";
import { metadata as privacyMetadata } from "./privacy-policy/page";
import { metadata as termsMetadata } from "./terms-of-service/page";

const requireGuide = (slug: string) => {
  const guide = getGuide(slug);
  expect(guide, slug).toBeDefined();
  return guide!;
};

const requirePage = (slug: string) => {
  const page = getResearchPage(slug);
  expect(page, slug).toBeDefined();
  return page!;
};

describe("post-launch gameplay content", () => {
  it("prioritizes gameplay destinations on the homepage", () => {
    expect(gameConfig.content.homepage.meta?.title).toBe(
      "Halloween: The Game Wiki — Characters & Gameplay Guides"
    );
    expect(gameConfig.content.homepage.hero?.title).toBe("Halloween: The Game Wiki");
    expect(gameConfig.content.homepage.startHereLinks.map(({ label }) => label)).toEqual([
      "Challenges",
      "Characters",
      "Michael Myers",
      "Perks",
      "How to Play",
      "Police Respawn",
      "Crossplay"
    ]);

    const homepageCopy = JSON.stringify(gameConfig.content.homepage);
    expect(homepageCopy).not.toMatch(/releases sep|await launch|before launch|pre-launch preparation/i);
  });

  it("turns How to Play and the beginner guide into practical post-launch guides", () => {
    const howToPlay = requireGuide("how-to-play");
    const beginner = requireGuide("beginner-guide");

    expect(howToPlay.body).toContain("## Quick Answer");
    expect(howToPlay.body).toContain("## Steps");
    expect(howToPlay.body).toContain("## Key Mechanics");
    expect(howToPlay.body).toContain("## Beginner Mistakes");
    expect(howToPlay.body).toMatch(/residents/i);
    expect(howToPlay.body).toMatch(/Sheriff's Deputy/i);

    expect(beginner.frontmatter.title).toBe("Halloween: The Game Beginner Guide");
    expect(beginner.body).toContain("## What Beginners Should Do First");
    expect(beginner.body).toContain("## Playing as Michael Myers");
    expect(beginner.body).toContain("## Playing as Civilians");
    expect(beginner.body).toContain("## Perk Decks");
    expect(beginner.body).toContain("## What to Do After Dying");
    expect(beginner.body).not.toMatch(/pre-launch preparation|before entering Haddonfield/i);
  });

  it("publishes current Michael, police, crossplay, release, and character answers", () => {
    const michael = requirePage("michael-myers");
    const police = requireGuide("how-to-respawn-as-police");
    const crossplay = requirePage("crossplay");
    const release = requirePage("release-date");
    const characters = requirePage("characters");

    expect(michael.body).toMatch(/community-tested/i);
    expect(michael.body).toMatch(/approximately 5 seconds/i);
    expect(michael.body).toMatch(/3½–4 minutes/i);
    expect(michael.body).toContain("Patch 1.0.1");

    expect(police.body).toContain("## Step-by-Step");
    expect(police.body).toContain("## Officially Confirmed");
    expect(police.body).toContain("## Community-Tested Behavior");
    expect(police.body).toContain("## What Is Still Uncertain");

    expect(crossplay.body).toContain("Patch 1.0.1");
    expect(crossplay.body).toContain("## How to Turn Off Crossplay");
    expect(crossplay.body).toMatch(/PS5.*Xbox.*PC/is);

    expect(release.frontmatter.title).toBe("Halloween: The Game Release Date — Out Now");
    expect(release.body).toMatch(/released.*September 8, 2026/i);
    expect(release.body).not.toContain("## Before launch");

    expect(characters.frontmatter.title).toContain("Characters Guide");
    expect(characters.body).toMatch(/\| Character \| Availability \/ unlock \| Traits or role \| Starting item \|/);
  });

  it("keeps legal pages accessible but removes them from search indexing", () => {
    expect(privacyMetadata.robots).toMatchObject({ index: false, follow: true });
    expect(termsMetadata.robots).toMatchObject({ index: false, follow: true });

    const paths = sitemap().map(({ url }) => new URL(url).pathname);
    expect(paths).not.toContain("/privacy-policy");
    expect(paths).not.toContain("/terms-of-service");
  });
});
