# Halloween: The Game Wiki

Independent fan-made Halloween: The Game guide and wiki.

Phase one instantiates the approved ARPG Wiki Template v1.0 (source commit `228c093`) without inheriting its Git history. This site is not affiliated with, endorsed by, or owned by IllFonic, Gun Interactive, or the Halloween rights holders.

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Zod, local JSON and restricted MDX; Vitest and Testing Library. No CMS, database, accounts, comments, analytics, or ads.

## Local development

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Verification and production build

```sh
npm run lint
npm test
npm run build
npm start
```

The build first validates every configured and content-referenced local image. MDX permits Markdown, GFM tables, local images, and ImportantNote; remote media, raw HTML, and arbitrary JavaScript/JSX are rejected.

With the production server running, use `node scripts/verify-site.mjs http://localhost:3000` to crawl all linked pages, images and anchors and verify SEO output. When testing a configured origin, pass the same `NEXT_PUBLIC_SITE_URL` used for the build.

## Project structure

- `src/config/game.ts`: identity, SEO, theme, navigation, official links, homepage and footer copy.
- `src/config/categories.ts`: visible categories and their presentation. Navigation's stable `database` ID controls which categories are exposed.
- `src/data/`: validated local entities; four confirmed maps and two player-role overviews.
- `src/content/guides/`: beginner-guide.mdx and how-to-play.mdx.
- `src/app/`: homepage, guides, category/entity routes, Game Info, legal pages, sitemap and robots.
- `src/components/`: existing template layout, navigation, cards and wiki components.
- `public/images/`: neutral, clearly labeled fan-made placeholders. These are not official screenshots or logos.
- `src/test/fixtures/`: independent test-only data.
- `docs/phase-one.md`: source notes, scope decisions, and release checklist.

## Content directory

- `/`: launch-focused homepage.
- `/guides`, `/guides/beginner-guide`, `/guides/how-to-play`.
- `/locations`: displayed as **Maps**, reusing the template route. Four minimal factual entries, not an interactive map.
- `/characters`: Michael Myers and Civilians role overviews, not a complete roster.
- `/game-info`: platforms, release, editions, requirements, and official links.
- `/privacy-policy`, `/terms-of-service`.

Weapons, Bosses, Skills, Items and Quests are hidden, contain empty datasets, and are not generated as category pages or sitemap entries. No Codes pages or invented statistics are provided.

## Environment variables

`NEXT_PUBLIC_SITE_URL` is optional locally. Set it to the real production HTTP(S) origin before the production build. No production domain has been selected or invented.

Without this variable the template deliberately omits canonical URLs, absolute Open Graph URLs/images and the robots sitemap declaration, and returns an empty sitemap. Once configured, canonical, Open Graph, sitemap and JSON-LD absolute URLs use the existing shared builders. Do not treat the empty local sitemap as deployment-ready SEO.

All `.env*` files are ignored. No secrets are needed for local development. There is no Vercel deployment in this phase.

## Editorial status

Information checked September 3, 2026 against the official website and Steam. Crossplay/cross-progression, detailed controls, character progression/rewards, and tested route strategies remain awaiting verification in this wiki. The supplied keywords are a future content backlog, not authority to invent facts.

Verified official website and Steam links are in game config. The official Discord and trailer destinations are recorded in `docs/phase-one.md`, but their optional navigation links remain hidden until direct reachability can be verified. The original template has no video module; no video is embedded or rehosted.

Before public deployment: set the real domain, provide site operator/privacy contact and hosting disclosures, replace placeholders with authorized assets, review legal text, and recheck launch-sensitive claims.

Future localization priority: English → pt-BR → German → Spanish. Only English is implemented.
