/** Official IDs and source pages are recorded in research/visual-assets-2026-09-28/video-manifest.json. */
export const officialVideos = {
  homepage: { title: "Halloween Gameplay + Release Date Trailer", id: "715qsd1qIFg", poster: "/images/official/extendedfirstlooktrailerv4.webp", posterAlt: "Gameplay and release date trailer poster for Halloween: The Game" },
  howToPlay: { title: "Multiplayer Gameplay Overview", id: "BPJ83MKWJuc", poster: "/images/characters/michael-myers-official.webp", posterAlt: "Michael Myers standing at the top of a staircase" },
  progression: { title: "Progression & Customization Overview", id: "AdwC7tve3gc", poster: "/images/official/po-character.webp", posterAlt: "Civilian progression and challenge interface" },
  challenges: { title: "Singleplayer Story Mode", id: "1NqGLjfpYtI", poster: "/images/official/michael-hk.webp", posterAlt: "Michael Myers holding a knife indoors" },
  eastHaddonfield: { title: "East Haddonfield Map Flythrough", id: "3F4jgkffEwY", poster: "/images/official/phelps-v2.webp", posterAlt: "Phelps Garage in East Haddonfield" },
  haddonfieldHeights: { title: "Haddonfield Heights Map Flythrough", id: "C2iqQykoqB8", poster: "/images/official/haddonfield-heights-s1.webp", posterAlt: "Nighttime street in Haddonfield Heights" },
  orangeGroveEstates: { title: "Orange Grove Estates Map Flythrough", id: "xpKU4u7F2hY", poster: "/images/official/orange-grove-wh.webp", posterAlt: "Orange Grove Estates neighborhood at night" },
  haddonfieldTownCenter: { title: "Haddonfield Town Center Map Flythrough", id: "eiwC78qe84o", poster: "/images/official/wthtc-msc.webp", posterAlt: "Haddonfield Town Center at night" }
} as const;

export type OfficialVideoKey = keyof typeof officialVideos;
export const isOfficialVideoKey = (value: string): value is OfficialVideoKey => Object.hasOwn(officialVideos, value);

export const locationVisuals: Record<string, { image: string; alt: string; video: OfficialVideoKey }> = {
  "east-haddonfield": { image: "/images/official/pgarage-v2.webp", alt: "Rainy Phelps Garage concept art for East Haddonfield", video: "eastHaddonfield" },
  "haddonfield-heights": { image: "/images/official/haddonfield-heights-s2.webp", alt: "Residential street scene in Haddonfield Heights at night", video: "haddonfieldHeights" },
  "orange-grove-estates": { image: "/images/official/orange-grove-1.webp", alt: "Nighttime Orange Grove Estates neighborhood scene", video: "orangeGroveEstates" },
  "haddonfield-town-center": { image: "/images/official/wthtc-asm-i.webp", alt: "Interior of the A-Side music store in Haddonfield Town Center", video: "haddonfieldTownCenter" }
};
