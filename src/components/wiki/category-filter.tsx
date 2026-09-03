"use client";

import { useMemo, useState } from "react";
import { EntityCard } from "@/components/cards/entity-card";
import { categoryDefinitions } from "@/config/categories";
import type { CategoryDefinition, CategorySlug, WikiEntity } from "@/lib/content/types";

type CategoryFilterProps = Readonly<{
  category: CategorySlug;
  entries: readonly WikiEntity[];
  definition?: CategoryDefinition;
}>;

const matchesQuery = (entry: WikiEntity, query: string): boolean => {
  if (!query) {
    return true;
  }

  const values = [
    entry.name,
    entry.summary,
    ...entry.tags,
    ...Object.values(entry.infobox).filter((value): value is string => typeof value === "string")
  ];

  return values.some((value) => value.toLocaleLowerCase().includes(query));
};

export function CategoryFilter({ category, entries, definition }: CategoryFilterProps) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const categoryDefinition = definition ?? categoryDefinitions.find((item) => item.slug === category);
  const categoryLabel = categoryDefinition?.label ?? category;
  const tags = useMemo(
    () => [...new Set(entries.flatMap((entry) => entry.tags))].sort((left, right) => left.localeCompare(right)),
    [entries]
  );
  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return entries.filter((entry) => matchesQuery(entry, normalizedQuery) && (!tag || entry.tags.includes(tag)));
  }, [entries, query, tag]);
  const resetFilters = () => {
    setQuery("");
    setTag("");
  };
  if (!categoryDefinition) {
    return null;
  }

  return (
    <section aria-label={`${categoryLabel} filters`} className="category-filter">
      <div className="category-filter__controls">
        <label>
          <span>Filter {categoryLabel}</span>
          <input
            aria-label={`Filter ${categoryLabel}`}
            name="query"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${categoryLabel}`}
            role="searchbox"
            type="search"
            value={query}
          />
        </label>
        <label>
          <span>Tag</span>
          <select aria-label="Filter by tag" name="tag" onChange={(event) => setTag(event.target.value)} value={tag}>
            <option value="">All tags</option>
            {tags.map((entryTag) => <option key={entryTag} value={entryTag}>{entryTag}</option>)}
          </select>
        </label>
        <button className="category-filter__reset" onClick={resetFilters} type="button">Reset filters</button>
      </div>
      <p aria-live="polite" className="category-filter__count">
        {filteredEntries.length} {filteredEntries.length === 1 ? categoryDefinition.singularLabel.toLowerCase() : categoryLabel.toLowerCase()}
      </p>
      {filteredEntries.length ? (
        <div className="category-filter__grid">
          {filteredEntries.map((entry) => <EntityCard category={categoryDefinition} entity={entry} key={entry.id} />)}
        </div>
      ) : (
        <p className="category-filter__empty">No {categoryLabel.toLowerCase()} match the current filters.</p>
      )}
    </section>
  );
}
