import type { Metadata } from "next";

export type PageMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  siteUrl?: string;
  image?: string;
  article?: {
    updatedAt: string;
    publishedAt?: string;
    author?: string;
  };
};

const getAbsoluteUrl = (pathname: string, siteUrl?: string): string | undefined =>
  siteUrl ? new URL(pathname, siteUrl).toString() : undefined;

export const buildPageMetadata = ({
  title,
  description,
  pathname,
  siteUrl,
  image,
  article
}: PageMetadataInput): Metadata => {
  const url = getAbsoluteUrl(pathname, siteUrl);
  const openGraphImage = image ? getAbsoluteUrl(image, siteUrl) : undefined;

  return {
    title,
    description,
    ...(article?.author ? { authors: [{ name: article.author }] } : {}),
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title,
      description,
      ...(article
        ? {
            type: "article" as const,
            modifiedTime: article.updatedAt,
            ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
            ...(article.author ? { authors: [article.author] } : {})
          }
        : {}),
      ...(url ? { url } : {}),
      ...(openGraphImage ? { images: [{ url: openGraphImage }] } : {})
    }
  };
};
