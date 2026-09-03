import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { WikiDetailLayout } from "@/components/wiki/wiki-detail-layout";
import { categoryDefinitions, isCategorySlug } from "@/config/categories";
import { getAllEntities, getEntity, resolveContentReferences } from "@/lib/content/queries";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { gameConfig } from "@/config/game";
import { compileGuide } from "@/lib/content/guides";
import { getResearchPage } from "@/lib/content/pages";
import { formatDate } from "@/lib/utils/format";

type EntityPageProps = Readonly<{
  params: Promise<{ category: string; slug: string }>;
}>;

const getCategoryDefinition = (category: string) => {
  if (!isCategorySlug(category)) {
    notFound();
  }

  return categoryDefinitions.find((definition) => definition.slug === category)!;
};

export function generateStaticParams() {
  return getAllEntities().map((entity) => ({ category: entity.category, slug: entity.slug }));
}

export async function generateMetadata({ params }: EntityPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const definition = getCategoryDefinition(category);
  const entity = getEntity(definition.slug, slug);

  if (!entity) {
    notFound();
  }

  const editorial = category === "characters" && slug === "michael-myers" ? getResearchPage(slug) : undefined;
  return {
    ...buildPageMetadata({
    title: editorial?.frontmatter.title ?? entity.name,
    description: editorial?.frontmatter.description ?? entity.summary,
    pathname: `/${entity.category}/${entity.slug}`,
    siteUrl: gameConfig.siteUrl,
    image: entity.image,
    ...(editorial ? { article: { updatedAt: editorial.frontmatter.updatedAt, publishedAt: editorial.frontmatter.publishedAt } } : {})
    }),
    ...(editorial ? { title: { absolute: editorial.frontmatter.title } } : {})
  };
}

export default async function EntityPage({ params }: EntityPageProps) {
  const { category, slug } = await params;
  const definition = getCategoryDefinition(category);
  const entity = getEntity(definition.slug, slug);

  if (!entity) {
    notFound();
  }

  const editorial = category === "characters" && slug === "michael-myers" ? getResearchPage(slug) : undefined;
  const compiled = editorial ? await compileGuide(editorial, { moveRelatedToSidebar: true }) : undefined;
  return (
    <>
      {editorial ? <JsonLdScript data={buildArticleJsonLd({
        title: editorial.frontmatter.title, description: editorial.frontmatter.description,
        updatedAt: editorial.frontmatter.updatedAt, publishedAt: editorial.frontmatter.publishedAt,
        pathname: `/${entity.category}/${entity.slug}`, siteUrl: gameConfig.siteUrl, image: entity.image
      })} /> : null}
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          items: [
            { name: "Home", pathname: "/" },
            { name: definition.label, pathname: `/${definition.slug}` },
            { name: entity.name, pathname: `/${entity.category}/${entity.slug}` }
          ],
          siteUrl: gameConfig.siteUrl
        })}
      />
      <WikiDetailLayout category={definition} entity={entity} related={resolveContentReferences(entity.related)}
        editorial={editorial && compiled ? {
          title: editorial.frontmatter.title, content: compiled.content,
          headings: compiled.headings, relatedPages: compiled.relatedPages,
          dates: <p className="editorial-dates">Published {formatDate(editorial.frontmatter.publishedAt!)} · Updated <time dateTime={editorial.frontmatter.updatedAt}>{formatDate(editorial.frontmatter.updatedAt)}</time></p>
        } : undefined} />
    </>
  );
}
