import { describe, it } from "vitest";
import { gameConfig } from "@/config/game";
import { compileGuide, getAllGuides } from "@/lib/content/guides";
import { getAllEntities } from "@/lib/content/queries";
import { assertLocalImageExists } from "@/lib/validation/assets";

describe("production content asset integrity", () => {
  it("resolves every configured, entity, and guide-local image to a regular public asset", async () => {
    assertLocalImageExists(gameConfig.logoPath, "gameConfig.logoPath");
    assertLocalImageExists(gameConfig.heroImagePath, "gameConfig.heroImagePath");

    for (const entity of getAllEntities()) {
      assertLocalImageExists(entity.image, `${entity.category}/${entity.slug}`);
    }

    for (const guide of getAllGuides()) {
      if (guide.frontmatter.image) {
        assertLocalImageExists(guide.frontmatter.image, `guides/${guide.slug} frontmatter`);
      }

      const { imagePaths } = await compileGuide(guide);
      for (const imagePath of imagePaths) {
        assertLocalImageExists(imagePath, `guides/${guide.slug} Markdown`);
      }
    }
  });
});
