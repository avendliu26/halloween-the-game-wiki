import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { RelatedContent } from "@/components/wiki/related-content";
import { TableOfContents } from "@/components/wiki/table-of-contents";
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
    ...(guide.frontmatter.title.startsWith(gameConfig.name) ? { title: { absolute: guide.frontmatter.title } } : {})
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const { content, headings } = await compileGuide(guide);
  const related = resolveContentReferences(guide.frontmatter.related);

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
            { name: guide.frontmatter.title, pathname: `/guides/${guide.slug}` }
          ],
          siteUrl: gameConfig.siteUrl
        })}
      />
    <article className="guide-article-page">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/guides", label: "Guides" }, { label: guide.frontmatter.title }]} />
      <header className="guide-article-page__header">
        <p className="preview-card__eyebrow">Guide</p>
        <h1>{guide.frontmatter.title}</h1>
        {guide.frontmatter.publishedAt ? <time dateTime={guide.frontmatter.publishedAt}>Published {formatDate(guide.frontmatter.publishedAt)}</time> : null}
        <time dateTime={guide.frontmatter.updatedAt}>Updated {formatDate(guide.frontmatter.updatedAt)}</time>
      </header>
      <div className="guide-article-page__layout">
        <TableOfContents headings={headings} />
        <div className="guide-article-page__body">
          {guide.frontmatter.image && guide.frontmatter.imageAlt ? (
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
          <RelatedContent heading="Related Content" related={related} />
        </div>
      </div>
    </article>
    </>
  );
}
