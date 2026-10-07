import { notFound } from "next/navigation";
import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";
import { standalonePages } from "@/lib/content/pages";

type UpdatePageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

const isUpdate = (slug: string) => standalonePages.some(
  (page) => page.slug === slug && page.pathname === `/updates/${slug}`
);

export function generateStaticParams() {
  return standalonePages
    .filter((page) => page.pathname.startsWith("/updates/"))
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: UpdatePageProps) {
  const { slug } = await params;
  if (!isUpdate(slug)) notFound();
  return researchMetadata(slug);
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const { slug } = await params;
  if (!isUpdate(slug)) notFound();
  return <ResearchArticle slug={slug} />;
}
