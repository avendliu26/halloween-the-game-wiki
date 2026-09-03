import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { ContentReferenceSchema } from "./types.ts";
import { IsoDateSchema, LocalImagePathSchema, SlugSchema } from "../validation/common.ts";

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
