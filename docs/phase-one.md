# Phase one implementation record

Historical phase-one snapshot. The September 3 content expansion and refreshed source findings are recorded in [content-audit.md](content-audit.md) and [../research/README.md](../research/README.md); use those for current verification status.

## Scope and protection

- Approved source: ARPG Wiki Template v1.0, commit `228c093`, branch main, clean before copying.
- Independent project and Git repository; no inherited .git, dependencies, build output, coverage, worktrees, caches or environment files.
- The existing empty Codex working folder was left untouched. All project edits are in the explicitly requested lower-case hyphenated project directory.
- Reused the template routes, layout, validation, cards, restricted MDX and SEO builders. No deployment or services added.
- Replaced inherited template planning documents with this project record; originals remain in the untouched template.

## Decisions

- Maps use the existing `/locations` category, displayed as Maps. No route or database architecture rewrite.
- The official September 1 announcement confirms all four map names; minimal entries can therefore be published without inventing names.
- The two character entries describe player roles, not an exhaustive character roster.
- Start cards describe current pre-launch coverage honestly rather than promising controls, routes or progression that are not yet verified.
- The mother template has no homepage video module, global sidebar, or legal pages. Added optional official media-link support and simple legal pages using existing page classes; kept existing article sidebars/table of contents. The media link remains hidden pending direct availability verification.
- Optional schema fields and small render additions support the requested hero stats, third CTA, About section, final CTA and footer. Existing fixture-based tests retain their independent configuration.
- The template already uses a single dark theme. Orange was mapped to the existing primary field, without adding a duplicate light/dark theme system.
- Canonical and absolute social/sitemap URLs stay omitted until NEXT_PUBLIC_SITE_URL is set to a real domain.

## Official source notes — checked September 3, 2026

- [Official website](https://halloweengame.com/): September 8 digital launch, Haddonfield in 1978, Michael Myers, 1v4.
- [Official map announcement](https://halloweengame.com/news/the-locations-of-halloween-the-game/): East Haddonfield, Haddonfield Heights, Orange Grove Estates and Haddonfield Town Center; limited landmark descriptions.
- [Official pre-order FAQ](https://halloweengame.com/news/preorder/): $39.99/$59.99 USD digital editions, eligible early access September 4 at 9 AM PT, Richard/Alexis in Deluxe.
- [Steam listing](https://store.steampowered.com/app/3219630/Halloween_The_Game/), checked through Steam's appdetails API as the web reader reached an age gate: developers/publishers, single-player, ten languages, and published PC requirements. Steam's CPU labels describe socket/platform families rather than precise CPU models; the site explicitly notes this.
- [Official Discord announcement](https://halloweengame.com/news/official-discord-server/): official invitation is `https://discord.gg/halloweenthegame`.
- The official site's YouTube link targets [the announce trailer](https://www.youtube.com/watch?v=sv3QNjz1mYg). No downloaded or rehosted video.
- Discord and YouTube direct requests timed out in this environment (web reader, terminal and browser checks). This is not evidence of a 404, but live availability could not be established. Their optional public links are therefore hidden rather than presented as verified; Game Info links to the reachable official sources. Re-enable `discordUrl` and `youtubeUrl` after a successful availability check.

## Still awaiting verification / pre-deployment work

- Complete crossplay/cross-progression rules.
- Direct availability of the official Discord invitation and YouTube trailer.
- Controls, detailed objectives, progression/rewards, abilities, and tested escape strategies.
- Authorized final brand assets: current SVGs are clearly labeled fan-made placeholders.
- Production domain, operator/privacy contact and hosting-specific privacy disclosures.
- Future localization priority: English → pt-BR → German → Spanish. Only English in phase one.

## Verification

- Original copied baseline: 131 tests passed before implementation.
- New configuration/visibility tests were observed failing before implementation.
- Filter fixture isolation and 404 recovery regressions were observed failing before fixes.
- First complete pass: lint passed, 137 tests passed, production build passed including image validation.
- Final pass: lint passed; 17 test files / 138 tests passed; build passed (19 generated outputs, including framework and metadata routes). The additional regression proves missing entity-card fields never display `undefined`.
- `node scripts/verify-site.mjs` passed against the production server: all 15 linked content pages return 200; 29 anchors and 3 distinct local image assets are valid; hidden/unknown categories return 404.
- Homepage title: 59 characters; description: 156; keywords: within 100. Metadata and JSON-LD parsed successfully. No visible former brand, fictional world, or missing-data strings.
- Both SEO modes were exercised: no domain (intentionally absent canonical/absolute OG/empty sitemap), and a temporary localhost origin (all 15 canonical and sitemap URLs, OG URLs and robots sitemap declaration correct). Final build restored to no configured production domain. No environment file was written.
- Browser verification at 390px: homepage, both guides, Game Info, Characters and Maps have no horizontal overflow or broken images. Desktop homepage checked at 1280px; mobile menu/category navigation and live map filtering work. Browser console: no captured warnings/errors.
- Independent read-only code review and scoped card-fix follow-up found no outstanding substantive issues.
- Final source-template check before commit: `git status --porcelain` empty; HEAD remains `228c093`. No Halloween content was written into the template.
