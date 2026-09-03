import type { GuideHeading } from "@/lib/content/guides";

type TableOfContentsProps = Readonly<{
  headings: readonly GuideHeading[];
}>;

function TableOfContentsLinks({ headings }: TableOfContentsProps) {
  return (
    <nav aria-label="Table of contents">
      <ol>
        {headings.map((heading) => (
          <li className={heading.depth === 3 ? "table-of-contents__subheading" : undefined} key={heading.id}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
      <details className="table-of-contents" open>
        <summary>On this page</summary>
        <TableOfContentsLinks headings={headings} />
      </details>
  );
}
