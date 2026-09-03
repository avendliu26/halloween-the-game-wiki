# Vercel asset validation implementation plan

> **For agentic workers:** Use systematic debugging, test-driven development and verification-before-completion. The user requested direct execution in this checkout, one final commit and push to main.

**Goal:** Keep mandatory prebuild image integrity checks without loading Vitest.

**Architecture:** Plain Node imports an independent TypeScript validator using native type stripping. Share existing entity/frontmatter schemas, filesystem protection and MDX AST plugins with application code; keep React rendering outside the validation graph.

**Tech stack:** Existing Node engine range, Next.js, Zod, gray-matter and MDX compiler.

**Spec:** User's 2026-09-03 Vercel build repair request in this task.

## Constraints

- Only change this repository; never change the ARPG template.
- Preserve Node engines `^22.22.2 || ^24.15.0 || >=26.0.0`, framework versions and npm security settings.
- Keep every existing asset rule and `asset-integrity.test.ts`.
- No Vercel deployment command; user will retrigger deployment.

## Implementation and verification

- [x] Inspect scripts, imports, schemas, lockfile, resolver ancestry and deployment status.
- [x] Add a failing plain-Node CLI regression test; verify nonzero exit before implementing the CLI.
- [x] Extract guide parsing into `src/lib/content/guide-source.ts` and entity validation into `src/lib/content/entity-validation.ts`; re-export existing APIs.
- [x] Add `validateAssets({rootDirectory?, config?})` in `src/lib/content/validate-assets.ts`, using shared schemas and MDX AST plugins, without evaluating MDX.
- [x] Add `scripts/validate-assets.mjs`; route `prebuild` through `npm run validate:assets`.
- [x] Make only the validator's transitive TypeScript imports Node-compatible with explicit relative extensions; allow those extensions in tsconfig.
- [x] Declare the already-locked MDX compiler 3.1.1 as a direct production dependency, with no package upgrades.
- [x] Preserve production integrity test and add real filesystem fixtures for valid, missing, empty, remote, traversal, duplicate-definition, directory and escaping-symlink cases.
- [x] Run `npm install`, `npm run lint`, `npm run test`, `npm run build`.
- [x] Inject `/images/test/missing-image.webp` into actual content; assert standalone validation and prebuild fail; restore and assert success.
- [x] Move only this repository's generated `node_modules` and `.next` out of the checkout; run `npm ci` and full build. Check supported Node 22 and 24 entrypoints.
- [x] Request independent read-only review; the review agent could not run due to its usage limit. Coordinator completed a direct diff review instead; no independent-review approval is claimed.

Final handoff: commit `fix: make asset validation Vercel-compatible`, push `origin main`, and verify the remote SHA. Commit/push evidence is reported after execution in the task, rather than embedding a self-referential SHA in this commit.

## Diagnostic evidence and limits

- Original `prebuild` ran Vitest 4.1.11, loading global jsdom setup and `next-mdx-remote/rsc` through the content test.
- Local Node is 26.3.1. The original test also passed on locally invoked Node 22.22.2 and 24.15.0. A Node-major mismatch alone is not established as the cause.
- GitHub deployment 6234881751 reports Vercel deployment `dpl_GEiZbaWipDgGfjT9dM8vdv1rmcDL` failed. The provided log reports `No such built-in module: node:` during Vitest. Full Vercel stack and actual build Node patch version were unavailable through current read-only access; browser access timed out. Do not claim an exact resolver defect or verified remote runtime.
- Project imports use valid `node:fs`, `node:path`, `node:url`, etc.; none imports the bare `node:` specifier.
- `unrs-resolver@1.12.2` is pulled in by `eslint-config-next -> eslint-import-resolver-typescript`; the warning also appears during successful local installation/build. No evidence supports approving its install scripts as this fix.
- Production now bypasses the failing runner boundary entirely. A child-process test rejects Vitest/Vite/jsdom/Testing Library/Next/React imports while running the real validation CLI successfully.

Vercel chooses a supported major version from package engines; the configured range already permits 22/24 and future supported versions. See [Vercel Node version documentation](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions). No unrelated runtime pin or security-policy change is needed for this architectural repair.

## Verification results

- `npm install`: passed, zero reported vulnerabilities. Existing allow-scripts warnings retained; no approval or policy override.
- Node 26.3.1: lint, 187 tests across 23 files, production build passed.
- Real missing-image injection: both `npm run validate:assets` and `npm run build` exited 1 with a path/source-specific error. Next build never started. The actual content file was restored byte-for-byte against Git.
- Node 22.22.2 and 24.15.0: direct Node validator passed.
- Clean installation on local macOS using Node 24.15.0 / npm 11.16.0: `npm ci`, lint, 187 tests and production build passed. This is not a claim that Vercel's Linux build has run.
- Existing generated dependencies and build output were moved recoverably to `/tmp/halloween-clean-install.Qh8enP` before `npm ci`; nothing from that directory was reused.
- The ARPG template working tree remains unchanged.

## Changed-file responsibilities

- `package.json`, `package-lock.json`: direct prebuild command and explicit existing MDX compiler dependency; no dependency versions changed.
- `scripts/validate-assets.mjs`, `src/lib/content/validate-assets.ts`: CLI status/error reporting and complete image scan.
- `src/lib/content/guide-source.ts`, `entity-validation.ts`: existing parsing/schema validation extracted unchanged.
- `src/lib/content/guides.ts`, `registry.ts`: use/re-export shared validation while retaining rendering APIs.
- `src/config/game.ts`, `categories.ts`, `src/lib/config/schema.ts`, `src/lib/content/types.ts`, `guide-mdx.ts`, `src/lib/validation/assets.ts`: only explicit relative TypeScript imports needed by Node.
- `tsconfig.json`: permit those `.ts` import extensions for type checking.
- `src/lib/content/asset-integrity.test.ts`, `asset-cli.test.ts`: validator fixture coverage and plain-Node runtime isolation test.
- This document: implementation, diagnostic limits and verification record.
