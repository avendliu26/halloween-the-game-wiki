import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { gameConfig } from "@/config/game";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { WikiPageLayout } from "@/components/wiki/wiki-page-layout";
import { PageSummaryCards } from "@/components/wiki/page-summary-cards";
import { compileGuide } from "@/lib/content/guides";
import { getResearchPage, standalonePages } from "@/lib/content/pages";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/format";
import { AdsterraBanner, ResponsiveAdsterraTop } from "@/components/ads/adsterra-banner";

const requirePage = (slug: string) => {
  const route = standalonePages.find((page) => page.slug === slug);
  const record = getResearchPage(slug);
  if (!route || !record) notFound();
  return { route, record };
};

export function researchMetadata(slug: string): Metadata {
  const { route, record } = requirePage(slug);
  const { title, description, updatedAt, publishedAt } = record.frontmatter;
  return {
    ...buildPageMetadata({ title, description, pathname: route.pathname,
      siteUrl: gameConfig.siteUrl, article: { updatedAt, publishedAt } }),
    title: { absolute: title }
  };
}

export async function ResearchArticle({ slug }: { slug: string }) {
  const { route, record } = requirePage(slug);
  const { title, description, updatedAt, publishedAt } = record.frontmatter;
  const heading = record.frontmatter.heading ?? title;
  const isChapter = route.pathname.startsWith("/challenges/");
  const breadcrumbs = [
    { name: "Home", pathname: "/" },
    ...(isChapter ? [{ name: "Story Challenges", pathname: "/challenges" }] : []),
    { name: heading, pathname: route.pathname }
  ];
  const showRectangleAd = record.body.length >= 4000;
  const { content, headings, relatedPages } = await compileGuide(record, { moveRelatedToSidebar: true });
  return <>
    <JsonLdScript data={buildArticleJsonLd({
      title, description, updatedAt, publishedAt,
      pathname: route.pathname, siteUrl: gameConfig.siteUrl
    })} />
    <JsonLdScript data={buildBreadcrumbJsonLd({
      items: breadcrumbs,
      siteUrl: gameConfig.siteUrl
    })} />
    <article className="guide-article-page">
      <Breadcrumbs items={breadcrumbs.map((item, index) => ({
        label: item.name,
        ...(index < breadcrumbs.length - 1 ? { href: item.pathname } : {})
      }))} />
      <header className="guide-article-page__header">
        <p className="preview-card__eyebrow">{route.type}</p>
        <h1>{heading}</h1>
        <p className="editorial-dates">
          {publishedAt ? <><time dateTime={publishedAt}>Published {formatDate(publishedAt)}</time>{" · "}</> : null}
          <time dateTime={updatedAt}>Updated {formatDate(updatedAt)}</time>
        </p>
      </header>
      <ResponsiveAdsterraTop />
      <WikiPageLayout headings={headings} related={relatedPages}
        sidebarAd={showRectangleAd ? <AdsterraBanner size="300x250" /> : undefined}>
        <PageSummaryCards slug={slug} />
        <div className="guide-article-page__body">{content}</div>
      </WikiPageLayout>
    </article>
  </>;
}
