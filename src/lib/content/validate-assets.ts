import { readFileSync } from "node:fs";
import path from "node:path";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { gameConfig } from "../../config/game.ts";
import { createCategoryDefinitions } from "../../config/categories.ts";
import { assertLocalImageExists } from "../validation/assets.ts";
import { categorySlugs } from "./types.ts";
import { validateEntityCollection } from "./entity-validation.ts";
import { loadGuidesFromDirectory } from "./guide-source.ts";
import { createGuideImagePathCollector, createSafeGuideMdxPlugin } from "./guide-mdx.ts";

/** Shared build/test validation. No test runner, DOM, React or Next runtime. */
export const validateAssets = async ({
  rootDirectory = process.cwd(),
  config = gameConfig
} = {}): Promise<{ checkedImages: number; checkedDocuments: number }> => {
  const publicDirectory = path.join(rootDirectory, "public");
  let checkedImages = 0;
  let checkedDocuments = 0;
  const check = (image: string, source: string): void => {
    assertLocalImageExists(image, source, publicDirectory);
    checkedImages += 1;
  };

  check(config.logoPath, "gameConfig.logoPath");
  check(config.heroImagePath, "gameConfig.heroImagePath");
  const definitions = createCategoryDefinitions(config.navigation);
  for (const category of categorySlugs) {
    const source: unknown = JSON.parse(readFileSync(path.join(rootDirectory, "src/data", `${category}.json`), "utf8"));
    const definition = definitions.find((candidate) => candidate.slug === category);
    if (!definition) {
      if (!Array.isArray(source) || source.length !== 0) {
        throw new Error(`Hidden category "${category}" must have an empty content source`);
      }
      continue;
    }
    for (const entity of validateEntityCollection(category, source, definition)) {
      check(entity.image, `${category}/${entity.slug}`);
    }
  }

  for (const directory of ["guides", "pages"]) {
    for (const document of loadGuidesFromDirectory(path.join(rootDirectory, "src/content", directory))) {
      const source = `${directory}/${document.slug}`;
      if (document.frontmatter.image !== undefined) {
        check(document.frontmatter.image, `${source} frontmatter`);
      }
      const imagePaths: string[] = [];
      // Compile only to inspect the same MDX AST as rendering; never evaluate it.
      await compile(document.body, {
        remarkPlugins: [remarkGfm, createSafeGuideMdxPlugin(source), createGuideImagePathCollector(imagePaths)]
      });
      for (const image of imagePaths) check(image, `${source} Markdown`);
      checkedDocuments += 1;
    }
  }
  return { checkedImages, checkedDocuments };
};
