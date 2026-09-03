import { z } from "zod";
import { InternalReferenceSchema } from "../content/types.ts";
import { HttpUrlSchema, IsoDateSchema, LocalImagePathSchema } from "../validation/common.ts";

type NavigationItemInput = {
  id: string;
  label: string;
  href: string;
  children?: NavigationItemInput[];
};

export const NavigationItemSchema: z.ZodType<NavigationItemInput> = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase kebab-case navigation id"),
  label: z.string().min(1),
  href: z.string().startsWith("/"),
  children: z.array(z.lazy(() => NavigationItemSchema)).optional()
});

export const ThemeSchema = z.object({
  background: z.string().min(1),
  surface: z.string().min(1),
  surfaceRaised: z.string().min(1),
  text: z.string().min(1),
  textMuted: z.string().min(1),
  primary: z.string().min(1),
  primaryContrast: z.string().min(1),
  secondary: z.string().min(1),
  border: z.string().min(1)
});

const InternalActionSchema = z.strictObject({
  label: z.string().min(1),
  reference: InternalReferenceSchema
});

const EditorialContentSchema = z.strictObject({
  guideIndexDescription: z.string().min(1),
  footer: z.strictObject({
    aboutTitle: z.string().min(1),
    about: z.string().min(1),
    description: z.string().min(1),
    playGame: z.string().min(1)
  }).optional(),
  gameInfoDemoNotice: z.strictObject({
    title: z.string().min(1),
    body: z.string().min(1)
  }).optional(),
  footerDisclaimer: z.string().min(1).optional(),
  homepage: z.strictObject({
    meta: z.strictObject({ title: z.string().min(1).max(60), description: z.string().min(1).max(160) }).optional(),
    hero: z.strictObject({
      eyebrow: z.string().min(1), title: z.string().min(1), description: z.string().min(1),
      stats: z.array(z.string().min(1)).min(1)
    }).optional(),
    startHereTitle: z.string().min(1).optional(),
    tertiaryAction: InternalActionSchema.optional(),
    aboutGame: z.strictObject({
      title: z.string().min(1), paragraphs: z.array(z.string().min(1)).min(1),
      stats: z.array(z.strictObject({ label: z.string().min(1), value: z.string().min(1) })),
      cta: z.string().min(1)
    }).optional(),
    finalCta: z.strictObject({
      title: z.string().min(1), description: z.string().min(1), primary: z.string().min(1), secondary: z.string().min(1)
    }).optional(),
    startHereEyebrow: z.string().min(1),
    primaryAction: InternalActionSchema,
    secondaryAction: InternalActionSchema,
    startHereLinks: z
      .array(
        InternalActionSchema.extend({
          description: z.string().min(1)
        })
      )
      .min(1),
    databaseAction: InternalActionSchema,
    popularQuestions: z.array(InternalActionSchema).min(1)
  })
});

export const GameConfigSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  wikiName: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  developer: z.string().min(1).optional(),
  publisher: z.string().min(1).optional(),
  releaseDate: IsoDateSchema.optional(),
  platforms: z.array(z.string().min(1)).min(1),
  officialWebsite: HttpUrlSchema.optional(),
  steamUrl: HttpUrlSchema.optional(),
  discordUrl: HttpUrlSchema.optional(),
  youtubeUrl: HttpUrlSchema.optional(),
  metadata: z.strictObject({
    title: z.string().min(1).max(60), description: z.string().min(1).max(160), keywords: z.string().min(1).max(100)
  }).optional(),
  siteUrl: HttpUrlSchema.optional(),
  locale: z.literal("en"),
  logoPath: LocalImagePathSchema,
  heroImagePath: LocalImagePathSchema,
  theme: ThemeSchema,
  navigation: z.array(NavigationItemSchema).min(1),
  content: EditorialContentSchema
}).superRefine((config, context) => {
  const seenIds = new Set<string>();
  const visit = (item: NavigationItemInput): void => {
    if (seenIds.has(item.id)) {
      context.addIssue({
        code: "custom",
        path: ["navigation"],
        message: `Duplicate navigation id "${item.id}"`
      });
    }
    seenIds.add(item.id);
    item.children?.forEach(visit);
  };

  config.navigation.forEach(visit);
});

export type NavigationItem = z.infer<typeof NavigationItemSchema>;
export type GameConfig = z.infer<typeof GameConfigSchema>;

export const createGameConfig = (input: unknown): GameConfig => GameConfigSchema.parse(input);
