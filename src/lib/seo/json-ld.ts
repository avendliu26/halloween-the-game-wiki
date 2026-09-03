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
  items: { name: string; pathname: string }[];
  siteUrl?: string;
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

export const buildBreadcrumbJsonLd = ({ items, siteUrl }: BreadcrumbJsonLdInput): JsonLdRecord => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(({ name, pathname }, index) => {
    const item = getAbsoluteUrl(pathname, siteUrl);

    return {
      "@type": "ListItem",
      position: index + 1,
      name,
      ...(item ? { item } : {})
    };
  })
});
