import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { WikiPageLayout } from "@/components/wiki/wiki-page-layout";
import { MatchStart } from "@/components/wiki/match-start";
import { compileGuide, getAllGuides, getGuide } from "@/lib/content/guides";
import { resolveContentReferences } from "@/lib/content/queries";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/format";
import { gameConfig } from "@/config/game";

type GuidePageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  return {
    ...buildPageMetadata({
    title: guide.frontmatter.title,
    description: guide.frontmatter.description,
    pathname: `/guides/${guide.slug}`,
    siteUrl: gameConfig.siteUrl,
    image: guide.frontmatter.image,
    article: {
      updatedAt: guide.frontmatter.updatedAt,
      publishedAt: guide.frontmatter.publishedAt,
      author: guide.frontmatter.author
    }
    }),
    ...(guide.frontmatter.title.includes(gameConfig.name) ? { title: { absolute: guide.frontmatter.title } } : {})
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const { content, headings, relatedPages } = await compileGuide(guide, { moveRelatedToSidebar: true });
  const related = resolveContentReferences(guide.frontmatter.related);
  const heading = guide.frontmatter.heading ?? guide.frontmatter.title;

  return (
    <>
      <JsonLdScript
        data={buildArticleJsonLd({
          title: guide.frontmatter.title,
          description: guide.frontmatter.description,
          updatedAt: guide.frontmatter.updatedAt,
          publishedAt: guide.frontmatter.publishedAt,
          author: guide.frontmatter.author,
          pathname: `/guides/${guide.slug}`,
          siteUrl: gameConfig.siteUrl,
          image: guide.frontmatter.image
        })}
      />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          items: [
            { name: "Home", pathname: "/" },
            { name: "Guides", pathname: "/guides" },
            { name: heading, pathname: `/guides/${guide.slug}` }
          ],
          siteUrl: gameConfig.siteUrl
        })}
      />
    <article className={`guide-article-page${slug === "how-to-play" ? " guide-article-page--how-to-play" : ""}`}>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/guides", label: "Guides" }, { label: heading }]} />
      <header className="guide-article-page__header">
        <p className="preview-card__eyebrow">{slug === "how-to-play" ? "Getting started · Multiplayer guide" : "Guide"}</p>
        <h1>{heading}</h1>
        <div className="guide-dates">{guide.frontmatter.publishedAt ? <time dateTime={guide.frontmatter.publishedAt}>Published {formatDate(guide.frontmatter.publishedAt)}</time> : null}
        <time dateTime={guide.frontmatter.updatedAt}>Updated {formatDate(guide.frontmatter.updatedAt)}</time></div>
        {slug === "how-to-play" ? <>
          <p className="guide-deck">{guide.frontmatter.description}</p>
        </> : null}
      </header>
      {slug === "how-to-play" ? <MatchStart /> : null}
      <WikiPageLayout headings={headings} related={relatedPages.length ? relatedPages : related} relatedHeading={relatedPages.length ? "Related Pages" : "Related Content"}>
        <div className="guide-article-page__body">
          {/* These guides place their media in MDX after the direct answer. */}
          {!["how-to-play", "how-to-respawn-as-police"].includes(guide.slug) && guide.frontmatter.image && guide.frontmatter.imageAlt ? (
            <Image
              alt={guide.frontmatter.imageAlt}
              className="guide-article-page__image"
              height={720}
              src={guide.frontmatter.image}
              unoptimized
              width={1280}
            />
          ) : null}
          {content}
        </div>
      </WikiPageLayout>
    </article>
    </>
  );
}
