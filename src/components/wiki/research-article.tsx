import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { gameConfig } from "@/config/game";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { TableOfContents } from "@/components/wiki/table-of-contents";
import { compileGuide } from "@/lib/content/guides";
import { getResearchPage, standalonePages } from "@/lib/content/pages";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/format";

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
  const { content, headings } = await compileGuide(record);
  return <>
    <JsonLdScript data={buildArticleJsonLd({
      title, description, updatedAt, publishedAt,
      pathname: route.pathname, siteUrl: gameConfig.siteUrl
    })} />
    <JsonLdScript data={buildBreadcrumbJsonLd({
      items: [{ name: "Home", pathname: "/" }, { name: title, pathname: route.pathname }],
      siteUrl: gameConfig.siteUrl
    })} />
    <article className="guide-article-page">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: title }]} />
      <header className="guide-article-page__header">
        <p className="preview-card__eyebrow">{route.type}</p>
        <h1>{title}</h1>
        <p className="editorial-dates">
          {publishedAt ? <><time dateTime={publishedAt}>Published {formatDate(publishedAt)}</time>{" · "}</> : null}
          <time dateTime={updatedAt}>Updated {formatDate(updatedAt)}</time>
        </p>
      </header>
      <div className="guide-article-page__layout">
        <TableOfContents headings={headings} />
        <div className="guide-article-page__body">{content}</div>
      </div>
    </article>
  </>;
}
