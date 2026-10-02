# Controlled visual polish — October 2, 2026

## Scope

Baseline production commit: `9105f2cf7ecc845b32b0b4f017407f2bae02a2e4`.

This pass changes presentation and homepage motion. It preserves all page URLs, content, navigation labels and destinations, metadata, canonical URLs, and structured data. No content files or configuration files are edited. The how-to-play, platforms, police-respawn, and release-date content is frozen.

## Implementation

- Homepage retains its split layout, headings, facts, and three existing actions. An existing 1600×900 Haddonfield still (about 48KB WebP) supplies a decorative backdrop beneath directional dark gradients, an edge vignette, and restrained amber light. It is explicitly hidden from accessibility APIs. The existing click-to-play trailer stays in place.
- Guide and entity cards reuse their components, with a clipped 16:9 media wrapper. Shared styles also polish category, Start Here, and summary cards. Desktop pointer hover lifts a card 3px and scales its image 1.035×, with stronger borders, shadow, and readable metadata. Touch users see all metadata without hover.
- Existing media keeps its 16:9 reserved frame and lazy posters/iframes. Play controls use a neutral dark ring that turns amber on interaction, with a clear outer keyboard focus outline. Playback remains user-triggered without autoplay.
- Section dividers and tonal gradients establish rhythm without changing section order or adding new boxes.
- Navigation structure, labels, and behavior are preserved. Styles add active/hover treatments and a 160ms desktop menu entrance.
- Shared motion tokens are 160ms, 260ms, and 600ms with one common easing curve. The homepage image has a 28-second transform-only drift; initial text entrance starts at 80% opacity and never delays useful content.
- `HomeMotion` is a small homepage-only client wrapper around server-rendered children. One IntersectionObserver watches major sections and unobserves each on first entry. Sections are visible by default; observer support is optional. No waiting/hidden state is introduced. Keyboard focus cancels a section animation.
- Narrow viewports disable hero/reveal/zoom motion and remove the hero's minimum height. Reduced-motion preferences disable drift, reveals, zoom, transforms, and nonessential transitions. Preference changes disconnect the observer and clear reveal classes.

## Verification before deployment

- 39 test files / 304 tests pass, including existing SEO/content, navigation, media, TOC, and internal-reference tests. New tests cover observer-free visibility, mobile/reduced-motion behavior, one-time entry, preference changes, and cleanup.
- Lint, standalone typecheck, and production build pass. The asset validator reports 31 references across 30 MDX documents.
- Production-build crawl passes across 41 pages, 684 anchors, and 29 unique image assets, including homepage, sitemap, robots, metadata, JSON-LD, duplicate/orphan routes, and known 404s. The crawler's image-label assertion now accepts explicitly aria-hidden decorative imagery while retaining the required alt attribute.
- Rendered freeze comparison matches the previous production HTML for `/`, `/guides/beginner-guide`, `/guides/how-to-play`, `/platforms`, `/guides/how-to-respawn-as-police`, and `/release-date`: main text, H1/H2/H3, title, description, canonical, JSON-LD, and desktop navigation labels/destinations are identical.
- Homepage and all four representative articles were inspected at 320, 375, 390, 430, and 1440px. No horizontal overflow or TOC/main overlap was found. Mobile TOCs start closed; desktop TOCs remain expanded. Article content ordering is unchanged.
- Mobile homepage useful hero content and actions fit in the initial 844px viewport. Poster/media continues below that content without an artificial minimum height. Cards remain readable, and mobile navigation targets measure 53px or more. Menu opening and Escape closing work.
- Desktop hover measures a 3px lift and approximately 1.035× image zoom. Keyboard focus has a visible 2px outline. Real browser reduced-motion emulation confirms no drift, reveal classes, image transform, or transition motion.
- Buffered browser layout-shift observations on the local production build report CLS 0 at 1440×900 and 320/375/390/430×844. These are synthetic checks, not field Core Web Vitals.
- First-party homepage transfer comparison, recompressed with gzip: JS 274,408 → 274,527 bytes (+119); CSS 6,085 → 7,500 bytes (+1,415). No dependencies or animation libraries are added. The observer is scoped to the homepage, images retain fixed frames, and noncritical media retains lazy loading.

Production is deployed through the existing linked Vercel Git workflow after the final diff review. Live verification and the deployment identity are reported in the task completion message.
