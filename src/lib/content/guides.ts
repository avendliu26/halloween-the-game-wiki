import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { ImportantNote } from "@/components/wiki/important-note";
import { createGuideHeadingPlugin, createGuideImagePathCollector, createSafeGuideMdxPlugin } from "@/lib/content/guide-mdx";
import { ContentReferenceSchema } from "@/lib/content/types";
import { IsoDateSchema, LocalImagePathSchema, SlugSchema } from "@/lib/validation/common";

const guidesDirectory = path.join(process.cwd(), "src/content/guides");

export const GuideFrontmatterSchema = z.strictObject({
  slug: SlugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  updatedAt: IsoDateSchema,
  publishedAt: IsoDateSchema.optional(),
  author: z.string().min(1).optional(),
  image: LocalImagePathSchema.optional(),
  imageAlt: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)),
  featured: z.boolean().optional(),
  related: z.array(ContentReferenceSchema)
}).superRefine((frontmatter, context) => {
  if (frontmatter.image && !frontmatter.imageAlt) {
    context.addIssue({ code: "custom", path: ["imageAlt"], message: "imageAlt is required when image is present" });
  }

  if (frontmatter.imageAlt && !frontmatter.image) {
    context.addIssue({ code: "custom", path: ["image"], message: "image is required when imageAlt is present" });
  }
});

export type GuideFrontmatter = z.infer<typeof GuideFrontmatterSchema>;

export type GuideRecord = {
  slug: string;
  frontmatter: GuideFrontmatter;
  body: string;
};

export type GuideHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

export const mdxComponents = { ImportantNote };

const headingExpression = /^(#{2,3})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/;
const openingFenceExpression = /^[ \t]{0,3}(`{3,}|~{3,})/;

type CodeFence = {
  character: "`" | "~";
  length: number;
};

const slugifyHeading = (text: string): string => {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");

  return slug || "section";
};

const getOpeningFence = (line: string): CodeFence | undefined => {
  const marker = line.match(openingFenceExpression)?.[1];

  if (!marker) {
    return undefined;
  }

  return { character: marker[0] as CodeFence["character"], length: marker.length };
};

const isClosingFence = (line: string, fence: CodeFence): boolean =>
  new RegExp(`^[ \\t]{0,3}${fence.character}{${fence.length},}[ \\t]*$`).test(line);

const allocateHeadingId = (baseId: string, allocatedIds: Set<string>): string => {
  let id = baseId;
  let suffix = 2;

  while (allocatedIds.has(id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  allocatedIds.add(id);
  return id;
};

export const prepareGuideBody = (body: string): { body: string; headings: GuideHeading[] } => {
  const parts = body.split(/(\r?\n)/);
  const allocatedIds = new Set<string>();
  const headings: GuideHeading[] = [];
  let activeFence: CodeFence | undefined;

  for (let index = 0; index < parts.length; index += 2) {
    const line = parts[index];

    if (activeFence) {
      if (isClosingFence(line, activeFence)) {
        activeFence = undefined;
      }
      continue;
    }

    const openingFence = getOpeningFence(line);
    if (openingFence) {
      activeFence = openingFence;
      continue;
    }

    const match = line.match(headingExpression);
    if (!match) {
      continue;
    }

    const depth = match[1].length as GuideHeading["depth"];
    const headingText = match[2].trim();
    const id = allocateHeadingId(slugifyHeading(headingText), allocatedIds);

    headings.push({ depth, text: headingText, id });
    parts[index] = `<h${depth} id="${id}">${headingText}</h${depth}>`;
  }

  return { body: parts.join(""), headings };
};

export const extractHeadings = (body: string): GuideHeading[] => prepareGuideBody(body).headings;

export const parseGuideSource = (source: string, slug: string): GuideRecord => {
  const slugResult = SlugSchema.safeParse(slug);

  if (!slugResult.success) {
    throw new Error(`Invalid guide slug "${slug}": ${slugResult.error.message}`);
  }

  const { data, content } = matter(source);
  const result = GuideFrontmatterSchema.safeParse(data);

  if (!result.success) {
    throw new Error(`Invalid guide "${slug}": ${result.error.message}`);
  }

  if (result.data.slug !== slug) {
    throw new Error(`Invalid guide "${slug}": frontmatter slug "${result.data.slug}" must match the file slug`);
  }

  return { slug, frontmatter: result.data, body: content };
};

export const validateGuideRecords = (records: GuideRecord[]): GuideRecord[] => {
  const slugs = new Set<string>();

  for (const record of records) {
    if (slugs.has(record.slug)) {
      throw new Error(`Invalid guide registry: duplicate guide slug "${record.slug}"`);
    }
    slugs.add(record.slug);
  }

  return records;
};

export const loadGuidesFromDirectory = (directory: string): GuideRecord[] => {
  const records = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => {
      const slug = entry.name.slice(0, -".mdx".length);
      return parseGuideSource(readFileSync(path.join(directory, entry.name), "utf8"), slug);
    });

  return validateGuideRecords(records).sort(
      (left, right) =>
        right.frontmatter.updatedAt.localeCompare(left.frontmatter.updatedAt) || left.slug.localeCompare(right.slug)
    );
};

export const getAllGuides = (): GuideRecord[] => loadGuidesFromDirectory(guidesDirectory);

export const getGuide = (slug: string): GuideRecord | undefined =>
  getAllGuides().find((guide) => guide.slug === slug);

export const compileGuide = async (record: GuideRecord) => {
  const headings: GuideHeading[] = [];
  const imagePaths: string[] = [];
  const compiled = await compileMDX({
    source: record.body,
    components: mdxComponents,
    options: {
      blockJS: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          createSafeGuideMdxPlugin(record.slug),
          createGuideHeadingPlugin(headings),
          createGuideImagePathCollector(imagePaths)
        ]
      }
    }
  });

  return { ...compiled, headings, imagePaths };
};
