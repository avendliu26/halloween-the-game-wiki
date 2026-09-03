# Layout, official media and Steam access

**Goal:** Improve existing pages without redesigning the site or changing its routes/SEO architecture.

**Scope:** User's P0–P12 request, supplied in this task. Direct execution and final commit/push are explicitly authorized; no approval checkpoints or template edits.

**Design:** Extend the existing server-rendered components. One shared `WikiPageLayout` owns a ~70/30 desktop grid and `PageSidebar`; below 1100px it becomes one column. Render a single native-details TOC, move existing Markdown Related Pages links into the sidebar without duplicating them, retain their original anchor, and preserve all other prose/headings. Keep entity details in the shared sidebar. Reuse current config for game facts and official links. Existing colors, fonts, static-image delivery and SEO builders stay unchanged.

**Alternatives considered:** Stretching prose full-width hurts readability; per-route sidebar copies cause drift. A shared server component keeps layout consistent and avoids extra client hydration. Related-page extraction uses the existing MDX AST, not client DOM rewriting.

## Tasks

- [x] Add failing tests for a single TOC, related-link extraction with preserved content/anchors, summary cards, desktop/mobile Steam access.
- [x] Implement `WikiPageLayout`, `PageSidebar`, single TOC; integrate standalone research articles, guides, category indexes and entity pages. Keep empty modules hidden.
- [x] Add compact edition/platform summary cards using rechecked official preorder, physical-edition and launch sources. Do not infer an unconfirmed crossplay matrix.
- [x] Add safe external Steam CTA at the end of desktop/mobile navigation; keep the existing responsive menu.
- [x] Independently verify official image/video sources. Download only official local imagery; document every association in `research/assets.md`. Keep the hero unchanged unless video access and embedding can be verified.
- [x] Update entities/guide images and card presentation using shared components. Never enable image optimization.
- [x] Verify lint/tests/build, every new asset, all TOC/internal links, SEO invariants, console and five viewports (1440,1280,1024,768,390). Capture screenshots for visual review.
- [x] Complete read-only review: no Critical/Important findings; minor mobile keyboard-order follow-up recorded in the audit. Ready for the authorized commit/push; final response records the Git outcome and post-push template status.

## Interfaces and checks

- `SidebarLink`: `{title: string; href: string}`. Only existing internal links are moved; preserve the full original label.
- `compileGuide(record, {moveRelatedToSidebar?: boolean})` returns existing content/headings/imagePaths plus `relatedPages`. Default preserves the previous rendering contract; image validation retains all existing rules.
- `WikiPageLayout({children, headings?, related?, details?})`: single source of layout/sidebar composition; hidden empty TOC/related/details modules.
- `PageSummaryCards({slug})`: renders only for editions/platforms; details remain in existing Markdown tables below.
- Tests exercise real page/component output and real MDX compilation. Browser verification checks one TOC, one Related Pages heading, valid fragment targets, no viewport overflow, no sticky sidebar on tablet/mobile, working menu CTA, and exact media URLs.

Official summary sources rechecked September 3, 2026: https://halloweengame.com/news/preorder/ ; https://halloweengame.com/news/physical-editions/ ; https://halloweengame.com/news/the-locations-of-halloween-the-game/ .
