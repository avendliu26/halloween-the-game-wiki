import type { Metadata } from "next";
import { GuideCard } from "@/components/cards/guide-card";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { gameConfig } from "@/config/game";
import { getAllGuides } from "@/lib/content/guides";
import { buildPageMetadata } from "@/lib/seo/metadata";

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

  return (
    <article className="guides-page">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Guides" }]} />
      <header className="page-header">
        <p className="preview-card__eyebrow">Field notes</p>
        <h1>Guides</h1>
        <p>{gameConfig.content.guideIndexDescription}</p>
      </header>
      <div className="preview-grid preview-grid--guides">
        {guides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
      </div>
    </article>
  );
}
