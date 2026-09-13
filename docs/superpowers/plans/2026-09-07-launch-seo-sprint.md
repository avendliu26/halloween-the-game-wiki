# Halloween: The Game Launch SEO Sprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a source-backed launch-period topic cluster around crossplay, core Civilian mechanics, progression, and current technical issues without changing the existing visual system.

**Architecture:** Keep the existing MDX content pipeline and dynamic guide route. Add `/crossplay` to the existing standalone research-page registry, add an optional frontmatter H1 for pages whose search title and visible question differ, use existing Related Pages extraction, and let the current sitemap derive URLs from content registries.

**Tech Stack:** Next.js App Router, React, TypeScript, MDX, Zod, Vitest, Testing Library.

**Spec:** `/Users/bulinlin/.codex/attachments/c1e918bc-5f8f-4678-8766-06ab9108bf54/pasted-text.txt`

## Global Constraints

- Preserve the current UI, templates, route conventions, canonical domain, existing ranked URLs, and existing content.
- Facts must come from official Halloween: The Game pages/storefronts or clearly labelled community reports.
- Do not publish speculative mechanics, fixes, platform matrices, menu paths, error codes, or patch claims.
- Every new canonical page needs unique metadata, visible source attribution, Article and complete BreadcrumbList JSON-LD, 3–6 intentional related links, and sitemap inclusion.
- Do not publish separate pages where evidence is too weak or the intent would cannibalize a stronger page.

---

### Task 1: Content model and SEO route contracts

**Files:**
- Modify: `src/lib/content/guide-source.ts`
- Modify: `src/app/(site)/guides/[slug]/page.tsx`
- Modify: `src/components/wiki/research-article.tsx`
- Modify: `src/lib/content/pages.ts`
- Modify: `next.config.ts`
- Test: `src/lib/content/guides.test.ts`
- Test: `src/lib/content/pages.test.tsx`
- Test: `src/app/(site)/guides/[slug]/page.test.tsx`
- Test: `src/app/redirects.test.ts`

**Interfaces:**
- Consumes: current `GuideFrontmatterSchema`, `ResearchArticle`, and Next.js redirects.
- Produces: optional `heading: string`, standalone `/crossplay`, and permanent legacy redirect.

- [ ] Write failing tests for optional H1 rendering, crossplay registry resolution, and `/en/modes/halloween-the-game-crossplay` permanent redirect.
- [ ] Run the focused tests and confirm failures are caused by the missing contracts.
- [ ] Add the minimal schema/template/registry/config implementation.
- [ ] Re-run focused tests until green.

### Task 2: Publish source-backed P0 pages

**Files:**
- Create: `src/content/pages/crossplay.mdx`
- Create: `src/app/(site)/crossplay/page.tsx`
- Create: `src/content/guides/how-to-respawn-as-police.mdx`
- Create: `src/content/guides/backend-authentication-error.mdx`
- Create: `research/pages/how-to-respawn-as-police.md`
- Create: `research/pages/backend-authentication-error.md`
- Modify: `research/pages/crossplay.md`
- Test: `src/app/(site)/launch-seo-content.test.tsx`

**Interfaces:**
- Consumes: standalone page registry, guide loader, existing Article/Breadcrumb JSON-LD, MDX Related Pages extraction.
- Produces: `/crossplay`, `/guides/how-to-respawn-as-police`, `/guides/backend-authentication-error`.

- [ ] Write failing route/content tests for quick answers, evidence labels, unique metadata, correct H1, source sections, breadcrumbs, and related links.
- [ ] Run the focused tests and verify the three pages are missing.
- [ ] Add full MDX articles and research provenance using current official pages, storefronts, official support, and clearly labelled Steam Community reports.
- [ ] Re-run focused tests until green.

### Task 3: Publish evidence-supported P1/P2 pages

**Files:**
- Create: `src/content/guides/how-to-call-the-police.mdx`
- Create: `src/content/guides/how-to-escape.mdx`
- Create: `src/content/guides/how-skill-checks-work.mdx`
- Create: `src/content/guides/how-to-get-xp.mdx`
- Create: `src/content/guides/halloween-the-game-crashing.mdx`
- Create: matching `research/pages/*.md` provenance records
- Test: `src/app/(site)/launch-seo-content.test.tsx`

**Interfaces:**
- Consumes: guide MDX pipeline and official multiplayer/progression/hotfix pages.
- Produces: five non-overlapping guide routes with qualified community evidence where needed.

- [ ] Extend failing tests with route-specific intent, qualification, source, and related-link assertions.
- [ ] Verify failures identify missing pages/content.
- [ ] Write complete pages; explicitly mark undocumented timings, thresholds, menus, and workarounds as unconfirmed.
- [ ] Re-run focused tests until green.

### Task 4: Strengthen existing hubs without rewriting them

**Files:**
- Modify: `src/content/guides/how-to-play.mdx`
- Modify: `src/content/pages/michael-myers.mdx`
- Modify: `src/content/pages/release-date.mdx`
- Modify: `src/content/pages/platforms.mdx`
- Modify: `src/config/game.ts`
- Test: `src/app/(site)/researched-content.test.tsx`
- Test: `src/lib/content/content-integrity.test.ts`

**Interfaces:**
- Consumes: new canonical pages.
- Produces: internal topic cluster and updated titles/launch facts while preserving all existing URLs.

- [ ] Write failing assertions for the Michael abilities quick list/title, September 8 9 AM PT launch time, crossplay/platform separation, hub links, and five homepage destinations.
- [ ] Run focused tests and confirm the expected gaps.
- [ ] Make additive content changes and update dates; do not remove ranked copy or redesign homepage modules.
- [ ] Re-run focused tests until green.

### Task 5: Technical SEO integrity and full verification

**Files:**
- Modify: `src/app/sitemap.test.ts`
- Modify: `src/lib/content/content-integrity.test.ts`
- Test: generated production output.

**Interfaces:**
- Consumes: all page and guide registries.
- Produces: complete unique sitemap, self-canonicals, valid breadcrumb/Article JSON-LD, and no broken internal references.

- [ ] Write failing tests listing all new canonical paths and excluding the legacy redirect.
- [ ] Run sitemap/content tests and confirm they fail before registry/content completion.
- [ ] Make only the minimal registry/reference corrections needed for green tests.
- [ ] Run `npm run lint`, `npm run test`, and `npm run build`.
- [ ] Crawl the production build for status, canonical, internal-link, sitemap, robots, duplicate-title, and JSON-LD errors.
- [ ] Review the final diff and report intentionally deferred topics that lack reliable evidence.
