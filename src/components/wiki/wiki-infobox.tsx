import type { CategoryDefinition, InfoboxValue, WikiEntity } from "@/lib/content/types";

type WikiInfoboxProps = Readonly<{
  category: CategoryDefinition;
  entity: WikiEntity;
}>;

const formatValue = (value: InfoboxValue | undefined): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const formatted = value.filter((item) => item.trim().length > 0).join(", ");
    return formatted || undefined;
  }

  if (typeof value === "string") {
    return value.trim() || undefined;
  }

  return String(value);
};

export function WikiInfobox({ category, entity }: WikiInfoboxProps) {
  const fields = category.infoboxFields.flatMap((field) => {
    const value = formatValue(entity.infobox[field.key]);

    return value ? [{ ...field, value }] : [];
  });

  if (fields.length === 0) {
    return null;
  }

  return (
    <aside aria-label={`${entity.name} details`} className="wiki-infobox">
      <h2>Details</h2>
      <dl>
        {fields.map((field) => (
          <div key={field.key}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
