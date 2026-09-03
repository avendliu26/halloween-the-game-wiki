import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";

export const generateMetadata = () => researchMetadata("release-date");

export default function Page() {
  return <ResearchArticle slug="release-date" />;
}
