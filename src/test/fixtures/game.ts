export const fixtureGameConfig = {
  name: "Template Game",
  shortName: "Template",
  wikiName: "Template Game Wiki",
  tagline: "Explore an unknown world.",
  description: "A neutral configuration used only by tests.",
  platforms: ["PC"],
  locale: "en" as const,
  logoPath: "/images/brand/game-mark.svg",
  heroImagePath: "/images/brand/game-hero.svg",
  theme: {
    background: "#101010",
    surface: "#202020",
    surfaceRaised: "#303030",
    text: "#f0f0f0",
    textMuted: "#a0a0a0",
    primary: "#999999",
    primaryContrast: "#000000",
    secondary: "#555555",
    border: "#444444"
  },
  navigation: [
    { id: "home", label: "Home", href: "/" },
    { id: "guides", label: "Guides", href: "/guides" },
    {
      id: "database",
      label: "Database",
      href: "/weapons",
      children: [
        { id: "weapons", label: "Weapons", href: "/weapons" },
        { id: "bosses", label: "Bosses", href: "/bosses" },
        { id: "skills", label: "Skills", href: "/skills" },
        { id: "items", label: "Items", href: "/items" },
        { id: "characters", label: "Characters", href: "/characters" },
        { id: "locations", label: "Locations", href: "/locations" },
        { id: "quests", label: "Quests", href: "/quests" }
      ]
    },
    { id: "game-info", label: "Game Info", href: "/game-info" }
  ],
  content: {
    guideIndexDescription: "Neutral guide index description.",
    homepage: {
      startHereEyebrow: "Start here",
      primaryAction: { label: "Read field notes", reference: { kind: "guide" as const, slug: "field-notes" } },
      secondaryAction: { label: "Browse weapons", reference: { kind: "category" as const, category: "weapons" as const } },
      startHereLinks: [
        { label: "Field notes", description: "Prepare for an expedition.", reference: { kind: "guide" as const, slug: "field-notes" } }
      ],
      databaseAction: { label: "Browse entries", reference: { kind: "category" as const, category: "weapons" as const } },
      popularQuestions: [
        { label: "Where should I start?", reference: { kind: "guide" as const, slug: "field-notes" } }
      ]
    }
  }
};
