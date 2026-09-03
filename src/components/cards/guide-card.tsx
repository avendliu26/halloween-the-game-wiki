import Link from "next/link";
import Image from "next/image";
import type { GuideRecord } from "@/lib/content/guides";
import { formatDate } from "@/lib/utils/format";

type GuideCardProps = Readonly<{
  guide: GuideRecord;
}>;

export function GuideCard({ guide }: GuideCardProps) {
  const { frontmatter } = guide;

  return (
    <article className="preview-card guide-card">
      <Link aria-label={frontmatter.title} className="preview-card__link" href={`/guides/${guide.slug}`}>
        {frontmatter.image ? <Image alt={frontmatter.imageAlt ?? frontmatter.title} className="guide-card__image" height={360} src={frontmatter.image} unoptimized width={640} /> : null}
        <p className="preview-card__eyebrow">Guide</p>
        <h3>{frontmatter.title}</h3>
        <p>{frontmatter.description}</p>
        <div className="guide-card__meta">
          <span>Updated {formatDate(frontmatter.updatedAt)}</span>
          <ul aria-label={`${frontmatter.title} tags`} className="tag-list">
            {frontmatter.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}
