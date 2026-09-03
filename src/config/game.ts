import { createGameConfig } from "../lib/config/schema.ts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || undefined;
const description = "Halloween: The Game Wiki covers release details, crossplay, maps, characters, editions, system requirements, beginner tips, and multiplayer survival guides.";

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
    guideIndexDescription: "Confirmed launch information and a first look at both sides of Halloween: The Game. Detailed controls and tested strategies will follow launch.",
    footerDisclaimer: "Independent fan-made website. Not affiliated with, endorsed by, or owned by IllFonic, Gun Interactive, or the Halloween rights holders. All game names and trademarks belong to their respective owners.",
    footer: {
      aboutTitle: "Halloween: The Game Wiki",
      about: "Halloween: The Game Wiki is an independent fan-made knowledge base for players exploring Haddonfield. It covers beginner guides, multiplayer strategies, maps, characters, editions, progression, crossplay, platforms, and frequently searched gameplay questions.",
      description: "Asymmetrical horror set in Haddonfield, featuring Michael Myers, Civilians, 1v4 multiplayer, and four launch maps.",
      playGame: "Official Website"
    },
    homepage: {
      meta: { title: "Halloween: The Game Wiki — Release Date, Crossplay & Guides", description },
      hero: {
        eyebrow: "Fan-Made Halloween: The Game Community Wiki",
        title: "Halloween: The Game",
        description: "Enter Haddonfield on Halloween night, 1978, and experience an asymmetrical horror sandbox inspired by the original film. Play as Michael Myers and stalk the town, or work together as Civilians to survive, escape, and fight back.",
        stats: ["Releases Sep 8, 2026", "4 Launch Maps", "1v4 Multiplayer", "$39.99 Standard Edition"]
      },
      startHereEyebrow: "Start Here",
      startHereTitle: "Your Halloween: The Game Journey",
      primaryAction: { label: "Start Beginner Guide", reference: { kind: "guide", slug: "beginner-guide" } },
      secondaryAction: { label: "Explore Maps", reference: { kind: "category", category: "locations" } },
      tertiaryAction: { label: "Learn How to Play", reference: { kind: "guide", slug: "how-to-play" } },
      startHereLinks: [
        { label: "Beginner Guide", description: "Prepare for your first night: check your platform, edition and PC requirements, then choose what to read before entering Haddonfield.", reference: { kind: "guide", slug: "beginner-guide" } },
        { label: "How to Play", description: "Understand both sides of the 1v4 match: stalking Haddonfield as Michael Myers or cooperating with other Civilians to survive and escape.", reference: { kind: "guide", slug: "how-to-play" } },
        { label: "Maps & Locations", description: "Explore the four confirmed launch maps and recognizable landmarks from the original Halloween film. Detailed escape routes await launch.", reference: { kind: "category", category: "locations" } },
        { label: "Characters & Roster", description: "Meet Michael Myers, the ten Standard Edition Civilians and two Deluxe additions. Separate playable roles from NPCs and cosmetic appearances.", reference: { kind: "category", category: "characters" } }
      ],
      databaseAction: { label: "Explore Maps", reference: { kind: "category", category: "locations" } },
      popularQuestions: [
        { label: "When does Halloween: The Game release?", reference: { kind: "page", slug: "release-date" } },
        { label: "How does the 1v4 match work?", reference: { kind: "guide", slug: "how-to-play", anchor: "core-match-structure" } },
        { label: "Is crossplay confirmed?", reference: { kind: "guide", slug: "how-to-play", anchor: "crossplay" } },
        { label: "What are the four launch maps?", reference: { kind: "category", category: "locations" } }
      ],
      aboutGame: {
        title: "What is Halloween: The Game?",
        paragraphs: [
          "Halloween: The Game is an asymmetrical horror action game developed by IllFonic and set in Haddonfield on Halloween night, 1978. Its multiplayer mode pits Michael Myers against a group of Civilians in a 1v4 sandbox built around stalking, survival, cooperation, exploration, and escape.",
          "Players can become the Boogeyman and hunt residents across Haddonfield or work together as Civilians, scavenging equipment and completing escape objectives. The game also includes single-player content and recreates iconic locations from the original Halloween alongside new areas designed for gameplay."
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
