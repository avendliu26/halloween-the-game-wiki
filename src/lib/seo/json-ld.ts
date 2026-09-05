export type VideoGameJsonLdInput = {
  name: string;
  description: string;
  platforms: string[];
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  pathname?: string;
  siteUrl?: string;
  image?: string;
};

export type ArticleJsonLdInput = {
  title: string;
  description: string;
  updatedAt: string;
  publishedAt?: string;
  author?: string;
  pathname: string;
  siteUrl?: string;
  image?: string;
};

export type BreadcrumbJsonLdInput = {
  items: readonly { name: string; pathname: string }[];
  siteUrl: string | undefined;
};

type JsonLdRecord = Record<string, unknown>;

const getAbsoluteUrl = (pathname: string, siteUrl?: string): string | undefined =>
  siteUrl ? new URL(pathname, siteUrl).toString() : undefined;

const organization = (name: string): JsonLdRecord => ({ "@type": "Organization", name });

export const buildVideoGameJsonLd = ({
  name,
  description,
  platforms,
  releaseDate,
  developer,
  publisher,
  pathname,
  siteUrl,
  image
}: VideoGameJsonLdInput): JsonLdRecord => {
  const url = pathname ? getAbsoluteUrl(pathname, siteUrl) : undefined;
  const imageUrl = image ? getAbsoluteUrl(image, siteUrl) ?? image : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name,
    description,
    gamePlatform: platforms,
    ...(releaseDate ? { datePublished: releaseDate } : {}),
    ...(developer ? { developer: organization(developer) } : {}),
    ...(publisher ? { publisher: organization(publisher) } : {}),
    ...(url ? { url } : {}),
    ...(imageUrl ? { image: imageUrl } : {})
  };
};

export const buildArticleJsonLd = ({
  title,
  description,
  updatedAt,
  publishedAt,
  author,
  pathname,
  siteUrl,
  image
}: ArticleJsonLdInput): JsonLdRecord => {
  const url = getAbsoluteUrl(pathname, siteUrl);
  const imageUrl = image ? getAbsoluteUrl(image, siteUrl) ?? image : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    dateModified: updatedAt,
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(author ? { author: { "@type": "Person", name: author } } : {}),
    ...(url ? { url } : {}),
    ...(imageUrl ? { image: imageUrl } : {})
  };
};

export const buildBreadcrumbJsonLd = ({ items, siteUrl }: BreadcrumbJsonLdInput): JsonLdRecord => {
  if (!siteUrl) {
    throw new Error("Cannot build breadcrumb JSON-LD without a site URL");
  }
  if (items.length < 2) {
    throw new Error("Breadcrumb JSON-LD requires at least two items");
  }

  const origin = new URL(siteUrl);
  const itemListElement = items.map(({ name, pathname }, index) => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new Error(`Breadcrumb item ${index + 1} requires a non-empty name`);
    }
    if (!pathname.startsWith("/") || pathname.startsWith("//")) {
      throw new Error(`Breadcrumb item ${index + 1} requires an internal absolute pathname`);
    }

    const item = new URL(pathname, origin);
    const hasNonCanonicalPathname =
      (pathname !== "/" && pathname.endsWith("/")) ||
      pathname.slice(1).includes("//") ||
      item.pathname !== pathname;
    if (hasNonCanonicalPathname) {
      throw new Error(`Breadcrumb item ${index + 1} requires a canonical pathname`);
    }
    if (item.origin !== origin.origin || item.search || item.hash) {
      throw new Error(`Breadcrumb item ${index + 1} must resolve to a canonical URL on the site origin`);
    }

    return {
      "@type": "ListItem",
      position: index + 1,
      name: normalizedName,
      item: item.toString()
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement
  };
};
