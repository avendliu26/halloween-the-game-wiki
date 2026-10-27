# Cloudflare backup deployment

- Source: this repository, `main`; both platforms watch Git pushes.
- Backup: https://halloween-the-game-wiki-dfa.pages.dev
- Pages build: `node scripts/cloudflare-build.mjs`; output: `out`.
- No custom domain or DNS changes. Default `npm run build` retains the Vercel build mode.
- Backup Worker preserves redirects and sends `X-Robots-Tag: noindex, nofollow`, including on errors. Canonicals remain on the original domain.
- No secret or database migration. Production analytics credentials are not copied.
- Verify the deployed commit on both platforms and test actual pages, redirects, missing routes and assets. A build alone is not a release check.
