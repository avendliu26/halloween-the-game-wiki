# Content audit — 2026-09-03

## Outcome

- Original keywords: **19**.
- Secondary phrases merged into broader intents: **7**.
- Independent intents assessed: **12**.
- Published intent pages: **9** — **5 new URLs** and **4 substantive upgrades of existing URLs**.
- Draft pages: **0**.
- Waiting for more data: **3**; none is exposed as a placeholder route.
- Total reachable site pages, including pre-existing support/database/legal pages: **20**.
- Existing Beginner Guide is now a preparation checklist; Game Info is a navigation hub. Those support-page changes are not counted as additional keyword-intent pages.
- “Published” here means included in the repository's production build. This task does not deploy a hosted website or assign a domain.

## Keyword mapping and measured pages

Word counts use rendered editorial body text, including its headings, table cells, related-page list and source notes, but excluding global navigation, H1/date metadata, category filters/cards and shared related-content components. Adjacent block/table cells are separated before counting; inline emphasis does not create false words. Counts are reproducible with `node scripts/audit-content.mjs http://127.0.0.1:3106`.

Source Count counts unique reviewed supporting documents linked in that page, not publishers or independent corroborators. Steam's API and storefront count as one Steam source. The inaccessible original X link is provenance, not an additional inspected source. Waiting rows count research sources, not published citations.

| Primary Keyword | Secondary Keywords | URL | Title | Word Count | Source Count | Status |
|---|---|---|---|---:|---:|---|
| halloween the game how to play | halloween the game gameplay | /guides/how-to-play | Halloween: The Game How to Play — Roles & Objectives | 951 | 6 | PUBLISHED |
| halloween the game release date | — | /release-date | Halloween: The Game Release Date & Early Access | 540 | 5 | PUBLISHED |
| halloween the game deluxe edition | halloween the game pre order; halloween the game price | /editions | Halloween: The Game Deluxe Edition, Price & Pre-order | 603 | 3 | PUBLISHED |
| halloween the game physical copy | halloween the game limited collector's edition; halloween the game collector's edition ps5 | /physical-editions | Halloween: The Game Physical Copy & Collector Editions | 589 | 3 | PUBLISHED |
| halloween the game platforms | halloween the game ps5; halloween the game xbox | /platforms | Halloween: The Game Platforms — PS5, Xbox & PC | 662 | 7 | PUBLISHED |
| halloween the game system requirements | — | /system-requirements | Halloween: The Game System Requirements for PC | 642 | 2 | PUBLISHED |
| halloween the game michael myers | — | /characters/michael-myers | Halloween: The Game Michael Myers — Abilities & Role | 674 | 5 | PUBLISHED |
| halloween the game characters | — | /characters | Halloween: The Game Characters — Confirmed Roster | 630 | 4 | PUBLISHED |
| halloween the game maps | — | /locations | Halloween: The Game Maps — All Four Launch Locations | 637 | 3 | PUBLISHED |
| halloween the game crossplay | — | /crossplay | Halloween: The Game Crossplay — Confirmed Details | 0 | 3 | WAITING_FOR_MORE_DATA |
| halloween the game alexis | — | /characters/alexis | Halloween: The Game Alexis — Role & Availability | 0 | 2 | WAITING_FOR_MORE_DATA |
| halloween the game trailer | — | /trailers | Halloween: The Game Trailers — Official Video Guide | 0 | 3 | WAITING_FOR_MORE_DATA |

## Merges and cannibalization review

- Gameplay → How to Play: one explanation of roles and objectives.
- PS5 + Xbox → Platforms: one hardware/store decision page with platform-specific sections.
- Pre order + Price → Deluxe Edition comparison: one digital purchase decision page covering Standard as the alternative.
- Limited Collector's Edition + Collector's Edition PS5 → Physical Copy: one disc-package comparison.
- Release Date owns timing; edition pages link to it instead of reproducing a second full release guide.
- Maps retains the established `/locations` URL. No parallel `/maps` page.
- Characters is the roster; Michael is an individual mechanics reference. Alexis only appears as a confirmed edition/roster fact until enough detail exists.
- Beginner Guide no longer repeats the full gameplay explanation; Game Info no longer duplicates the detailed specs and purchase tables.
- Search-volume data was not supplied; primary choices are based on natural phrasing and intent. No invented ranking/volume claims.

## Deferred intents

- **Crossplay:** Xbox and Epic have cross-platform badges, but full platform pairings, invitations, opt-out and cross-progression are not established in the reviewed evidence. Qualified summaries live in Platforms/How to Play; `/crossplay` returns 404.
- **Alexis:** Deluxe availability is confirmed, but an entity-specific biography, ability/stat reference and supported playstyle explanation are missing. `/characters/alexis` returns 404.
- **Trailer:** Official video landing pages exist, but direct YouTube playback/transcript verification failed. Relevant official landing pages are linked; no invented video analysis or timestamps. `/trailers` returns 404.

## Evidence quality and uncertainty

- No community experience, Reddit opinion or player speculation is used in published facts. No competitor wiki is cited or used as a prose source.
- Platforms has **6 directly reviewed official sources + 1 secondary news report reproducing an official developer statement**. Direct access to the original Japan PS5 X statement failed; the page explicitly discloses that limitation. All other published-page sources are primary official documents/storefronts.
- Shape Jump light/visibility wording differs between the September 2025 dedicated article and March 2026 overview. The page uses the newer high-level description and does not invent an exact Boolean activation rule.
- CPU requirements use broad socket labels, GPU recommendations use families, and no measured frame-rate guarantee is claimed.
- Steam lists ten text languages; Epic lists eight. Pages preserve storefront-specific scope.
- Universal Standard unlock hour, preload schedule, precise character stats, tested escape routes, exact cross-network rules, some cosmetic identities and unspecified edition surprises are not claimed.
- Images remain labeled fan-made placeholders. No competitor image extraction, official screenshot rehosting or implied hands-on play.

## SEO and technical validation

- Published target titles: 46–54 characters; descriptions: 148–158 characters.
- H1 and first editorial paragraphs directly answer each intent. Type labels are Release, Edition, Platform, Guide or existing database/entity types.
- Article + BreadcrumbList reused for standalone editorial pages and Michael; category directories retain BreadcrumbList; VideoGame remains on the homepage. No invented rating, review or author credentials.
- Published/updated dates reflect actual September 3, 2026 work.
- No production domain supplied: production canonical/OG URL and sitemap URLs remain intentionally omitted. A separate build with the test-only origin `https://halloween-the-game.test` verified unique path-matched canonicals, Open Graph URLs and complete sitemap coverage. The test origin was not saved to config; final build restored without it.
- Full crawl: 20 pages return 200; no duplicate title/H1/canonical; no orphan built or sitemap pages; all internal hrefs and 112 linked anchors pass; 3 unique image assets return images successfully.
- Waiting, hidden and unknown routes return 404; no Demo/sample-game residue.
- Browser: all 9 target pages checked desktop and mobile width; no page-level horizontal overflow or warning/error logs. Tables retain local horizontal scroll. Mobile Game Info → Overview opens the hub and closes the menu; map search narrows Orange to one result.
- Visual regression found and fixed: old global desktop grid placement could put category editorial text before its H1. Scoped the rule to the guide layout's direct body. Browser red probe (H1 below body) and green probe recorded; final order verified.
- Independent review: no critical findings; restored Overview submenu link, fixed block/table word counting with regression tests. Fresh primary-source spot checks agreed with published facts.
- Lint passed; 22 test files / 152 tests passed; production build passed including TypeScript and all content image validation. A missing declaration for the audit JS helper was caught by build and resolved with a typed declaration.
- Final Git commit/push details are reported in the delivery message and repository history.

## Priority manual review

1. `/platforms` — regional availability, secondary transmission of Japan statement and cross-platform boundaries.
2. `/editions` — purchase-entitlement distinctions and pre-order wording.
3. `/physical-editions` — collector contents and cosmetic advance access versus early gameplay.
4. `/characters/michael-myers` — differing official Shape Jump descriptions.
5. `/guides/how-to-play` — objective explanations versus untested tactical advice.

## Reproduce checks

```sh
npm run lint
npm test
npm run build
npm run start -- --hostname 127.0.0.1 --port 3106
node scripts/verify-site.mjs http://127.0.0.1:3106
node scripts/audit-content.mjs http://127.0.0.1:3106
```

Mother template was checked clean before and after the implementation; no template edits were made.
