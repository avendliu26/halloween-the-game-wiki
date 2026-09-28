# Visual enrichment implementation plan — 2026-09-28

The task is to improve existing guide cards and long pages with a limited set of official-source images, and to load official YouTube videos only after a user requests playback. Existing routes, ad behavior, and metadata rules remain in place.

1. Select roughly 20 visually checked originals from `selected/` (plus the official trailer poster from the staged candidate pool). Convert each to a local 16:9 WebP at no more than 1600×900, retaining the full frame and visible copyright notice. Record the exact production mapping and source URL in `research/`.
2. Add one typed official video registry in `src/config/media.ts` and one client component that initially renders a local poster and play button. After click it renders a non-autoplay YouTube iframe with the current referrer policy and a fallback watch link. Replace the homepage iframe.
3. Permit only `<OfficialVideo video="known-registry-key" />` with a literal validated key in the existing safe MDX compiler. Keep all other raw HTML, arbitrary JSX, expressions, and remote Markdown images rejected.
4. Add lead images to the seven relevant guides, a small number of contextual images to the named long pages, and one environment still plus a flythrough on each existing map detail page. Use responsive CSS for article Markdown images.
5. Test video interaction, safe MDX validation, asset paths, image sizing and source mappings; run full test, lint, build, local crawl, desktop/mobile page checks. Review the diff, commit, push main, wait for production Ready, and verify live pages and metadata.
