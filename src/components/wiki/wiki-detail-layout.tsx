import Image from "next/image";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { RelatedContent } from "@/components/wiki/related-content";
import { WikiInfobox } from "@/components/wiki/wiki-infobox";
import { WikiSection } from "@/components/wiki/wiki-section";
import type { ResolvedContent } from "@/lib/content/queries";
import type { CategoryDefinition, WikiEntity } from "@/lib/content/types";

type WikiDetailLayoutProps = Readonly<{
  category: CategoryDefinition;
  entity: WikiEntity;
  related: readonly ResolvedContent[];
}>;

export function WikiDetailLayout({ category, entity, related }: WikiDetailLayoutProps) {
  return (
    <article className="wiki-detail-page">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: `/${category.slug}`, label: category.label },
          { label: entity.name }
        ]}
      />
      <div className="wiki-detail-layout">
        <header className="wiki-detail-layout__header">
          <p className="preview-card__eyebrow">{category.singularLabel}</p>
          <h1>{entity.name}</h1>
          <p>{entity.summary}</p>
        </header>
        <WikiInfobox category={category} entity={entity} />
        <div className="wiki-detail-layout__body">
          <Image alt={entity.imageAlt} className="wiki-detail-layout__image" height={720} src={entity.image} unoptimized width={1280} />
          {entity.sections.map((section) => <WikiSection key={section.id} section={section} />)}
          <RelatedContent related={related} />
        </div>
      </div>
    </article>
  );
}
