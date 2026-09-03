# Halloween content plan — 2026-09-03

Primary input: `keywords.json`, imported unchanged (format normalized only final newline) from the user-supplied Halloween The Game keyword collection. No volumes were supplied; primary selection is based on natural phrasing and shared user outcomes, not invented traffic estimates.

19 source keywords → 12 independent intents. Seven phrases become secondary keywords; 9 intent pages planned for publication (5 new routes + 4 existing-page upgrades), 3 waiting. Existing URLs stay permanent; Maps remains `/locations` with no duplicate `/maps` route.

## Intent decisions

Gameplay/how-to-play describe the same gameplay overview. PS5/Xbox/platforms share a hardware-selection answer. Price/pre-order/Deluxe share a digital purchase comparison, while physical copy/collector/PS5 collector need a separate disc-package comparison. Release timing remains distinct, linking to purchase comparisons rather than duplicating them. Roster, Michael and Alexis are different entity intents, but Alexis lacks enough entity-specific evidence. Existing Beginner Guide becomes a preparation checklist, not another gameplay article.

| Primary Keyword | Secondary Keywords | Search Intent | Page Type | Suggested Slug | Planned Title | Research Status | Content Status |
|---|---|---|---|---|---|---|---|
| halloween the game how to play | halloween the game gameplay | Understand the playable sides, NPC rescue, police escalation and story mode, not purchase details. | Guide | /guides/how-to-play | Halloween: The Game How to Play — Roles & Objectives | RESEARCHED | PUBLISHED |
| halloween the game release date | — | Resolve digital launch vs Deluxe early access vs disc launch. | Release | /release-date | Halloween: The Game Release Date & Early Access | RESEARCHED | PUBLISHED |
| halloween the game deluxe edition | halloween the game pre order; halloween the game price | Compare digital purchase options and which bonuses require a preorder. | Edition | /editions | Halloween: The Game Deluxe Edition, Price & Pre-order | RESEARCHED | PUBLISHED |
| halloween the game physical copy | halloween the game limited collector's edition; halloween the game collector's edition ps5 | Compare disc packages, contents, hardware and later release date. | Edition | /physical-editions | Halloween: The Game Physical Copy & Collector Editions | RESEARCHED | PUBLISHED |
| halloween the game platforms | halloween the game ps5; halloween the game xbox | Choose supported hardware/store and understand online requirements. | Platform | /platforms | Halloween: The Game Platforms — PS5, Xbox & PC | RESEARCHED | PUBLISHED |
| halloween the game system requirements | — | Compare real PC specifications with the reader's machine; explain source ambiguity. | Platform | /system-requirements | Halloween: The Game System Requirements for PC | RESEARCHED | PUBLISHED |
| halloween the game michael myers | — | Explain the playable killer's role and confirmed mechanics; no invented builds. | Character | /characters/michael-myers | Halloween: The Game Michael Myers — Abilities & Role | RESEARCHED | PUBLISHED |
| halloween the game characters | — | Separate roster availability from skins, NPC residents and conditional return roles. | Character / Category | /characters | Halloween: The Game Characters — Confirmed Roster | RESEARCHED | PUBLISHED |
| halloween the game maps | — | Identify launch maps and landmarks without implying solved routes. | Map / Category | /locations | Halloween: The Game Maps — All Four Launch Locations | RESEARCHED | PUBLISHED |
| halloween the game crossplay | — | Which platforms play together, how invites work and whether saves carry over. | Multiplayer | /crossplay | Halloween: The Game Crossplay — Confirmed Details | WAITING_FOR_MORE_DATA | WAITING_FOR_MORE_DATA |
| halloween the game alexis | — | Identify Alexis and her unlock method, abilities, background and playstyle. | Character | /characters/alexis | Halloween: The Game Alexis — Role & Availability | WAITING_FOR_MORE_DATA | WAITING_FOR_MORE_DATA |
| halloween the game trailer | — | Watch verified official trailers and distinguish announcement, gameplay and story footage. | Game Info / Media | /trailers | Halloween: The Game Trailers — Official Video Guide | WAITING_FOR_MORE_DATA | WAITING_FOR_MORE_DATA |

## Implementation / acceptance plan

- [x] Check mother repository clean; read prior content and original keyword input.
- [x] Search and open official sources; record fact-level provenance before article authoring.
- [x] Add failing tests for researched page loading/rendering, published routes, metadata, category/character editorial content and unsupported slugs.
- [x] Reuse current Markdown compiler and guide CSS for five typed fact pages in `src/content/pages`; retain Category Layout for maps/roster and Wiki Detail Layout for Michael. No new CMS, dependencies or major categories.
- [x] Write substantive intent-specific content, direct-answer introductions, source links, related links, real publication/update dates. Upgrade gameplay and narrow Beginner Guide.
- [x] Link important pages through existing Game Info/navigation; retain homepage layout.
- [x] Audit actual rendered word counts and unique official source URLs; check sitemap coverage, no orphan URLs, titles/H1/canonical uniqueness, anchors/images and console.
- [x] Run lint, tests, build and independent review.
- Git delivery: final commit/push status is reported in the delivery message and repository history; mother cleanliness is rechecked at handoff.

User explicitly authorizes this current project/main and directs autonomous execution without design confirmations. No separate worktree, mother edits, deployment or domain claim. Domain remains unconfigured; verify omission plus canonical/sitemap behavior under a test-only origin. Source limitations are recorded per research page. No community opinion is a published fact.
