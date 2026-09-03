import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { CategoryFilter } from "@/components/wiki/category-filter";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { categoryDefinitions, isCategorySlug } from "@/config/categories";
import { getCategoryEntries } from "@/lib/content/queries";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { gameConfig } from "@/config/game";
import { getResearchPage } from "@/lib/content/pages";
import { compileGuide } from "@/lib/content/guides";
import { formatDate } from "@/lib/utils/format";

type CategoryPageProps = Readonly<{
  params: Promise<{ category: string }>;
}>;

const getCategoryDefinition = (category: string) => {
  if (!isCategorySlug(category)) {
    notFound();
  }

  return categoryDefinitions.find((definition) => definition.slug === category)!;
};

export function generateStaticParams() {
  return categoryDefinitions.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const definition = getCategoryDefinition(category);
  const editorial = getResearchPage(category === "locations" ? "maps" : category);

  return {
    ...buildPageMetadata({
    title: editorial?.frontmatter.title ?? definition.label,
    description: editorial?.frontmatter.description ?? definition.description,
    pathname: `/${definition.slug}`,
    siteUrl: gameConfig.siteUrl
    }),
    ...(editorial ? { title: { absolute: editorial.frontmatter.title } } : {})
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const definition = getCategoryDefinition(category);
  const entries = getCategoryEntries(definition.slug);
  const editorial = getResearchPage(category === "locations" ? "maps" : category);
  const compiled = editorial ? await compileGuide(editorial) : undefined;

  return (
    <>
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          items: [
            { name: "Home", pathname: "/" },
            { name: definition.label, pathname: `/${definition.slug}` }
          ],
          siteUrl: gameConfig.siteUrl
        })}
      />
    <article className="category-page">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: definition.label }]} />
      <header className="page-header">
        <p className="preview-card__eyebrow">Database</p>
        <h1>{editorial?.frontmatter.title ?? definition.label}</h1>
        {!editorial ? <p>{definition.description}</p> : null}
        {editorial ? <p className="editorial-dates">Published {formatDate(editorial.frontmatter.publishedAt!)} · Updated <time dateTime={editorial.frontmatter.updatedAt}>{formatDate(editorial.frontmatter.updatedAt)}</time></p> : null}
      </header>
      {compiled ? <div className="guide-article-page__body">{compiled.content}</div> : null}
      <p className="category-page__total">{entries.length} {entries.length === 1 ? "entry" : "entries"}</p>
      <CategoryFilter category={definition.slug} entries={entries} />
    </article>
    </>
  );
}
