// @vitest-environment node
import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { gameConfig } from "../../config/game.ts";
import { categorySlugs } from "./types.ts";
import { validateAssets } from "./validate-assets.ts";

describe("production content asset integrity", () => {
  it("resolves every configured, entity, guide and research-page image", async () => {
    const result = await validateAssets();
    expect(result.checkedImages).toBeGreaterThan(0);
    expect(result.checkedDocuments).toBeGreaterThan(0);
  });

  describe("independent validator fixtures", () => {
    let rootDirectory: string;
    const image = "/images/placeholders/entity.svg";
    const entity = {
      id: "test", slug: "test", name: "Test", category: "characters", image,
      imageAlt: "Test art", summary: "Test entity", tags: ["test"], related: [], updatedAt: "2026-09-01",
      infobox: {}, sections: []
    };
    const saveEntities = (value: unknown) => writeFileSync(path.join(rootDirectory, "src/data/characters.json"), JSON.stringify(value));
    const saveMdx = (body: string, fields = "", directory = "guides") => {
      writeFileSync(path.join(rootDirectory, "src/content", directory, "test.mdx"),
        `---\nslug: test\ntitle: Test\ndescription: Test guide\nupdatedAt: "2026-09-01"\ntags: []\nrelated: []\n${fields}---\n${body}`);
    };
    beforeEach(() => {
      rootDirectory = mkdtempSync(path.join(os.tmpdir(), "halloween-assets-"));
      for (const directory of ["src/data", "src/content/guides", "src/content/pages"]) {
        mkdirSync(path.join(rootDirectory, directory), { recursive: true });
      }
      cpSync(path.resolve("public"), path.join(rootDirectory, "public"), { recursive: true });
      for (const category of categorySlugs) {
        writeFileSync(path.join(rootDirectory, "src/data", `${category}.json`), "[]");
      }
    });
    afterEach(() => rmSync(rootDirectory, { recursive: true, force: true }));

    it("accepts valid config, JSON, frontmatter, direct and repeated reference images", async () => {
      saveEntities([entity]);
      saveMdx(`![Direct](${image})\n\n![One][art]\n\n![Two][ART]\n\n[art]: ${image}`,
        `image: ${image}\nimageAlt: Art\n`);
      await expect(validateAssets({ rootDirectory })).resolves.toEqual({ checkedImages: 7, checkedDocuments: 1 });
    });
    it.each(["logoPath", "heroImagePath"] as const)("checks config %s", async (field) => {
      await expect(validateAssets({ rootDirectory, config: { ...gameConfig, [field]: "/images/test/missing-image.webp" } }))
        .rejects.toThrow(/Missing local image.*gameConfig/);
    });
    it.each(["", "https://example.com/image.webp", "/images/../outside.svg", "/images/%2e%2e/outside.svg", "/images/a.svg?x=1", "/images/a.svg#x", "/images/a\\b.svg", "/images/%XX.svg"])
    ("rejects invalid config image %j", async (invalid) => {
      await expect(validateAssets({ rootDirectory, config: { ...gameConfig, logoPath: invalid } })).rejects.toThrow(/Invalid local image/);
    });
    it.each(["/images/test/missing-image.webp", "", "https://example.com/image.webp", "/images/../outside.svg"])
    ("rejects invalid or missing JSON image %j", async (invalid) => {
      saveEntities([{ ...entity, image: invalid }]);
      await expect(validateAssets({ rootDirectory })).rejects.toThrow();
    });
    it("rejects duplicate JSON entities", async () => {
      saveEntities([entity, entity]);
      await expect(validateAssets({ rootDirectory })).rejects.toThrow(/duplicate entity id/);
    });
    it.each(["guides", "pages"])("checks MDX body images in %s", async (directory) => {
      saveMdx("![Missing](/images/test/missing-image.webp)", "", directory);
      await expect(validateAssets({ rootDirectory })).rejects.toThrow(new RegExp(`Missing local image.*${directory}/test Markdown`));
    });
    it.each(["guides", "pages"])("checks frontmatter images in %s", async (directory) => {
      saveMdx("Body", "image: /images/test/missing-image.webp\nimageAlt: Missing\n", directory);
      await expect(validateAssets({ rootDirectory })).rejects.toThrow(/Missing local image.*frontmatter/);
    });
    it.each(["", "https://example.com/image.webp", "/images/../outside.svg"])("rejects invalid frontmatter image %j", async (invalid) => {
      saveMdx("Body", `image: ${JSON.stringify(invalid)}\nimageAlt: Art\n`);
      await expect(validateAssets({ rootDirectory })).rejects.toThrow(/Invalid guide/);
    });
    it.each([
      "![Empty]()", "![Remote](https://example.com/art.svg)",
      "![Traversal](/images/%2e%2e/outside.svg)",
      "![Reference][art]\n\n[art]: <>\n[art]: /images/placeholders/entity.svg",
      "![Reference][art]\n\n[art]: https://example.com/remote.svg\n[art]: /images/placeholders/entity.svg",
      '<img src="/images/placeholders/entity.svg" />', "export const unsafe = true", "{process.env.SECRET}"
    ])("rejects unsafe MDX %j", async (body) => {
      saveMdx(body);
      await expect(validateAssets({ rootDirectory })).rejects.toThrow(/Unsafe MDX/);
    });
    it("uses the first duplicate image definition, even when a later file exists", async () => {
      saveMdx(`![Art][art]\n\n[art]: /images/test/missing-image.webp\n[art]: ${image}`);
      await expect(validateAssets({ rootDirectory })).rejects.toThrow(/Missing local image.*missing-image.webp/);
    });
    it("ignores code examples and does not execute allowed MDX components", async () => {
      saveMdx('```md\n![Example](https://example.com/image.webp)\n```\n\n<ImportantNote title="Safe">Note</ImportantNote>');
      await expect(validateAssets({ rootDirectory })).resolves.toEqual({ checkedImages: 2, checkedDocuments: 1 });
    });
    it("rejects directories and symlinks escaping public/images", async () => {
      saveMdx("![Directory](/images/brand)");
      await expect(validateAssets({ rootDirectory })).rejects.toThrow(/regular file/);
      writeFileSync(path.join(rootDirectory, "outside.svg"), "outside");
      symlinkSync(path.join(rootDirectory, "outside.svg"), path.join(rootDirectory, "public/images/escape.svg"));
      saveMdx("![Escape](/images/escape.svg)");
      await expect(validateAssets({ rootDirectory })).rejects.toThrow(/escapes public\/images/);
    });
  });
});
