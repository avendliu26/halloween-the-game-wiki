import Link from "next/link";
import { categoryDefinitions } from "@/config/categories";
import type { CategoryDefinition, CategorySlug } from "@/lib/content/types";

type CategoryCardProps = Readonly<{
  category: CategorySlug;
  count: number;
  definition?: CategoryDefinition;
}>;

export function CategoryCard({ category, count, definition: suppliedDefinition }: CategoryCardProps) {
  const definition = suppliedDefinition ?? categoryDefinitions.find((item) => item.slug === category);

  if (!definition) {
    return null;
  }

  return (
    <article className="preview-card category-card">
      <Link aria-label={`Browse ${definition.label}`} className="preview-card__link category-card__link" href={`/${definition.slug}`}>
        <span aria-hidden="true" className="category-card__glyph">
          {definition.glyph}
        </span>
        <div>
          <h3>{definition.label}</h3>
          <p>{definition.description}</p>
          <span className="category-card__count">{count} {count === 1 ? "entry" : "entries"}</span>
        </div>
      </Link>
    </article>
  );
}
