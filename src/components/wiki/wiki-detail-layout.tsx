import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { WikiPageLayout } from "@/components/wiki/wiki-page-layout";
import { WikiInfobox } from "@/components/wiki/wiki-infobox";
import { WikiSection } from "@/components/wiki/wiki-section";
import type { ResolvedContent } from "@/lib/content/queries";
import type { CategoryDefinition, WikiEntity } from "@/lib/content/types";
import type { GuideHeading } from "@/lib/content/guides";
import type { SidebarLink } from "@/lib/content/guide-mdx";

type WikiDetailLayoutProps = Readonly<{
  category: CategoryDefinition;
  entity: WikiEntity;
  related: readonly ResolvedContent[];
  editorial?: { title: string; content: ReactNode; dates: ReactNode; headings?: GuideHeading[]; relatedPages?: SidebarLink[] };
}>;

export function WikiDetailLayout({ category, entity, related, editorial }: WikiDetailLayoutProps) {
  return (
    <article className="wiki-detail-page">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: `/${category.slug}`, label: category.label },
          { label: entity.name }
        ]}
      />
      <div className="wiki-detail-layout wiki-detail-layout--shared">
        <header className="wiki-detail-layout__header">
          <p className="preview-card__eyebrow">{category.singularLabel}</p>
          <h1>{editorial?.title ?? entity.name}</h1>
          <p>{entity.summary}</p>
          {editorial?.dates}
        </header>
        <WikiPageLayout
          headings={editorial?.headings ?? entity.sections.map((section) => ({ depth: 2, text: section.title, id: `section-${section.id}` }))}
          related={editorial?.relatedPages?.length ? editorial.relatedPages : related}
          details={<WikiInfobox category={category} entity={entity} />}
        >
        <div className="wiki-detail-layout__body">
          <Image alt={entity.imageAlt} className="wiki-detail-layout__image" height={720} src={entity.image} unoptimized width={1280} />
          {editorial ? <div className="guide-article-page__body">{editorial.content}</div> : entity.sections.map((section) => <WikiSection key={section.id} section={section} />)}
        </div>
        </WikiPageLayout>
      </div>
    </article>
  );
}
