import { createGameConfig } from "../lib/config/schema.ts";

// This deployed wiki has a known origin; missing build-time env must not empty its sitemap.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://halloween-thegame.wiki";
const description = "Halloween: The Game Wiki covers characters, challenges, perks, Michael Myers abilities, Civilian objectives, police respawns, crossplay, and gameplay guides.";

export const gameConfig = createGameConfig({
  name: "Halloween: The Game",
  shortName: "Halloween: The Game",
  wikiName: "Halloween: The Game Wiki",
  tagline: "Halloween: The Game",
  description: "Asymmetrical horror set in Haddonfield, featuring Michael Myers, Civilians, 1v4 multiplayer, and four launch maps.",
  developer: "IllFonic",
  publisher: "IllFonic Publishing / Gun Interactive",
  releaseDate: "2026-09-08",
  platforms: ["PS5", "Xbox Series X|S", "PC"],
  officialWebsite: "https://halloweengame.com/",
  steamUrl: "https://store.steampowered.com/app/3219630/Halloween_The_Game/",
  discordUrl: "https://discord.gg/halloweenthegame",
  locale: "en",
  logoPath: "/images/brand/game-mark.svg",
  heroImagePath: "/images/brand/game-hero.svg",
  metadata: {
    title: "Halloween: The Game Wiki — Guides, Maps & Crossplay",
    description,
    keywords: "Halloween: The Game, wiki, guides, maps, crossplay, Michael Myers, PS5, Xbox, PC"
  },
  theme: {
    background: "hsl(20 12% 6%)",
    surface: "hsl(20 10% 10%)",
    surfaceRaised: "hsl(20 10% 14%)",
    text: "hsl(40 20% 92%)",
    textMuted: "#b5ada2",
    primary: "hsl(24 95% 52%)",
    primaryContrast: "hsl(20 15% 6%)",
    secondary: "hsl(0 55% 30%)",
    border: "hsl(20 10% 19%)"
  },
  navigation: [
    { id: "home", label: "Home", href: "/" },
    { id: "guides", label: "Guides", href: "/guides" },
    { id: "database", label: "Explore", href: "/locations", children: [
      { id: "characters", label: "Characters", href: "/characters" },
      { id: "challenges", label: "Challenges", href: "/challenges" },
      { id: "perks", label: "Perks", href: "/perks" },
      { id: "locations", label: "Maps", href: "/locations" }
    ] },
    { id: "game-info", label: "Game Info", href: "/game-info", children: [
      { id: "game-info-overview", label: "Overview", href: "/game-info" },
      { id: "release-date", label: "Release Date", href: "/release-date" },
      { id: "editions", label: "Editions & Price", href: "/editions" },
      { id: "platforms", label: "Platforms", href: "/platforms" }
    ] }
  ],
  content: {
    guideIndexDescription: "Practical Halloween: The Game guides for Michael Myers, Civilians, residents, police, escapes, challenges, XP, skill checks, crossplay, and troubleshooting.",
    footerDisclaimer: "Independent fan-made website. Not affiliated with, endorsed by, or owned by IllFonic, Gun Interactive, or the Halloween rights holders. All game names and trademarks belong to their respective owners.",
    footer: {
      aboutTitle: "Halloween: The Game Wiki",
      about: "Halloween: The Game Wiki is an independent fan-made knowledge base for players exploring Haddonfield. It covers beginner guides, multiplayer strategies, maps, characters, editions, progression, crossplay, platforms, and frequently searched gameplay questions.",
      description: "Asymmetrical horror set in Haddonfield, featuring Michael Myers, Civilians, 1v4 multiplayer, and four launch maps.",
      playGame: "Official Website"
    },
    homepage: {
      meta: { title: "Halloween: The Game Wiki — Characters & Gameplay Guides", description },
      hero: {
        eyebrow: "Independent Gameplay Wiki",
        title: "Halloween: The Game Wiki",
        description: "Characters, Challenges, Perks, Michael Myers Abilities & Gameplay Guides for surviving — or stalking — Haddonfield after launch.",
        stats: ["Out Now", "1v4 Multiplayer", "6-Chapter Story Mode", "PS5 / Xbox Series X|S / PC"]
      },
      startHereEyebrow: "Gameplay Help",
      startHereTitle: "Find the Answer You Need",
      primaryAction: { label: "Read How to Play", reference: { kind: "guide", slug: "how-to-play" } },
      secondaryAction: { label: "Browse Characters", reference: { kind: "category", category: "characters" } },
      tertiaryAction: { label: "Learn How to Play", reference: { kind: "guide", slug: "how-to-play" } },
      startHereLinks: [
        { label: "Challenges", description: "Find chapter objectives, execution tips, and help with challenges that do not complete.", reference: { kind: "page", slug: "challenges" } },
        { label: "Characters", description: "Compare the playable Civilian roster, unlock availability, roles, traits, and Michael Myers.", reference: { kind: "category", category: "characters" } },
        { label: "Michael Myers", description: "Learn Killer Sense, Stalk, Shape Jump, loadout abilities, cooldowns, and practical hunting tactics.", reference: { kind: "entity", category: "characters", slug: "michael-myers" } },
        { label: "Perks", description: "Learn how Perk Points, card rolls, temporary upgrades, and Civilian Perk Decks work.", reference: { kind: "page", slug: "perks" } },
        { label: "How to Play", description: "Follow the Michael and Civilian match loops, from residents and police to escapes and reinforcements.", reference: { kind: "guide", slug: "how-to-play" } },
        { label: "Police Respawn", description: "Stay in the match after death and learn how the community-observed reinforcement-card loop works.", reference: { kind: "guide", slug: "how-to-respawn-as-police" } },
        { label: "Crossplay", description: "Check PS5, Xbox, Steam, and Epic crossplay status, settings, progression limits, and party fixes.", reference: { kind: "page", slug: "crossplay" } }
      ],
      databaseAction: { label: "Explore Maps", reference: { kind: "category", category: "locations" } },
      popularQuestions: [
        { label: "What should I do first as a beginner?", reference: { kind: "guide", slug: "beginner-guide", anchor: "what-beginners-should-do-first" } },
        { label: "How does the 1v4 match work?", reference: { kind: "guide", slug: "how-to-play", anchor: "quick-answer" } },
        { label: "Is Halloween: The Game crossplay?", reference: { kind: "page", slug: "crossplay" } },
        { label: "How do challenges and XP work?", reference: { kind: "guide", slug: "how-to-get-xp", anchor: "complete-passive-progressive-and-singleplayer-challenges" } },
        { label: "How do you respawn as police?", reference: { kind: "guide", slug: "how-to-respawn-as-police" } },
        { label: "How do you fix backend authentication errors?", reference: { kind: "guide", slug: "backend-authentication-error" } },
        { label: "How do you escape?", reference: { kind: "guide", slug: "how-to-escape" } },
        { label: "How do skill checks work?", reference: { kind: "guide", slug: "how-skill-checks-work" } }
      ],
      aboutGame: {
        title: "What is Halloween: The Game?",
        paragraphs: [
          "Halloween: The Game is an asymmetrical horror action game developed by IllFonic and set in Haddonfield on Halloween night, 1978. Its multiplayer mode pits Michael Myers against a group of Civilians in a 1v4 sandbox built around stalking, survival, cooperation, exploration, and escape.",
          "Players can become the Boogeyman and hunt residents across Haddonfield or work together as Civilians, scavenging equipment and completing escape objectives. The released game also includes a six-chapter Michael-led Story Mode, character progression, challenges, and Civilian Perk Decks."
        ],
        stats: [
          { label: "Developer", value: "IllFonic" },
          { label: "Publisher", value: "IllFonic Publishing / Gun Interactive" },
          { label: "Platforms", value: "PS5 / Xbox Series X|S / PC" },
          { label: "Genre", value: "Asymmetrical Horror Action" },
          { label: "Launch Maps", value: "4" },
          { label: "Multiplayer", value: "1v4" },
          { label: "Supported Languages", value: "10" }
        ],
        cta: "Explore All Guides"
      },
      finalCta: {
        title: "Ready to Survive Halloween?",
        description: "From your first night in Haddonfield to mastering Michael Myers, escape routes, maps, characters, and multiplayer strategies, our fan-made wiki helps you understand Halloween: The Game.",
        primary: "Read the Beginner Guide",
        secondary: "Play Halloween: The Game"
      }
    }
  },
  siteUrl
});
