import { render, screen } from "@testing-library/react";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { compileGuide, parseGuideSource, prepareGuideBody } from "@/lib/content/guides";
import { assertLocalImageExists } from "@/lib/validation/assets";
import * as guidesModule from "@/lib/content/guides";

const frontmatter = (overrides = "", updatedAt = '"2026-09-01"') =>
  `---\nslug: test-guide\ntitle: Test Guide\ndescription: Test description\nupdatedAt: ${updatedAt}\ntags: [starter]\nrelated: []\n${overrides}---\n`;

describe("guide content", () => {
  it("parses required frontmatter and retains MDX body", () => {
    const source = `${frontmatter()}## First Step\nBody`;
    const record = parseGuideSource(source, "test-guide");

    expect(record.frontmatter.title).toBe("Test Guide");
    expect(record.frontmatter.slug).toBe("test-guide");
    expect(record.body).toContain("## First Step");
  });

  it("accepts complete optional article frontmatter", () => {
    const record = parseGuideSource(
      `${frontmatter(
        'publishedAt: "2026-08-30"\nauthor: "Mara Venn"\nimage: "/images/placeholders/entity.svg"\nimageAlt: "A route traced across the fictional vale"\n'
      )}Body`,
      "test-guide"
    );

    expect(record.frontmatter).toMatchObject({
      publishedAt: "2026-08-30",
      author: "Mara Venn",
      image: "/images/placeholders/entity.svg",
      imageAlt: "A route traced across the fictional vale"
    });
  });

  it("discovers guides from an independent fixture directory", () => {
    const loadGuidesFromDirectory = (guidesModule as typeof guidesModule & {
      loadGuidesFromDirectory?: (directory: string) => ReturnType<typeof guidesModule.getAllGuides>;
    }).loadGuidesFromDirectory;
    const guides = loadGuidesFromDirectory?.(path.resolve("src/test/fixtures/guides"));

    expect(guides?.map((guide) => guide.slug)).toEqual(["field-notes"]);
  });

  it("rejects missing descriptions", () => {
    expect(() =>
      parseGuideSource(`---\nslug: broken\ntitle: Broken\nupdatedAt: "2026-09-01"\ntags: []\nrelated: []\n---\nText`, "broken")
    ).toThrow();
  });

  it.each([
    ["updatedAt 2026-9-01", "", '"2026-9-01"', "updatedAt"],
    ["updatedAt 2026-02-30", "", '"2026-02-30"', "updatedAt"],
    ["publishedAt prose date", 'publishedAt: "September 1, 2026"\n', '"2026-09-01"', "publishedAt"],
    [
      "publishedAt timestamp",
      'publishedAt: "2026-09-01T12:00:00Z"\n',
      '"2026-09-01"',
      "publishedAt"
    ]
  ])("rejects invalid guide date in %s", (_label, overrides, updatedAt, fieldName) => {
    expect(() => parseGuideSource(`${frontmatter(overrides, updatedAt)}Body`, "test-guide")).toThrow(fieldName);
  });

  it.each([
    'image: "https://cdn.example/guide.jpg"\nimageAlt: "Remote"\n',
    'image: "/images/../guide.jpg"\nimageAlt: "Traversal"\n',
    'image: "/images/guide.jpg?size=2"\nimageAlt: "Query"\n'
  ])("rejects unsafe guide image frontmatter", (imageFields) => {
    expect(() => parseGuideSource(`${frontmatter(imageFields)}Body`, "test-guide")).toThrow();
  });

  it("requires image and imageAlt together", () => {
    expect(() =>
      parseGuideSource(`${frontmatter('image: "/images/placeholders/entity.svg"\n')}Body`, "test-guide")
    ).toThrow(/imageAlt/);
    expect(() => parseGuideSource(`${frontmatter('imageAlt: "Orphan alt"\n')}Body`, "test-guide")).toThrow(
      /image/
    );
  });

  it("rejects invalid or mismatched guide slugs", () => {
    expect(() => parseGuideSource(`${frontmatter().replace("test-guide", "Test Guide")}Body`, "Test Guide")).toThrow();
    expect(() => parseGuideSource(`${frontmatter()}Body`, "another-guide")).toThrow(/slug/i);
  });

  it("rejects duplicate guide slugs in the content registry", () => {
    const record = parseGuideSource(`${frontmatter()}Body`, "test-guide");
    const validateGuideRecords = (
      guidesModule as typeof guidesModule & {
        validateGuideRecords?: (records: typeof record[]) => typeof record[];
      }
    ).validateGuideRecords;

    expect(() => validateGuideRecords?.([record, { ...record }])).toThrow(/duplicate guide slug.*test-guide/i);
  });

  it("rewrites the exact heading IDs it returns for the table of contents", () => {
    const prepared = prepareGuideBody("## First Route\n\n### First Route");

    expect(prepared).toEqual({
      body: '<h2 id="first-route">First Route</h2>\n\n<h3 id="first-route-2">First Route</h3>',
      headings: [
        { depth: 2, text: "First Route", id: "first-route" },
        { depth: 3, text: "First Route", id: "first-route-2" }
      ]
    });
  });

  it("compiles a GFM pipe table into a semantic table", async () => {
    const record = parseGuideSource(
      `${frontmatter()}| Route | Risk |\n| --- | --- |\n| Causeway | High |`,
      "test-guide"
    );
    const compiled = await compileGuide(record);

    render(compiled.content);

    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Route" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "High" })).toBeVisible();
  });

  it.each([
    ["raw HTML", "<div>Unsafe HTML</div>"],
    ["script", "<script>alert('unsafe')</script>"],
    ["remote iframe", '<iframe src="https://example.com/embed" />'],
    ["arbitrary JSX", "<Callout>Unsafe</Callout>"],
    ["expression", "The value is {process.env.SECRET}"],
    ["ESM", "export const unsafe = true"],
    ["remote Markdown image", "![Remote](https://cdn.example/guide.png)"]
  ])("rejects unsafe %s with a slug-aware error", async (_label, body) => {
    const record = parseGuideSource(`${frontmatter()}${body}`, "test-guide");

    await expect(compileGuide(record)).rejects.toThrow(/guide "test-guide"/i);
  });

  it("allows ImportantNote and local Markdown images", async () => {
    const record = parseGuideSource(
      `${frontmatter()}<ImportantNote title="Safe note">Local content only.</ImportantNote>\n\n![Local art](/images/placeholders/entity.svg)`,
      "test-guide"
    );
    const compiled = await compileGuide(record);

    render(compiled.content);

    expect(screen.getByRole("note")).toHaveTextContent("Local content only.");
    expect(screen.getByRole("img", { name: "Local art" })).toHaveAttribute(
      "src",
      "/images/placeholders/entity.svg"
    );
  });

  it("collects direct and reference-style local image paths from the MDX AST", async () => {
    const record = parseGuideSource(
      `${frontmatter()}![Direct art](/images/placeholders/entity.svg)\n\n![Reference art][art]\n\n[art]: /images/placeholders/entity.svg`,
      "test-guide"
    );

    await expect(compileGuide(record)).resolves.toMatchObject({
      imagePaths: ["/images/placeholders/entity.svg", "/images/placeholders/entity.svg"]
    });
  });

  it("uses the first duplicate Markdown definition for both rendering and asset collection", async () => {
    const record = parseGuideSource(
      `${frontmatter()}![Reference art][art]\n\n[art]: /images/missing-first.svg\n[art]: /images/placeholders/entity.svg`,
      "test-guide"
    );
    const compiled = await compileGuide(record);

    render(compiled.content);

    expect(screen.getByRole("img", { name: "Reference art" })).toHaveAttribute("src", "/images/missing-first.svg");
    expect(compiled.imagePaths).toEqual(["/images/missing-first.svg"]);
    expect(() =>
      assertLocalImageExists("/images/missing-first.svg", "guides/test-guide Markdown", path.resolve("src/test/fixtures/public"))
    ).toThrow(/guides\/test-guide Markdown.*missing-first.svg/);
  });

  it("rejects a remote first Markdown definition even when a later definition is local", async () => {
    const record = parseGuideSource(
      `${frontmatter()}![Reference art][art]\n\n[art]: https://cdn.example/remote.svg\n[art]: /images/placeholders/entity.svg`,
      "test-guide"
    );

    await expect(compileGuide(record)).rejects.toThrow(/guide "test-guide"/i);
  });

  it("rejects an empty direct Markdown image destination before rendering", async () => {
    const record = parseGuideSource(`${frontmatter()}![Empty]()`, "test-guide");

    await expect(compileGuide(record)).rejects.toThrow(/guide "test-guide".*received ""/i);
  });

  it("rejects an empty first reference definition instead of using a later local definition", async () => {
    const record = parseGuideSource(
      `${frontmatter()}![Empty][art]\n\n[art]: <>\n[art]: /images/brand/game-hero.svg`,
      "test-guide"
    );

    await expect(compileGuide(record)).rejects.toThrow(/guide "test-guide".*received ""/i);
  });

  it("uses the prepared headings returned with compiled MDX", async () => {
    const record = parseGuideSource(
      `${frontmatter()}## First Route\n\n### First Route`,
      "test-guide"
    );

    await expect(compileGuide(record)).resolves.toMatchObject({
      headings: [
        { depth: 2, text: "First Route", id: "first-route" },
        { depth: 3, text: "First Route", id: "first-route-2" }
      ]
    });
  });

  it("compiles the fence-aware prepared heading set", async () => {
    const record = parseGuideSource(
      `${frontmatter()}\`\`\`md\n## Example\n\`\`\`\n\n## Live heading`,
      "test-guide"
    );

    await expect(compileGuide(record)).resolves.toMatchObject({
      headings: [{ depth: 2, text: "Live heading", id: "live-heading" }]
    });
  });
});
