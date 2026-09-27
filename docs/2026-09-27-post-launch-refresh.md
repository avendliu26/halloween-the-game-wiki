# September 27 post-launch refresh

## Scope and sources

Preserved Next.js/React/MDX architecture, visual system, existing routes, and canonical origin. Updated homepage/game-info/edition summary copy, Challenges hub and all six chapter guides, challenge troubleshooting, Perks, XP, unlocks, escape, Michael, characters, beginner/how-to-play, police, crashes, crossplay, platforms and physical-edition context.

Added only two missing intents:

- `/guides/patch-notes`: evergreen update history, launch through 1.0.4.
- `/guides/how-to-struggle-free`: grab/Struggle, Stalk versus Bloodthirst, Capability, Pocket Knife, 1.0.3 and corrective 1.0.4.

Official news checked September 27; newest published patch was 1.0.4, September 26:

- https://halloweengame.com/news/
- https://halloweengame.com/news/patch-notes-1-0-4/
- https://halloweengame.com/news/patch-notes-1-0-3/
- https://halloweengame.com/news/patch-notes-1-0-2/
- https://halloweengame.com/news/halloween-the-game-out-now/
- https://halloweengame.com/news/progression-customization-overview/
- https://halloweengame.com/news/multiplayer-gameplay-overview/
- https://halloweengame.com/news/the-locations-of-halloween-the-game/
- https://halloweengame.com/news/whats-coming-next/

## Evidence boundaries

The 10,000 Perk Point grant is dated September 26, for then-current players, not a permanent new-account reward. The two-identical-perk rule is not a two-card deck size. Passive tracking after Prestige is distinct from its remaining locked-looking UI. Updated Progressive targets are separate from Story chapter objectives.

Removed unsupported current cooldown measurements and stale “latest 1.0.2” advice. Retained historical pre-order benefits, the still-future October physical release, and explicitly dated community routes. Research archives remain historical records, not current-facing copy. No unverified challenge slots, full unlock/reset tables, hidden combat formulas, exact route capacities or guaranteed escape inputs were invented. No hands-on current-game testing is claimed.

## Verification

- New guide route expectations first failed before implementation; subsequently passed.
- `npm test`: 279 tests, 37 files passed.
- `npm run lint`: passed.
- `npm run build`: passed, including asset validation and TypeScript.
- `scripts/verify-site.mjs` against local production build: 41 pages, 342 anchors, seven images; metadata, JSON-LD, canonical, robots and sitemap passed; no duplicate titles/H1/canonicals or orphan built pages.
- Browser checks: desktop homepage and patch tracker; 390px mobile homepage and struggle guide, including table/anchor navigation. No whole-page horizontal overflow; tables retain existing internal scrolling.
- Final production readiness is checked after push, separately from this local report.

## Domain discrepancy

The brief spells `halloween-the-game.wiki`; the repository, canonical configuration and existing Vercel account bind `halloween-thegame.wiki`. The former resolves to a different `/en` site. This refresh preserves and deploys the existing repository's actual production domain; no DNS or domain migration is authorized or performed.
