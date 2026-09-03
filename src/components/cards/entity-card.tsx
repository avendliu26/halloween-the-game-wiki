import Image from "next/image";
import Link from "next/link";
import type { CategoryDefinition, InfoboxValue, WikiEntity } from "@/lib/content/types";

type EntityCardProps = Readonly<{
  category: CategoryDefinition;
  entity: WikiEntity;
}>;

const formatValue = (value: InfoboxValue | undefined): string | undefined => {
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
    return undefined;
  }

  return Array.isArray(value) ? value.join(", ") : String(value);
};

const formatLabel = (key: string): string =>
  key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase());

export function EntityCard({ category, entity }: EntityCardProps) {
  const metadata = category.cardFields.flatMap((key) => {
    const value = formatValue(entity.infobox[key]);

    return value ? [{ key, label: formatLabel(key), value }] : [];
  });

  return (
    <article className="preview-card entity-card">
      <Link aria-label={entity.name} className="preview-card__link entity-card__link" href={`/${entity.category}/${entity.slug}`}>
        <Image alt={entity.imageAlt} className="entity-card__image" height={360} src={entity.image} unoptimized width={640} />
        <div className="entity-card__content">
          <p className="preview-card__eyebrow">{category.label}</p>
          <h3>{entity.name}</h3>
          <p>{entity.summary}</p>
          {metadata.length ? (
            <dl className="entity-card__details">
              {metadata.map((item) => (
                <div key={item.key}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
