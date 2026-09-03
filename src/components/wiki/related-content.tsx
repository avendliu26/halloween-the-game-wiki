import Link from "next/link";
import type { ResolvedContent } from "@/lib/content/queries";

type RelatedContentProps = Readonly<{
  heading?: string;
  related: readonly ResolvedContent[];
}>;

export function RelatedContent({ heading = "Related links", related }: RelatedContentProps) {
  if (related.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-links" className="related-content">
      <h2 id="related-links">{heading}</h2>
      <ul>
        {related.map((item) => (
          <li key={`${item.kind}-${item.slug}`}>
            <Link href={item.href}>{item.title}</Link>
            <p>{item.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
