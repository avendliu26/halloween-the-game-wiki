# Codex Task — Halloween Visual Enrichment

Work directly in the existing repository for `https://halloween-thegame.wiki/`.

Use the staged research package already on disk:
- `research/visual-assets-2026-09-28/visual-asset-plan.md`
- `research/visual-assets-2026-09-28/selected-manifest.json`
- `research/visual-assets-2026-09-28/video-manifest.json`
- `research/visual-assets-2026-09-28/selected/`

Do not ask for intermediate confirmation. Complete implementation, tests, commit, push, Vercel deployment, and production verification.

## Hard constraints
- Do not redesign the site or change its information architecture.
- Preserve the current Adsterra empty-slot fix and all SEO/canonical/sitemap behavior.
- Do not create thin new pages just to use images.
- Do not use competitor-wiki/community images and do not hotlink Storyblok images in production.
- Use only the staged official-source originals or existing production assets.
- Keep source/provenance records in `research/`; only optimized assets used by the site go into `public/`.
- Do not publish all staged images merely because they exist. Select only assets that materially improve the page.

## Image implementation
- Convert selected production images to local WebP, normally 1600×900 or 1280×720, quality about 82–86.
- Preserve visible copyright notices; no generative editing, face alteration, compositing, or misleading crops.
- Use descriptive, factual alt text. Do not infer an exact map/character/mechanic beyond what the official source supports.
- Keep `images.unoptimized: true` behavior.
- Add responsive article-image styling if Markdown body images currently lack safe max-width/height rules.
## Guide-card coverage priority
The current scan found 13 guides but only 2 with frontmatter images. Improve the guide index without forcing imagery onto unrelated troubleshooting pages.

Add strong lead/card images first to:
1. `patch-notes` — use a post-launch/update visual.
2. `how-to-escape` — use an official map/garage/escape-context visual.
3. `how-to-struggle-free` — use a Michael-vs-Civilian gameplay visual.
4. `how-to-respawn-as-police` — use the official Michael/police scene.
5. `how-to-get-xp` — use the progression/challenge UI.
6. `how-to-unlock-characters` — use the official cast/roster visual.
7. `challenges-not-working` only if a clearly relevant challenge/progression UI image fits.

Keep the existing Beginner Guide and How to Play images unless a clearly superior use is justified.
Leave backend-authentication/crashing/skill-check pages without decorative art if no accurate official still matches them.

## Long-page visual enrichment
Add a small number of contextual images, not galleries everywhere:
- `/challenges`: 2–3 visuals from progression UI + official Story Mode imagery.
- `/perks`: 2 visuals, led by `po-perk-cards.jpg`.
- `/characters`: 2–3 visuals: new-cast group, legacy group, and/or current customization UI. Do not make 10 thin character pages.
- `/characters/michael-myers`: 2 relevant stalking/gameplay stills.
- `/guides/how-to-play`: keep the existing lead image and add at most 2 useful gameplay images.
- `/guides/how-to-escape`: lead image plus at most 1 secondary map/garage visual.
- Map detail pages: at most 1–2 additional environment stills each where useful.

Target roughly 18–24 new production images total, despite the larger staged pool.
## Official video implementation
Use `video-manifest.json` as the source of truth.

Create one reusable lightweight official-video component. Preferred behavior:
- local poster image first;
- no YouTube iframe until the user clicks Play;
- no autoplay;
- accessible button/title;
- direct YouTube fallback link;
- responsive 16:9 layout;
- preserve `strict-origin-when-cross-origin` or equivalent safe referrer behavior once iframe loads.

Extend the existing `src/config/media.ts` registry rather than scattering raw video IDs through components.
If MDX integration is used, keep the safe-MDX model: allow only a tightly controlled official-video component with literal/validated props. Do not enable arbitrary raw HTML or arbitrary iframe URLs.

Recommended placements:
- Homepage: replace the older announce trailer with the current Gameplay + Release Date Trailer (`715qsd1qIFg`) using the lightweight component.
- How to Play: Multiplayer Gameplay Overview (`BPJ83MKWJuc`).
- Perks or progression-focused content: Progression & Customization (`AdwC7tve3gc`). Avoid unnecessary duplicate embeds across several pages.
- Challenges hub: Singleplayer Story Mode (`1NqGLjfpYtI`).
- Four map detail pages: their respective official flythrough videos, click-to-load only.

## Verification
Run:
- `npm test`
- `npm run lint`
- `npm run build`

Also verify asset integrity, local `/images/...` paths, no broken Markdown images, no duplicate slugs, no new third-party image hotlinks, no autoplay, and no eager YouTube iframe loading before interaction.
Check desktop and mobile for `/`, `/guides`, `/challenges`, `/perks`, `/characters`, `/characters/michael-myers`, `/guides/how-to-play`, `/guides/how-to-escape`, `/guides/how-to-respawn-as-police`, and the four map detail pages.

Review the diff, commit clearly, push `main`, wait for Vercel Production Ready, and verify live production. Final report in Chinese: images added/where, videos added/where, optimization sizes, tests/lint/build, commit SHA, Vercel result, and any staged assets intentionally left unused.
