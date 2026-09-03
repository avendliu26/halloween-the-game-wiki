import { z } from "zod";
import { IsoDateSchema, LocalImagePathSchema, SlugSchema } from "@/lib/validation/common";

export const categorySlugs = [
  "weapons",
  "bosses",
  "skills",
  "items",
  "characters",
  "locations",
  "quests"
] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export const CategorySlugSchema = z.enum(categorySlugs);

export const ContentReferenceSchema = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: z.literal("entity"),
    category: CategorySlugSchema,
    slug: SlugSchema
  }),
  z.strictObject({
    kind: z.literal("guide"),
    slug: SlugSchema
  })
]);

export const InternalReferenceSchema = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: z.literal("page"),
    slug: SlugSchema,
    anchor: SlugSchema.optional()
  }),
  z.strictObject({
    kind: z.literal("category"),
    category: CategorySlugSchema
  }),
  z.strictObject({
    kind: z.literal("entity"),
    category: CategorySlugSchema,
    slug: SlugSchema,
    anchor: SlugSchema.optional()
  }),
  z.strictObject({
    kind: z.literal("guide"),
    slug: SlugSchema,
    anchor: SlugSchema.optional()
  })
]);

const WikiSectionBaseSchema = z.strictObject({
  id: z.string().min(1),
  title: z.string().min(1)
});

export const WikiSectionSchema = z.discriminatedUnion("type", [
  WikiSectionBaseSchema.extend({
    type: z.literal("prose"),
    body: z.string().min(1)
  }),
  WikiSectionBaseSchema.extend({
    type: z.literal("list"),
    items: z.array(z.string().min(1)).min(1)
  }),
  WikiSectionBaseSchema.extend({
    type: z.literal("stats"),
    stats: z
    .array(
      z.strictObject({
        label: z.string().min(1),
        value: z.string().min(1)
      })
    )
      .min(1)
  })
]);

export const InfoboxValueSchema = z.union([
  z.string(),
  z.number(),
  z.array(z.string()),
  z.null()
]);

export const WikiEntitySchema = z.strictObject({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  category: CategorySlugSchema,
  image: LocalImagePathSchema,
  imageAlt: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  updatedAt: IsoDateSchema.optional(),
  featured: z.boolean().optional(),
  related: z.array(ContentReferenceSchema),
  infobox: z.record(z.string(), InfoboxValueSchema),
  sections: z.array(WikiSectionSchema)
});

export type ContentReference = z.infer<typeof ContentReferenceSchema>;
export type InternalReference = z.infer<typeof InternalReferenceSchema>;
export type WikiSection = z.infer<typeof WikiSectionSchema>;
export type InfoboxValue = z.infer<typeof InfoboxValueSchema>;
export type WikiEntity = z.infer<typeof WikiEntitySchema>;

export type CategoryDefinition = {
  slug: CategorySlug;
  label: string;
  singularLabel: string;
  description: string;
  glyph: string;
  cardFields: readonly string[];
  infoboxFields: readonly { key: string; label: string }[];
  supportedSectionIds: readonly string[];
};
