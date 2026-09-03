import type { WikiSection as WikiSectionData } from "@/lib/content/types";

type WikiSectionProps = Readonly<{
  section: WikiSectionData;
}>;

export function WikiSection({ section }: WikiSectionProps) {
  return (
    <section aria-labelledby={`section-${section.id}`} className="wiki-section">
      <h2 id={`section-${section.id}`}>{section.title}</h2>
      {section.type === "prose" && section.body ? <p>{section.body}</p> : null}
      {section.type === "list" && section.items?.length ? (
        <ul>
          {section.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : null}
      {section.type === "stats" && section.stats?.length ? (
        <dl className="wiki-section__stats">
          {section.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
