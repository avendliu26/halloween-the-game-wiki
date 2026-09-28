# Halloween: The Game — Visual Asset Plan (2026-09-28)

Scope: official-source visual enrichment only. No competitor-wiki images, no hotlinking in production, no AI-generated gameplay screenshots.

Research result: 34 official news pages crawled; 340 raw Storyblok image references and 52 YouTube references found. A curated local candidate pool of 53 official images was downloaded to `research/visual-assets-2026-09-28/candidates/` (about 42 MB) for selection and conversion.

Important: official publication verifies provenance, not a separate redistribution license. Keep source URLs/provenance in research docs and retain any copyright notices visible in source imagery.

## Recommended official videos

| Placement | Video | YouTube ID | Official source |
|---|---|---|---|
| Homepage hero | Gameplay + Release Date Trailer | `715qsd1qIFg` | https://halloweengame.com/news/halloween-gameplay-release-date-trailer/ |
| How to Play | Multiplayer Gameplay Overview | `BPJ83MKWJuc` | https://halloweengame.com/news/multiplayer-gameplay-overview/ |
| Perks / Challenges / XP | Progression & Customization Overview | `AdwC7tve3gc` | https://halloweengame.com/news/progression-customization-overview/ |
| Challenges / Story Mode | Singleplayer Story Mode | `1NqGLjfpYtI` | https://halloweengame.com/news/unleash-hell-upon-haddonfield/ |
| Maps — East Haddonfield | Map Flythrough | `3F4jgkffEwY` | https://halloweengame.com/news/the-locations-of-halloween-the-game/ |
| Maps — Haddonfield Heights | Map Flythrough | `C2iqQykoqB8` | https://halloweengame.com/news/haddonfield-heights-map-flythrough/ |
| Maps — Orange Grove Estates | Map Flythrough | `xpKU4u7F2hY` | https://halloweengame.com/news/orange-grove-estates/ |
| Maps — Haddonfield Town Center | Map Flythrough | `eiwC78qe84o` | https://halloweengame.com/news/haddonfield-town-center/ |

Video implementation recommendation: thumbnail/poster first, iframe only after click. No autoplay. Reuse local official stills as posters so pages do not depend on YouTube thumbnails before interaction.

## Core image shortlist
| Candidate file | Best use | Official source |
|---|---|---|
| `po-character.jpg` | Challenges hub; How to Get XP | Progression & Customization Overview |
| `po-perk-cards.jpg` | Perks hub; Perk Deck explanation | Progression & Customization Overview |
| `po-customization.jpg` | Characters / Civilian stats / loadout explanation | Progression & Customization Overview |
| `po-player-customization.jpg` | XP / progression / profile-card section | Progression & Customization Overview |
| `po-side-by-side.jpg` | How to Play overview; Michael vs Civilian split | Progression & Customization Overview |
| `michael-lurking-pv2.png` | Police / Loomis / calling police; Michael pressure | Multiplayer Gameplay Overview |
| `rachel-pv2.png` | Beginner / Civilian section / character overview | Multiplayer Gameplay Overview |
| `group-polaroid-vf.jpg` | Characters hub; legacy cast section | Legacy Characters Reimagined |
| `laurie-final-vf.jpg` | Laurie character page/card | Legacy Characters Reimagined |
| `annie-final-vf.jpg` | Annie character page/card | Legacy Characters Reimagined |
| `lynda-vf.jpg` | Lynda character page/card | Legacy Characters Reimagined |
| `bob-final-vf.jpg` | Bob character page/card | Legacy Characters Reimagined |
| `thomasa-v1.jpg` | Thomas character page/card | The Heroes of Haddonfield |
| `jennifera-v1.jpg` | Jennifer character page/card | The Heroes of Haddonfield |
| `tanyah-v1.jpg` | Tanya character page/card | The Heroes of Haddonfield |
| `rachelc-v1.jpg` | Rachel character page/card | The Heroes of Haddonfield |
| `marcusn-v1.jpg` | Marcus character page/card | The Heroes of Haddonfield |
| `michael-hk.jpg` | Story Challenges / Chapter guide visual | Unleash Hell Upon Haddonfield |
| `michael-hm.jpg` | Story Mode / Michael section | Unleash Hell Upon Haddonfield |
| `michael-sr.jpg` | Story Mode / Smith's Grove context | Unleash Hell Upon Haddonfield |
| `rir.jpg` | Story Mode / chapter atmosphere | Unleash Hell Upon Haddonfield |
| `haddonfield-heights-s2.jpg` | Haddonfield Heights detail page secondary image | Haddonfield Heights Map Flythrough |
| `haddonfield-heights-s3.jpg` | Haddonfield Heights detail page secondary image | Haddonfield Heights Map Flythrough |
| `orange-grove-1.jpg` | Orange Grove detail page secondary image | Welcome To Orange Grove Estates |
| `orange-grove-2.jpg` | Orange Grove detail page secondary image | Welcome To Orange Grove Estates |
| `wthtc-asm-i.jpg` | Town Center detail page; A-Side Music Store | Welcome to Haddonfield Town Center |
| `wthtc-po-i.jpg` | Town Center detail page; post office context | Welcome to Haddonfield Town Center |
| `wthtc-gy.jpg` | Town Center detail page; cemetery / graveyard context | Welcome to Haddonfield Town Center |
| `pgarage-v2.jpg` | East Haddonfield / garage / escape atmosphere | The Night He Came Home Reimagined |
| `post-launch.jpg` | Patch Notes / launch-history card | Halloween: The Game Out Now |
| `day-one-patch-notes.jpg` | Patch Notes historical section | Halloween: The Game Out Now |

## Existing production assets to keep

- `public/images/characters/michael-myers-official.webp` — current Michael/How to Play card image.
- `public/images/characters/civilians-official.webp` — current Civilians/Beginner card image.
- `public/images/maps/east-haddonfield-official.webp` — current East Haddonfield map image.
- `public/images/maps/haddonfield-heights-official.webp` — current Haddonfield Heights map image.
- `public/images/maps/orange-grove-estates-official.webp` — current Orange Grove map image.
- `public/images/maps/haddonfield-town-center-official.webp` — current Town Center map image.

## First deployment priority

1. Give `/guides` strong thumbnail coverage: Patch Notes, How to Escape, How to Struggle Free, Police Respawn, How to Get XP, Challenges Not Working, plus the two existing illustrated guides.
2. Add 2–4 contextual images to long evergreen pages rather than filling every section.
3. Add character art only to character/detail cards that already exist; do not create thin pages just to use an image.
4. Add one reusable click-to-load YouTube component; replace homepage direct iframe with the same lightweight component if regression-safe.
5. Maps hub may expose four flythrough play buttons, but iframe creation must occur only after user interaction.
