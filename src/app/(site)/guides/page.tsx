import type { Metadata } from "next";
import { GuideCard } from "@/components/cards/guide-card";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { gameConfig } from "@/config/game";
import { getAllGuides } from "@/lib/content/guides";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { WikiPageLayout } from "@/components/wiki/wiki-page-layout";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Guides",
    description: gameConfig.content.guideIndexDescription,
    pathname: "/guides",
    siteUrl: gameConfig.siteUrl
  });
}

export default function GuidesPage() {
  const guides = getAllGuides();
  const illustratedGuides = guides.filter((guide) => Boolean(guide.frontmatter.image));
  const textGuides = guides.filter((guide) => !guide.frontmatter.image);

  return (
    <article className="guides-page">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Guides" }]} />
      <header className="page-header">
        <p className="preview-card__eyebrow">Field notes</p>
        <h1>Guides</h1>
        <p>{gameConfig.content.guideIndexDescription}</p>
      </header>
      <WikiPageLayout related={[{ title: "Story Challenges", href: "/challenges" }, { title: "Perks and decks", href: "/perks" }, { title: "Michael Myers abilities", href: "/characters/michael-myers" }, { title: "Playable characters", href: "/characters" }, { title: "Crossplay status", href: "/crossplay" }]}>
        <div className="preview-grid preview-grid--guides">
          {illustratedGuides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
        </div>
        {textGuides.length > 0 ? (
          <section className="guides-text-only" aria-labelledby="more-guides-heading">
            <h2 id="more-guides-heading">More guides</h2>
            <div className="preview-grid preview-grid--guides preview-grid--guides-compact">
              {textGuides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
            </div>
          </section>
        ) : null}
      </WikiPageLayout>
    </article>
  );
}
