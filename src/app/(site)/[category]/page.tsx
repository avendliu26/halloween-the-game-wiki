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

  return buildPageMetadata({
    title: definition.label,
    description: definition.description,
    pathname: `/${definition.slug}`,
    siteUrl: gameConfig.siteUrl
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const definition = getCategoryDefinition(category);
  const entries = getCategoryEntries(definition.slug);

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
        <h1>{definition.label}</h1>
        <p>{definition.description}</p>
      </header>
      <p className="category-page__total">{entries.length} {entries.length === 1 ? "entry" : "entries"}</p>
      <CategoryFilter category={definition.slug} entries={entries} />
    </article>
    </>
  );
}
