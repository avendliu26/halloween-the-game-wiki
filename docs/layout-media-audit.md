# Layout, official media and Steam access — verification

Verified September 3, 2026 against the production Next.js build. Scope: this Halloween project only; no template changes, dependency upgrades, image optimizer, client-side content fetching, or VideoObject schema.

## Delivered

- Shared layout covers release date, platforms, editions, physical editions, system requirements, both guides, guides index, characters/maps indexes and all six entity details. Desktop uses 70/30 content/sidebar above 1100px; smaller screens use one column.
- Each article has one real TOC. Existing pure Related Pages lists move to the sidebar; other prose and source headings stay intact. `related-pages`, legacy `related-links`, all old H2/H3 targets and structured `section-*` targets remain valid. Guides index has no empty TOC.
- Sidebar includes TOC, existing related links, release/platform/developer/genre facts, official website/Steam, and entity infobox where applicable. Empty modules are omitted. Desktop sidebar is sticky below the header and scrollable when long; mobile is not sticky.
- Six verified official 1600×900 WebP images replace the four map and two character placeholders. Homepage database cards and both guide cards reuse these local assets. Character compositions retain faces and the full five-person lineup. Provenance and exact map associations: [assets.md](../research/assets.md).
- Editions adds Standard, Digital Deluxe and Physical/Collector summaries; platforms adds PS5, Xbox Series X|S and PC summaries. Existing prose and tables are retained; no unconfirmed crossplay matrix is invented.
- Orange Buy on Steam appears last in desktop navigation and inside the mobile menu. The user-supplied Steam URL opens with `target="_blank" rel="noopener noreferrer"`.
- Hero is 61/39 on desktop, with the verified IllFonic announcement trailer in a responsive 16:9 card and a direct YouTube fallback link. Mobile places video below text. Lazy loading, fullscreen and explicit referrer policy; no autoplay. Actual integrated playback verified.
- Header logo, favicon, brand configuration, global fonts/colors and SEO builders were not changed.

## Validation evidence

- `npm run lint`: passed.
- `npm run test`: 206/206 tests, 26 files passed. New coverage includes single TOC, safe related-list extraction and conservative fallback, old anchors, summary cards, desktop/mobile Steam links, official iframe and guide imagery.
- `npm run build`: passed, including independent prebuild asset validation (10 unique image references, 10 MDX documents). Also built successfully with `NEXT_PUBLIC_SITE_URL=https://halloween-thegame.wiki`.
- `scripts/verify-site.mjs`: 20 reachable pages, 97 internal fragment links and 7 rendered image URLs passed. Expected hidden/unknown routes return 404; no orphan built pages, duplicate titles/H1/canonicals or old demo text.
- Canonical, Open Graph, JSON-LD, robots and sitemap passed with the real production origin. Default/no-origin behavior also passed. Comparing 12 affected pages with the previous build preserved all old H2/H3 anchors and metadata; intentional JSON-LD image changes only for the replaced guide/character assets.
- Chrome: 12 key pages × 5 widths (1440, 1280, 1024, 768, 390) = 60 passing checks. No viewport overflow, duplicate IDs/TOCs/Related Pages, broken TOC targets, header crowding, first-party HTTP failures or console errors. Verified desktop column ratio/sticky boundaries, single-column smaller layouts, mobile menu Steam access, and 16:9 video sizing.
- Visual review: homepage, editions, platforms, maps and characters at desktop/mobile sizes. Tables retain their existing horizontal scroll container instead of forcing page overflow.
- Official video integrated playback: paused at 0 before interaction, progressed beyond 2 seconds after Play, no media error. See provenance for earlier independent >10-second embed verification.
- Independent read-only code review: no Critical/Important findings; targeted tests and diff whitespace checks passed. Minor follow-up: on mobile, CSS places sidebar modules after the article while their DOM order remains before it, so keyboard focus can move below the article and then back. All links remain reachable; this is recorded rather than adding client-side DOM relocation to a server-rendered layout.

## Release boundary

This task commits and pushes source to GitHub; local build/browser checks do not themselves verify a subsequent Vercel deployment. The mother-template repository is checked clean before commit/push and again afterward.
