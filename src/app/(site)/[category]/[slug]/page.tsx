import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { WikiDetailLayout } from "@/components/wiki/wiki-detail-layout";
import { categoryDefinitions, isCategorySlug } from "@/config/categories";
import { getAllEntities, getEntity, resolveContentReferences } from "@/lib/content/queries";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { gameConfig } from "@/config/game";

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

  return buildPageMetadata({
    title: entity.name,
    description: entity.summary,
    pathname: `/${entity.category}/${entity.slug}`,
    siteUrl: gameConfig.siteUrl,
    image: entity.image
  });
}

export default async function EntityPage({ params }: EntityPageProps) {
  const { category, slug } = await params;
  const definition = getCategoryDefinition(category);
  const entity = getEntity(definition.slug, slug);

  if (!entity) {
    notFound();
  }

  return (
    <>
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
      <WikiDetailLayout category={definition} entity={entity} related={resolveContentReferences(entity.related)} />
    </>
  );
}
