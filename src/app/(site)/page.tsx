import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CategoryCard } from "@/components/cards/category-card";
import { EntityCard } from "@/components/cards/entity-card";
import { GuideCard } from "@/components/cards/guide-card";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { categoryDefinitions } from "@/config/categories";
import { gameConfig } from "@/config/game";
import { officialTrailer } from "@/config/media";
import type { GameConfig } from "@/lib/config/schema";
import { getAllGuides } from "@/lib/content/guides";
import { getCategoryEntries, getFeaturedEntities, resolveInternalHref } from "@/lib/content/queries";
import { buildVideoGameJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const getHeroImageAlt = (gameName: string): string =>
  `Fan-made placeholder for ${gameName}; not official game artwork`;

export function buildHomePageMetadata(config: GameConfig): Metadata {
  const metadata = buildPageMetadata({
    title: config.content.homepage.meta?.title ?? config.wikiName,
    description: config.content.homepage.meta?.description ?? config.description,
    pathname: "/",
    siteUrl: config.siteUrl,
    image: config.heroImagePath
  });

  return { ...metadata, title: { absolute: config.content.homepage.meta?.title ?? config.wikiName } };
}

export function generateMetadata(): Metadata {
  return buildHomePageMetadata(gameConfig);
}

export function HomePageContent({ config }: Readonly<{ config: GameConfig }>) {
  const guides = getAllGuides();
  const popularGuides = guides.filter((guide) => guide.frontmatter.featured).slice(0, 3);
  const latestGuides = guides.slice(0, 3);
  const featuredEntities = getFeaturedEntities(3);
  const homepage = config.content.homepage;

  return (
    <>
      <JsonLdScript
        data={buildVideoGameJsonLd({
          name: config.name,
          description: config.description,
          platforms: config.platforms,
          releaseDate: config.releaseDate,
          developer: config.developer,
          publisher: config.publisher,
          pathname: "/",
          siteUrl: config.siteUrl,
          image: config.heroImagePath
        })}
      />
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">{homepage.hero?.eyebrow ?? config.wikiName}</p>
          <h1 id="home-title">{homepage.hero?.title ?? config.tagline}</h1>
          <p className="home-hero__description">{homepage.hero?.description ?? config.description}</p>
          {homepage.hero ? <ul className="tag-list" aria-label="Confirmed launch facts">
            {homepage.hero.stats.map((stat) => <li key={stat}>{stat}</li>)}
          </ul> : null}
          <div className="home-hero__actions">
            <Link className="button button--primary" href={resolveInternalHref(config.content.homepage.primaryAction.reference)}>
              {config.content.homepage.primaryAction.label}
            </Link>
            <Link className="button button--secondary" href={resolveInternalHref(config.content.homepage.secondaryAction.reference)}>
              {config.content.homepage.secondaryAction.label}
            </Link>
            {homepage.tertiaryAction ? <Link className="button button--secondary" href={resolveInternalHref(homepage.tertiaryAction.reference)}>
              {homepage.tertiaryAction.label}
            </Link> : null}
          </div>
        </div>
        {config.name === officialTrailer.gameName ? <div className="home-hero__media">
          <p className="preview-card__eyebrow">Official Media</p>
          <div className="home-hero__video">
            <iframe
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={officialTrailer.embedUrl}
              title={officialTrailer.title}
            />
          </div>
          <a href={officialTrailer.watchUrl} rel="noopener noreferrer" target="_blank">Official Announce Trailer · Watch on YouTube ↗</a>
        </div> : <div className="home-hero__art">
          <Image alt={getHeroImageAlt(config.name)} fill priority sizes="(min-width: 64rem) 42vw, 100vw" src={config.heroImagePath} />
        </div>}
      </section>

      <section className="home-section" aria-labelledby="start-here-heading">
        <div className="section-heading">
          <p>{config.content.homepage.startHereEyebrow}</p>
          <h2 id="start-here-heading">{homepage.startHereTitle ?? "Start Here"}</h2>
        </div>
        <div className="start-here-grid">
          {config.content.homepage.startHereLinks.map((item) => {
            const href = resolveInternalHref(item.reference);

            return (
            <Link className="start-here-link" href={href} key={href}>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </Link>
            );
          })}
        </div>
      </section>

      <section className="home-section" aria-labelledby="popular-guides-heading">
        <div className="section-heading">
          <p>Recommended reading</p>
          <h2 id="popular-guides-heading">Essential Guides</h2>
        </div>
        <div className="preview-grid preview-grid--guides">
          {popularGuides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
        </div>
      </section>

      <section className="home-section" aria-labelledby="database-heading">
        <div className="section-heading section-heading--with-link">
          <div>
            <p>Explore the archive</p>
            <h2 id="database-heading">Wiki Database</h2>
          </div>
          <Link href={resolveInternalHref(config.content.homepage.databaseAction.reference)}>
            {config.content.homepage.databaseAction.label}
          </Link>
        </div>
        <div className="preview-grid preview-grid--categories">
          {categoryDefinitions.map((category) => (
            <CategoryCard category={category.slug} count={getCategoryEntries(category.slug).length} key={category.slug} />
          ))}
        </div>
        <div className="preview-grid preview-grid--entities">
          {featuredEntities.map((entity) => (
            <EntityCard
              category={categoryDefinitions.find((category) => category.slug === entity.category)!}
              entity={entity}
              key={`${entity.category}-${entity.slug}`}
            />
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="questions-heading">
        <div className="section-heading">
          <p>Quick answers</p>
          <h2 id="questions-heading">Popular Questions</h2>
        </div>
        <ul className="question-list">
          {config.content.homepage.popularQuestions.map((question) => {
            const href = resolveInternalHref(question.reference);

            return <li key={href}><Link href={href}>{question.label}</Link></li>;
          })}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="latest-guides-heading">
        <div className="section-heading">
          <p>Recently revised</p>
          <h2 id="latest-guides-heading">Latest Guides</h2>
        </div>
        <div className="preview-grid preview-grid--guides">
          {latestGuides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
        </div>
      </section>

      <section className="home-section game-information" aria-labelledby="game-information-heading">
        <div>
          <p className="preview-card__eyebrow">About the game</p>
          <h2 id="game-information-heading">{homepage.aboutGame?.title ?? "Game Information"}</h2>
          {(homepage.aboutGame?.paragraphs ?? [config.description]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {homepage.aboutGame ? <Link href="/guides">{homepage.aboutGame.cta}</Link> : null}
        </div>
        <div className="game-information__facts">
          <dl className="facts-list">
            {(homepage.aboutGame?.stats ?? [{ label: "Platforms", value: config.platforms.join(", ") }]).map((fact) =>
              <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
            )}
          </dl>
          <Link href="/game-info">View game information</Link>
        </div>
      </section>
      {homepage.finalCta ? <section className="home-section game-info-section" aria-labelledby="final-cta-heading">
        <h2 id="final-cta-heading">{homepage.finalCta.title}</h2>
        <p>{homepage.finalCta.description}</p>
        <div className="home-hero__actions">
          <Link className="button button--primary" href={resolveInternalHref(homepage.primaryAction.reference)}>{homepage.finalCta.primary}</Link>
          {config.officialWebsite ? <a className="button button--secondary" href={config.officialWebsite} rel="noreferrer" target="_blank">{homepage.finalCta.secondary}</a> : null}
        </div>
      </section> : null}
    </div>
    </>
  );
}

export default function HomePage() {
  return <HomePageContent config={gameConfig} />;
}
